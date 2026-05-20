import { createHmac, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const JOBS_PATH = "docs/client-ops-ledger/agent-jobs.csv";
const DOMAINS_PATH = "docs/client-ops-ledger/sending-domain-readiness.csv";
const DAILY_BRIEF_PATH = "docs/client-ops-ledger/daily-brief-current.md";
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

type CsvRow = Record<string, string>;

type LaneKey = "reviews" | "ai" | "relay";

const LANES: Record<
  LaneKey,
  {
    label: string;
    aliases: string[];
    pipeline: string;
    coldWorkflow: string;
    replyWorkflow: string;
  }
> = {
  reviews: {
    label: "Reviews",
    aliases: ["reviews", "review"],
    pipeline: "Reach - Reviews",
    coldWorkflow: "Reviews Special - Pilot Drip",
    replyWorkflow: "Campaign Reply - Reviews Send",
  },
  ai: {
    label: "AI Visibility",
    aliases: ["ai", "ai visibility", "visibility"],
    pipeline: "Reach - AI",
    coldWorkflow: "AI Visibility - Pilot Drip",
    replyWorkflow: "Campaign Reply - AI Visibility Send",
  },
  relay: {
    label: "Relay",
    aliases: ["relay"],
    pipeline: "Reach - Relay",
    coldWorkflow: "Relay - Pilot Drip",
    replyWorkflow: "Campaign Reply - Relay Send",
  },
};

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const auth = verifySlackRequest(req, rawBody);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return handleJsonEvent(req, rawBody);
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return handleSlashLikeCommand(rawBody);
  }

  return NextResponse.json({ ok: false, error: "Unsupported Slack payload." }, { status: 415 });
}

