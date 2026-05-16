import type { Metadata } from "next";
import { RevenueCalculator } from "@/components/RevenueCalculator";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Lost-Revenue Calculator",
  description:
    "See exactly how much revenue your current reviews, ranking, and AI search visibility are costing you every month. No card. Takes 30 seconds.",
  alternates: { canonical: "/calculator" },
};

const breadcrumb = pageBreadcrumbs("Calculator", "/calculator");

export default function CalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col focus:outline-none"
      >
        <section className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)]">
          <div className="mx-auto max-w-3xl px-6 py-12 md:py-16 text-center">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Lost-Revenue Calculator
            </p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              See what you&apos;re losing every month.
            </h1>
            <p className="text-base md:text-lg text-[var(--color-hero-subtext)] leading-relaxed max-w-xl mx-auto">
              <span className="font-bold text-white">80% of your future customers find you by searching.</span> If your reviews, ranking, or AI visibility are weak — they pick a competitor. Run the math in 30 seconds.
            </p>
          </div>
        </section>

        <RevenueCalculator />
      </main>
    </>
  );
}
