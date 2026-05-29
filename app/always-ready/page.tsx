import type { Metadata } from "next";
import Link from "next/link";
import { LogoOnlyNav } from "@/components/LogoOnlyNav";
import { AlwaysReadyWaitlist } from "@/components/sections/AlwaysReadyWaitlist";

export const metadata: Metadata = {
  title: "Always Ready — Early Access | GetMeFound",
  description:
    "An AI agent answers your calls 24/7, gives real prices and hours, and books the appointment. Join the early-access list.",
  alternates: { canonical: "/always-ready" },
};

const WHAT_YOU_GET = [
  "AI agent answers calls 24/7 with your real services, pricing, and hours",
  "Handles booking requests and routes complex calls to you",
  "Everything in Stay Found — reviews, signals, monthly report",
  "Full Google profile content management and local content planning",
  "Monthly 30-minute strategy call",
  "Monthly AI answer visibility check across Google, ChatGPT, Claude, Gemini",
];

export default function AlwaysReadyPage() {
  return (
    <div className="min-h-screen bg-(--color-hero-bg) text-hero-text">
      <LogoOnlyNav />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-400/15 px-4 py-1.5 ring-1 ring-sky-400/30">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-sky-300">
            Early Access
          </span>
        </div>

        <h1 className="text-[clamp(2.4rem,7vw,4rem)] font-bold leading-[1.05] tracking-tight">
          Never miss another customer —{" "}
          <span className="text-sky-300">human or AI.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-hero-subtext/80 md:text-xl max-w-xl mx-auto">
          An AI agent answers your calls 24/7, gives real prices and hours, and books the appointment.
          Google is getting ready to call businesses on customers&apos; behalf — we get yours ready to answer.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="text-4xl font-bold text-sky-300">$299<span className="text-2xl text-hero-subtext/50">/mo</span></div>
          <div className="text-hero-subtext/50 text-xs text-left">
            indicative pricing<br />
            <span className="text-hero-subtext/35">no buy button yet</span>
          </div>
        </div>

        <div className="mt-10 max-w-sm mx-auto">
          <AlwaysReadyWaitlist source="always-ready-page" variant="card" />
        </div>

        <p className="mt-4 text-xs text-hero-subtext/40">
          Approval-gated — nothing goes live without your sign-off.
        </p>
      </section>

      {/* What you get */}
      <section className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-accent">
            What&apos;s included every month
          </h2>
          <ul className="space-y-3">
            {WHAT_YOU_GET.map((item) => (
              <li key={item} className="flex gap-3 text-base text-hero-subtext/90 leading-relaxed">
                <span className="text-sky-300 flex-shrink-0 mt-0.5 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Google citation */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <blockquote className="rounded-2xl border border-sky-300/20 bg-sky-300/8 p-5 text-sm leading-7 text-white/80">
            <a
              href="https://blog.google/products-and-platforms/products/search/deep-search-business-calling-google-search/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sky-200 underline decoration-sky-200/40 underline-offset-4 hover:text-white transition-colors"
            >
              Google says Search can &ldquo;call businesses to get pricing and availability information on your behalf.&rdquo;
            </a>
            <p className="mt-3 text-white/55 text-xs">
              We&apos;re not getting ahead of Google — we&apos;re getting you ready. Nothing goes live without your explicit sign-off.
            </p>
          </blockquote>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/10 bg-(--color-hero-bg) py-14">
        <div className="mx-auto max-w-sm px-6 text-center">
          <p className="mb-6 text-sm text-hero-subtext/60 leading-relaxed">
            Not ready for Always Ready yet? Start with Get Found to fix your AI-visibility basics first.
          </p>
          <Link
            href="/checkout/get-found-refresh"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-bold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)]"
          >
            Start with Get Found — $149
          </Link>
          <Link
            href="/pricing"
            className="mt-4 block text-sm text-hero-subtext/40 hover:text-hero-text transition-colors"
          >
            ← Compare all plans
          </Link>
        </div>
      </section>
    </div>
  );
}
