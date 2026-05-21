export type JobCostStatus = "worth-it" | "watch" | "too-early" | "paused";

export type ScheduledJobCost = {
  slug: string;
  name: string;
  service: string;
  owner: string;
  overview: string;
  reachPart?: string;
  salesAgentTasks: {
    title: string;
    description: string;
    owner: string;
  }[];
  internalTasks: {
    title: string;
    description: string;
    owner: string;
  }[];
  agentRoles: {
    agent: string;
    role: string;
  }[];
  cadence: string;
  status: JobCostStatus;
  startedOn: string;
  dailyCostUsd: number;
  totalOverrideUsd?: number;
  bookedCalls: number;
  wonRevenueUsd: number;
  estimatedPipelineValueUsd: number;
  lastRun: string;
  nextRun: string;
  notes: string;
  costBreakdown: {
    label: string;
    amountUsd: number;
  }[];
  checks: string[];
};

export type ReachCommercialItem = {
  title: string;
  description: string;
};

export type ReachFlowStatus = "verified" | "partial" | "manual" | "missing";

export type ReachInternalStep = {
  title: string;
  owner: string;
  status: ReachFlowStatus;
  description: string;
  verification: string;
};

export const REACH_COMMERCIAL_DEMO: ReachCommercialItem[] = [
  {
    title: "Define the market and offer",
    description:
      "Pick one lane, one local market, and one clear reason to talk: reviews, AI visibility, Relay, or another approved AOH offer.",
  },
  {
    title: "Discover businesses first",
    description:
      "Find candidate businesses cheaply before paying for deeper enrichment. Agents look for fit signals instead of blasting every map result.",
  },
  {
    title: "Verify a real contact path",
    description:
      "Use public business emails when possible, reject risky personal emails, and validate contacts before import or sending.",
  },
  {
    title: "Send a useful first message",
    description:
      "The outreach is reply-first and specific to the business. The goal is a real response, not a giant generic campaign.",
  },
  {
    title: "Sort replies into next actions",
    description:
      "Agents separate interested, not interested, bad fit, unsubscribe, report request, and book-a-call replies.",
  },
  {
    title: "Book and improve",
    description:
      "Warm replies go to the calendar or report handoff, while cost, bounce, reply, and booked-call data improve the next run.",
  },
];

export const REACH_INTERNAL_FLOW: ReachInternalStep[] = [
  {
    title: "Pick the lane, market, and daily cap",
    owner: "Coach + Manager",
    status: "manual",
    description:
      "Start with one offer, one geography, one target niche, and a spend/sending limit. This keeps the job explainable and prevents agents from wandering into random lead lists.",
    verification: "Defined in runbooks and Mission Control, but not yet enforced through a required campaign setup form.",
  },
  {
    title: "Run business discovery first",
    owner: "Scout",
    status: "partial",
    description:
      "Scout collects candidate businesses with the cheap discovery pass before deeper scraping, verification, or imports happen.",
    verification: "scripts/reach-discovery-first.mjs and docs/client-ops-ledger/reach-business-discovery-first.md exist; production scheduling/state still needs live telemetry.",
  },
  {
    title: "Score and shortlist businesses",
    owner: "Scout + Local Visibility Manager",
    status: "partial",
    description:
      "Agents look for likely pain: review gap, stale reviews, weak local visibility, incomplete profile, no useful website, or competitor pressure.",
    verification: "Scoring rules are documented and partially scripted; live scoring still needs more automated evidence before scale.",
  },
  {
    title: "Find and verify business emails",
    owner: "Enricher + Sender",
    status: "partial",
    description:
      "Only shortlisted businesses move to contact discovery. Business-domain emails are preferred, personal/free-mail rows are held unless Sales Manager clears them, and verification happens before sending.",
    verification: "The Relay batch proved risky rows can be held out. Live NoBounce/NeverBounce/GHL validation telemetry is not yet shown directly in Mission Control.",
  },
  {
    title: "Create clean prospect records",
    owner: "GHL Expert",
    status: "partial",
    description:
      "Clean contacts can be imported/tagged into the right lane with source, offer, and safety status. Import-only never means start sending.",
    verification: "Read-only GHL readiness passed and Relay import-only completed for 2 clean contacts; other lanes still need visual review.",
  },
  {
    title: "Send reply-first outreach",
    owner: "Sender + Coach",
    status: "missing",
    description:
      "Sender uses a specific business reason and asks for a small next action such as send the report, show details, or book a short call.",
    verification: "Copy and runbooks exist, but live Send Email/start-drip remains blocked until reply routing, unsubscribe, sender-domain, and Systems Director QA pass.",
  },
  {
    title: "Route replies and report requests",
    owner: "Sorter + GHL Expert",
    status: "partial",
    description:
      "Replies become clear next actions: interested, send report, book call, objection, bad fit, unsubscribe, or needs-human review.",
    verification: "Website report delivery workflows are live. Campaign reply router blueprint exists but still needs live UI build and QA.",
  },
  {
    title: "Book interested prospects",
    owner: "Booker + Scheduler",
    status: "verified",
    description:
      "Warm replies get moved to the AOH Talk calendar or a human handoff so the owner is not sorting cold email noise.",
    verification: "AOH Talk booking URL loads and production custom value aoh_discovery_calendar_link is set.",
  },
  {
    title: "Review cost and improve the next run",
    owner: "Systems Director + Manager",
    status: "partial",
    description:
      "Mission Control watches discovery spend, verified contacts, sends, replies, booked calls, and lane quality so weak lists or copy get changed before scaling.",
    verification: "The ledger shows cost estimates and blockers; live vendor billing, bounce, and booked-call telemetry still need deeper wiring.",
  },
];

