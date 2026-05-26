"use client";

import Link from "next/link";

const STEPS = [
  {
    number: "01",
    title: "You hand us the keys",
    body: "Share access to your Google Business listing and your website backend. Takes 5 minutes — we walk you through it. You also send us your past customer list so we can kick off your first review campaign — we check your email setup first so nothing gets touched that shouldn't be.",
  },
  {
    number: "02",
    title: "We fix everything",
    body: "Our team corrects your Google listing — hours, services, photos, service area, business description. We update your website to match exactly. We submit your business to the top directories so your information is consistent everywhere Google and AI cross-check — your first review request emails go out to your customer list automatically.",
  },
  {
    number: "03",
    title: "You see exactly what changed",
    body: "Within 48 hours you get a before/after report showing your likelihood of being found — before we started and after. You'll see how you compare to local competitors and what's still worth improving over time — most clients see their likelihood jump from under 20% to over 70%.",
  },
] as const;

const PILLS = ["No contract", "No tech skills needed", "We handle everything"] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="hiw-title"
      className="scroll-mt-20 border-y border-white/10 bg-(--color-hero-bg) py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_3fr] md:items-start md:gap-16">

          {/* Left column */}
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-hero-subtext/60">
              Get Found · $149
            </p>
            <h2
              id="hiw-title"
              className="mt-3 text-3xl font-bold leading-tight text-hero-text md:text-4xl"
            >
              Done for you.<br />Done in 48 hours.
            </h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-hero-subtext">
              You give us access. We fix everything Google and AI look at. You get a before/after report showing exactly what changed.
            </p>

            {/* Pills — reuse hero pill pattern */}
            <div className="mt-5 flex flex-wrap gap-2">
              {PILLS.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-hero-subtext"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-3 w-3 shrink-0 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {pill}
                </span>
              ))}
            </div>

            {/* CTA — matches hero button style */}
            <Link
              href="/checkout/get-found-refresh"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-(--color-accent-text) transition hover:-translate-y-0.5 hover:bg-(--color-accent-hover) hover:shadow-lg hover:shadow-(--color-accent)/25"
            >
              Get Found for $149
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Right column — vertical timeline */}
          <div className="relative">
            {/* Timeline connector line */}
            <div
              aria-hidden="true"
              className="absolute left-4.75 top-10 h-[calc(100%-2.5rem)] w-0.5"
              style={{ background: "rgba(255,255,255,0.10)" }}
            />

            <div className="space-y-5">
              {STEPS.map((step) => (
                <div key={step.number} className="relative flex gap-5">

                  {/* Step number circle — matches carousel accent color */}
                  <div
                    className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold"
                    style={{
                      background: "rgba(63,174,126,0.12)",
                      border: "1px solid rgba(63,174,126,0.30)",
                      color: "#3fae7e",
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Step content panel — matches carousel inner panel */}
                  <div
                    className="min-w-0 flex-1 rounded-xl px-5 py-4"
                    style={{ background: "#1b2636", border: "1px solid #2a3647" }}
                  >
                    <p
                      className="text-base font-bold leading-snug"
                      style={{ color: "#f0f6ff" }}
                    >
                      {step.title}
                    </p>
                    <p
                      className="mt-2 text-sm leading-relaxed"
                      style={{ color: "#8099b8" }}
                    >
                      {step.body}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
