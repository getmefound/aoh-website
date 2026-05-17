import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import {
  SCHEDULED_JOB_COSTS,
  costPerBookedCall,
  daysRunning,
  formatUsd,
  totalCost,
  type JobCostStatus,
  type ScheduledJobCost,
} from "@/lib/control/job-costs";

export const metadata: Metadata = {
  title: "Scheduled Jobs - The Hub",
  description: "AOH scheduled job costs and value tracking.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default function JobsPage() {
  const now = new Date();
  const totalDaily = SCHEDULED_JOB_COSTS.reduce((sum, job) => sum + job.dailyCostUsd, 0);
  const totalToDate = SCHEDULED_JOB_COSTS.reduce((sum, job) => sum + totalCost(job, now), 0);
  const bookedCalls = SCHEDULED_JOB_COSTS.reduce((sum, job) => sum + job.bookedCalls, 0);
  const wonRevenue = SCHEDULED_JOB_COSTS.reduce((sum, job) => sum + job.wonRevenueUsd, 0);

  return (
    <ControlShell>
      <header className="mb-8 flex flex-col gap-3 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            AOH · Mission Control
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Scheduled Jobs
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            Daily run cost, total-to-date, and whether the work is paying for itself.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/mike-mc"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Back to MC
          </Link>
          <Pill tone="warn">estimated until telemetry</Pill>
        </div>
      </header>

      <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Daily run cost" value={formatUsd(totalDaily)} tone="warm" />
        <Metric label="Total to date" value={formatUsd(totalToDate)} />
        <Metric label="Booked calls" value={bookedCalls.toString()} />
        <Metric label="Won revenue" value={formatUsd(wonRevenue)} tone={wonRevenue > totalToDate ? "accent" : "muted"} />
      </section>

      <section className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300">
              Cost source
            </p>
            <p className="mt-1 max-w-4xl text-sm leading-relaxed text-zinc-400">
              These are operating estimates, not live vendor bills yet. The page is shaped so real OpenClaw,
              GHL, enrichment, email, and model usage can replace the estimates once telemetry is wired.
            </p>
          </div>
          <Pill tone="muted">v0 ledger</Pill>
        </div>
      </section>

      <section className="space-y-4">
        {SCHEDULED_JOB_COSTS.map((job, index) => (
          <JobCostCard key={job.slug} job={job} now={now} featured={index === 0} />
        ))}
      </section>
    </ControlShell>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent" | "warm" | "muted";
}) {
  const valueClass = {
    default: "text-zinc-50",
    accent: "text-emerald-300",
    warm: "text-amber-300",
    muted: "text-zinc-400",
  }[tone];

  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className={`mt-1 font-mono text-3xl font-bold leading-none ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function JobCostCard({
  job,
  now,
  featured,
}: {
  job: ScheduledJobCost;
  now: Date;
  featured?: boolean;
}) {
  const total = totalCost(job, now);
  const cpb = costPerBookedCall(job, now);
  const days = daysRunning(job.startedOn, now);
  const roi = job.wonRevenueUsd - total;

  return (
    <article
      className={`rounded-2xl border bg-gradient-to-br p-5 shadow-xl shadow-black/25 ${
        featured
          ? "border-emerald-500/35 from-emerald-950/30 to-zinc-950"
          : "border-zinc-800/60 from-zinc-900/60 to-zinc-950"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {featured ? <Pill tone="accent">watch first</Pill> : null}
            <Pill tone={statusTone(job.status)}>{statusLabel(job.status)}</Pill>
            <Pill tone="muted">{job.cadence}</Pill>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
            {job.name}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {job.service} · {job.owner}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
            {job.notes}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[34rem]">
          <MiniMetric label="Per day" value={formatUsd(job.dailyCostUsd)} tone="warm" />
          <MiniMetric label="To date" value={formatUsd(total)} />
          <MiniMetric label="Booked" value={job.bookedCalls.toString()} />
          <MiniMetric
            label="Cost/booked"
            value={cpb === null ? "--" : formatUsd(cpb)}
            tone={cpb === null ? "muted" : "accent"}
          />
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-zinc-800/70 bg-black/20 p-4">
        <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          Job overview
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{job.overview}</p>
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          {job.agentRoles.map((item) => (
            <div key={`${job.slug}-${item.agent}`} className="rounded-lg border border-zinc-800/70 bg-zinc-950/70 p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                {item.agent}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">{item.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-zinc-800/70 bg-black/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Cost breakdown
            </h3>
            <span className="text-xs text-zinc-600">{days} day run</span>
          </div>
          <div className="space-y-2">
            {job.costBreakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-zinc-400">{item.label}</span>
                <span className="font-mono text-zinc-200">{formatUsd(item.amountUsd)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/70 bg-black/20 p-4">
          <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Worth it check
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <MiniMetric label="Won revenue" value={formatUsd(job.wonRevenueUsd)} />
            <MiniMetric label="Net so far" value={formatUsd(roi)} tone={roi >= 0 ? "accent" : "warm"} />
            <MiniMetric label="Pipeline value" value={formatUsd(job.estimatedPipelineValueUsd)} />
            <MiniMetric label="Next run" value={job.nextRun} compact />
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {job.checks.map((check) => (
              <span
                key={check}
                className="rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-1 text-xs text-zinc-500"
              >
                {check}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function MiniMetric({
  label,
  value,
  tone = "default",
  compact,
}: {
  label: string;
  value: string;
  tone?: "default" | "accent" | "warm" | "muted";
  compact?: boolean;
}) {
  const valueClass = {
    default: "text-zinc-100",
    accent: "text-emerald-300",
    warm: "text-amber-300",
    muted: "text-zinc-500",
  }[tone];

  return (
    <div className="rounded-lg border border-zinc-800/70 bg-zinc-950/70 p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
        {label}
      </p>
      <p className={`mt-1 font-mono font-semibold ${compact ? "text-sm" : "text-lg"} ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function statusTone(status: JobCostStatus) {
  if (status === "worth-it") return "accent";
  if (status === "watch") return "warm";
  if (status === "paused") return "danger";
  return "muted";
}

function statusLabel(status: JobCostStatus) {
  if (status === "worth-it") return "worth it";
  if (status === "watch") return "watch cost";
  if (status === "paused") return "paused";
  return "too early";
}
