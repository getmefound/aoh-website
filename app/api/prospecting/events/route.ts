import { NextRequest, NextResponse } from "next/server";
import { classifyCampaignReply, normalizeCampaignLane } from "@/lib/campaign-reply-router";
import { createAgentTask, logEmailEvent } from "@/lib/ops-store";
import { updateVisibilityReportsByEmail } from "@/lib/visibility-reports";
import { supabaseRest } from "@/lib/supabase-rest";
import { sendSmartleadThreadReply } from "@/lib/smartlead";

type ProspectingEventKind =
  | "reply"
  | "opt_out"
  | "not_interested"
  | "ooo"
  | "hard_bounce"
  | "complaint"
  | "form_fill"
  | "purchase"
  | "sent"
  | "click"
  | "unknown";

type ProspectingEvent = {
  kind: ProspectingEventKind;
  email: string;
  businessName: string;
  replyText: string;
  campaignLane: ReturnType<typeof normalizeCampaignLane>;
  providerId: string;
  campaignId: string;
  leadId: string;
  emailStatsId: string;
  replyMessageId: string;
  replyReceivedAt: string;
  rawEventType: string;
  payload: Record<string, unknown>;
};

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = authorize(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const event = normalizeProspectingEvent(body);
  if (!event.email && event.kind !== "unknown") {
    return NextResponse.json({ ok: false, error: "Missing lead email for prospecting event." }, { status: 400 });
  }

  const decision = decideEvent(event);
  const effects = await applyEventEffects(event, decision);

  return NextResponse.json({
    ok: true,
    event: {
      kind: event.kind,
      email: event.email || null,
      businessName: event.businessName || null,
      rawEventType: event.rawEventType || null,
      campaignLane: event.campaignLane,
    },
    decision,
    effects,
  });
}

function decideEvent(event: ProspectingEvent) {
  if (event.kind === "reply") {
    return classifyCampaignReply({
      replyText: event.replyText,
      lane: event.campaignLane,
    });
  }

  if (event.kind === "opt_out") {
    return {
      intent: "optout" as const,
      lane: event.campaignLane,
      tags: ["gmf_reply_optout", "gmf_global_suppression", "gmf_sequence_stop"],
      shouldGenerateReport: false,
      shouldSendBookingLink: false,
      shouldCreateHumanTask: false,
      shouldStopSequence: true,
      shouldSuppressContact: true,
      reason: "Provider event is an opt-out/unsubscribe.",
    };
  }

  if (event.kind === "hard_bounce" || event.kind === "complaint") {
    return {
      intent: "optout" as const,
      lane: event.campaignLane,
      tags: ["gmf_global_suppression", "gmf_sequence_stop", `gmf_${event.kind}`],
      shouldGenerateReport: false,
      shouldSendBookingLink: false,
      shouldCreateHumanTask: event.kind === "complaint",
      shouldStopSequence: true,
      shouldSuppressContact: true,
      reason: event.kind === "hard_bounce" ? "Provider event is a hard bounce." : "Provider event is a spam complaint.",
    };
  }

  if (event.kind === "form_fill" || event.kind === "purchase") {
    return {
      intent: "interested" as const,
      lane: event.campaignLane,
      tags: ["gmf_sequence_stop", `gmf_${event.kind}`],
      shouldGenerateReport: event.kind === "form_fill",
      shouldSendBookingLink: false,
      shouldCreateHumanTask: event.kind === "form_fill",
      shouldStopSequence: true,
      shouldSuppressContact: false,
      reason: event.kind === "form_fill" ? "Lead filled a visibility/report form; stop cold sequence." : "Lead purchased; stop nurture and cold sequence.",
    };
  }

  return {
    intent: "unclear" as const,
    lane: event.campaignLane,
    tags: ["gmf_event_unclear"],
    shouldGenerateReport: false,
    shouldSendBookingLink: false,
    shouldCreateHumanTask: true,
    shouldStopSequence: false,
    shouldSuppressContact: false,
    reason: "Event did not map to a known prospecting action.",
  };
}

