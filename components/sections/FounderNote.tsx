import Link from "next/link";

export function FounderNote() {
  return (
    <section
      aria-label="Why I built this"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-10 md:py-12"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr] md:items-start">
          {/* Photo */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-[var(--color-border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/team/mike.jpg"
                alt="Mike Egidio, founder of GetMeFound"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm font-bold text-[var(--color-text-body)]">Mike Egidio</p>
              <p className="text-xs text-[var(--color-text-muted)]">Founder, GetMeFound</p>
            </div>
          </div>

          {/* Note */}
          <div>
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Why I built this
            </p>
            <blockquote className="text-base leading-relaxed text-[var(--color-text-muted)] md:text-lg">
              &ldquo;I&apos;ve built and sold companies. Every single time, I watched good local
              businesses lose customers to competitors who just looked more credible online — not
              because they were better, but because their Google profile was cleaner and their
              reviews were newer. Google&apos;s AI makes that gap worse and faster.
              I built GetMeFound to close it — done for you, no contracts, no dashboards.&rdquo;
            </blockquote>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap gap-3">
                {[
                  { stat: "15+ yrs", label: "building businesses" },
                  { stat: "1 sold", label: "EdTech company" },
                ].map(({ stat, label }) => (
                  <div
                    key={stat}
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] px-4 py-2 text-center"
                  >
                    <p className="text-sm font-bold text-[var(--color-text-body)]">{stat}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{label}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="text-sm font-semibold text-[var(--color-accent)] hover:underline underline-offset-4 transition-colors"
              >
                Full story →
              </Link>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-[var(--color-text-muted)]/70">
              Everything we do is based on{" "}
              <a
                href="https://support.google.com/business/answer/7091"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                Google&apos;s own published guidance
              </a>{" "}
              for local business visibility — not guesswork. We only touch what Google says matters.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
