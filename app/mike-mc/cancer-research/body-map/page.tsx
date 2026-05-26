import type { Metadata } from "next";
import Link from "next/link";
import { CbcNav } from "../CbcNav";
import { CbcBodyMap } from "./CbcBodyMap";

export const metadata: Metadata = {
  title: "CBC Body Map",
  description: "Interactive 3D visual map of cancer history and current findings.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function CbcBodyMapPage() {
  return (
    <main className="cbc-page-bg min-h-screen overflow-x-hidden text-slate-900">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 md:px-8 md:py-10">
        <header className="cbc-glass mb-8 rounded-3xl border p-6 shadow-xl shadow-cyan-100/50 backdrop-blur md:p-8">
          <Link href="/mike-mc/cancer-research" className="text-xs font-bold uppercase tracking-[0.18em] text-rose-500 transition hover:text-teal-700">
            Back to CBC
          </Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">3D Body Map</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            Visual Cancer Map
          </h1>
          <p className="mt-3 max-w-xs text-base leading-8 text-slate-600 sm:max-w-4xl">
            Choose a history item, then drag the body to rotate it and see where CBC is placing known findings.
          </p>
        </header>

        <CbcNav active="Body Map" />
        <CbcBodyMap />
      </div>
    </main>
  );
}
