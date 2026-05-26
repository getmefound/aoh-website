import type { ReactNode } from "react";
import { hasCbcSession } from "@/lib/cbc-auth";
import { unlockCbc } from "./actions";

export async function CbcGate({
  children,
  error,
  nextPath,
}: {
  children: ReactNode;
  error?: string;
  nextPath: string;
}) {
  if (await hasCbcSession()) return <>{children}</>;

  return (
    <main className="cbc-page-bg min-h-screen overflow-x-hidden px-4 py-8 text-slate-950 md:px-8">
      <section className="mx-auto grid min-h-[80vh] w-full max-w-5xl items-center">
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-cyan-100/60 md:grid md:grid-cols-[1fr_0.9fr]">
          <div className="cbc-hero p-6 text-white md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
              CBC private access
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Cancer Battle Companion
            </h1>
            <p className="mt-4 max-w-xl text-base font-semibold leading-8 text-cyan-50 md:text-lg">
              Protected workspace for organizing the case, reviewing reports, preparing oncology questions, and keeping the next steps clear.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Local records", "Doctor questions", "Body map"].map((item) => (
                <div key={item} className="cbc-hero-soft rounded-2xl border p-3 text-sm font-black">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-900">
              Enter PIN
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Open CBC
            </h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
              This page is intentionally blocked from casual visitors. Use the shared PIN to continue.
            </p>

            <form action={unlockCbc} className="mt-6 space-y-4">
              <input type="hidden" name="next" value={nextPath} />
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  Password
                </span>
                <input
                  name="pin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-xl border border-blue-200 bg-blue-50/40 px-4 py-3 text-xl font-black tracking-[0.2em] text-slate-950 outline-none transition focus:border-blue-700 focus:bg-white"
                />
              </label>
              {error && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-xl border border-blue-950 bg-blue-900 px-5 py-3 text-sm font-black text-white shadow-xl shadow-blue-200 transition hover:bg-blue-800"
              >
                Unlock CBC
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
