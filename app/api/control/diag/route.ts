import { NextResponse } from "next/server";

/**
 * Temporary diagnostic route for The Hub data-wiring debug.
 * Returns env-var presence + GHL probe status. Masks the actual token.
 * Remove after data wiring is verified.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const pit = process.env.GHL_PIT_TOKEN ?? "";
  const locationId = process.env.GHL_LOCATION_ID ?? "";
  const githubPat = process.env.GITHUB_PAT ?? "";
  const vercelToken = process.env.VERCEL_TOKEN ?? "";

  const mask = (s: string) =>
    s.length > 10 ? `${s.slice(0, 6)}…${s.slice(-4)}` : s ? "(short)" : "(empty)";

  let ghlProbe: {
    status: number | "error";
    bodySnippet?: string;
    pipelineCount?: number;
  } = { status: "error" };
  if (pit && locationId) {
    try {
      const res = await fetch(
        `https://services.leadconnectorhq.com/opportunities/pipelines?locationId=${locationId}`,
        {
          headers: {
            Authorization: `Bearer ${pit}`,
            Version: "2021-07-28",
            Accept: "application/json",
          },
          cache: "no-store",
        },
      );
      const text = await res.text();
      ghlProbe = {
        status: res.status,
        bodySnippet: text.slice(0, 400),
      };
      if (res.ok) {
        try {
          const data = JSON.parse(text) as { pipelines?: unknown[] };
          ghlProbe.pipelineCount = data.pipelines?.length ?? 0;
        } catch {
          /* ignore parse */
        }
      }
    } catch (err) {
      ghlProbe = { status: "error", bodySnippet: String(err).slice(0, 200) };
    }
  }

  return NextResponse.json({
    envVars: {
      GHL_PIT_TOKEN: { present: !!pit, masked: mask(pit), length: pit.length },
      GHL_LOCATION_ID: { present: !!locationId, value: locationId },
      GITHUB_PAT: { present: !!githubPat, masked: mask(githubPat) },
      VERCEL_TOKEN: { present: !!vercelToken, masked: mask(vercelToken) },
    },
    ghlProbe,
    timestamp: new Date().toISOString(),
  });
}
