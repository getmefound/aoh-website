import { NextRequest, NextResponse } from "next/server";
import { getReportRun } from "@/lib/report-runs";

export async function GET(req: NextRequest) {
  const runId = req.nextUrl.searchParams.get("runId")?.trim();
  if (!runId) {
    return NextResponse.json({ ok: false, error: "Missing runId" }, { status: 400 });
  }

  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase() || "";
  const run = getReportRun(runId);
  if (!run) {
    return NextResponse.json({
      ok: true,
      run: {
        runId,
        email: email || "unknown@unknown.local",
        businessName: "Unknown Business",
        campaign: "organic",
        reportType: "marketing",
        secondaryReport: false,
        submittedAt: Date.now(),
      },
      timing: {
        secondsSinceSubmit: 0,
        reportSeconds: null,
        heatmapSeconds: null,
      },
      stage: "submitted",
    });
  }

  const now = Date.now();
  const timing = {
    secondsSinceSubmit: Math.max(0, Math.round((now - run.submittedAt) / 1000)),
    reportSeconds: run.reportReadyAt
      ? Math.max(0, Math.round((run.reportReadyAt - run.submittedAt) / 1000))
      : null,
    heatmapSeconds: run.heatmapReadyAt
      ? Math.max(0, Math.round((run.heatmapReadyAt - run.submittedAt) / 1000))
      : null,
  };

  return NextResponse.json({
    ok: true,
    run,
    timing,
    stage: run.heatmapReadyAt ? "heatmap_ready" : run.reportReadyAt ? "report_ready" : "submitted",
  });
}