async function applyEventEffects(event: ProspectingEvent, decision: ReturnType<typeof decideEvent>) {
  const effects: Array<{ action: string; ok: boolean; detail?: string }> = [];
  const emailEventType = emailEventTypeFor(event, decision);

  const emailLog = await logEmailEvent({
    provider: "smartlead",
    event_type: emailEventType,
    to_email: event.email || "unknown",
    status: event.kind === "hard_bounce" || event.kind === "complaint" ? "failed" : "sent",
    provider_id: event.providerId || undefined,
    payload: {
      kind: event.kind,
      businessName: event.businessName || null,
      rawEventType: event.rawEventType || null,
      campaignLane: event.campaignLane,
      decision,
      payload: event.payload,
    },
  });
  effects.push({ action: `log_email_event:${emailEventType}`, ok: emailLog.ok, detail: emailLog.ok ? undefined : emailLog.error });

  if (event.email && event.kind === "reply" && event.campaignLane === "gmf_visibility") {
    const reportReply = await handleGmfReportReply(event, decision);
    effects.push(...reportReply);
  }

  if (event.email && decision.shouldSuppressContact) {
    const suppressionUpdate = await updateProspectingLeadByEmail(event.email, {
      pipeline_stage: "suppressed",
      status: event.kind === "hard_bounce" ? "hard_bounced" : event.kind === "complaint" ? "complained" : "suppressed",
      last_reply_intent: decision.intent,
      last_reply_at: new Date().toISOString(),
      last_reply_text: event.replyText.slice(0, 1000),
      smartlead_campaign_id: event.campaignId || "",
      smartlead_lead_id: event.leadId || "",
      smartlead_email_stats_id: event.emailStatsId || "",
      updated_at: new Date().toISOString(),
    });
    effects.push({ action: "prospecting_pipeline_suppressed", ok: suppressionUpdate.ok, detail: suppressionUpdate.ok ? undefined : suppressionUpdate.error });

    const reportUpdate = await updateVisibilityReportsByEmail({
      email: event.email,
      reportStatus: event.kind === "hard_bounce" || event.kind === "complaint" ? "blocked" : "closed",
      leadStatus: event.kind === "hard_bounce" ? "hard_bounced" : event.kind === "complaint" ? "complained" : "suppressed",
      nextAction: "Do not contact. Prospecting event triggered suppression.",
      blocker: "",
      metadata: {
        prospectingEvent: event.kind,
        rawEventType: event.rawEventType,
        decision,
        updatedAt: new Date().toISOString(),
      },
    });
    effects.push({ action: "update_visibility_reports_by_email", ok: reportUpdate.ok, detail: reportUpdate.ok ? undefined : reportUpdate.error });
  }

  if (event.email && (event.kind === "form_fill" || event.kind === "purchase")) {
    const pipelineUpdate = await updateProspectingLeadByEmail(event.email, {
      pipeline_stage: event.kind === "purchase" ? "purchased" : "form_fill",
      status: event.kind === "purchase" ? "purchased_get_found" : "form_fill",
      last_reply_intent: event.kind,
      updated_at: new Date().toISOString(),
    });
    effects.push({ action: "prospecting_pipeline_form_or_purchase", ok: pipelineUpdate.ok, detail: pipelineUpdate.ok ? undefined : pipelineUpdate.error });

    const reportUpdate = await updateVisibilityReportsByEmail({
      email: event.email,
      reportStatus: event.kind === "purchase" ? "closed" : "sent",
      leadStatus: event.kind === "purchase" ? "purchased_get_found" : "form_fill_stop_cold_sequence",
      nextAction: event.kind === "purchase" ? "Stop nurture and start paid onboarding." : "Stop cold sequence and continue report/nurture workflow.",
      blocker: "",
      metadata: {
        prospectingEvent: event.kind,
        rawEventType: event.rawEventType,
        decision,
        updatedAt: new Date().toISOString(),
      },
    });
    effects.push({ action: "update_visibility_reports_by_email", ok: reportUpdate.ok, detail: reportUpdate.ok ? undefined : reportUpdate.error });
  }

  const positiveReportSent = effects.some((effect) => effect.action === "smartlead_reply_report_url" && effect.ok);
  if (decision.shouldCreateHumanTask && !positiveReportSent) {
    const task = await createAgentTask({
      title: `Prospecting reply/event needs Sales Rep - ${event.businessName || event.email || "unknown"}`,
      kind: "gmf_prospecting_event",
      priority: decision.intent === "interested" || decision.intent === "book" ? "high" : "normal",
      source: "smartlead/prospecting-events",
      payload: {
        email: event.email || null,
        businessName: event.businessName || null,
        eventKind: event.kind,
        replyText: event.replyText || null,
        decision,
        nextAction: "Sales Rep routes interested replies, OOO, unclear replies, and form-fill handoffs. Do not ask Mike unless approval or reputation risk is present.",
      },
    });
    effects.push({ action: "create_agent_task", ok: task.ok, detail: task.ok ? undefined : task.error });
  }

  return effects;
}

