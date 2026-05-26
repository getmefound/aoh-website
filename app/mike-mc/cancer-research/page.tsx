import type { Metadata } from "next";
import Link from "next/link";
import { CbcNav } from "./CbcNav";
import { CancerResearchWorkbench } from "./CancerResearchWorkbench";

export const metadata: Metadata = {
  title: "Cancer Research Notebook",
  description: "Private cancer research assistant workspace.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function CancerResearchPage() {
  return (
    <main className="cbc-page-bg min-h-screen overflow-x-hidden text-slate-900">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 md:px-8 md:py-10">
        <header className="cbc-glass mb-4 rounded-2xl border px-4 py-3 shadow-lg shadow-rose-100/40 backdrop-blur">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/mike-mc" className="text-xs font-black uppercase tracking-[0.14em] text-rose-600 transition hover:text-teal-700">
                Back
              </Link>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950">
                  CBC <span className="hidden text-base font-bold text-slate-500 sm:inline">Cancer Battle Companion</span>
                </h1>
              </div>
              <span className="hidden sm:inline-flex"><Badge>Local</Badge></span>
              <Badge tone="amber">Source-backed</Badge>
            </div>
            <CbcNav active="Home" compact />
          </div>
        </header>

        <CancerResearchWorkbench />
      </div>
    </main>
  );
}

function Badge({ children, tone = "teal" }: { children: React.ReactNode; tone?: "teal" | "rose" | "amber" }) {
  const classes = {
    teal: "border-teal-200 bg-teal-50 text-teal-800",
    rose: "border-rose-200 bg-rose-50 text-rose-800",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
  }[tone];

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${classes}`}>
      {children}
    </span>
  );
}
