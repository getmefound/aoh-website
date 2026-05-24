import type { Metadata } from "next";
import Link from "next/link";
import { PageBody, PageSection, CtaBlock } from "@/components/PageBody";
import { Reveal } from "@/components/Reveal";
import { ProductDetail, type ProductDetailData } from "@/components/sections/ProductDetail";
import { BackToTopButton } from "@/components/BackToTopButton";
import { ICON_PATHS } from "@/lib/icon-paths";
import { MockReviewPanel } from "@/components/ui/MockReviewPanel";
import { MockAIVisibilityPanel } from "@/components/ui/MockAIVisibilityPanel";
import { MockRelayPanel } from "@/components/ui/MockRelayPanel";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Done-for-you Google visibility for local businesses. Get Found Refresh, Stay Found, Review Engine, and review replies in your voice.",
  alternates: { canonical: "/pricing" },
};

const breadcrumb = pageBreadcrumbs("Pricing", "/pricing");
const BOOKING_HREF = "/contact";

const products: ProductDetailData[] = [
  {
    slug: "get-found-refresh",
    number: "01",
    name: "Get Found Refresh",
    outcome: "Clean up the places Google checks before customers choose you.",
    story:
      "A fast one-time refresh for local businesses that need their Google-facing footprint to look current, accurate, and trustworthy. We tune the basics, find obvious visibility gaps, and hand you a plain-language next move.",
    stats: [
      { label: "Type", value: "One-time" },
      { label: "Typical turn", value: "72h" },
      { label: "Contract", value: "None" },
    ],
    whatYouGet: [
      "Google Business Profile basics reviewed",
      "Name, address, phone, website, category, hours, and services checked",
      "Review link and public trust signals checked",
      "Simple before/after notes",
      "One short action list for what to fix next",
      "No new dashboard for the client to learn",
    ],
    useThisIf: [
      "Your Google profile is stale, thin, or inconsistent.",
      "You want a low-cost first step before a monthly plan.",
      "You need a clear visibility baseline before asking for more reviews.",
    ],
    setupSteps: [
      { title: "Intake", sub: "We collect the business basics and current profile link." },
      { title: "Refresh", sub: "Profile, website, review path, and trust signals are reviewed." },
      { title: "Report", sub: "You get the before/after summary and next move." },
    ],
    cadence: "One-time refresh, usually completed within 72 hours after access and intake are ready.",
    crossSell: { label: "Stay Found - monthly upkeep", href: "#stay-found" },
    price: "$149",
    cadenceLabel: " one-time",
    setup: "No contract",
    promoNote: "Best first step for a business that wants to see the GMF process.",
    ctaLabel: "Start the refresh",
    ctaHref: "/contact",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.search,
    mock: <MockAIVisibilityPanel />,
  },
  {
    slug: "stay-found",
    number: "02",
    name: "Stay Found",
    outcome: "Keep your local visibility from going stale again.",
    story:
      "Google Search is getting more answer-driven. Stay Found keeps the profile, website signals, review path, and visibility notes moving monthly so the business does not disappear into old information.",
    stats: [
      { label: "Cadence", value: "Monthly" },
      { label: "Report", value: "Plain" },
      { label: "Access", value: "Light" },
    ],
    whatYouGet: [
      "Monthly Google profile and local visibility check",
      "Profile drift and missing-info watch",
      "Review path and reputation signal check",
      "Simple monthly recap",
      "Recommended next move for the owner",
      "Manager exception review if something breaks",
    ],
    useThisIf: [
      "You do not want your Google profile to decay after the first cleanup.",
      "You want a simple monthly visibility report without logging into a platform.",
      "You need an affordable maintenance plan before adding review automation.",
    ],
    setupSteps: [
      { title: "Baseline", sub: "We start from the Get Found Refresh or a fresh audit." },
      { title: "Monthly check", sub: "Profile, review path, and trust signals are checked." },
      { title: "Owner recap", sub: "You get the short update and any recommended fix." },
    ],
    cadence: "Monthly check and recap. Urgent profile issues escalate to Manager.",
    crossSell: { label: "Review Engine - generate more reviews", href: "#review-engine" },
    price: "$49",
    cadenceLabel: "/mo",
    setup: "No contract",
    promoNote: "Designed to be easy to keep, even for small local businesses.",
    ctaLabel: "Stay found monthly",
    ctaHref: "/contact",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.dashboard,
    mock: <MockAIVisibilityPanel />,
    variant: "dark",
  },
  {
    slug: "review-engine",
    number: "03",
    name: "Review Engine",
    outcome: "Ask happy customers for reviews at the right time.",
    story:
      "We help current and future customers get the review request after the job, visit, or purchase is complete. The first version is email-first, with manual upload or POS export before deeper integrations.",
    stats: [
      { label: "Channel", value: "Email" },
      { label: "Flow", value: "After job" },
      { label: "Report", value: "Monthly" },
    ],
    whatYouGet: [
      "Email review requests to current and future customers",
      "Manual upload or POS/export workflow planning",
      "Google review link and review-ready timing",
      "Suppression list for customers who should not be asked",
      "Monthly sent, clicked, and review proof recap",
      "Human-safe setup before any SMS expansion",
    ],
    useThisIf: [
      "You have happy customers but do not ask consistently.",
      "Your team forgets to send review requests after jobs.",
      "You want review growth without paying for a heavy CRM.",
    ],
    setupSteps: [
      { title: "Map the trigger", sub: "We define what counts as review-ready." },
      { title: "Connect the source", sub: "Manual upload first, POS export/API later if available." },
      { title: "Send and report", sub: "Requests go out and the monthly proof is saved." },
    ],
    cadence: "Requests send after the review-ready event, with monthly proof reporting.",
    crossSell: { label: "Review Voice - replies in the client's voice", href: "#review-voice" },
    price: "$149",
    cadenceLabel: "/mo",
    setup: "No contract",
    promoNote: "Start with email. SMS can be added later only after compliance is ready.",
    ctaLabel: "Start Review Engine",
    ctaHref: "/contact",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.star,
    mock: <MockReviewPanel />,
  },
  {
    slug: "review-voice",
    number: "04",
    name: "Review Voice",
    outcome: "Reply to reviews in the client's voice without handing the keys to autopilot.",
    story:
      "AI drafts thoughtful review replies using the client's tone, boundaries, and favorite language. It starts approval-first. Only safe, proven reply types become eligible for automation later.",
    stats: [
      { label: "Mode", value: "Draft" },
      { label: "Voice", value: "Trained" },
      { label: "Risk", value: "Guarded" },
    ],
    whatYouGet: [
      "Client voice profile",
      "AI review reply drafts",
      "Escalation rules for sensitive reviews",
      "Approval-first workflow",
      "Manager audit trail",
      "Safe auto-reply eligibility only after proof",
    ],
    useThisIf: [
      "Reviews are coming in but nobody has time to reply.",
      "The owner wants responses to sound like the business, not a template.",
      "You want AI help without risky auto-posting on day one.",
    ],
    setupSteps: [
      { title: "Train the voice", sub: "We capture tone, phrases, do-not-say rules, and escalation lines." },
      { title: "Draft replies", sub: "The agent drafts replies and flags anything sensitive." },
      { title: "Audit weekly", sub: "Manager and Auditor check quality before automation expands." },
    ],
    cadence: "Draft replies as reviews arrive. Sensitive reviews always hold for human review.",
    crossSell: { label: "Review Engine - feed the reply workflow", href: "#review-engine" },
    price: "+$49",
    cadenceLabel: "/mo",
    setup: "Add-on",
    promoNote: "Approval-first keeps the brand safe while the voice model learns.",
    ctaLabel: "Add Review Voice",
    ctaHref: "/contact",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.star,
    mock: <MockReviewPanel />,
    variant: "dark",
  },
  {
    slug: "call-protection",
    number: "05",
    name: "Call Protection",
    outcome: "Future add-on: answer important calls when the business cannot.",
    story:
      "Google is moving toward more agentic local actions, including calling businesses for details. GMF will add phone coverage later, after the profile and review engine are stable enough to justify it.",
    stats: [
      { label: "Status", value: "Future" },
      { label: "Pricing", value: "Custom" },
      { label: "Launch", value: "Later" },
    ],
    whatYouGet: [
      "Future AI or human-assisted call answer plan",
      "FAQ and escalation map",
      "Missed-call risk review",
      "Appointment or message handoff planning",
      "Only offered when the client is ready",
      "Contact us for pricing when this becomes active",
    ],
    useThisIf: [
      "The business misses valuable calls during jobs or after hours.",
      "The owner wants phone coverage but not another full-time hire.",
      "Google phone checks or customer calls become a real growth bottleneck.",
    ],
    setupSteps: [
      { title: "Hold", sub: "Not a core offer yet." },
      { title: "Map calls", sub: "When ready, we map FAQs, routing, booking, and escalation." },
      { title: "Pilot", sub: "We test before putting real customer calls at risk." },
    ],
    cadence: "Future add-on. No client phone automation without explicit approval.",
    price: "Contact",
    cadenceLabel: "",
    setup: "Future",
    promoNote: "Parked until the core GMF offer is producing proof.",
    ctaLabel: "Ask about call coverage",
    ctaHref: "/contact",
    secondaryCtaHref: BOOKING_HREF,
    iconPaths: ICON_PATHS.phone,
    mock: <MockRelayPanel />,
  },
];

