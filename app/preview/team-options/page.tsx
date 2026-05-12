"use client";

import { useState } from "react";
import {
  SURFACES,
  TEAM_COORDINATION_NOTE,
  type SurfaceOptions,
  type TextOption,
  type ImageOption,
} from "@/lib/team-options";

function CopyButton({ text }: { text: string }) {
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
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function TextOptionCard({
  surfaceKey,
  option,
  picked,
  onPick,
}: {
  surfaceKey: string;
  option: TextOption;
  picked: boolean;
  onPick: () => void;
}) {
  return (
    <div
      onClick={onPick}
      className={`cursor-pointer rounded-xl border p-4 transition-all ${
        picked
          ? "border-emerald-400 bg-emerald-400/10 ring-2 ring-emerald-400/40"
          : "border-white/10 bg-white/[0.03] hover:border-white/30"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-sm ${
              picked
                ? "bg-emerald-400 text-emerald-950"
                : "bg-white/10 text-white/70"
            }`}
          >
            {option.letter}
          </span>
          <span className="text-sm font-semibold text-white/90">{option.angle}</span>
        </div>
        {picked && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            Selected
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
            Banner overlay text
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/85">
            {option.bannerOverlay}
          </pre>
        </div>
        {option.taglineOrHeadline && (
          <div onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                {option.taglineOrHeadline.label}
                {option.taglineOrHeadline.charLimit && (
                  <span
                    className={`ml-2 font-mono ${
                      option.taglineOrHeadline.text.length >
                      option.taglineOrHeadline.charLimit
                        ? "text-red-300"
                        : "text-white/40"
                    }`}
                  >
                    {option.taglineOrHeadline.text.length}/
                    {option.taglineOrHeadline.charLimit}
                  </span>
                )}
              </div>
              <CopyButton text={option.taglineOrHeadline.text} />
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-white/75">
              {option.taglineOrHeadline.text}
            </pre>
          </div>
        )}
        {option.bioOrShortDescription && (
          <div onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                {option.bioOrShortDescription.label}
                {option.bioOrShortDescription.charLimit && (
                  <span
                    className={`ml-2 font-mono ${
                      option.bioOrShortDescription.text.length >
                      option.bioOrShortDescription.charLimit
                        ? "text-red-300"
                        : "text-white/40"
                    }`}
                  >
                    {option.bioOrShortDescription.text.length}/
                    {option.bioOrShortDescription.charLimit}
                  </span>
                )}
              </div>
              <CopyButton text={option.bioOrShortDescription.text} />
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-white/75">
              {option.bioOrShortDescription.text}
            </pre>
          </div>
        )}
        {option.about && (
          <details onClick={(e) => e.stopPropagation()}>
            <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-wider text-emerald-300 hover:text-emerald-200">
              {option.about.label} — tap to expand
            </summary>
            <div className="mt-2 flex items-center justify-end">
              <CopyButton text={option.about.text} />
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-white/75 mt-1">
              {option.about.text}
            </pre>
          </details>
        )}
        {option.categories && (
          <div onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                Categories
              </div>
              <CopyButton text={option.categories} />
            </div>
            <div className="font-mono text-[11px] text-white/70">{option.categories}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ImageOptionCard({
  option,
  picked,
  onPick,
}: {
  option: ImageOption;
  picked: boolean;
  onPick: () => void;
}) {
  return (
    <div
      onClick={onPick}
      className={`cursor-pointer rounded-xl border p-4 transition-all ${
        picked
          ? "border-amber-300 bg-amber-300/10 ring-2 ring-amber-300/40"
          : "border-white/10 bg-white/[0.03] hover:border-white/30"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-sm ${
              picked ? "bg-amber-300 text-amber-950" : "bg-white/10 text-white/70"
            }`}
          >
            {option.number}
          </span>
          <span className="text-sm font-semibold text-white/90">{option.lane}</span>
        </div>
        {picked && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Selected
          </span>
        )}
      </div>

      <div className="mb-2 text-[10px] font-mono text-white/50">
        Model: {option.model}
      </div>
      <div className="text-xs leading-relaxed text-white/80 mb-2">{option.prompt}</div>
      <div className="text-[11px] italic text-emerald-200/80">
        → {option.whyItWorks}
      </div>
    </div>
  );
}

function SurfaceSection({
  surface,
  textPick,
  imagePick,
  onTextPick,
  onImagePick,
}: {
  surface: SurfaceOptions;
  textPick: string | null;
  imagePick: number | null;
  onTextPick: (letter: string) => void;
  onImagePick: (n: number) => void;
}) {
  return (
    <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="mb-5">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">{surface.label}</h2>
        <div className="text-xs font-mono text-white/40 mt-1">{surface.dimensions}</div>
        {surface.notes && (
          <div className="mt-2 rounded-lg border border-amber-300/30 bg-amber-300/[0.06] p-3 text-xs text-amber-100">
            ⚠ {surface.notes}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-300">
              Text — pick A / B / C
            </span>
          </div>
          <div className="space-y-3">
            {surface.textOptions.map((o) => (
              <TextOptionCard
                key={o.letter}
                surfaceKey={surface.key}
                option={o}
                picked={textPick === o.letter}
                onPick={() => onTextPick(o.letter)}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-amber-300">
              Image direction — pick 1 / 2 / 3
            </span>
          </div>
          <div className="space-y-3">
            {surface.imageOptions.map((o) => (
              <ImageOptionCard
                key={o.number}
                option={o}
                picked={imagePick === o.number}
                onPick={() => onImagePick(o.number)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TeamOptionsPicker() {
  const [textPicks, setTextPicks] = useState<Record<string, string>>({});
  const [imagePicks, setImagePicks] = useState<Record<string, number>>({});

  const allPickedCount =
    Object.keys(textPicks).length + Object.keys(imagePicks).length;
  const expected = SURFACES.length * 2;

  const picksSummary = SURFACES.map((s) => {
    const t = textPicks[s.key];
    const i = imagePicks[s.key];
    if (!t && !i) return null;
    return `${s.label}: ${t ?? "?"} + ${i ?? "?"}`;
  })
    .filter(Boolean)
    .join("\n");

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 mb-3">
            Internal · Not indexed · Pick page
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Brand kit options — pick your picks
          </h1>
          <p className="text-white/70 max-w-2xl leading-relaxed">
            48 strategist-vetted options across 8 surfaces. For each surface, tap one text option (A/B/C) and one image direction (1/2/3). Nothing gets generated until you've picked. Your selections show below.
          </p>

          <div className="mt-5 rounded-xl border border-amber-300/30 bg-amber-300/[0.06] p-4 text-sm text-amber-100 leading-relaxed">
            <div className="font-bold mb-2">Coordination note</div>
            <pre className="whitespace-pre-wrap font-sans text-xs">
              {TEAM_COORDINATION_NOTE}
            </pre>
          </div>
        </div>

        {SURFACES.map((s) => (
          <SurfaceSection
            key={s.key}
            surface={s}
            textPick={textPicks[s.key] ?? null}
            imagePick={imagePicks[s.key] ?? null}
            onTextPick={(letter) =>
              setTextPicks((p) => ({ ...p, [s.key]: letter }))
            }
            onImagePick={(n) =>
              setImagePicks((p) => ({ ...p, [s.key]: n }))
            }
          />
        ))}

        {/* Sticky picks summary at bottom */}
        <div className="sticky bottom-4 mt-8 rounded-2xl border-2 border-emerald-400/50 bg-[#0A1628] p-5 shadow-2xl shadow-emerald-400/20">
          <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-300">
                Your picks
              </div>
              <div className="text-sm text-white/70 mt-1">
                {allPickedCount} of {expected} selected
              </div>
            </div>
            {picksSummary && <CopyButton text={picksSummary} />}
          </div>
          <pre className="whitespace-pre-wrap font-mono text-xs text-white/85 leading-relaxed">
            {picksSummary || "Nothing selected yet. Tap a card above."}
          </pre>
          {allPickedCount === expected && (
            <div className="mt-3 rounded-lg border border-emerald-400/40 bg-emerald-400/10 p-3 text-sm text-emerald-100">
              ✓ All 8 surfaces picked. Copy the list above and paste back to me — I'll generate the chosen images and ship final banners + profile copy.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