async function handleJsonEvent(req: NextRequest, rawBody: string) {
  const payload = safeJson(rawBody);
  if (!payload) {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (payload.type === "url_verification" && typeof payload.challenge === "string") {
    return new Response(payload.challenge, {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  }

  if (payload.type !== "event_callback") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const event = asRecord(payload.event);
  if (event.subtype || event.bot_id) return NextResponse.json({ ok: true, ignored: "bot_or_subtype" });

  const text = typeof event.text === "string" ? event.text.trim() : "";
  const channel = typeof event.channel === "string" ? event.channel : "";
  const threadTs = typeof event.ts === "string" ? event.ts : undefined;

  if (!text || !channel || !isSupportedCommand(text)) {
    return NextResponse.json({ ok: true, ignored: "not_agent_command" });
  }
  if (!isAllowedChannel(channel)) {
    return NextResponse.json({ ok: true, ignored: "not_allowed_channel" });
  }

  const response = await buildAgentResponse(text);
  await postSlackMessage({ channel, text: response, threadTs });

  return NextResponse.json({ ok: true });
}

async function handleSlashLikeCommand(rawBody: string) {
  const params = new URLSearchParams(rawBody);
  const commandText = params.get("text")?.trim() || "Manager, status";
  const text = commandText.match(/^(manager|general manager|chief of staff|ghl expert|sales manager|approve|pause)\b/i)
    ? commandText
    : `Manager, ${commandText}`;

  const response = await buildAgentResponse(text);
  return NextResponse.json({
    response_type: "in_channel",
    text: response,
  });
}

async function buildAgentResponse(command: string): Promise<string> {
  const normalized = normalizeCommand(command);

  if (normalized.includes("pause all campaign live actions")) {
    return `*Manager pause acknowledged - ${today()}*

All campaign live actions are blocked.

- Do not import contacts into GHL.
- Do not add start-drip tags.
- Do not enable or toggle any HighLevel AI feature.
- Continue read-only checks and local prep only.`;
  }

  const approval = parseApproval(normalized);
  if (approval) return buildApprovalResponse(approval);

  if (mentionsReachColdEmailCampaign(normalized)) return buildReachColdEmailCampaignResponse();

  if (mentionsGhlReadiness(normalized)) {
    const result = await runGhlReadinessCheck();
    return `${renderGhlResult(result)}

${buildManagerStatus()}`;
  }

  if (mentionsQaReview(normalized)) return buildQaResponse();
  if (mentionsBrief(normalized)) return buildManagerStatus();

  return `*Manager command not recognized - ${today()}*

Supported examples:

\`\`\`text
Manager, status
Manager, run Reach Cold Email Campaign
GHL Expert, check Reach readiness
Sales Manager, review Reach QA
approve relay import only
pause all campaign live actions
\`\`\``;
}

async function buildReachColdEmailCampaignResponse() {
  const summaries = laneSummaries();
  const recommendation = readRecommendation();
  const ghlResult = await runGhlReadinessCheck();

  return `*Reach Cold Email Campaign - ${today()}*

Manager ran today's active Reach Cold Email Campaign routine.

What ran:

- Sales Manager QA summary from the current prepared lanes.
- GHL Expert read-only readiness check.
- Manager approval gate review.

GHL Expert result: ${ghlResult.ok ? "read-only API check passed" : "read-only API check needs attention"}

Current lanes:

${summaries.map(renderLaneBullet).join("\n")}

What still needs approval or review:

- Sales Manager must decide what to do with QA-flagged rows before live outreach.
- GHL Expert must visually confirm sender/from domains, domain warmup status, workflow email sender nodes, and HighLevel AI toggles OFF.
- Mike must approve import-only before contacts are imported.
- Mike must approve start-drip separately, and only after the lane is marked \`ready_for_drip=yes\`.

Recommended next approval, if Mike wants to move today:

\`\`\`text
approve relay import only
\`\`\`

Do not start drip yet.

Safety:

- No contacts were imported.
- No drip was started.
- No GHL workflows or settings were changed.
- No HighLevel AI features were enabled or toggled.

Plain-English recommendation:

${recommendation}`;
}

function buildManagerStatus() {
  const summaries = laneSummaries();
  const waiting = reachJobs().filter((job) => String(job.status ?? "").startsWith("waiting")).length;

  return `*Manager status - ${today()}*

Current position:

- ${summaries.length} Reach prep jobs are in the queue; ${waiting} are waiting on agent review.
- No live GHL import or start-drip is running from this listener.
- Default Slack command channel is \`#04-aoh-ops\`.

Reach queue:

${summaries.map(renderLaneBullet).join("\n")}

Mike can say:

\`\`\`text
Manager, run Reach Cold Email Campaign
GHL Expert, check Reach readiness
Sales Manager, review Reach QA
approve relay import only
pause all campaign live actions
\`\`\``;
}

function buildQaResponse() {
  return `*Sales Manager Reach QA - ${today()}*

Review focus:

${laneSummaries()
  .map((summary) => `- ${summary.label}: ${summary.verified} verified, ${summary.qaText}; source \`${summary.sourceFile}\``)
  .join("\n")}

Decision rule:

- Remove or approve questionable personal-email contacts before live outreach.
- If a business appears more than once, keep only the best contact unless there is a clear reason.
- Do not ask Mike to approve start-drip until GHL Expert finishes visual sender-domain/warmup/AI-toggle checks.`;
}

function buildApprovalResponse(approval: { laneKey: LaneKey; action: "import" | "start" }) {
  const lane = LANES[approval.laneKey];
  const job = reachJobs().find((item) => item.campaign_lane?.toLowerCase() === approval.laneKey);
  const sourceFile = job?.source_file?.trim() || "CSV_PATH";
  const limit = extractVerifiedCount(job?.notes) || "N";
  const domain = domainRows().find((item) => item.lane?.toLowerCase() === approval.laneKey) ?? {};
  const blockers = approvalBlockers({ action: approval.action, job, domain });
  const command = `npm run reach:launch -- --lane ${approval.laneKey} --csv ${sourceFile} --limit ${limit} --commit${
    approval.action === "start" ? " --start-drip" : ""
  }`;

  return `*Manager heard approval - ${today()}*

Request: ${lane.label} / ${approval.action === "start" ? "start drip" : "import only"}

Current judgment: ${blockers.length ? "blocked before live execution" : "eligible for guarded execution"}

${blockers.length ? `Blockers:\n\n${blockers.map((blocker) => `- ${blocker}`).join("\n")}` : "Blockers: none from the current gates."}

Exact command after clearance:

\`\`\`bash
${command}
\`\`\`

Execution:

Live execution was not attempted by Slack listener.

Safety:

- Import-only approval does not approve start-drip.
- Start-drip approval is blocked unless \`ready_for_drip=yes\`.
- HighLevel AI features must stay OFF unless Mike explicitly authorizes them manually.`;
}

function approvalBlockers({
  action,
  job,
  domain,
}: {
  action: "import" | "start";
  job: CsvRow | undefined;
  domain: CsvRow;
}) {
  const blockers: string[] = [];
  if (!job) blockers.push("No matching job is present in the agent job queue.");
  if (String(domain.ready_for_import ?? "").toLowerCase() !== "yes") {
    blockers.push("Domain readiness says ready_for_import is not yes.");
  }
  if (action === "start" && String(domain.ready_for_drip ?? "").toLowerCase() !== "yes") {
    blockers.push("Domain readiness says ready_for_drip is not yes.");
  }
  if (String(job?.status ?? "").includes("waiting_sales_and_visual_ghl_review")) {
    blockers.push("Sales Manager QA and GHL Expert visual sender-domain/warmup/AI-toggle review are still waiting.");
  }
  if (String(job?.status ?? "").includes("paused")) blockers.push("Campaign live actions are paused.");
  return blockers;
}

async function runGhlReadinessCheck() {
  const token = process.env.GHL_PIT_TOKEN?.trim();
  const locationId = process.env.GHL_LOCATION_ID?.trim();
  if (!token || !locationId) {
    return { ok: false, lines: ["GHL token/location env vars are not configured for this listener."] };
  }

  try {
    const [pipelines, workflows] = await Promise.all([
      getGhlJson(`/opportunities/pipelines?locationId=${encodeURIComponent(locationId)}`, token),
      getGhlJson(`/workflows/?locationId=${encodeURIComponent(locationId)}`, token).catch(() => null),
    ]);
    const pipelineList = asArray(asRecord(pipelines).pipelines);
    const workflowList = asArray(asRecord(workflows).workflows ?? asRecord(workflows).data ?? workflows);
    const lines = (Object.keys(LANES) as LaneKey[]).map((laneKey) => {
      const lane = LANES[laneKey];
      const pipelineFound = pipelineList.some((item) => same(asRecord(item).name, lane.pipeline));
      const coldFound = workflowList.some((item) => same(asRecord(item).name ?? asRecord(item).title, lane.coldWorkflow));
      const replyFound = workflowList.some((item) => same(asRecord(item).name ?? asRecord(item).title, lane.replyWorkflow));
      return `${lane.label}: pipeline ${yesNo(pipelineFound)}, cold workflow ${yesNo(coldFound)}, reply workflow ${yesNo(replyFound)}`;
    });
    return { ok: true, lines };
  } catch (error) {
    return { ok: false, lines: [error instanceof Error ? error.message : "Unknown GHL readiness error."] };
  }
}

function renderGhlResult(result: { ok: boolean; lines: string[] }) {
  return `*GHL Expert readiness check - ${today()}*

Mode: read-only

Result: ${result.ok ? "passed" : "needs attention"}

${result.lines.map((line) => `- ${line}`).join("\n")}

No contacts, tags, workflows, settings, or HighLevel AI features were changed.`;
}

async function getGhlJson(path: string, token: string) {
  const res = await fetch(`${GHL_API_BASE}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      Version: GHL_API_VERSION,
    },
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 200)}`);
  return JSON.parse(text) as unknown;
}

async function postSlackMessage({ channel, text, threadTs }: { channel: string; text: string; threadTs?: string }) {
  const token = process.env.SLACK_BOT_TOKEN?.trim();
  if (!token) return;

  await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel,
      text,
      thread_ts: threadTs,
    }),
    cache: "no-store",
  });
}