async function handleGmfReportReply(event: ProspectingEvent, decision: ReturnType<typeof decideEvent>) {
  const effects: Array<{ action: string; ok: boolean; detail?: string }> = [];
  const positiveIntent = isStrictPositiveReportRequest(event.replyText);
  const now = new Date().toISOString();

  if (!positiveIntent) {
    const stage = await updateProspectingLeadByEmail(event.email, {
      pipeline_stage: "manual_review",
      last_reply_intent: decision.intent,
      last_reply_at: now,
      last_reply_text: event.replyText.slice(0, 1000),
      smartlead_campaign_id: event.campaignId || "",
      smartlead_lead_id: event.leadId || "",
      smartlead_email_stats_id: event.emailStatsId || "",
      updated_at: now,
    });
    effects.push({ action: "prospecting_pipeline_manual_review", ok: stage.ok, detail: stage.ok ? undefined : stage.error });
    return effects;
  }

  const lead = await getProspectingLeadForReply(event.email);
  effects.push({ action: "lookup_prospecting_lead", ok: lead.ok, detail: lead.ok ? undefined : lead.error });
  if (!lead.ok) {
    await createReportReplyTask(event, "Could not find prospecting lead/report URL for a positive reply.");
    effects.push({ action: "route_positive_reply_manual", ok: true, detail: "missing_prospecting_lead" });
    return effects;
  }

  const reportUrl = lead.data.report_url?.trim();
  if (!reportUrl) {
    await createReportReplyTask(event, "Positive reply matched, but the prospecting lead has no report_url.");
    const stage = await updateProspectingLeadByEmail(event.email, {
      pipeline_stage: "manual_review",
      last_reply_intent: "positive_missing_report_url",
      last_reply_at: now,
      last_reply_text: event.replyText.slice(0, 1000),
      updated_at: now,
    });
    effects.push({ action: "prospecting_pipeline_manual_review", ok: stage.ok, detail: stage.ok ? "missing_report_url" : stage.error });
    return effects;
  }

  if (!event.campaignId || !event.emailStatsId) {
    await createReportReplyTask(event, "Positive reply matched, but SmartLead campaign_id or email_stats_id was missing from the webhook.");
    const stage = await updateProspectingLeadByEmail(event.email, {
      pipeline_stage: "manual_review",
      last_reply_intent: "positive_missing_smartlead_thread_id",
      last_reply_at: now,
      last_reply_text: event.replyText.slice(0, 1000),
      updated_at: now,
    });
    effects.push({ action: "prospecting_pipeline_manual_review", ok: stage.ok, detail: stage.ok ? "missing_smartlead_thread_id" : stage.error });
    return effects;
  }

  const reply = renderReportReply({
    ownerFirstName: lead.data.owner_first_name || "there",
    businessName: lead.data.business_name || event.businessName || "your business",
    reportUrl,
  });

  const smartlead = await sendSmartleadThreadReply({
    campaignId: event.campaignId,
    emailStatsId: event.emailStatsId,
    emailBody: reply,
    toEmail: event.email,
    toFirstName: lead.data.owner_first_name || "",
    replyMessageId: event.replyMessageId || "",
    replyEmailBody: event.replyText || "",
    replyEmailTime: event.replyReceivedAt || now,
  });
  effects.push({ action: "smartlead_reply_report_url", ok: smartlead.ok, detail: smartlead.ok ? undefined : smartlead.error });

  const stage = await updateProspectingLeadByEmail(event.email, {
    pipeline_stage: smartlead.ok ? "report_sent" : "manual_review",
    status: smartlead.ok ? "report_sent" : "held",
    last_reply_intent: smartlead.ok ? "positive_report_sent" : "positive_report_send_failed",
    last_reply_at: now,
    last_reply_text: event.replyText.slice(0, 1000),
    smartlead_campaign_id: event.campaignId,
    smartlead_lead_id: event.leadId || "",
    smartlead_email_stats_id: event.emailStatsId,
    report_sent_at: smartlead.ok ? now : null,
    updated_at: now,
  });
  effects.push({ action: "prospecting_pipeline_report_sent", ok: stage.ok, detail: stage.ok ? undefined : stage.error });

  if (!smartlead.ok) {
    await createReportReplyTask(event, `SmartLead report reply failed: ${smartlead.error}`);
  }

  return effects;
}

