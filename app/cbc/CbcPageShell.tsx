import type { ReactNode } from "react";
import Link from "next/link";
import { CbcNav } from "@/app/mike-mc/cancer-research/CbcNav";
import { lockCbc } from "./actions";

export function CbcPageShell({
  active,
  children,
  subtitle,
  title,
}: {
  active: string;
  children: ReactNode;
  subtitle?: string;
  title?: string;
}) {
  return (
    <main className="cbc-page-bg min-h-screen overflow-x-hidden text-slate-900">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 md:px-8 md:py-10">
        <header className="cbc-glass mb-4 rounded-2xl border px-4 py-3 shadow-lg shadow-rose-100/40 backdrop-blur">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/cbc" className="text-xs font-black uppercase tracking-[0.14em] text-rose-600 transition hover:text-teal-700">
                Home
              </Link>
              <Link href="/cbc" className="text-2xl font-black tracking-tight text-slate-950">
                CBC <span className="hidden text-base font-bold text-slate-500 sm:inline">Cancer Battle Companion</span>
              </Link>
              <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-teal-800">
                Protected
              </span>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-amber-900">
                Source-backed
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CbcNav active={active} compact basePath="/cbc" />
              <form action={lockCbc}>
                <button className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-bold text-rose-800 transition hover:bg-rose-100">
                  Lock
                </button>
              </form>
            </div>
          </div>
        </header>

        {title && (
          <section className="cbc-glass mb-6 rounded-3xl border p-6 shadow-xl shadow-cyan-100/50 md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">{active}</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">{title}</h1>
            {subtitle && <p className="mt-3 max-w-4xl text-base leading-8 text-slate-600">{subtitle}</p>}
          </section>
        )}

        {children}
      </div>
    </main>
  );
}
