import type { Metadata } from "next";
import Link from "next/link";
import { CancerResearchWorkbench } from "../CancerResearchWorkbench";
import { CbcNav } from "../CbcNav";

export const metadata: Metadata = {
  title: "CBC Doctor Questions",
  description: "Dynamic oncologist questions, likely responses, and follow-ups.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function CbcDoctorQuestionsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#bae6fd_0,#ecfeff_24rem,transparent_42rem),linear-gradient(135deg,#fff7ed_0%,#ecfeff_48%,#fdf2f8_100%)] text-slate-900">
      <div className="mx-auto w-full max-w-[92rem] px-4 py-6 md:px-8 md:py-10">
        <PageHeader eyebrow="Doctor Visit Mode" title="Questions And Follow-Ups" copy="CBC builds questions from the current case, then adds likely oncologist responses and the follow-up questions to ask next." />
        <CbcNav active="Doctor Questions" />
        <CancerResearchWorkbench view="doctor" />
      </div>
    </main>
  );
}

function PageHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <header className="mb-8 rounded-[1.5rem] border border-white/70 bg-white/82 p-6 shadow-xl shadow-cyan-100/50 backdrop-blur md:p-8">
      <Link href="/mike-mc/cancer-research" className="text-xs font-bold uppercase tracking-[0.18em] text-rose-500 transition hover:text-teal-700">
        Back to CBC
      </Link>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">{title}</h1>
      <p className="mt-3 max-w-4xl text-base leading-8 text-slate-600">{copy}</p>
    </header>
  );
}
