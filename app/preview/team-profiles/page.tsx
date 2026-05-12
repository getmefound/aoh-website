"use client";

import { useState } from "react";
import { TEAM, type Surface } from "@/lib/team-pack";

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
    >
      {copied ? "✓ Copied" : label ?? "Copy"}
    </button>
  );
}

function CopyableBlock({
  title,
  text,
  charLimit,
}: {
  title: string;
  text: string;
  charLimit?: number;
}) {
  const len = text.length;
  const over = charLimit ? len > charLimit : false;
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70">
          {title}
        </div>
        <div className="flex items-center gap-2">
          {charLimit && (
            <span
              className={`text-[11px] font-mono ${
                over ? "text-red-300" : "text-white/40"
              }`}
            >
              {len}/{charLimit}
            </span>
          )}
          <CopyButton text={text} />
        </div>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/85 max-w-prose">
        {text}
      </pre>
    </div>
  );
}

function SurfaceCard({ surface, open }: { surface: Surface; open: boolean }) {
  const bannerUrl =
    surface.photoSlug && surface.bannerWidth
      ? `/api/team-banner/${surface.photoSlug}`
      : null;
  const isPerson = surface.type === "person";

  return (
    <details
      open={open}
      className={`mb-6 rounded-2xl border ${
        isPerson
          ? "border-emerald-400/30 bg-emerald-400/[0.04]"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <summary className="cursor-pointer p-5 list-none flex items-center justify-between gap-4 flex-wrap hover:bg-white/[0.02]">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] ${
              isPerson
                ? "border border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                : "border border-white/20 bg-white/5 text-white/70"
            }`}
          >
            {isPerson ? "Person" : "Company"}
          </span>
          <h2 className="text-lg md:text-xl font-bold tracking-tight truncate">
            {surface.label}
          </h2>
          {surface.bannerWidth && surface.bannerHeight && (
            <span className="text-xs font-mono text-white/40 shrink-0">
              {surface.bannerWidth}×{surface.bannerHeight}
            </span>
          )}
        </div>
        <span className="text-xs font-bold text-emerald-300">Tap to expand ▾</span>
      </summary>

      <div className="px-5 pb-5 space-y-4">
        {/* Banner image preview */}
        {bannerUrl && (
          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30">
            <div className="bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/60 flex items-center justify-between">
              <span>Banner — right-click to save</span>
              <div className="flex items-center gap-2">
                <CopyButton text={`https://aioutsourcehub.com${bannerUrl}`} label="Copy URL" />
                <a
                  href={bannerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-300 hover:text-emerald-200"
                >
                  Open →
                </a>
              </div>
            </div>
            <img
              src={bannerUrl}
              alt={`${surface.label} banner`}
              className="w-full block"
            />
          </div>
        )}

        {/* Profile copy */}
        {surface.profile.headlineOrTagline && (
          <CopyableBlock
            title={surface.profile.headlineOrTagline.label}
            text={surface.profile.headlineOrTagline.text}
            charLimit={surface.profile.headlineOrTagline.charLimit}
          />
        )}
        {surface.profile.bio && (
          <CopyableBlock
            title={surface.profile.bio.label}
            text={surface.profile.bio.text}
            charLimit={surface.profile.bio.charLimit}
          />
        )}
        {surface.profile.about && (
          <CopyableBlock
            title={surface.profile.about.label}
            text={surface.profile.about.text}
          />
        )}
        {surface.profile.extras?.map((e) => (
          <CopyableBlock key={e.label} title={e.label} text={e.text} />
        ))}

        {/* Profile links + fields */}
        {surface.links.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-white/70">
              Profile fields to set on the platform
            </div>
            <div className="grid gap-2">
              {surface.links.map((l) => (
                <div
                  key={l.field}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="text-white/60 shrink-0 font-mono text-xs">
                    {l.field}
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <code className="text-white/85 truncate">{l.value}</code>
                    <CopyButton text={l.value} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </details>
  );
}

export default function TeamProfilesPreview() {
  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 mb-3">
            Internal · Not indexed
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Team profile kit — banners + paste-ready copy
          </h1>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/85 leading-relaxed">
              <div className="font-bold mb-2 text-white">How to use this page</div>
              <ul className="list-disc pl-5 space-y-1 text-white/75">
                <li>
                  Each surface (LinkedIn co, FB, X, IG, GBP, plus Mike / Kip / Teri
                  personal LinkedIn) is one expandable block.
                </li>
                <li>
                  Right-click the banner image → "Save image as" → upload to that
                  platform's cover/header field.
                </li>
                <li>
                  Use the "Copy" button next to each text block to grab paste-ready
                  copy. Character counts show whether you're under the platform
                  limit.
                </li>
                <li>
                  Profile pic for every platform: same icon (see Instagram
                  section).
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] p-4 text-sm text-emerald-100 leading-relaxed">
              <div className="font-bold mb-2">Visual lane</div>
              <div>
                Strategist-recommended "operator's desk" aesthetic — documentary
                still-life photography on warm cream surfaces. Signals "we're the
                operator behind your front desk," not "AI agency." Anchors text
                overlay with brand wordmark in pine-green.
              </div>
            </div>
          </div>
        </div>

        {/* Company surfaces first */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40 mb-3">
            Company surfaces
          </h2>
          {TEAM.filter((s) => s.type === "company").map((s) => (
            <SurfaceCard key={s.key} surface={s} open={s.key === "linkedin-company"} />
          ))}
        </div>

        {/* Personal LinkedIns */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40 mb-3">
            Personal LinkedIn — team
          </h2>
          {TEAM.filter((s) => s.type === "person").map((s) => (
            <SurfaceCard key={s.key} surface={s} open={s.key === "mike"} />
          ))}
        </div>
      </div>
    </div>
  );
}