function verifySlackRequest(req: NextRequest, rawBody: string): { ok: true } | { ok: false; status: number; error: string } {
  const signingSecret = process.env.SLACK_SIGNING_SECRET?.trim();
  const localTestToken = process.env.SLACK_LISTENER_TEST_TOKEN?.trim() || process.env.REPORT_TEST_BYPASS_TOKEN?.trim() || "local-dev-only";
  const localBypass = process.env.NODE_ENV !== "production" && req.headers.get("x-agent-test-bypass") === localTestToken;

  if (!signingSecret) {
    return localBypass
      ? { ok: true }
      : { ok: false, status: 503, error: "SLACK_SIGNING_SECRET is not configured." };
  }

  const timestamp = req.headers.get("x-slack-request-timestamp") ?? "";
  const signature = req.headers.get("x-slack-signature") ?? "";
  const timestampSeconds = Number(timestamp);
  if (!timestampSeconds || Math.abs(Date.now() / 1000 - timestampSeconds) > 60 * 5) {
    return { ok: false, status: 401, error: "Invalid Slack timestamp." };
  }

  const base = `v0:${timestamp}:${rawBody}`;
  const expected = `v0=${createHmac("sha256", signingSecret).update(base).digest("hex")}`;
  if (!safeEqual(signature, expected)) {
    return { ok: false, status: 401, error: "Invalid Slack signature." };
  }

  return { ok: true };
}