function isStrictPositiveReportRequest(replyText: string) {
  const text = replyText.trim().toLowerCase();
  if (!text) return false;
  if (matchesAnyText(text, AMBIGUOUS_OR_OBJECTION_PATTERNS)) return false;
  return matchesAnyText(text, POSITIVE_REPORT_PATTERNS);
}

async function getProspectingLeadForReply(email: string) {
  const query = `select=email,business_name,owner_first_name,report_url,pipeline_stage&email=eq.${encodeURIComponent(email)}&limit=1`;
  const result = await supabaseRest<Array<{ email: string; business_name: string; owner_first_name: string; report_url: string; pipeline_stage: string }>>(
    "prospecting_leads",
    { query },
  );
  if (!result.ok) return result;
  const row = result.data[0];
  return row ? { ok: true as const, status: result.status, data: row } : { ok: false as const, status: 404, error: "Prospecting lead not found." };
}

async function updateProspectingLeadByEmail(email: string, body: Record<string, unknown>) {
  return supabaseRest("prospecting_leads", {
    method: "PATCH",
    query: `email=eq.${encodeURIComponent(email)}`,
    body,
    prefer: "return=minimal",
  });
}

async function createReportReplyTask(event: ProspectingEvent, reason: string) {
  return createAgentTask({
    title: `Positive GMF reply needs Sales Rep - ${event.businessName || event.email}`,
    kind: "gmf_positive_reply_manual",
    priority: "high",
    source: "smartlead/prospecting-events",
    payload: {
      email: event.email,
      businessName: event.businessName || null,
      campaignId: event.campaignId || null,
      leadId: event.leadId || null,
      emailStatsId: event.emailStatsId || null,
      replyText: event.replyText || null,
      reason,
      nextAction: "Sales Rep sends the report manually in-thread only after verifying the report URL and SmartLead thread identifiers.",
    },
  });
}

function renderReportReply(input: { ownerFirstName: string; businessName: string; reportUrl: string }) {
  return `Hi ${input.ownerFirstName},

Awesome - here's your free visibility report for ${input.businessName}:
${input.reportUrl}

It shows your AI Visibility Score, what's helping or hurting you on Google and with AI like ChatGPT and Gemini, and what's fixable. About two minutes to scan - no account needed.

A few items are locked (the deeper technical work we handle with Get Found), but you'll see plenty for free.

Take a look and let me know what jumps out - happy to answer anything.

- Mike`;
}

function matchesAnyText(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text));
}