const chips = products.map((product) => ({
  href: `#${product.slug}`,
  label: product.name,
}));

type JobKey = "get-found" | "stay-found" | "build-trust" | "future";

const jobBySlug: Record<string, JobKey> = {
  "get-found-refresh": "get-found",
  "stay-found": "stay-found",
  "review-engine": "build-trust",
  "review-voice": "build-trust",
  "call-protection": "future",
};

const jobGroupCopy: Record<JobKey, { index: string; label: string; intro: string }> = {
  "get-found": {
    index: "Job 1 of 4",
    label: "Get found.",
    intro:
      "Google Search is changing. We clean up the public footprint first so customers and search systems see the right business.",
  },
  "stay-found": {
    index: "Job 2 of 4",
    label: "Stay found.",
    intro:
      "Monthly upkeep keeps the profile, review path, and local trust signals from going stale.",
  },
  "build-trust": {
    index: "Job 3 of 4",
    label: "Build trust.",
    intro:
      "Fresh review requests and safe review replies help customers choose the business with more confidence.",
  },
  future: {
    index: "Job 4 of 4",
    label: "Protect calls later.",
    intro:
      "Phone coverage comes later, when the core visibility and review system is already producing proof.",
  },
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <section
        id="top"
        aria-label="Page header"
        className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]"
      >
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400 bg-gray-800 px-3 py-1 text-xs font-semibold text-white">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Launch pricing for local businesses
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Pricing
          </p>
          <h1 className="font-semibold leading-[1.05] tracking-tight text-4xl md:text-6xl">
            Google Search is changing. Staying visible should not be complicated.
          </h1>
          <p className="mt-5 max-w-2xl text-lg md:text-xl text-[var(--color-hero-subtext)] leading-relaxed">
            GMF helps local businesses get found, stay current, and turn happy customers into stronger review proof. Start small. Add only what is worth keeping.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/30 transition-colors"
            >
              Start with a refresh
              <span aria-hidden="true">-&gt;</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-green-400" />
              No long contract
            </span>
          </div>
        </div>
      </section>

      <PageBody>
        <PageSection className="!max-w-6xl !py-12 md:!py-16 !pb-10 md:!pb-12">
          <div className="mx-auto max-w-6xl">
            <Reveal delay={0.05}>
              <div className="mb-6 max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-body)] mb-3">
                  Start with the lowest-risk fix.
                </h2>
                <p className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed">
                  A local business does not need another complicated platform first. It needs the Google-facing basics right, a review path that runs, and a clear owner recap.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.07}>
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: "$149", label: "first refresh", border: "border-t-green-500", text: "text-green-500" },
                  { value: "$49/mo", label: "visibility upkeep", border: "border-t-amber-500", text: "text-amber-500" },
                  { value: "$149/mo", label: "review engine", border: "border-t-gray-900", text: "text-gray-900" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-2xl border border-[var(--color-border)] border-t-[3px] ${stat.border} bg-[var(--color-bg-elevated)] px-5 py-5 text-center`}
                  >
                    <p className={`font-mono text-xs uppercase tracking-[0.2em] mb-1 ${stat.text}`}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl bg-[var(--color-hero-bg)] p-8 md:p-10 ring-1 ring-[var(--color-hero-border)]">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-green-400 mb-3">
                  Step 1 - Start here
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-5">
                  Most owners start with Get Found Refresh.
                </h3>

                <div className="mb-6 flex flex-wrap gap-2">
                  {["$149 one-time", "72h typical turn", "no contract"].map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center rounded-full bg-transparent border border-green-400 px-3 py-1 text-xs font-semibold text-white"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <p className="text-base md:text-lg text-white/80 leading-relaxed mb-7 max-w-2xl">
                  We clean up the obvious visibility issues first. If the monthly plan or review engine makes sense after that, you will know why.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-500 text-white px-6 py-3.5 text-sm font-semibold transition-all hover:gap-3 hover:shadow-lg hover:shadow-green-600/30"
                  >
                    Start Get Found Refresh
                    <span aria-hidden="true">-&gt;</span>
                  </Link>
                  <Link
                    href="#get-found-refresh"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80 transition-colors"
                  >
                    See GMF services
                    <span aria-hidden="true">v</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </PageSection>

        <div className="sticky top-16 z-40 -mt-4 mb-0 bg-[var(--color-bg-page)]/95 backdrop-blur-md border-y border-[var(--color-border)] shadow-sm">
          <div className="mx-auto max-w-6xl px-6 py-3">
            <div className="flex items-center gap-2 overflow-x-auto scroll-smooth -mx-2 px-2">
              <span className="flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mr-2">
                Jump to
              </span>
              {chips.map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="flex-shrink-0 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-body)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30 transition-colors whitespace-nowrap"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {products.map((product, index) => {
          const nextProduct = products[index + 1];
          const next = nextProduct
            ? { label: nextProduct.name, href: `#${nextProduct.slug}` }
            : undefined;
          const sectionData: ProductDetailData = {
            ...product,
            variant: product.variant ?? (index % 2 === 1 ? "dark" : "light"),
          };

          const currentJob = jobBySlug[product.slug];
          const previousJob = index > 0 ? jobBySlug[products[index - 1].slug] : null;
          const isFirstInJob = currentJob && currentJob !== previousJob;
          const groupCopy = currentJob ? jobGroupCopy[currentJob] : null;

          return (
            <div key={product.slug}>
              {isFirstInJob && groupCopy ? (
                <section
                  id={`job-${currentJob}`}
                  className="bg-[var(--color-hero-bg)] text-white scroll-mt-32"
                >
                  <div className="mx-auto max-w-6xl px-6 py-12 md:py-16 text-center">
                    <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-accent)]">
                      {groupCopy.index}
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                      {groupCopy.label}
                    </h2>
                    <p className="text-base md:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
                      {groupCopy.intro}
                    </p>
                  </div>
                </section>
              ) : null}
              <ProductDetail data={sectionData} next={next} />
            </div>
          );
        })}

        <CtaBlock
          headline="Not sure where to start?"
          subline="Start with the Get Found Refresh. It gives the business a clear visibility baseline before you add monthly upkeep, review requests, or AI reply drafts."
        />
      </PageBody>
      <BackToTopButton />
    </>
  );
}
