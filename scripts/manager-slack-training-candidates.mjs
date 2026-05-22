import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const DEFAULT_CHANNEL = "C0ATTA4NBR8";
const DEFAULT_OUT_DIR = "docs/client-ops-ledger/outbox";
const DEFAULT_LOOKBACK_HOURS = 48;
const DEFAULT_LIMIT = 100;

const AGENT_PREFIXES = [
  "manager",
  "general manager",
  "ghl expert",
  "sales manager",
  "systems director",
  "scout",
  "sender",
  "sorter",
  "booker",
  "profile manager",
  "reviews manager",
  "relay manager",
  "coach",
  "reporter",
  "scheduler",
  "press",
  "editor",
];

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  loadEnv(".env.local");
  loadEnv(".env");

  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const token = process.env.SLACK_BOT_TOKEN?.trim();
  if (!token) {
    throw new Error("SLACK_BOT_TOKEN is not configured locally. Run this where the Slack bot token is available.");
  }

  const channel = String(args.channel ?? process.env.SLACK_TRAINING_CHANNEL_ID ?? firstAllowedChannel()).trim();
  const hours = Number(args.hours ?? process.env.SLACK_TRAINING_LOOKBACK_HOURS ?? DEFAULT_LOOKBACK_HOURS);
  const limit = Number(args.limit ?? DEFAULT_LIMIT);
  const outDir = String(args.outDir ?? args["out-dir"] ?? DEFAULT_OUT_DIR);
  const oldest = Math.floor(Date.now() / 1000 - hours * 60 * 60);

  mkdirSync(outDir, { recursive: true });

  const messages = await readChannelHistory({ token, channel, oldest, limit });
  const candidates = buildCandidates(messages, { channel });
  const stamp = timestamp();
  const jsonPath = path.join(outDir, `manager-slack-training-candidates-${stamp}.json`);
  const mdPath = path.join(outDir, `manager-slack-training-candidates-${stamp}.md`);

  const payload = {
    generated_at: new Date().toISOString(),
    channel,
    lookback_hours: hours,
    source: "slack.conversations.history",
    review_rule: "Raw Slack candidates stay in outbox. Promote only sanitized, useful examples into docs/agentops/manager-eval-scenarios.json.",
    candidates,
  };

  writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);
  writeFileSync(mdPath, renderMarkdown(payload));

  console.log(`Slack training candidates: ${candidates.length}`);
  console.log(`JSON: ${jsonPath}`);
  console.log(`Summary: ${mdPath}`);
}

async function readChannelHistory({ token, channel, oldest, limit }) {
  const url = new URL("https://slack.com/api/conversations.history");
  url.searchParams.set("channel", channel);
  url.searchParams.set("oldest", String(oldest));
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("inclusive", "true");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const body = await response.json().catch(() => null);
  if (!body?.ok) {
    throw new Error(`Slack history read failed: ${body?.error || response.status}`);
  }

  return Array.isArray(body.messages) ? body.messages : [];
}

function buildCandidates(messages, { channel }) {
  const chronological = [...messages].sort((a, b) => Number(a.ts ?? 0) - Number(b.ts ?? 0));
  const candidates = [];

  for (let index = 0; index < chronological.length; index += 1) {
    const message = chronological[index];
    if (!isHumanMessage(message)) continue;

    const text = cleanSlackText(message.text ?? "");
    if (!isAgentCommand(text)) continue;

    const response = findLikelyBotResponse(chronological, index);
    const intent = classifyIntent(text);
    const id = `slack_${String(message.ts ?? "").replace(".", "_")}`;

    candidates.push({
      id,
      review_status: "needs_codex_review",
      detected_intent: intent,
      command: text,
      manager_response: response ? cleanSlackText(response.text ?? "") : "",
      response_found: Boolean(response),
      suggested_eval: {
        id: `${intent}_${id}`,
        command: text,
        intent,
        must_include: suggestedMustInclude(intent),
        must_not_include: ["Reports to: President", "Best next command", "HighLevel AI features were enabled"],
      },
      slack: {
        channel,
        ts: message.ts ?? "",
        response_ts: response?.ts ?? "",
        thread_ts: message.thread_ts ?? "",
      },
    });
  }

  return candidates;
}

function findLikelyBotResponse(messages, commandIndex) {
  const command = messages[commandIndex];
  const commandTs = Number(command.ts ?? 0);
  const threadTs = command.thread_ts || command.ts;

  return messages.slice(commandIndex + 1).find((candidate) => {
    const candidateTs = Number(candidate.ts ?? 0);
    if (candidateTs <= commandTs) return false;
    if (candidateTs - commandTs > 10 * 60) return false;
    const sameThread = !candidate.thread_ts || candidate.thread_ts === threadTs || candidate.ts === threadTs;
    return sameThread && isBotMessage(candidate);
  });
}

