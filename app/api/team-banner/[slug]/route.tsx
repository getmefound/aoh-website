import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { TEAM, type Surface } from "@/lib/team-pack";

export const dynamic = "force-static";
export const revalidate = false;

// Index TEAM by photoSlug so the route can render any surface that has a photo
const BY_SLUG: Record<string, Surface> = Object.fromEntries(
  TEAM.filter((s) => s.photoSlug && s.bannerWidth && s.bannerHeight).map((s) => [s.photoSlug!, s])
);

export function generateStaticParams() {
  return Object.keys(BY_SLUG).map((slug) => ({ slug }));
}

const AOH_NAVY = "#0A1628";
const AOH_GREEN = "#7CE7B7";
const AOH_GREEN_DEEP = "#2D6A4F";
const AOH_CREAM = "#F8F6F1";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const surface = BY_SLUG[slug];

  if (!surface || !surface.photoSlug || !surface.bannerWidth || !surface.bannerHeight) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = join(process.cwd(), "public", "banners", `${surface.photoSlug}.jpg`);
  const buf = await readFile(filePath);
  const dataUrl = `data:image/jpeg;base64,${buf.toString("base64")}`;

  const width = surface.bannerWidth;
  const height = surface.bannerHeight;

  // Scale typography based on banner height
  const scale = height / 312;
  const headlineSize = Math.max(22, Math.round(54 * scale));
  const accentSize = Math.max(14, Math.round(20 * scale));
  const padding = Math.max(24, Math.round(56 * scale));

  // No overlay? Just return the photo.
  if (!surface.overlay) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            position: "relative",
          }}
        >
          <img
            src={dataUrl}
            alt=""
            width={width}
            height={height}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ),
      { width, height }
    );
  }

  const o = surface.overlay;

  // Position the text block on the navy text-pane side (panel is 58% wide)
  const positionStyles = (() => {
    switch (o.align) {
      case "left":
        return {
          left: padding,
          top: padding,
          right: "55%",
          bottom: padding,
          alignItems: "flex-start",
          textAlign: "left" as const,
          justifyContent: "center",
        };
      case "right":
        return {
          left: "47%",
          top: padding,
          right: padding,
          bottom: padding,
          alignItems: "flex-start",
          textAlign: "left" as const,
          justifyContent: "center",
        };
      case "bottom-right":
        return {
          left: "47%",
          top: "auto",
          right: padding,
          bottom: padding,
          alignItems: "flex-end",
          textAlign: "right" as const,
          justifyContent: "flex-end",
        };
      case "lower-left-and-upper-right":
        return {
          left: padding,
          right: "55%",
          bottom: padding,
          top: padding,
          alignItems: "flex-start",
          textAlign: "left" as const,
          justifyContent: "flex-end",
        };
    }
  })();

  // Hard split: solid AOH-navy panel where text sits, photo bleeds through on the other side.
  // Stronger than gradient — the photos themselves are dominantly cream so a soft gradient can't pull enough contrast.
  const gradient = (() => {
    switch (o.align) {
      case "left":
        return "linear-gradient(90deg, rgba(10,22,40,1) 0%, rgba(10,22,40,1) 56%, rgba(10,22,40,0.65) 64%, rgba(10,22,40,0) 78%)";
      case "right":
        return "linear-gradient(270deg, rgba(10,22,40,1) 0%, rgba(10,22,40,1) 56%, rgba(10,22,40,0.65) 64%, rgba(10,22,40,0) 78%)";
      case "bottom-right":
        return "linear-gradient(330deg, rgba(10,22,40,1) 0%, rgba(10,22,40,0.9) 30%, rgba(10,22,40,0.3) 55%, rgba(10,22,40,0) 78%)";
      case "lower-left-and-upper-right":
        return "linear-gradient(180deg, rgba(10,22,40,0.78) 0%, rgba(10,22,40,0.2) 30%, rgba(10,22,40,0.2) 70%, rgba(10,22,40,0.92) 100%)";
    }
  })();

  // Two-pane layout: solid navy text panel on one side, photo on the other.
  // Strategist's split spec — far higher contrast than a soft gradient overlay.
  const textPaneOnLeft = o.align === "left" || o.align === "lower-left-and-upper-right";
  const textPaneWidth = o.align === "bottom-right" ? "55%" : "58%";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          position: "relative",
          fontFamily: "sans-serif",
          background: AOH_NAVY,
        }}
      >
        {/* Text pane (solid navy) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: textPaneOnLeft ? 0 : "auto",
            right: textPaneOnLeft ? "auto" : 0,
            width: textPaneWidth,
            background: AOH_NAVY,
            display: "flex",
            zIndex: 2,
          }}
        />

        {/* Photo pane (right or left, fades into text pane) */}
        <img
          src={dataUrl}
          alt=""
          width={width}
          height={height}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: textPaneOnLeft ? "auto" : 0,
            right: textPaneOnLeft ? 0 : "auto",
            width: "60%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
          }}
        />

        {/* Soft fade strip at the seam between photo and panel */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: textPaneOnLeft ? "55%" : "37%",
            width: "10%",
            background: textPaneOnLeft
              ? "linear-gradient(90deg, rgba(10,22,40,1) 0%, rgba(10,22,40,0) 100%)"
              : "linear-gradient(270deg, rgba(10,22,40,1) 0%, rgba(10,22,40,0) 100%)",
            zIndex: 3,
            display: "flex",
          }}
        />

        {/* Upper-right wordmark (X variant only) */}
        {o.align === "lower-left-and-upper-right" && (
          <div
            style={{
              position: "absolute",
              top: padding,
              right: padding,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: Math.round(40 * scale),
                height: Math.round(40 * scale),
                borderRadius: 10,
                background: AOH_GREEN_DEEP,
                color: AOH_CREAM,
                fontSize: Math.round(22 * scale),
                fontWeight: 800,
              }}
            >
              A
            </div>
            <div
              style={{
                display: "flex",
                fontSize: Math.round(16 * scale),
                fontWeight: 700,
                letterSpacing: 2,
                color: AOH_CREAM,
              }}
            >
              AOH
            </div>
          </div>
        )}

        {/* Headline + accent block */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            zIndex: 4,
            ...positionStyles,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: Math.round(4 * scale),
            }}
          >
            {o.headlineLines.map((line, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  fontSize: headlineSize,
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: -0.8,
                  color: AOH_CREAM,
                  textShadow: "0 2px 18px rgba(0,0,0,0.7)",
                }}
              >
                {line}
              </div>
            ))}
          </div>
          {o.accentLine && (
            <div
              style={{
                display: "flex",
                marginTop: Math.round(14 * scale),
                fontSize: accentSize,
                fontWeight: 600,
                letterSpacing: 1,
                color: AOH_GREEN,
                fontFamily: "monospace",
              }}
            >
              {o.accentLine}
            </div>
          )}
        </div>
      </div>
    ),
    { width, height }
  );
}
