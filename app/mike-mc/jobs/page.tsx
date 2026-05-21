import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import {
  REACH_COMMERCIAL_DEMO,
  REACH_INTERNAL_FLOW,
  REACH_OPTIONAL_AGENT_FLOW,
  REACH_TOMORROW_BLOCKERS,
  SCHEDULED_JOB_COSTS,
  costPerBookedCall,
  daysRunning,
  formatUsd,
  totalCost,
  type ReachFlowStatus,
  type ReachInternalStep,
  type JobCostStatus,
  type ScheduledJobCost,
} from "@/lib/control/job-costs";

export const metadata: Metadata = {
  title: "Scheduled Jobs - The Hub",
  description: "AOH scheduled job costs and workflow tracking.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

const REACH_REVIEW_GATE = [
  {
    label: "Owner",
    value: "GHL Expert",
    detail: "Inspects live HighLevel, documents exact fields, and prepares the workflow plan.",
  },
  {
    label: "Reviewer",
    value: "Auditor",
    detail: "Checks merge fields, unsubscribe behavior, report URLs, DNS, and launch safety.",
  },
  {
    label: "Orchestrator",
    value: "Manager",
    detail: "Confirms proof, blockers, model choice, and whether the work is ready for Mike.",
  },
  {
    label: "Mike needed",
    value: "Not yet",
    detail: "Mike only approves final decisions or access changes after agents finish review.",
  },
];

export default function JobsPage() {
  const now = new Date();
  const totalDaily = SCHEDULED_JOB_COSTS.reduce((sum, job) => sum + job.dailyCostUsd, 0);
  const totalToDate = SCHEDULED_JOB_COSTS.reduce((sum, job) => sum + totalCost(job, now), 0);
  const bookedCalls = SCHEDULED_JOB_COSTS.reduce((sum, job) => sum + job.bookedCalls, 0);
  const wonRevenue = SCHEDULED_JOB_COSTS.reduce((sum, job) => sum + job.wonRevenueUsd, 0);
  const reachJob = SCHEDULED_JOB_COSTS.find((job) => job.slug === "reviews-outreach");

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-3 border-b border-zinc-800/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-400/70">
            AOH - Mission Control
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Scheduled Jobs + Workflow Ledger
          </h1>
          <p className="mt-1.5 text-base text-zinc-400">
            The sales story, agent handoffs, daily run cost, and whether each job is paying for itself.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/mike-mc"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Back to MC
          </Link>
          <Link
            href="/mike-mc/campaigns"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Campaigns
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

      <JobIndexSection />
      {reachJob ? <ReachWorkflowHero job={reachJob} /> : null}
      <CommercialReachFlowSection />
      <OptionalCustomAgentSection />
      <ReachReviewGateSection />
      <TomorrowReadinessSection />

      <section className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
              Cost source
            </p>
            <p className="mt-1 max-w-none text-base leading-relaxed text-zinc-400">
              These are operating estimates, not live vendor bills yet. The page is shaped so real OpenClaw,
              GHL, enrichment, email, and model usage can replace the estimates once telemetry is wired.
            </p>
          </div>
          <Pill tone="muted">v0 ledger</Pill>
        </div>
      </section>

      <section className="space-y-5">
        {SCHEDULED_JOB_COSTS.map((job, index) => (
          <JobCostCard key={job.slug} job={job} now={now} featured={index === 0} />
        ))}
      </section>
    </ControlShell>
  );
}