export const REACH_OPTIONAL_AGENT_FLOW: ReachInternalStep[] = [
  {
    title: "Confirm the custom automation need",
    owner: "Coach + Manager",
    status: "manual",
    description:
      "Use this layer only when the business needs AOH agents connected to its CRM, POS, intake form, webhook, or job system. Not every Reach client needs it.",
    verification: "Must be scoped during sales/onboarding before any client system is connected.",
  },
  {
    title: "Collect access and intake",
    owner: "Manager + GHL Expert",
    status: "manual",
    description:
      "The client supplies business facts, CRM/POS access path, customer data rules, service areas, message preferences, and approval contacts.",
    verification: "Client-facing intake and access proof must exist before build work starts.",
  },
  {
    title: "Connect CRM, POS, CSV, or webhook source",
    owner: "GHL Expert + Systems Director",
    status: "manual",
    description:
      "Agents map the system that will trigger work: closed jobs, missed calls, new customers, completed appointments, review requests, or follow-up stages.",
    verification: "No custom client CRM/POS connector should go live without a test contact, rollback path, and written scope.",
  },
  {
    title: "Build custom agent instructions",
    owner: "Systems Director + Coach",
    status: "manual",
    description:
      "Define what the agent can do, what it must never do, when it asks a human, and how it should sound for that business.",
    verification: "Instructions must be reviewed before any automated client communication or data write.",
  },
  {
    title: "Trigger delivery jobs from real events",
    owner: "GHL Expert + Custom Agent",
    status: "manual",
    description:
      "Once connected, events can start review requests, missed-call follow-up, lead triage, report delivery, or customer nurture jobs.",
    verification: "Each event trigger needs sample data, a dry run, and a visible Mission Control status before launch.",
  },
  {
    title: "QA and monitor the client agent",
    owner: "Auditor + Manager",
    status: "manual",
    description:
      "Auditor checks links, permissions, unsubscribe behavior, wrong-business risk, logs, and HighLevel AI features. Those AI features stay off unless Mike manually authorizes them.",
    verification: "Launch requires written QA and ongoing monitoring because custom agents touch client systems.",
  },
];

