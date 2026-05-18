import type { Metadata } from "next";
import Link from "next/link";
import { ControlShell, Pill } from "@/components/control/ControlPrimitives";
import { AGENT_TEAM, type AgentTeamMember } from "@/lib/control/team";

export const metadata: Metadata = {
  title: "AOH Agent Team - The Hub",
  description: "Internal AOH agent team bios and responsibilities.",
  robots: { index: false, follow: false },
};

const STATUS_TONE: Record<AgentTeamMember["status"], "accent" | "warm" | "muted" | "warn"> = {
  active: "accent",
  building: "warm",
  planned: "muted",
  review: "warn",
};

const COLOR_CLASS: Record<AgentTeamMember["color"], string> = {
  emerald: "from-emerald-500/25 via-emerald-400/10 to-zinc-950 border-emerald-500/25",
  sky: "from-sky-500/25 via-sky-400/10 to-zinc-950 border-sky-500/25",
  amber: "from-amber-500/25 via-amber-400/10 to-zinc-950 border-amber-500/25",
  rose: "from-rose-500/25 via-rose-400/10 to-zinc-950 border-rose-500/25",
  violet: "from-violet-500/25 via-violet-400/10 to-zinc-950 border-violet-500/25",
  zinc: "from-zinc-700/35 via-zinc-800/20 to-zinc-950 border-zinc-700/60",
};

export default function AgentTeamPage() {
  const active = AGENT_TEAM.filter((agent) => agent.status === "active").length;
  const gated = AGENT_TEAM.filter((agent) => agent.status === "review" || agent.status === "building").length;

  return (
    <ControlShell wide>
      <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800/60 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            AOH - Mission Control
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Agent Team
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Internal company-style roster for the agents that run AOH work. The famous-name references are
            inspiration only, not affiliation, endorsement, or real identities.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/mike-mc"
            className="rounded-md border border-zinc-700/70 bg-zinc-900/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            Back to Hub
          </Link>
          <Pill tone="accent">{active} active</Pill>
          <Pill tone="warn">{gated} gated</Pill>
          <Pill tone="muted">internal</Pill>
        </div>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Metric label="Team members" value={AGENT_TEAM.length.toString()} />
        <Metric label="Current P0" value="Reply Router" tone="warn" />
        <Metric label="Mike needed" value="Final approval" tone="muted" />
      </section>

      <section className="mb-8 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300">
              Today&apos;s command line
            </p>
            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-zinc-300">
              GHL Expert builds the campaign reply router, Auditor proves `send`, `book`, unclear, and opt-out
              paths, Sender waits for QA, and Manager keeps the gate closed until scaled sending is safe.
            </p>
          </div>
          <Pill tone="warn">scaled send blocked</Pill>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {AGENT_TEAM.map((agent) => (
          <AgentProfileCard key={agent.agent} agent={agent} />
        ))}
      </section>
    </ControlShell>
  );
}

function AgentProfileCard({ agent }: { agent: AgentTeamMember }) {
  return (
    <article className={`overflow-hidden rounded-2xl border bg-gradient-to-br ${COLOR_CLASS[agent.color]} shadow-2xl shadow-black/30`}>
      <header className="border-b border-white/10 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/35 font-mono text-xl font-bold text-zinc-50">
            {initials(agent.agent)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Pill tone={STATUS_TONE[agent.status]}>{agent.status}</Pill>
              <Pill tone="muted">{agent.codename}</Pill>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-50">{agent.agent}</h2>
            <p className="mt-1 text-sm text-zinc-400">{agent.title}</p>
          </div>
        </div>
      </header>

      <div className="space-y-4 p-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Responsibility</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">{agent.responsibility}</p>
        </div>

        <div className="rounded-xl border border-zinc-800/70 bg-black/25 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Archetype</p>
          <p className="mt-2 text-sm font-semibold text-zinc-100">{agent.archetype}</p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">{agent.archetypeNote}</p>
        </div>

        <TagBlock label="Owns" items={agent.owns} />
        <TagBlock label="Done means" items={agent.proof} muted />

        <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Current focus</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">{agent.currentFocus}</p>
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value, tone = "accent" }: { label: string; value: string; tone?: "accent" | "warn" | "muted" }) {
  const color = tone === "accent" ? "text-emerald-300" : tone === "warn" ? "text-amber-300" : "text-zinc-300";
  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/60 to-zinc-950 p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-1 font-mono text-3xl font-bold leading-none ${color}`}>{value}</p>
    </div>
  );
}

function TagBlock({ label, items, muted = false }: { label: string; items: string[]; muted?: boolean }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-md border px-2 py-1 text-xs ${
              muted
                ? "border-zinc-800 bg-zinc-950/60 text-zinc-500"
                : "border-zinc-700/70 bg-zinc-900/70 text-zinc-300"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
