"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GetFoundCloseBlock } from "@/components/sections/GetFoundCloseBlock";

export function FinalCta() {
  return (
    <section
      aria-label="Final call to action"
      className="bg-(--color-bg-page) py-12 text-text-body md:py-16"
    >
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mb-10 text-center">
            <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-text-muted">
              One decision
            </p>
            <h2 className="text-[clamp(2.2rem,6.5vw,3.8rem)] font-bold leading-[1.05] tracking-tight text-text-body">
              One business gets recommended in your area.
              <br />
              <span className="text-accent">Make sure it&apos;s yours.</span>
            </h2>
            <p className="mt-6 text-sm text-text-muted">
              Based on{" "}
              <a
                href="https://support.google.com/business/answer/7091"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-text-body"
              >
                Google&apos;s own published guidance
              </a>{" "}
              for local business visibility — not guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_380px] md:items-start">
            {/* Left: primary CTA + free check */}
            <div className="flex flex-col gap-4">
              <GetFoundCloseBlock variant="light" showCta={true} />
              <p className="text-center text-sm text-text-muted">
                Not ready to buy?{" "}
                <Link href="/#free-audit" className="font-semibold text-accent hover:underline underline-offset-2 transition-colors">
                  Get your free visibility check first →
                </Link>
              </p>
            </div>

            {/* Right: trust stack */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
                <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  Your access stays safe
                </p>
                <ul className="space-y-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  <li>→ We never touch your email or email hosting</li>
                  <li>→ Google access is manager-only — you stay owner</li>
                  <li>→ Nothing posts without your approval</li>
                  <li>→ You can remove our access any time</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
                <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  New company. Honest about it.
                </p>
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                  We&apos;re new. That&apos;s exactly why there&apos;s no contract, no lock-in, and we show you exactly what we&apos;d fix before you pay anything.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