export const REACH_TOMORROW_BLOCKERS: ReachInternalStep[] = [
  {
    title: "Final dynamic email template",
    owner: "Sender + Coach",
    status: "partial",
    description:
      "Draft first-touch/follow-up copy exists in docs/AOH_REACH_CAMPAIGN_COPY.md. The approved strategy separates three lanes: Reviews $1 first month, AI Visibility free snapshot/report, and Relay missed-call details. Each lane still needs final GHL merge-field validation, real footer values, unsubscribe proof, daily cap, and Systems Director approval before any scaled send.",
    verification: "Sender, Coach, and Systems Director pressure-tested the offer structure on 2026-05-18; copy is drafted but not approved for scaled live send nodes until reply router QA passes.",
  },
  {
    title: "Live GHL report + heatmap workflow",
    owner: "GHL Expert",
    status: "verified",
    description:
      "Active AOH/Hub360AI production workflows generate/store report URLs, call the website callback, and use a single combined delivery workflow to avoid duplicate customer emails.",
    verification: "Verified 2026-05-18 in active production location: Website Visitor Free Marketing Report Intake, Website Visitor Free AI Visibility Report Intake, and Website Visitor Report Delivery are published; delivery execution completed successfully.",
  },
  {
    title: "Campaign reply-to-report automation",
    owner: "GHL Expert + Website",
    status: "partial",
    description:
      "Need reliable campaign reply automations: Reviews/AI `send` replies trigger the correct report generation/delivery, Relay `send` replies send missed-call details, `book` replies trigger AOH Talk booking handoff, unclear replies become tasks, and unsubscribe/not-interested replies stop safely.",
    verification: "Website/report delivery flow is live. Live MC diagnostics see production GHL location tRbczwt6oJsXK4tjuzOI and the Reach - Reviews / Reach - AI pipelines. docs/AOH_CAMPAIGN_REPLY_ROUTER.md now defines the exact router blueprint. GHL UI build and QA still need to pass before scaled sends.",
  },
  {
    title: "AOH Client Template Lab template check",
    owner: "GHL Expert + Systems Director",
    status: "partial",
    description:
      "Fields, values, tags, and a Draft-only Reach workflow skeleton exist in the template lab. This is reusable setup only, not proof that live AOH campaigns/report workflows are wired.",
    verification: "Template-lab setup was verified manually/visually; keep it separate from the active production workflows that now handle website visitor reports.",
  },
  {
    title: "Prospect list filter before spending",
    owner: "Scout",
    status: "missing",
    description:
      "Need the cheap prefilter so you do not pay to deeply scan every GBP in an area/niche.",
    verification: "Defined above, not automated.",
  },
  {
    title: "Controlled launch caps and first-hour watch",
    owner: "Systems Director + Manager",
    status: "partial",
    description:
      "The dedicated-domain warmup ladder is documented: 10-20 emails/day for 3 days, then 40-50/day for 3 days, then 80-100/day for 3 days, followed by a Day 9 warmup/status check before any increase. Mission Control still needs automated live telemetry for lane status, daily cap, suppression count, duplicate prevention status, failures, and first-hour watch owner.",
    verification: "Launch runbook is documented in docs/AOH_REACH_LAUNCH_RUNBOOK.md; live MC telemetry and first-hour watch are not fully automated yet.",
  },
];

