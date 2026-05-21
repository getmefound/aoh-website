"use client";

import { useMemo, useState } from "react";
import type { MorningBriefData, GhlEmailStat } from "@/lib/control/morning-brief";

type Totals = {
  sent: number;
  delivered: number;
  deliveredPct: number;
  opened: number;
  openedPct: number;
  replied: number;
  bounced: number;
  bouncePct: number;
  unsubscribed: number;
};

type ViewKey = "owner" | "sell" | "custom" | "pricing";

const commercialIncludes = [
  "Daily owner read",
  "Reach campaign results",
  "Leads, replies, bounces, unsubscribes",
  "One market signal",
  "Needs-owner list",
  "Running archive",
];

const customIncludes = [
  "Email inbox triage",
  "Calendar and booking checks",
  "GHL or CRM pipeline detail",
  "Google Business Profile checks",
  "Call tracking or missed calls",
  "Ads, payments, or custom systems",
];

const marketPositioning = [
  {
    title: "What most reporting tools sell",
    body: "Dashboards, scheduled reports, client portals, white-label branding, and AI summaries.",
  },
  {
    title: "What we should sell",
    body: "The owner does not need another dashboard. They need a short daily decision brief plus a live page if they want to look back.",
  },
  {
    title: "How to say it",
    body: "Every morning, you know what happened, what needs attention, and where money may be leaking.",
  },
];

const pricingAnchors = [
  {
    vendor: "AgencyAnalytics",
    price: "$20/client/mo",
    detail: "Automated reports, AI insights, white-label branding, and client portal. Billed annually.",
    source: "https://agencyanalytics.com/pricing",
  },
  {
    vendor: "DashThis",
    price: "$44-$54/mo",
    detail: "Starter dashboard plan with 3 dashboards and 15 sources.",
    source: "https://dashthis.com/pricing",
  },
  {
    vendor: "Databox",
    price: "$159/mo",
    detail: "Pro reporting plan for dashboards, reports, goals, shared updates, and team visibility.",
    source: "https://databox.com/pricing",
  },
  {
    vendor: "Whatagraph",
    price: "199 euros/mo",
    detail: "Start plan billed annually, with automated emails, reports, AI summaries, and data credits.",
    source: "https://whatagraph.com/pricing",
  },
];

const packaging = [
  {
    tier: "Commercial Brief",
    price: "$149-$299/mo",
    setup: "$0-$500 setup",
    body: "Daily owner read, Reach results, market signal, archive, and one recommended move.",
  },
  {
    tier: "Mike's Custom Layer",
    price: "$399-$1,500+/mo",
    setup: "$750-$3,000 setup",
    body: "Private systems connected: email, calendar, GHL/CRM, GBP, calls, ads, payments, or custom agent jobs.",
  },
];

const retention = [
  ["Daily briefs", "13 months", "Useful for seasonal comparisons and owner lookback."],
  ["Raw proof", "90 days", "Enough to debug without cluttering the owner page."],
  ["Monthly rollups", "24 months", "Best for renewals and showing long-term value."],
];