function isAllowedChannel(channel: string) {
  const allowed = (process.env.SLACK_AGENT_ALLOWED_CHANNEL_IDS ?? "C0ATTA4NBR8")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return allowed.includes(channel);
}

function isSupportedCommand(text: string) {
  const normalized = normalizeCommand(text);
  return (
    mentionsReachColdEmailCampaign(normalized) ||
    mentionsBrief(normalized) ||
    mentionsGhlReadiness(normalized) ||
    mentionsQaReview(normalized) ||
    normalized.includes("approve") ||
    normalized.includes("pause all campaign live actions")
  );
}

function parseApproval(normalized: string): { laneKey: LaneKey; action: "import" | "start" } | null {
  if (!normalized.includes("approve")) return null;
  const laneKey = (Object.keys(LANES) as LaneKey[]).find((key) =>
    LANES[key].aliases.some((alias) => containsAlias(normalized, alias)),
  );
  if (!laneKey) return null;
  if (normalized.includes("start") || normalized.includes("drip")) return { laneKey, action: "start" };
  if (normalized.includes("import")) return { laneKey, action: "import" };
  return null;
}

function laneSummaries() {
  const domains = domainRows();
  return reachJobs().map((job) => {
    const laneKey = (job.campaign_lane?.toLowerCase() || "reviews") as LaneKey;
    const lane = LANES[laneKey] ?? LANES.reviews;
    const domain = domains.find((item) => item.lane?.toLowerCase() === laneKey) ?? {};
    return {
      label: lane.label,
      verified: extractVerifiedCount(job.notes) || "unknown",
      qaText: readQaText(lane.label),
      status: job.status || "unknown",
      importReady: domain.ready_for_import || "unknown",
      dripReady: domain.ready_for_drip || "unknown",
      domain: domain.dedicated_subdomain || "TBD",
      sourceFile: job.source_file || "missing",
    };
  });
}