export const SCHEDULED_JOB_COSTS: ScheduledJobCost[] = [
  {
    slug: "reviews-outreach",
    name: "Commercial Reach - Reviews lane",
    service: "Reach",
    owner: "Scout + Sender + Sorter + Booker",
    overview:
      "Commercial Reach is the standard outbound job AOH can sell to most businesses: find likely buyers, verify a safe way to contact them, send a useful first message, sort replies, and turn real interest into calls.",
    reachPart:
      "This is standard Reach. Custom agents and CRM/POS connections are a separate add-on after the client needs event-based automation.",
    salesAgentTasks: [
      {
        title: "Run discovery first",
        description: "Scout finds and scores local businesses before AOH pays for deeper enrichment or starts any email workflow.",
        owner: "Scout",
      },
      {
        title: "Verify contact quality",
        description: "Enricher and Sender prefer business-domain emails, reject risky personal emails, and validate before send approval.",
        owner: "Enricher + Sender",
      },
      {
        title: "Send the first useful message",
        description: "Sender writes a specific, reply-first note tied to the lane instead of a generic cold email blast.",
        owner: "Sender",
      },
      {
        title: "Read and classify every reply",
        description: "Sorter separates interested replies, objections, bad fits, and unsubscribe/no-response noise.",
        owner: "Sorter",
      },
      {
        title: "Turn interest into a call",
        description: "Booker nudges warm replies toward the /aoh-talk calendar and makes sure no lead sits unanswered.",
        owner: "Booker",
      },
    ],
    internalTasks: [
      {
        title: "Measure cost against booked calls",
        description: "Systems Director watches daily spend, cost per booked call, reply quality, and whether the list or message should change.",
        owner: "Systems Director",
      },
      {
        title: "Keep custom agents separate",
        description: "Manager marks CRM, POS, webhook, or custom-agent work as an add-on path so the basic Reach job stays simple to explain.",
        owner: "Manager",
      },
      {
        title: "Keep the workflow visible",
        description: "Manager makes sure the job status, blockers, and next actions stay visible in Mission Control.",
        owner: "Manager",
      },
      {
        title: "Improve the offer loop",
        description: "Coach turns reply patterns into better sales language, clearer objections, and future playbook updates.",
        owner: "Coach",
      },
    ],
    agentRoles: [
      { agent: "Scout", role: "Runs business discovery first and shortlists businesses that look worth contacting." },
      { agent: "Enricher", role: "Finds usable business contact data and keeps risky emails out of the send path." },
      { agent: "Sender", role: "Prepares reply-first outreach without making it sound templated." },
      { agent: "Sorter", role: "Reads replies, separates real interest from noise, and flags hot leads." },
      { agent: "Booker", role: "Moves interested replies toward a call on the calendar." },
      { agent: "Systems Director", role: "Checks cost, booked-call rate, and whether the list/copy should change." },
    ],
    cadence: "Daily at 7:00am",
    status: "watch",
    startedOn: "2026-05-14",
    dailyCostUsd: 3.72,
    bookedCalls: 0,
    wonRevenueUsd: 0,
    estimatedPipelineValueUsd: 299,
    lastRun: "Today 7:00am",
    nextRun: "Tomorrow 7:00am",
    notes: "This is the clean business-facing job: discovery, verification, outreach, reply sorting, booking, and improvement. Do not bundle CRM/custom-agent setup into this unless the prospect buys that add-on.",
    costBreakdown: [
      { label: "Scout research", amountUsd: 0.42 },
      { label: "Contact enrichment", amountUsd: 0.9 },
      { label: "Message drafting + send prep", amountUsd: 1.8 },
      { label: "Reply triage", amountUsd: 0.35 },
      { label: "Booking/admin checks", amountUsd: 0.25 },
    ],
    checks: [
      "Discovery first",
      "Contacts verified",
      "Send gate passed",
      "Replies sorted",
      "Booked calls",
    ],
  },
  {
    slug: "ai-visibility-outreach",
    name: "AI Visibility Outreach",
    service: "Reach",
    owner: "Scout + Sender + Sorter",
    overview:
      "A Reach campaign angle focused on local and AI visibility. It finds companies with weak public visibility signals, starts the audit conversation, and watches whether that creates discovery calls.",
    reachPart:
      "This is a Reach campaign variant: the sales angle is visibility/audit instead of review automation.",
    salesAgentTasks: [
      {
        title: "Spot visibility gaps",
        description: "Scout looks for weak profiles, stale reviews, poor category coverage, and unclear local presence.",
        owner: "Scout",
      },
      {
        title: "Lead with the audit angle",
        description: "Sender frames the outreach around what customers and AI systems may not be finding.",
        owner: "Sender",
      },
      {
        title: "Route interested replies",
        description: "Sorter identifies who wants an audit, who needs more context, and who is not a fit.",
        owner: "Sorter",
      },
    ],
    internalTasks: [
      {
        title: "Supply proof points",
        description: "Local Visibility Manager gives the campaign the checklist and findings that make the visibility pitch credible.",
        owner: "Local Visibility Manager",
      },
      {
        title: "Decide whether to keep spending",
        description: "Systems Director compares replies and booked audits against the daily cost before scaling.",
        owner: "Systems Director",
      },
    ],
    agentRoles: [
      { agent: "Scout", role: "Finds prospects with Local Visibility Manager, review, citation, or AI visibility gaps." },
      { agent: "Sender", role: "Sends the visibility-audit angle and keeps the message aligned to AOH's offer." },
      { agent: "Sorter", role: "Classifies replies and sends interested leads toward discovery." },
      { agent: "Local Visibility Manager", role: "Provides the visibility checklist and proof points used in the pitch." },
      { agent: "Systems Director", role: "Watches reply quality and whether booked audits justify the daily spend." },
    ],
    cadence: "Daily at 7:15am",
    status: "watch",
    startedOn: "2026-05-14",
    dailyCostUsd: 3.1,
    bookedCalls: 0,
    wonRevenueUsd: 0,
    estimatedPipelineValueUsd: 199,
    lastRun: "Today 7:15am",
    nextRun: "Tomorrow 7:15am",
    notes: "Worth keeping only if it creates booked audits or reply signals that improve the offer.",
    costBreakdown: [
      { label: "Scout research", amountUsd: 0.5 },
      { label: "Contact enrichment", amountUsd: 0.75 },
      { label: "Message drafting + send prep", amountUsd: 1.55 },
      { label: "Reply triage", amountUsd: 0.3 },
    ],
    checks: ["Niche fit", "Prospects found", "Messages sent", "Replies", "Booked audits"],
  },
  {
    slug: "ghl-workflow-heartbeat",
    name: "GHL workflow heartbeat",
    service: "Mission Control",
    owner: "GHL Expert",
    overview:
      "Check the HighLevel systems that make bookings, workflows, and pipeline movement work before failures reach Mike or a client.",
    salesAgentTasks: [
      {
        title: "Protect booked-call flow",
        description: "GHL Expert checks the calendar, workflow, and pipeline pieces that convert interest into a real appointment.",
        owner: "GHL Expert",
      },
    ],
    internalTasks: [
      {
        title: "Run website report smoke test",
        description:
          "Systems Director submits one homepage report request, then confirms GHL tags, both report workflows, Website Leads opportunity creation, callbacks, and usable report links.",
        owner: "Systems Director",
      },
      {
        title: "Catch broken automations",
        description: "GHL Expert checks workflow errors, missed handoffs, calendar sync, and stuck pipeline movement.",
        owner: "GHL Expert",
      },
      {
        title: "Escalate failures",
        description: "Manager turns any failure into a visible Mission Control item with an owner.",
        owner: "Manager",
      },
      {
        title: "Review recurring issues",
        description: "Systems Director watches for repeated breaks so the system gets fixed instead of repeatedly patched.",
        owner: "Systems Director",
      },
    ],
    agentRoles: [
      { agent: "GHL Expert", role: "Checks workflow errors, calendar sync, report tags, Website Leads pipeline movement, and webhook health." },
      { agent: "Manager", role: "Turns any failure into a visible Mission Control task or blocker." },
      { agent: "Systems Director", role: "Runs the homepage report smoke test, reviews recurring failures, and decides whether the system is drifting." },
      { agent: "Reporter", role: "Confirms generated marketing and AI visibility report links are usable." },
      { agent: "Website/Codex", role: "Fixes /api/report, Vercel env, or callback issues when the handoff breaks." },
    ],
    cadence: "Daily",
    status: "worth-it",
    startedOn: "2026-05-17",
    dailyCostUsd: 0.18,
    bookedCalls: 0,
    wonRevenueUsd: 0,
    estimatedPipelineValueUsd: 0,
    lastRun: "Today",
    nextRun: "Tomorrow",
    notes: "Cheap insurance. Keep this even before client volume grows.",
    costBreakdown: [
      { label: "GHL API checks", amountUsd: 0.04 },
      { label: "Workflow/status summary", amountUsd: 0.1 },
      { label: "Alert routing", amountUsd: 0.04 },
    ],
    checks: ["Homepage report smoke test", "Report tags", "Workflow errors", "Website Leads pipeline", "Callbacks", "Report links", "Calendar sync"],
  },
  {
    slug: "secret-exposure-sweep",
    name: "Secret exposure sweep",
    service: "Security",
    owner: "Systems Director",
    overview:
      "Scan for obvious credential leaks, unsafe token exposure, and risky public/client-side configuration before they become incidents.",
    salesAgentTasks: [
      {
        title: "Keep client trust clean",
        description: "Systems Director makes sure sales and demo links are not exposing tokens or sensitive operational details.",
        owner: "Systems Director",
      },
    ],
    internalTasks: [
      {
        title: "Run exposure checks",
        description: "Systems Director scans for secrets in source, screenshots, URLs, and unsafe public configuration.",
        owner: "Systems Director",
      },
      {
        title: "Route fixes",
        description: "Manager sends any risk to the right owner and keeps it visible until closed.",
        owner: "Manager",
      },
      {
        title: "Review connected apps",
        description: "GHL Expert helps if the risk touches HighLevel credentials, webhooks, or connected workflows.",
        owner: "GHL Expert",
      },
    ],
    agentRoles: [
      { agent: "Systems Director", role: "Runs the sweep, flags exposures, and blocks risky deploys." },
      { agent: "Manager", role: "Routes any security fix to the right owner and keeps it visible." },
      { agent: "GHL Expert", role: "Helps when leaked or unsafe credentials touch HighLevel integrations." },
    ],
    cadence: "Daily",
    status: "worth-it",
    startedOn: "2026-05-17",
    dailyCostUsd: 0.06,
    bookedCalls: 0,
    wonRevenueUsd: 0,
    estimatedPipelineValueUsd: 0,
    lastRun: "Today",
    nextRun: "Tomorrow",
    notes: "Tiny cost compared with one leaked-token incident.",
    costBreakdown: [
      { label: "Pattern scan", amountUsd: 0.01 },
      { label: "Risk summary", amountUsd: 0.03 },
      { label: "Alert check", amountUsd: 0.02 },
    ],
    checks: ["Tokens in URLs", "Secrets in source", "Unsafe env names", "Public screenshots"],
  },
  {
    slug: "local-visibility-sweep",
    name: "Local visibility sweep",
    service: "AI Visibility",
    owner: "Local Visibility Manager",
    overview:
      "Check AOH or client profiles for basic visibility decay: profile completeness, reviews, unanswered reviews, and NAP drift.",
    salesAgentTasks: [
      {
        title: "Create client-facing findings",
        description: "Local Visibility Manager turns profile gaps, unanswered reviews, and visibility drift into simple sales talking points.",
        owner: "Local Visibility Manager",
      },
    ],
    internalTasks: [
      {
        title: "Monitor profile health",
        description: "Local Visibility Manager checks GBP completeness, photos, services, categories, reviews, and NAP consistency.",
        owner: "Local Visibility Manager",
      },
      {
        title: "Confirm GHL connection health",
        description: "GHL Expert verifies connected GBP or reputation pieces still sync where needed.",
        owner: "GHL Expert",
      },
      {
        title: "Turn findings into reporting",
        description: "Coach translates checks into client-friendly explanations and monthly report language.",
        owner: "Coach",
      },
    ],
    agentRoles: [
      { agent: "Local Visibility Manager", role: "Checks GBP completeness, reviews, photos, services, categories, and NAP consistency." },
      { agent: "GHL Expert", role: "Confirms connected HighLevel/GBP pieces still sync where needed." },
      { agent: "Systems Director", role: "Confirms recurring profile issues are not being ignored." },
      { agent: "Coach", role: "Turns findings into client-facing explanations or monthly report language." },
    ],
    cadence: "Weekly",
    status: "too-early",
    startedOn: "2026-05-17",
    dailyCostUsd: 0.21,
    bookedCalls: 0,
    wonRevenueUsd: 0,
    estimatedPipelineValueUsd: 0,
    lastRun: "Not started",
    nextRun: "This week",
    notes: "Estimated daily average of a weekly job. Useful once AOH GBP is treated as client zero.",
    costBreakdown: [
      { label: "GBP checks", amountUsd: 0.08 },
      { label: "Review/NAP scan", amountUsd: 0.07 },
      { label: "Summary", amountUsd: 0.06 },
    ],
    checks: ["GBP completeness", "New reviews", "Unanswered reviews", "NAP drift"],
  },
];

export function daysRunning(startedOn: string, now = new Date()): number {
  const start = new Date(`${startedOn}T00:00:00Z`).getTime();
  if (Number.isNaN(start)) return 1;
  const diff = now.getTime() - start;
  return Math.max(1, Math.floor(diff / 86_400_000) + 1);
}

export function totalCost(job: ScheduledJobCost, now = new Date()): number {
  if (typeof job.totalOverrideUsd === "number") return job.totalOverrideUsd;
  return job.dailyCostUsd * daysRunning(job.startedOn, now);
}

export function costPerBookedCall(job: ScheduledJobCost, now = new Date()): number | null {
  if (job.bookedCalls <= 0) return null;
  return totalCost(job, now) / job.bookedCalls;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount >= 100 ? 0 : 2,
  }).format(amount);
}
