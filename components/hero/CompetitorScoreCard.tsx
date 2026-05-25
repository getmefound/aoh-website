"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const scores = [
  { name: "Mike's HVAC", score: 23, color: "#E24B4A", isYou: true, delay: 0.4 },
  { name: "City Comfort HVAC", score: 81, color: "#2D6A4F", isYou: false, delay: 0.6 },
  { name: "Pro Air Solutions", score: 41, color: "#5A6072", isYou: false, delay: 0.8 },
];

export function CompetitorScoreCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="flex flex-col gap-3 w-full">
      {/* Main score card */}
      <div className="rounded-2xl border border-white/[0.10] bg-white/[0.04] p-5">
        <div className="mb-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-hero-subtext)]/60">
            AI Visibility Score
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-hero-subtext)]/50">
            Right now in your area
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {scores.map((s) => (
            <div key={s.name}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {s.isYou && (
                    <span className="shrink-0 rounded-full bg-[#E24B4A]/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#E24B4A]">
                      You
                    </span>
                  )}
                  <span className="truncate text-[13px] font-medium text-[var(--color-hero-text)]">
                    {s.name}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-sm font-bold" style={{ color: s.color }}>
                  {s.score}/100
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: s.color }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${s.score}%` } : { width: 0 }}
                  transition={{ duration: 0.8, delay: s.delay, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#E24B4A]/10 px-3 py-2.5">
          <span className="shrink-0 text-[#E24B4A]" aria-hidden="true">⚠</span>
          <p className="text-xs leading-relaxed text-[#E24B4A]">
            Google&apos;s AI is recommending Competitor A over you
          </p>
        </div>
      </div>

      {/* AI Search card */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4285F4]"
            style={{ boxShadow: "0 0 6px #4285F490" }}
          />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#4285F4]">
            Google AI Search · right now
          </span>
        </div>
        <p className="mb-3 text-[11px] text-[var(--color-hero-subtext)]/60">
          <span className="mr-1 opacity-40">›</span>
          best HVAC near Southington CT
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[var(--color-accent)]" aria-hidden="true">✓</span>
            <span className="text-xs text-[var(--color-hero-text)]">
              Recommending: City Comfort HVAC
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[#E24B4A]" aria-hidden="true">✗</span>
            <span className="text-xs text-[#E24B4A]">
              Mike&apos;s HVAC — not found
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