function renderLaneBullet(summary: ReturnType<typeof laneSummaries>[number]) {
  return `- ${summary.label}: ${summary.verified} verified, ${summary.qaText}; status \`${summary.status}\`; import ${summary.importReady}; drip ${summary.dripReady}; domain \`${summary.domain}\``;
}

function reachJobs() {
  const order: LaneKey[] = ["reviews", "ai", "relay"];
  return readCsv(JOBS_PATH)
    .filter((job) => String(job.job_type ?? "").includes("reach_campaign"))
    .sort((a, b) => order.indexOf((a.campaign_lane?.toLowerCase() || "reviews") as LaneKey) - order.indexOf((b.campaign_lane?.toLowerCase() || "reviews") as LaneKey));
}

function domainRows() {
  return readCsv(DOMAINS_PATH);
}

function readRecommendation() {
  const dailyBrief = readText(DAILY_BRIEF_PATH);
  return (
    dailyBrief.match(/Current strongest lane by cleanliness:[^\n]+/)?.[0] ??
    "Relay is the cleanest small lane right now. Use import-only first; wait on start-drip until domain readiness is confirmed."
  );
}

function readQaText(label: string) {
  const dailyBrief = readText(DAILY_BRIEF_PATH);
  const rows = dailyBrief
    .split(/\r?\n/)
    .filter((line) => line.startsWith(`| ${label} |`) || (label === "AI Visibility" && line.startsWith("| AI Visibility |")));
  const cells =
    rows
      .map((row) => row.split("|").map((cell) => cell.trim()).filter(Boolean))
      .find((rowCells) => /^\d+$/.test(rowCells[4] ?? "")) ?? [];
  const qa = cells[4];
  return qa ? `${qa} QA review flag${qa === "1" ? "" : "s"}` : "QA count unavailable";
}

function readCsv(path: string): CsvRow[] {
  const raw = readText(path);
  if (!raw) return [];
  return parseCsv(raw);
}

function readText(path: string) {
  const absolute = resolve(path);
  return existsSync(absolute) ? readFileSync(absolute, "utf8") : "";
}

function parseCsv(raw: string): CsvRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    const next = raw[i + 1];
    if (quoted && c === '"' && next === '"') {
      field += '"';
      i++;
    } else if (c === '"') {
      quoted = !quoted;
    } else if (!quoted && c === ",") {
      row.push(field);
      field = "";
    } else if (!quoted && (c === "\n" || c === "\r")) {
      if (c === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift()?.map((header) => header.trim()) ?? [];
  return rows
    .filter((values) => values.some((value) => value.trim()))
    .map((values) => Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ""])));
}

function safeJson(raw: string): Record<string, unknown> | null {
  try {
    const value = JSON.parse(raw) as unknown;
    return asRecord(value);
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function mentionsBrief(normalized: string) {
  return normalized.includes("manager status") || normalized.includes("status") || normalized.includes("chief of staff brief") || normalized.includes("brief");
}

function mentionsReachColdEmailCampaign(normalized: string) {
  return normalized.includes("run reach cold email campaign") || normalized.includes("start reach cold email campaign") || normalized.includes("reach cold email campaign");
}

function mentionsGhlReadiness(normalized: string) {
  return normalized.includes("ghl") && (normalized.includes("check") || normalized.includes("readiness") || normalized.includes("ready"));
}

function mentionsQaReview(normalized: string) {
  return normalized.includes("qa") || normalized.includes("quality") || normalized.includes("sales manager review");
}

function normalizeCommand(command: string) {
  return command.toLowerCase().replace(/[.,:;|]/g, " ").replace(/\s+/g, " ").trim();
}

function containsAlias(normalized: string, alias: string) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\s)${escaped}(\\s|$)`).test(normalized);
}

function extractVerifiedCount(notes: string | undefined) {
  return notes?.match(/(\d+)\s+verified/i)?.[1] ?? "";
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function same(a: unknown, b: unknown) {
  return String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
}

function yesNo(value: boolean) {
  return value ? "yes" : "no";
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
