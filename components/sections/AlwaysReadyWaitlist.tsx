"use client";

import { useRef, useState } from "react";
import { validateEmail } from "@/lib/email-validation";

interface AlwaysReadyWaitlistProps {
  source?: string;
  variant?: "dark" | "card";
}

export function AlwaysReadyWaitlist({
  source = "always-ready-waitlist",
  variant = "card",
}: AlwaysReadyWaitlistProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const honeypot = honeypotRef.current?.value ?? "";
    if (honeypot.trim()) { setDone(true); return; }

    if (name.trim().length < 2) { setError("Add your name."); return; }
    const v = validateEmail(email);
    if (!v.ok) { setError(v.error); return; }

    setPending(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          businessName: business.trim(),
          source,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok && !data.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div
        className={`rounded-2xl border p-6 text-center ${
          variant === "card"
            ? "border-sky-300/30 bg-sky-300/10"
            : "border-white/10 bg-white/[0.04]"
        }`}
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-bold text-white">You&apos;re on the early-access list.</p>
        <p className="mt-1 text-xs text-white/60">
          We&apos;ll reach out as spots open.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border p-6 space-y-3 ${
        variant === "card"
          ? "border-sky-300/30 bg-sky-300/5"
          : "border-white/10 bg-white/[0.03]"
      }`}
      noValidate
    >
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300">
        Join early access
      </p>

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <input
        type="text"
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-sky-300/50 focus:outline-none focus:ring-2 focus:ring-sky-300/20"
      />
      <input
        type="email"
        required
        inputMode="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-sky-300/50 focus:outline-none focus:ring-2 focus:ring-sky-300/20"
      />
      <input
        type="text"
        placeholder="Business name (optional)"
        value={business}
        onChange={(e) => setBusiness(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-sky-300/50 focus:outline-none focus:ring-2 focus:ring-sky-300/20"
      />

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Saving…" : "Join Early Access →"}
      </button>

      {error && <p role="alert" className="text-xs text-red-400">{error}</p>}

      <p className="text-[10px] text-white/35 text-center">
        No spam. Approval-gated — nothing goes live without your sign-off.
      </p>
    </form>
  );
}