export function MorningBriefExperience({
  brief,
  totals,
}: {
  brief: MorningBriefData;
  totals: Totals;
}) {
  const [view, setView] = useState<ViewKey>("owner");
  const [proofOpen, setProofOpen] = useState(false);
  const primarySignal = brief.marketSignals[0] ?? "Scout brings one useful market signal each morning.";

  const selectedContent = useMemo(() => {
    if (view === "sell") return <SellView />;
    if (view === "custom") return <CustomView />;
    if (view === "pricing") return <PricingView />;
    return <OwnerView brief={brief} totals={totals} />;
  }, [view, brief, totals]);

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <a href="/mike-mc" className="nav-chip">
                  Mission Control
                </a>
                <a href="/mike-mc/jobs" className="nav-chip">
                  Jobs
                </a>
                <span className="status-chip">Live owner page</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                AOH Owner Brief
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                Mike&apos;s Morning Brief
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                The commercial version is simple: what happened, what needs attention, and the next move. The custom layer is where we connect private systems.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <HeroMetric label="GHL sent" value={totals.sent.toString()} />
              <HeroMetric label="Delivered" value={`${totals.deliveredPct}%`} tone="green" />
              <HeroMetric label="Opened" value={`${totals.openedPct}%`} tone="amber" />
            </div>
          </div>

          <BriefGraphic brief={brief} totals={totals} />
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#eef6f2]">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
          <div className="grid gap-3 lg:grid-cols-[220px_1fr] lg:items-center">
            <p className="text-sm font-semibold text-emerald-900">Today&apos;s market signal</p>
            <p className="text-sm leading-6 text-slate-700">{primarySignal}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Client-room view
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              What they get vs. what is custom
            </h2>
          </div>
          <div className="inline-grid grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm md:grid-cols-4">
            <TabButton active={view === "owner"} onClick={() => setView("owner")} label="My Brief" />
            <TabButton active={view === "sell"} onClick={() => setView("sell")} label="Sell It" />
            <TabButton active={view === "custom"} onClick={() => setView("custom")} label="Custom" />
            <TabButton active={view === "pricing"} onClick={() => setView("pricing")} label="Pricing" />
          </div>
        </div>

        {selectedContent}
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="mb-6 grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Running page
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                Archive and retention
              </h2>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Keep the owner page useful, not endless. Show daily history for 13 months, store raw proof for 90 days, and keep monthly rollups for 24 months.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {retention.map(([label, value, note]) => (
              <article key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{note}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {brief.archive.slice(0, 6).map((item) => (
              <article key={item.file} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-950">{item.date}</h3>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                    archived
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <button
          type="button"
          onClick={() => setProofOpen((value) => !value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
        >
          {proofOpen ? "Hide proof files" : "Show proof files"}
        </button>
        {proofOpen ? (
          <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {[brief.currentFile, brief.statsFile, ...brief.proofUsed].filter(Boolean).map((item) => (
              <code key={item} className="truncate rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                {item}
              </code>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

function OwnerView({ brief, totals }: { brief: MorningBriefData; totals: Totals }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="status-chip">Commercial included</span>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {brief.date}
          </span>
        </div>
        <h3 className="text-2xl font-semibold text-slate-950">Today&apos;s brief</h3>
        <div className="mt-4 space-y-3">
          {brief.commercialBrief.map((item) => (
            <BriefLine key={item} text={item} />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-2xl font-semibold text-slate-950">Needs Mike</h3>
        <div className="mt-4 space-y-3">
          {brief.needsMike.length ? (
            brief.needsMike.map((item) => <BriefLine key={item} text={item} tone="amber" />)
          ) : (
            <p className="text-sm text-slate-600">No owner action listed.</p>
          )}
        </div>
        <div className="mt-5 border-t border-slate-200 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Recommended move
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{brief.recommendedMove}</p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <SmallMetric label="Replies" value={totals.replied.toString()} />
          <SmallMetric label="Bounces" value={totals.bounced.toString()} />
          <SmallMetric label="Unsubs" value={totals.unsubscribed.toString()} />
        </div>
      </section>
    </div>
  );
}

function SellView() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {marketPositioning.map((item, index) => (
        <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-emerald-700">0{index + 1}</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
        </article>
      ))}
      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 lg:col-span-3">
        <h3 className="text-2xl font-semibold text-emerald-950">Recommended positioning</h3>
        <p className="mt-3 max-w-4xl text-base leading-7 text-emerald-900">
          Sell the page as an owner decision brief, not analytics software. The standard package gives a daily push plus this running page. Custom integrations are sold separately when the business wants agents inside private systems.
        </p>
      </section>
    </div>
  );
}

function CustomView() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="status-chip">Standard / Commercial</span>
        </div>
        <h3 className="text-2xl font-semibold text-slate-950">Included for most clients</h3>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {commercialIncludes.map((item) => (
            <FeaturePill key={item} label={item} />
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="custom-chip">Mike&apos;s Custom</span>
          <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
            paid layer
          </span>
        </div>
        <h3 className="text-2xl font-semibold text-slate-950">Custom when private systems connect</h3>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {customIncludes.map((item) => (
            <FeaturePill key={item} label={item} custom />
          ))}
        </div>
      </section>
    </div>
  );
}

function PricingView() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {packaging.map((item) => (
          <article key={item.tier} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className={item.tier.includes("Custom") ? "custom-chip" : "status-chip"}>{item.tier}</span>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {item.setup}
              </span>
            </div>
            <p className="text-4xl font-semibold tracking-tight text-slate-950">{item.price}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-4">
        {pricingAnchors.map((item) => (
          <a
            key={item.vendor}
            href={item.source}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300"
          >
            <p className="font-semibold text-slate-950">{item.vendor}</p>
            <p className="mt-2 font-mono text-sm font-semibold text-emerald-700">{item.price}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

function BriefGraphic({ brief, totals }: { brief: MorningBriefData; totals: Totals }) {
  return (
    <div className="relative">
      <div className="absolute -right-4 top-6 hidden h-52 w-24 rounded-lg bg-amber-100 md:block" />
      <div className="relative rounded-lg border border-slate-200 bg-[#fbfaf6] p-5 shadow-2xl shadow-slate-200">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Owner page</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">{brief.date}</p>
          </div>
          <span className="status-chip">Client-ready</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <SmallMetric label="Sent" value={totals.sent.toString()} />
          <SmallMetric label="Deliver" value={`${totals.deliveredPct}%`} />
          <SmallMetric label="Open" value={`${totals.openedPct}%`} />
        </div>

        <div className="mt-5 space-y-3">
          {brief.stats.map((stat) => (
            <div key={stat.lane} className="grid grid-cols-[96px_1fr_54px] items-center gap-3">
              <p className="text-sm font-semibold text-slate-700">{laneLabel(stat.lane)}</p>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, stat.openedPct)}%` }} />
              </div>
              <p className="text-right font-mono text-sm text-slate-600">{stat.openedPct}%</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-emerald-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Next move
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{brief.recommendedMove}</p>
        </div>
      </div>
    </div>
  );
}

function HeroMetric({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "green" | "amber" }) {
  const color = tone === "green" ? "text-emerald-700" : tone === "amber" ? "text-amber-700" : "text-slate-950";
  return (
    <div className="rounded-lg border border-slate-200 bg-[#fbfaf6] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function BriefLine({ text, tone = "green" }: { text: string; tone?: "green" | "amber" }) {
  const dot = tone === "amber" ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="flex gap-3">
      <span className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${dot}`} />
      <p className="text-base leading-7 text-slate-700">{text}</p>
    </div>
  );
}

function FeaturePill({ label, custom }: { label: string; custom?: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm font-medium ${custom ? "border-amber-200 bg-white text-amber-950" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
      {custom ? "Custom: " : ""}
      {label}
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
        active ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      {label}
    </button>
  );
}

function laneLabel(lane: string) {
  if (lane === "ai") return "AI";
  return lane.charAt(0).toUpperCase() + lane.slice(1);
}