function isHumanMessage(message) {
  return Boolean(message?.text) && !isBotMessage(message) && !message.subtype;
}

function isBotMessage(message) {
  return Boolean(message?.bot_id || message?.subtype === "bot_message");
}

function isAgentCommand(text) {
  const normalized = normalize(text);
  if (normalized.startsWith("/manager")) return true;
  if (normalized.startsWith("approve ") || normalized.startsWith("pause all campaign")) return true;
  return AGENT_PREFIXES.some((prefix) => normalized.startsWith(`${prefix},`) || normalized.startsWith(`${prefix} `));
}

function classifyIntent(text) {
  const normalized = normalize(text);
  if (/\b(model|llm|gemini|openai|claude|tier)\b/.test(normalized)) return "model_routing";
  if (/\b(owner peek|where can i see|where.*activity|manager dm)\b/.test(normalized)) return "owner_status";
  if (/\b(morning brief|daily brief)\b/.test(normalized)) return "morning_brief";
  if (/\b(gbp|gmb|google business|profile access)\b/.test(normalized)) return "gbp_access";
  if (/\b(visual|ghl|readiness|sender domain|highlevel ai)\b/.test(normalized)) return "reach_live_action";
  if (/\b(reach|cold email|campaign|relay|drip|send|sent|running today)\b/.test(normalized)) return "reach_cold_email_status";
  if (/\b(key|token|secret|password|credential)\b/.test(normalized)) return "security_or_credentials";
  return "owner_status";
}

function suggestedMustInclude(intent) {
  const map = {
    model_routing: ["No LLM", "Cheap model", "Standard model", "Strong model", "Human"],
    owner_status: ["Manager conversation", "Mission Control", "Recommended DM policy"],
    morning_brief: ["Needs Mike", "Agents working", "Recommended move"],
    gbp_access: ["Manager access", "No password sharing", "Mike approves"],
    reach_live_action: ["visual confirmation", "HighLevel AI", "No contacts, tags, workflows, settings"],
    reach_cold_email_status: ["Short answer", "Relay", "NeverBounce", "HighLevel AI stays OFF"],
    security_or_credentials: ["Do not paste", "Vercel", "secret"],
  };
  return map[intent] ?? [];
}

function renderMarkdown(payload) {
  const lines = [];
  lines.push(`# Manager Slack Training Candidates - ${payload.generated_at}`);
  lines.push("");
  lines.push(`Channel: \`${payload.channel}\``);
  lines.push(`Lookback: ${payload.lookback_hours} hours`);
  lines.push(`Candidates: ${payload.candidates.length}`);
  lines.push("");
  lines.push("Raw Slack pulls stay in outbox. Promote only sanitized examples into permanent evals.");
  lines.push("");

  for (const candidate of payload.candidates) {
    lines.push(`## ${candidate.id}`);
    lines.push("");
    lines.push(`Intent: \`${candidate.detected_intent}\``);
    lines.push(`Response found: ${candidate.response_found ? "yes" : "no"}`);
    lines.push("");
    lines.push("Command:");
    lines.push("");
    lines.push("```text");
    lines.push(candidate.command);
    lines.push("```");
    lines.push("");
    if (candidate.manager_response) {
      lines.push("Manager response:");
      lines.push("");
      lines.push("```text");
      lines.push(candidate.manager_response.slice(0, 1200));
      lines.push("```");
      lines.push("");
    }
    lines.push("Suggested eval starter:");
    lines.push("");
    lines.push("```json");
    lines.push(JSON.stringify(candidate.suggested_eval, null, 2));
    lines.push("```");
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function cleanSlackText(text) {
  return String(text)
    .replace(/<@[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function normalize(text) {
  return cleanSlackText(text).toLowerCase().replace(/\s+/g, " ").trim();
}

function firstAllowedChannel() {
  return (process.env.SLACK_AGENT_ALLOWED_CHANNEL_IDS ?? DEFAULT_CHANNEL)
    .split(",")
    .map((item) => item.trim())
    .find(Boolean) ?? DEFAULT_CHANNEL;
}

function timestamp() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}-${get("minute")}-${get("second")}`;
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function loadEnv(envPath) {
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = rest.join("=").trim().replace(/^"(.*)"$/, "$1");
  }
}

function printHelp() {
  console.log(`
Manager Slack training candidate harvester.

Examples:
  npm run agent:slack-candidates
  npm run agent:slack-candidates -- --hours 24
  npm run agent:slack-candidates -- --channel C0ATTA4NBR8 --limit 200

Notes:
  - Requires SLACK_BOT_TOKEN.
  - Writes raw candidates to docs/client-ops-ledger/outbox, which is gitignored.
  - Review and sanitize before adding examples to docs/agentops/manager-eval-scenarios.json.
`);
}

