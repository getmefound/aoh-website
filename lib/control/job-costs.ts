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

export const SCHEDULED_JOB_COSTS: ScheduledJobCost[] = [
  {
    slug: "reviews-outreach",
    name: "Reviews Outreach - Reach lead engine",
    service: "Reach",
    owner: "Scout + Sender + Sorter + Booker",
    overview:
      "Reach is the outbound growth machine. It finds likely buyers, enriches their contact details, sends a clean first-touch message, sorts replies, and moves interested people toward a booked call.",
    reachPart:
      "This is the core Reach workflow: find the right businesses, start conversations, separate real buying signals from noise, and hand warm replies to booking.",
    salesAgentTasks: [
      {
        title: "Build the prospect list",
        description: "Scout finds businesses that look like they need review automation or local visibility help.",
        owner: "Scout",
      },
      {
        title: "Prepare usable contact records",
        description: "Enricher turns a business name into a useful lead record with website, phone, email, and context.",
        owner: "Enricher",
      },
      {
        title: "Send the first conversation starter",
        description: "Sender writes and sends outreach in AOH's voice so the message feels specific, not like a blast.",
        owner: "Sender",
      },
      {
        title: "Read and classify every reply",
        description: "Sorter separates interested replies, objections, bad fits, and unsubscribe/no-response noise.",
        owner: "Sorter",
      },
      {
        title: "Turn interest into a call",
        description: "Booker nudges warm replies toward the /talk calendar and makes sure no lead sits unanswered.",
        owner: "Booker",
      },
    ],
    internalTasks: [
      {
        title: "Measure cost against booked calls",
        description: "Auditor watches daily spend, cost per booked call, reply quality, and whether the list or message should change.",
        owner: "Auditor",
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
      { agent: "Scout", role: "Finds the right local businesses and checks whether they look like a fit." },
      { agent: "Enricher", role: "Adds usable email, phone, website, and business details before outreach." },
      { agent: "Sender", role: "Prepares and sends the outreach sequence without making it sound templated." },
      { agent: "Sorter", role: "Reads replies, separates real interest from noise, and flags hot leads." },
      { agent: "Booker", role: "Moves interested replies toward a call on the calendar." },
      { agent: "Auditor", role: "Checks cost, booked-call rate, and whether the list/copy should change." },
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
    notes: "First job to watch. If booked calls stay at 0 after a week, change list/source/copy before scaling.",
    costBreakdown: [
      { label: "Scout research", amountUsd: 0.42 },
      { label: "Contact enrichment", amountUsd: 0.9 },
      { label: "Message drafting + send prep", amountUsd: 1.8 },
      { label: "Reply triage", amountUsd: 0.35 },
      { label: "Booking/admin checks", amountUsd: 0.25 },
    ],
    checks: [
      "Prospects found",
      "Contacts enriched",
      "Messages sent",
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
        description: "Profile gives the campaign the checklist and findings that make the visibility pitch credible.",
        owner: "Profile",
      },
      {
        title: "Decide whether to keep spending",
        description: "Auditor compares replies and booked audits against the daily cost before scaling.",
        owner: "Auditor",
      },
    ],
    agentRoles: [
      { agent: "Scout", role: "Finds prospects with profile, review, citation, or AI visibility gaps." },
      { agent: "Sender", role: "Sends the visibility-audit angle and keeps the message aligned to AOH's offer." },
      { agent: "Sorter", role: "Classifies replies and sends interested leads toward discovery." },
      { agent: "Profile", role: "Provides the visibility checklist and proof points used in the pitch." },
      { agent: "Auditor", role: "Watches reply quality and whether booked audits justify the daily spend." },
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
        description: "Auditor watches for repeated breaks so the system gets fixed instead of repeatedly patched.",
        owner: "Auditor",
      },
    ],
    agentRoles: [
      { agent: "GHL Expert", role: "Checks workflow errors, calendar sync, pipeline movement, and webhook health." },
      { agent: "Manager", role: "Turns any failure into a visible Mission Control task or blocker." },
      { agent: "Auditor", role: "Reviews recurring failures and decides whether the system is drifting." },
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
    checks: ["Workflow errors", "Calendar sync", "Pipeline movement", "Webhook health"],
  },
  {
    slug: "secret-exposure-sweep",
    name: "Secret exposure sweep",
    service: "Security",
    owner: "Auditor",
    overview:
      "Scan for obvious credential leaks, unsafe token exposure, and risky public/client-side configuration before they become incidents.",
    salesAgentTasks: [
      {
        title: "Keep client trust clean",
        description: "Auditor makes sure sales and demo links are not exposing tokens or sensitive operational details.",
        owner: "Auditor",
      },
    ],
    internalTasks: [
      {
        title: "Run exposure checks",
        description: "Auditor scans for secrets in source, screenshots, URLs, and unsafe public configuration.",
        owner: "Auditor",
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
      { agent: "Auditor", role: "Runs the sweep, flags exposures, and blocks risky deploys." },
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
    slug: "profile-visibility-sweep",
    name: "Profile visibility sweep",
    service: "AI Visibility",
    owner: "Profile",
    overview:
      "Check AOH or client profiles for basic visibility decay: profile completeness, reviews, unanswered reviews, and NAP drift.",
    salesAgentTasks: [
      {
        title: "Create client-facing findings",
        description: "Profile turns profile gaps, unanswered reviews, and visibility drift into simple sales talking points.",
        owner: "Profile",
      },
    ],
    internalTasks: [
      {
        title: "Monitor profile health",
        description: "Profile checks GBP completeness, photos, services, categories, reviews, and NAP consistency.",
        owner: "Profile",
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
      { agent: "Profile", role: "Checks GBP completeness, reviews, photos, services, categories, and NAP consistency." },
      { agent: "GHL Expert", role: "Confirms connected HighLevel/GBP pieces still sync where needed." },
      { agent: "Auditor", role: "Confirms recurring profile issues are not being ignored." },
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
