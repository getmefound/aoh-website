import type { Metadata } from "next";
import Link from "next/link";
import { CancerResearchWorkbench } from "../CancerResearchWorkbench";
import { CbcNav } from "../CbcNav";

export const metadata: Metadata = {
  title: "CBC Case Builder",
  description: "Enter known diagnosis, staging, treatment, and biomarker details for CBC.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function CbcCasePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fde68a_0,#fff7ed_24rem,transparent_42rem),linear-gradient(135deg,#ecfeff_0%,#fff7ed_46%,#fdf2f8_100%)] text-slate-900">
      <div className="mx-auto w-full max-w-[92rem] px-4 py-6 md:px-8 md:py-10">
        <PageHeader eyebrow="Case Builder" title="Tell CBC What We Know" copy="One focused place to enter the diagnosis, history, staging, treatments, and trial location." />
        <CbcNav active="Case" />
        <CancerResearchWorkbench view="case" />
      </div>
    </main>
  );
}

function PageHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <header className="mb-8 rounded-[1.5rem] border border-white/70 bg-white/82 p-6 shadow-xl shadow-rose-100/50 backdrop-blur md:p-8">
      <Link href="/mike-mc/cancer-research" className="text-xs font-bold uppercase tracking-[0.18em] text-rose-500 transition hover:text-teal-700">
        Back to CBC
      </Link>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">{title}</h1>
      <p className="mt-3 max-w-4xl text-base leading-8 text-slate-600">{copy}</p>
    </header>
  );
}
