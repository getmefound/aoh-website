export type JobCostStatus = "worth-it" | "watch" | "too-early" | "paused";

export type ScheduledJobCost = {
  slug: string;
  name: string;
  service: string;
  owner: string;
  overview: string;
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
      "Find likely buyers, enrich contact details, send outreach in AOH's voice, sort replies, and turn interested replies into booked calls.",
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
      "Find businesses with weak local/AI visibility signals, start the conversation, and watch whether the offer creates audit calls.",
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
