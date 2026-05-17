export type JobCostStatus = "worth-it" | "watch" | "too-early" | "paused";

export type ScheduledJobCost = {
  slug: string;
  name: string;
  service: string;
  owner: string;
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

