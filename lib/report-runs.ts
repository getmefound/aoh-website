export type ReportStage = "submitted" | "report_ready" | "heatmap_ready";

export type ReportRun = {
  runId: string;
  email: string;
  campaign: "reviews" | "ai" | "organic";
  submittedAt: number;
  reportReadyAt?: number;
  heatmapReadyAt?: number;
  auditUrl?: string;
  heatmapUrl?: string;
};

const runs = new Map<string, ReportRun>();

export function createReportRun(input: {
  runId: string;
  email: string;
  campaign: "reviews" | "ai" | "organic";
}): ReportRun {
  const run: ReportRun = {
    runId: input.runId,
    email: input.email,
    campaign: input.campaign,
    submittedAt: Date.now(),
  };
  runs.set(run.runId, run);
  return run;
}

export function updateReportRun(
  runId: string,
  patch: Partial<Pick<ReportRun, "reportReadyAt" | "heatmapReadyAt" | "auditUrl" | "heatmapUrl">>,
): ReportRun | null {
  const run = runs.get(runId);
  if (!run) return null;
  const next = { ...run, ...patch };
  runs.set(runId, next);
  return next;
}

export function getReportRun(runId: string): ReportRun | null {
  return runs.get(runId) ?? null;
}