const POSITIVE_REPORT_PATTERNS = [
  /^(yes|yep|yeah|sure|ok|okay|please|absolutely|send it|send over|send me it|send me the report|send the report|please send|sounds good|i'?d like to see it|i would like to see it|interested)\.?$/i,
  /\b(yes|yep|yeah|sure|okay|send it|please send|send over)\b/i,
  /\b(yes please|sure send|send it over|send me the free report|please send the report|would love to see it|happy to take a look)\b/i,
];

const AMBIGUOUS_OR_OBJECTION_PATTERNS = [
  /\?$/,
  /\b(how much|price|cost|who is this|what is this|why|call me|book|schedule|demo|unsubscribe|stop|remove|not interested|no thanks|already|later|maybe|info|details|more information)\b/i,
];

function emailEventTypeFor(event: ProspectingEvent, decision: ReturnType<typeof decideEvent>) {
  if (event.kind === "opt_out" || decision.intent === "optout") return "unsubscribe";
  if (decision.intent === "not_interested") return "do_not_contact";
  if (event.kind === "hard_bounce") return "hard_bounce";
  if (event.kind === "complaint") return "complaint";
  if (event.kind === "form_fill") return "form_fill";
  if (event.kind === "purchase") return "purchase";
  if (event.kind === "reply") return "reply";
  return `gmf_prospecting_${event.kind}`;
}

function normalizeProspectingEvent(body: Record<string, unknown>): ProspectingEvent {
  const rawEventType = pickString(body, ["event_type", "eventType", "type", "event", "webhook_type"]);
  const replyText =
    pickString(body, ["reply_text", "replyText", "message", "body", "text"]) ??
    pickNestedString(body, ["reply", "body"]) ??
    pickNestedString(body, ["email", "body"]) ??
    "";
  const email =
    pickString(body, ["email", "lead_email", "to_email", "from_email"]) ??
    pickNestedString(body, ["lead", "email"]) ??
    pickNestedString(body, ["data", "email"]) ??
    "";
  const businessName =
    pickString(body, ["business_name", "businessName", "company_name", "companyName", "company"]) ??
    pickNestedString(body, ["lead", "company_name"]) ??
    pickNestedString(body, ["lead", "company"]) ??
    "";

  return {
    kind: normalizeEventKind(rawEventType, replyText),
    email: normalizeEmail(email),
    businessName,
    replyText,
    campaignLane: normalizeCampaignLane(
      pickString(body, ["campaign_lane", "campaignLane", "lane", "campaign"]) ??
        pickNestedString(body, ["customData", "campaignLane"]) ??
        "gmf_visibility",
    ),
    providerId:
      pickString(body, ["id", "event_id", "eventId", "lead_id", "leadId", "message_id", "messageId"]) ??
      pickNestedString(body, ["lead", "id"]) ??
      "",
    campaignId:
      pickString(body, ["campaign_id", "campaignId"]) ??
      pickNestedString(body, ["campaign", "id"]) ??
      pickNestedString(body, ["data", "campaign_id"]) ??
      "",
    leadId:
      pickString(body, ["lead_id", "leadId"]) ??
      pickNestedString(body, ["lead", "id"]) ??
      pickNestedString(body, ["data", "lead_id"]) ??
      "",
    emailStatsId:
      pickString(body, ["email_stats_id", "emailStatsId", "email_statsid"]) ??
      pickNestedString(body, ["email_stats", "id"]) ??
      pickNestedString(body, ["emailStats", "id"]) ??
      pickNestedString(body, ["reply", "email_stats_id"]) ??
      pickNestedString(body, ["data", "email_stats_id"]) ??
      "",
    replyMessageId:
      pickString(body, ["reply_message_id", "replyMessageId", "message_id", "messageId"]) ??
      pickNestedString(body, ["reply", "message_id"]) ??
      "",
    replyReceivedAt:
      pickString(body, ["reply_received_at", "received_at", "timestamp"]) ??
      pickNestedString(body, ["reply", "received_at"]) ??
      "",
    rawEventType: rawEventType || "",
    payload: safePayload(body),
  };
}

function normalizeEventKind(rawEventType: string, replyText: string): ProspectingEventKind {
  const event = rawEventType.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  if (/unsubscribe|opt_out|optout/.test(event)) return "opt_out";
  if (/bounce|bounced|failed/.test(event)) return "hard_bounce";
  if (/complaint|spam/.test(event)) return "complaint";
  if (/form|form_fill|lead_submitted|report_request/.test(event)) return "form_fill";
  if (/purchase|checkout|paid|stripe/.test(event)) return "purchase";
  if (/click/.test(event)) return "click";
  if (/sent|delivered/.test(event)) return "sent";
  if (/reply|replied|message/.test(event) || replyText.trim()) return "reply";
  return "unknown";
}

function authorize(req: NextRequest): { ok: true } | { ok: false; status: number; error: string } {
  const expected =
    process.env.GMF_PROSPECTING_EVENTS_TOKEN?.trim() ||
    process.env.CAMPAIGN_REPLY_ROUTER_TOKEN?.trim() ||
    process.env.GMF_INTERNAL_API_TOKEN?.trim();
  const testBypass = process.env.REPORT_TEST_BYPASS_TOKEN?.trim();
  const provided =
    req.headers.get("x-gmf-prospecting-events-token")?.trim() ??
    req.headers.get("x-campaign-reply-router-token")?.trim() ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ??
    req.nextUrl.searchParams.get("token")?.trim() ??
    req.nextUrl.searchParams.get("gmf_token")?.trim();

  if (expected) {
    return provided === expected
      ? { ok: true }
      : { ok: false, status: 401, error: "Unauthorized" };
  }

  if (process.env.NODE_ENV !== "production" && testBypass && provided === testBypass) {
    return { ok: true };
  }

  return {
    ok: false,
    status: 503,
    error: "GMF_PROSPECTING_EVENTS_TOKEN, CAMPAIGN_REPLY_ROUTER_TOKEN, or GMF_INTERNAL_API_TOKEN is not configured.",
  };
}

function pickString(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function pickNestedString(record: Record<string, unknown>, path: string[]): string {
  let cursor: unknown = record;
  for (const key of path) {
    const next = asRecord(cursor)[key];
    if (next === undefined) return "";
    cursor = next;
  }
  return typeof cursor === "string" && cursor.trim() ? cursor.trim() : "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizeEmail(value: string) {
  const match = value.trim().toLowerCase().match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  return match?.[0] ?? "";
}

function safePayload(body: Record<string, unknown>) {
  const copy = { ...body };
  delete copy.api_key;
  delete copy.apiKey;
  delete copy.token;
  delete copy.authorization;
  return copy;
}
