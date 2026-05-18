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
            Leadership Team
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Internal company-style roster for the agent roles that run AOH work. Names and portraits are
            inspiration labels for internal use only, not affiliation, endorsement, or real identities.
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
      <header className="border-b border-white/10 p-5 text-center">
        <Portrait agent={agent} />
        <div className="mt-4 flex justify-center gap-2">
          <Pill tone={STATUS_TONE[agent.status]}>{agent.status}</Pill>
          <Pill tone="muted">{agent.agent}</Pill>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-50">{agent.displayName}</h2>
        <p className="mt-1 text-sm font-medium text-zinc-300">{agent.title}</p>
      </header>

      <div className="space-y-4 p-5">
        <p className="text-sm leading-relaxed text-zinc-300">{agent.responsibility}</p>

        <div className="rounded-xl border border-zinc-800/70 bg-black/25 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">How they think</p>
          <p className="mt-2 text-sm font-semibold text-zinc-100">{agent.archetype}</p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">{agent.archetypeNote}</p>
        </div>

        <TagBlock label="Responsible for" items={agent.owns} />
        <TagBlock label="Done means" items={agent.proof} muted />

        <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Current focus</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">{agent.currentFocus}</p>
        </div>
      </div>
    </article>
  );
}

function Portrait({ agent }: { agent: AgentTeamMember }) {
  const glow = {
    emerald: "bg-emerald-300/20 text-emerald-100",
    sky: "bg-sky-300/20 text-sky-100",
    amber: "bg-amber-300/20 text-amber-100",
    rose: "bg-rose-300/20 text-rose-100",
    violet: "bg-violet-300/20 text-violet-100",
    zinc: "bg-zinc-300/10 text-zinc-100",
  }[agent.color];

  return (
    <div className="mx-auto h-36 w-36 overflow-hidden rounded-full border border-white/10 bg-zinc-950 shadow-2xl shadow-black/40">
      <div className={`relative flex h-full w-full items-center justify-center ${glow}`}>
        <div className="absolute left-1/2 top-6 h-14 w-14 -translate-x-1/2 rounded-full bg-current opacity-80" />
        <div className="absolute bottom-0 left-1/2 h-20 w-28 -translate-x-1/2 rounded-t-full bg-current opacity-70" />
        <div className="absolute inset-x-8 top-8 h-4 rounded-full bg-zinc-950/60" />
        <div className="relative z-10 mt-10 font-mono text-3xl font-bold tracking-tight text-zinc-950/80">
          {initials(agent.displayName)}
        </div>
      </div>
    </div>
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