function JobIndexSection() {
  const links = [
    {
      title: "Commercial Reach",
      label: "core job",
      tone: "accent" as const,
      href: "#commercial-reach",
      detail: "The business-facing product: discover, verify, email, sort replies, and book calls.",
    },
    {
      title: "Reach steps",
      label: "plain steps",
      tone: "warm" as const,
      href: "#commercial-reach-steps",
      detail: "The operational sequence you can explain without dragging a prospect into internal tooling.",
    },
    {
      title: "Custom agents / CRM",
      label: "optional",
      tone: "muted" as const,
      href: "#custom-agent-layer",
      detail: "Only for clients that need agents connected to CRM, POS, CSV, webhooks, or customer events.",
    },
    {
      title: "Internal Reach room",
      label: "live room",
      tone: "warn" as const,
      href: "/mike-mc/jobs/reach-cold-email-campaign",
      detail: "The current warmup/import/send-gate room for the cold email campaign.",
    },
  ];

  return (
    <section className="mb-8 rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            Job index
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            Fast links for explaining the work
          </h2>
          <p className="mt-2 max-w-none text-base leading-relaxed text-zinc-400">
            Use this as the table of contents when you are showing a business what agents do.
            Reach stays simple unless a client actually needs the custom CRM/agent layer.
          </p>
        </div>
        <Pill tone="accent">front-page index source</Pill>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {links.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/80"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-zinc-100">{item.title}</h3>
              <Pill tone={item.tone}>{item.label}</Pill>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">{item.detail}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ReachWorkflowHero({ job }: { job: ScheduledJobCost }) {
  return (
    <section id="commercial-reach" className="scroll-mt-8 mb-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-zinc-950 to-zinc-950 p-5 shadow-2xl shadow-black/30 md:p-6">
      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Pill tone="accent">Reach product</Pill>
            <Pill tone="muted">standard offer</Pill>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
            Commercial Reach: what a business is buying
          </h2>
          <p className="mt-3 max-w-none text-base leading-relaxed text-zinc-300">
            {job.reachPart ?? job.overview}
          </p>
          <p className="mt-4 max-w-none text-base leading-relaxed text-zinc-500">
            For a sales demo, keep the story here: Reach finds businesses that look like good fits,
            verifies the contact path, starts useful conversations, sorts replies, and moves real
            interest toward a report or booked call. CRM connections and custom agents are an add-on,
            not the default promise.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {REACH_COMMERCIAL_DEMO.map((item, index) => (
            <div key={item.title} className="rounded-xl border border-emerald-500/20 bg-black/25 p-4">
              <p className="font-mono text-xs uppercase tracking-wider text-emerald-300">
                Commercial {index + 1}
              </p>
              <p className="mt-3 text-base font-semibold text-zinc-100">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReachReviewGateSection() {
  return (
    <section className="mb-8 rounded-2xl border border-sky-500/25 bg-sky-500/5 p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
            Agent review gate
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            Agents work and review before Mike approves
          </h2>
          <p className="mt-2 max-w-none text-base leading-relaxed text-zinc-400">
            Website visitor reports are live-tested. Reach is still blocked from scaled campaign
            sending until GHL Expert verifies reply routing, Auditor reviews the risk, and Manager
            decides the work is ready to escalate. Mike should not be asked to gather technical
            details unless no agent or tool access exists.
          </p>
        </div>
        <Pill tone="warn">campaign routing still gated</Pill>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {REACH_REVIEW_GATE.map((item) => (
          <div key={item.label} className="rounded-xl border border-sky-500/20 bg-black/25 p-4">
            <p className="font-mono text-xs uppercase tracking-wider text-sky-300">
              {item.label}
            </p>
            <p className="mt-2 text-lg font-semibold text-zinc-100">{item.value}</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CommercialReachFlowSection() {
  return (
    <section id="commercial-reach-steps" className="scroll-mt-8 mb-8 rounded-2xl border border-zinc-800/70 bg-gradient-to-br from-zinc-900/70 to-zinc-950 p-5 shadow-xl shadow-black/25 md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
            Commercial Reach - standard job
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            Step-by-step: discovery to booked call
          </h2>
          <p className="mt-2 max-w-none text-base leading-relaxed text-zinc-400">
            This is the version to explain to most businesses. It does not assume their CRM is connected
            or that custom agents are running inside their company yet. Green is verified, amber is partly
            wired or still needs live proof, gray is manual, and red is not ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill tone="accent">verified</Pill>
          <Pill tone="warm">partial</Pill>
          <Pill tone="muted">manual</Pill>
          <Pill tone="danger">missing</Pill>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {REACH_INTERNAL_FLOW.map((step, index) => (
          <InternalStepCard key={step.title} step={step} index={index + 1} />
        ))}
      </div>
    </section>
  );
}

function OptionalCustomAgentSection() {
  return (
    <section id="custom-agent-layer" className="scroll-mt-8 mb-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">
            Optional add-on
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            Custom agents and CRM connections
          </h2>
          <p className="mt-2 max-w-none text-base leading-relaxed text-zinc-400">
            This starts after a business needs AOH agents connected to its CRM, POS, CSV,
            webhook, intake form, or job system. Not every business needs this layer, so it stays
            separate from the standard Commercial Reach promise.
          </p>
        </div>
        <Pill tone="muted">scope before build</Pill>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {REACH_OPTIONAL_AGENT_FLOW.map((step, index) => (
          <InternalStepCard key={step.title} step={step} index={index + 1} />
        ))}
      </div>
    </section>
  );
}

function TomorrowReadinessSection() {
  return (
    <section className="mb-8 rounded-2xl border border-rose-500/25 bg-rose-500/5 p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-rose-300">
            Before sending tomorrow
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
            What still has to be true before emails go out
          </h2>
          <p className="mt-2 text-base leading-relaxed text-zinc-400">
            The website build passed, but sending outreach safely needs these operational pieces
            finished or manually controlled first.
          </p>
        </div>
        <Pill tone="warn">do not scale until checked</Pill>
      </div>
      <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-5">
        {REACH_TOMORROW_BLOCKERS.map((step, index) => (
          <InternalStepCard key={step.title} step={step} index={index + 1} compact />
        ))}
      </div>
    </section>
  );
}

function InternalStepCard({
  step,
  index,
  compact,
}: {
  step: ReachInternalStep;
  index: number;
  compact?: boolean;
}) {
  return (
    <article className="rounded-xl border border-zinc-800/70 bg-zinc-950/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Step {index}
          </p>
          <h3 className="mt-2 text-base font-semibold leading-snug text-zinc-100">
            {step.title}
          </h3>
        </div>
        <Pill tone={flowStatusTone(step.status)}>{step.status}</Pill>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{step.description}</p>
      <div className="mt-4 rounded-lg border border-zinc-800/70 bg-black/20 p-3">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          Owner
        </p>
        <p className="mt-1 text-sm text-zinc-300">{step.owner}</p>
        {!compact ? (
          <>
            <p className="mt-3 font-mono text-xs uppercase tracking-wider text-zinc-500">
              Verification
            </p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">{step.verification}</p>
          </>
        ) : null}
      </div>
    </article>
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
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
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
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {featured ? <Pill tone="accent">Reach core</Pill> : null}
            <Pill tone={statusTone(job.status)}>{statusLabel(job.status)}</Pill>
            <Pill tone="muted">{job.cadence}</Pill>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
            {job.name}
          </h2>
          <p className="mt-1 text-base text-zinc-500">
            {job.service} - {job.owner}
          </p>
          <p className="mt-3 max-w-none text-base leading-relaxed text-zinc-400">
            {job.notes}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:min-w-[34rem]">
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

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[0.7fr_1.3fr]">
        <section className="rounded-xl border border-zinc-800/70 bg-black/20 p-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
            Job overview
          </h3>
          <p className="mt-2 text-base leading-relaxed text-zinc-400">{job.overview}</p>
          {job.reachPart ? (
            <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="font-mono text-xs uppercase tracking-wider text-emerald-300">
                Part of Reach
              </p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{job.reachPart}</p>
            </div>
          ) : null}
        </section>

        <section className="rounded-xl border border-zinc-800/70 bg-black/20 p-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
            Full workflow
          </h3>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <WorkflowColumn title="Possible sales-agent tasks" tasks={job.salesAgentTasks} tone="accent" />
            <WorkflowColumn title="Internal control work" tasks={job.internalTasks} tone="muted" />
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-zinc-800/70 bg-black/20 p-4">
        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
          Agent roles
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {job.agentRoles.map((item) => (
            <div key={`${job.slug}-${item.agent}`} className="rounded-lg border border-zinc-800/70 bg-zinc-950/70 p-3">
              <p className="font-mono text-xs uppercase tracking-wider text-emerald-300">
                {item.agent}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      {job.slug === "reviews-outreach" ? (
        <section className="mt-4 rounded-xl border border-sky-500/25 bg-sky-500/5 p-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-sky-300">
                Current review gate
              </h3>
              <p className="mt-2 text-base leading-relaxed text-zinc-400">
                This job should not reach Mike as raw technical work. GHL Expert verifies,
                Auditor reviews, Manager decides, then Mike approves only if needed.
              </p>
            </div>
            <Pill tone="warn">Mike not needed yet</Pill>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {REACH_REVIEW_GATE.map((item) => (
              <div key={`${job.slug}-gate-${item.label}`} className="rounded-lg border border-zinc-800/70 bg-zinc-950/70 p-3">
                <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-200">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr] 2xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-xl border border-zinc-800/70 bg-black/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
              Cost breakdown
            </h3>
            <span className="text-sm text-zinc-600">{days} day run</span>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {job.costBreakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800/70 bg-zinc-950/70 px-3 py-2 text-base">
                <span className="text-zinc-400">{item.label}</span>
                <span className="font-mono text-zinc-200">{formatUsd(item.amountUsd)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/70 bg-black/20 p-4">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
            Worth it check
          </h3>
          <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
            <MiniMetric label="Won revenue" value={formatUsd(job.wonRevenueUsd)} />
            <MiniMetric label="Net so far" value={formatUsd(roi)} tone={roi >= 0 ? "accent" : "warm"} />
            <MiniMetric label="Pipeline value" value={formatUsd(job.estimatedPipelineValueUsd)} />
            <MiniMetric label="Next run" value={job.nextRun} compact />
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {job.checks.map((check) => (
              <span
                key={check}
                className="rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-1 text-sm text-zinc-500"
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

function WorkflowColumn({
  title,
  tasks,
  tone,
}: {
  title: string;
  tasks: ScheduledJobCost["salesAgentTasks"];
  tone: "accent" | "muted";
}) {
  const titleClass = tone === "accent" ? "text-emerald-300" : "text-zinc-400";

  return (
    <div>
      <p className={`font-mono text-xs uppercase tracking-wider ${titleClass}`}>
        {title}
      </p>
      <div className="mt-2 space-y-2">
        {tasks.map((task) => (
          <div key={`${title}-${task.title}`} className="rounded-lg border border-zinc-800/70 bg-zinc-950/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-base font-medium text-zinc-200">{task.title}</p>
              <span className="shrink-0 rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-zinc-500">
                {task.owner}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">{task.description}</p>
          </div>
        ))}
      </div>
    </div>
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
      <p className="font-mono text-xs uppercase tracking-wider text-zinc-600">
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

function flowStatusTone(status: ReachFlowStatus) {
  if (status === "verified") return "accent";
  if (status === "partial") return "warm";
  if (status === "missing") return "danger";
  return "muted";
}
