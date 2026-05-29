import { NextRequest, NextResponse } from "next/server";
import { createAgentTask } from "@/lib/ops-store";
import { hasSupabaseConfig, supabaseRest } from "@/lib/supabase-rest";
import { logVisibilityReportEvent, type VisibilityReportRow } from "@/lib/visibility-reports";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type LaunchHeartbeat = {
  generatedAt: string;
  staleFreeReports: number;
  freeReportRescuesCreated: number;
  paidGetFoundPending: number;
  fulfillmentTasksCreated: number;
  blockers: string[];
};

export async function GET(req: NextRequest) {
  const auth = verifyCronRequest(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  const generatedAt = new Date().toISOString();
  const blockers: string[] = [];
  const heartbeat: LaunchHeartbeat = {
    generatedAt,
    staleFreeReports: 0,
    freeReportRescuesCreated: 0,
    paidGetFoundPending: 0,
    fulfillmentTasksCreated: 0,
    blockers,
  };

  if (!hasSupabaseConfig()) {
    blockers.push("Supabase service config missing; launch watchdog cannot inspect report/task queues.");
    await recordHeartbeat(heartbeat, "blocked");
    return NextResponse.json({ ok: false, heartbeat }, { status: 503 });
  }

  const [staleReports, paidReports] = await Promise.all([findStaleFreeReports(), findPaidGetFoundReports()]);

  if (!staleReports.ok) {
    blockers.push(`Stale report check failed: ${staleReports.error}`);
  } else {
    heartbeat.staleFreeReports = staleReports.reports.length;
    for (const report of staleReports.reports) {
      if (String(report.lead_status).includes("report_delivery_rescue_needed")) continue;
      const rescue = await createFreeReportRescue(report);
      if (rescue.ok) heartbeat.freeReportRescuesCreated++;
      else blockers.push(`Free report rescue failed for ${report.run_id}: ${rescue.error}`);
    }
  }

  if (!paidReports.ok) {
    blockers.push(`Paid Get Found check failed: ${paidReports.error}`);
  } else {
    const pending = paidReports.reports.filter((report) => !hasFulfillmentTaskProof(report));
    heartbeat.paidGetFoundPending = pending.length;
    for (const report of pending) {
      const fulfillment = await createFulfillmentTask(report);
      if (fulfillment.ok) heartbeat.fulfillmentTasksCreated++;
      else blockers.push(`Get Found fulfillment task failed for ${report.run_id}: ${fulfillment.error}`);
    }
  }

  await recordHeartbeat(heartbeat, blockers.length ? "watch" : "ok");
  return NextResponse.json({ ok: blockers.length === 0, heartbeat });
}

async function findStaleFreeReports() {
  const staleCutoff = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const query = new URLSearchParams({
    select: "id,created_at,updated_at,run_id,report_context,audience,report_status,lead_status,next_action,blocker,business_name,contact_email,metadata",
    report_context: "eq.prospect_free_check",
    report_status: "in.(requested,building)",
    updated_at: `lt.${staleCutoff}`,
    order: "updated_at.asc",
    limit: "25",
  });
  const result = await supabaseRest<VisibilityReportRow[]>("visibility_reports", { query: query.toString() });
  if (!result.ok) return { ok: false as const, error: result.error };
  return { ok: true as const, reports: result.data };
}

async function findPaidGetFoundReports() {
  const query = new URLSearchParams({
    select: "id,created_at,updated_at,run_id,report_context,audience,report_status,lead_status,next_action,blocker,business_name,contact_email,metadata",
    report_context: "eq.prospect_free_check",
    lead_status: "eq.purchased_get_found",
    order: "updated_at.desc",
    limit: "50",
  });
  const result = await supabaseRest<VisibilityReportRow[]>("visibility_reports", { query: query.toString() });
  if (!result.ok) return { ok: false as const, error: result.error };
  return { ok: true as const, reports: result.data };
}

async function createFreeReportRescue(report: VisibilityReportRow) {
  const task = await createAgentTask({
    title: `Visibility report stalled - ${report.business_name || report.contact_email || report.run_id}`,
    kind: "visibility_report_delivery_rescue",
    priority: "high",
    source: "api/launch/nonstop",
    payload: {
      runId: report.run_id,
      businessName: report.business_name,
      contactEmail: report.contact_email,
      previousStatus: report.report_status,
      previousLeadStatus: report.lead_status,
      nextAction:
        "Systems Director investigates report automation immediately: email verification, Outscraper timeout, Resend send, Supabase update, and retry path. Do not ask Mike unless access or vendor failure is proven.",
    },
  });
  if (!task.ok) return { ok: false as const, error: task.error };

  await Promise.allSettled([
    patchReport(report, {
      report_status: "blocked",
      lead_status: "report_delivery_rescue_needed",
      blocker: "Launch nonstop watchdog found the automated report past the under-5-minute target.",
      next_action:
        "Systems Director owns immediate rescue. Check verification/enrichment/send logs, rerun if safe, and record proof before escalating.",
      metadata: withLaunchMetadata(report, { freeReportRescueCreatedAt: new Date().toISOString() }),
    }),
    logVisibilityReportEvent({
      runId: report.run_id,
      eventType: "launch_watchdog_rescue",
      actorRole: "Systems Director",
      note: "Launch nonstop watchdog created a rescue task for a stale free visibility report.",
      payload: { previousStatus: report.report_status, previousLeadStatus: report.lead_status },
    }),
  ]);
  return { ok: true as const };
}

async function createFulfillmentTask(report: VisibilityReportRow) {
  const task = await createAgentTask({
    title: `Get Found fulfillment - ${report.business_name || report.contact_email || report.run_id}`,
    kind: "get_found_fulfillment",
    priority: "high",
    source: "api/launch/nonstop",
    payload: {
      runId: report.run_id,
      businessName: report.business_name,
      contactEmail: report.contact_email,
      sla: "48h",
      owner: "Profile Manager",
      reviewer: "Auditor",
      nextAction:
        "Start paid Get Found fulfillment immediately: create before snapshot, verify access path, run approved visibility fixes, and prepare before/after proof within 48 hours.",
    },
  });
  if (!task.ok) return { ok: false as const, error: task.error };

  await Promise.allSettled([
    patchReport(report, {
      next_action:
        "Paid Get Found fulfillment task created. Profile Manager executes the 48-hour fulfillment path; Auditor reviews before/after proof before upsell.",
      metadata: withLaunchMetadata(report, { fulfillmentTaskCreatedAt: new Date().toISOString() }),
    }),
    logVisibilityReportEvent({
      runId: report.run_id,
      eventType: "get_found_fulfillment_task_created",
      actorRole: "Systems Director",
      note: "Launch nonstop watchdog created a paid Get Found fulfillment task.",
      payload: { businessName: report.business_name, contactEmail: report.contact_email },
    }),
  ]);
  return { ok: true as const };
}

async function patchReport(report: VisibilityReportRow, body: Record<string, unknown>) {
  const query = new URLSearchParams({ run_id: `eq.${report.run_id}` });
  return supabaseRest<VisibilityReportRow[]>("visibility_reports", {
    method: "PATCH",
    query: query.toString(),
    prefer: "return=minimal",
    body: { ...body, updated_at: new Date().toISOString() },
  });
}

async function recordHeartbeat(heartbeat: LaunchHeartbeat, status: "ok" | "watch" | "blocked") {
  if (!hasSupabaseConfig()) return;
  await supabaseRest("tooling_status", {
    method: "POST",
    query: "on_conflict=service",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      service: "gmf_launch_nonstop",
      status,
      detail: status === "ok" ? "Launch watchdog completed without blockers." : heartbeat.blockers.join(" | "),
      metadata: heartbeat,
      updated_at: new Date().toISOString(),
    },
  });
}

function hasFulfillmentTaskProof(report: VisibilityReportRow) {
  const metadata = safeRecord(report.metadata);
  const launchNonstop = safeRecord(metadata.launchNonstop);
  return Boolean(launchNonstop.fulfillmentTaskCreatedAt);
}

function withLaunchMetadata(report: VisibilityReportRow, patch: Record<string, unknown>) {
  const metadata = safeRecord(report.metadata);
  return {
    ...metadata,
    launchNonstop: {
      ...safeRecord(metadata.launchNonstop),
      ...patch,
    },
  };
}

function safeRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function verifyCronRequest(req: NextRequest): { ok: true } | { ok: false; status: number; error: string } {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const authHeader = req.headers.get("authorization") ?? "";
  const testToken = process.env.REPORT_TEST_BYPASS_TOKEN?.trim();
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return { ok: true };
  if (process.env.NODE_ENV !== "production" && testToken && req.headers.get("x-agent-test-bypass") === testToken) {
    return { ok: true };
  }
  return { ok: false, status: 401, error: "Unauthorized." };
}
