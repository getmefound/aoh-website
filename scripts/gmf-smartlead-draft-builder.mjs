#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const API_BASE = "https://server.smartlead.ai/api/v1";
const CONFIG_PATH = "config/gmf-prospecting.config.json";

main().catch((error) => {
  console.error(error instanceof Error ? sanitize(error.message) : error);
  process.exitCode = 1;
});

async function main() {
  loadEnv(".env.local");
  loadEnv(".env");

  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const config = readJson(String(args.config ?? CONFIG_PATH));
  const date = String(args.date ?? todayEastern());
  const outbox = String(config.reporting?.outbox ?? "docs/client-ops-ledger/outbox");
  mkdirSync(outbox, { recursive: true });

  const sequenceOnly = Boolean(args["sequence-only"]);
  const readyCsv = sequenceOnly ? "" : String(args.csv ?? latestPath("tmp-gmf-prospecting-smartlead-ready-*.csv"));
  const sequenceJson = String(args.sequence ?? latestPath(`${outbox.replaceAll("\\", "/")}/gmf-prospecting-sequence-*.json`));
  const rows = sequenceOnly ? [] : readCsv(readyCsv);
  const sequence = readJson(sequenceJson);
  const validation = validatePacket({ rows, sequence, config, sequenceOnly });
  const payloads = buildPayloads({ rows, sequence, config, args, date });
  const apply = Boolean(args.apply);
  const canApply = apply && isApplyApproved(args);
  const actions = [];

  if (apply && !canApply) {
    validation.blockers.push("apply_requires_GMF_SMARTLEAD_APPLY_OK_yes_and_approval_note");
  }

  if (canApply && validation.blockers.length === 0) {
    actions.push(...(await applySmartleadDraft({ payloads, args, config, rows })));
  }

  const paths = writeOutputs({ date, outbox, config, payloads, validation, rows, sequence, apply, actions });
  const report = renderReport({ date, readyCsv, sequenceJson, config, rows, validation, payloads, apply, canApply, actions, paths });
  writeText(config.reporting?.currentSmartleadDraftReport ?? "docs/client-ops-ledger/gmf-smartlead-draft-current.md", report);
  const datedReport = resolve(outbox, `gmf-smartlead-draft-${date}.md`);
  writeText(datedReport, report);

  console.log(JSON.stringify(
    {
      ok: validation.blockers.length === 0,
      mode: canApply ? "apply" : "dry_run",
      readyCsv: readyCsv ? resolve(readyCsv) : "",
      sequenceJson: resolve(sequenceJson),
      leadCount: rows.length,
      blockers: validation.blockers,
      warnings: validation.warnings,
      currentReport: resolve(config.reporting?.currentSmartleadDraftReport ?? "docs/client-ops-ledger/gmf-smartlead-draft-current.md"),
      datedReport,
      payloads: paths,
      actions,
    },
    null,
    2,
  ));

  if (validation.blockers.length) process.exitCode = 1;
}

function buildPayloads({ rows, sequence, config, args, date }) {
  const campaignName = String(args.name ?? sequence.name ?? `GMF Visibility Engine Seed - ${date}`);
  const senderEmails = [...new Set(rows.map((row) => row.assigned_sender).filter(Boolean))];
  const minBetween = chooseMinBetween(config, date);
  const maxPerDay = Math.min(number(config.smartlead?.earlyLaunchMaxNewProspectsPerDay ?? 30), rows.length);

  return {
    campaign: {
      name: campaignName,
      status: "DRAFTED",
    },
    sequence: {
      sequences: buildGapBasedSequences(config),
    },
    leads: {
      lead_list: rows.map((row) => {
        const businessName = leadField(row, "business_name", "company_name", "name");
        const ownerFirstName = leadField(row, "owner_first_name", "first_name") || "there";
        return {
          email: row.email,
          first_name: ownerFirstName,
          company_name: businessName,
          phone_number: leadField(row, "phone_number", "phone"),
          website: row.website,
          company_url: row.website,
          location: row.location || [row.city, row.state].filter(Boolean).join(", "),
          custom_fields: {
            owner_first_name: ownerFirstName,
            business_name: businessName,
            city: row.city,
            state: row.state,
            category: row.category,
            niche_tier: row.niche_tier,
            segment: row.segment,
            single_gap: row.single_gap,
            worst_gap: row.worst_gap,
            gap_hook: row.gap_hook,
            visibility_score: row.visibility_score,
            report_url: row.report_url,
            review_count: row.review_count,
            days_since_last_review: row.days_since_last_review,
            rating: row.rating,
            photos_count: row.photos_count,
            hours_present: row.hours_present,
            competitor_name: row.competitor_name,
            competitor_review_count: row.competitor_review_count,
            assigned_sender: row.assigned_sender,
            assigned_sender_domain: row.assigned_sender_domain,
            launch_batch: `GMF Visibility Engine ${date}`,
          },
        };
      }),
      settings: {
        ignore_global_block_list: false,
        ignore_unsubscribe_list: false,
        ignore_duplicate_leads_in_other_campaign: false,
        ignore_community_bounce_list: false,
        return_lead_ids: true,
      },
    },
    schedule: {
      timezone: config.launch?.timeZone ?? "America/New_York",
      days_of_the_week: [1, 2, 3, 4, 5],
      start_hour: config.launch?.preferredSendWindow?.start ?? "10:00",
      end_hour: config.launch?.preferredSendWindow?.end ?? "12:00",
      min_time_btw_emails: minBetween,
      max_new_leads_per_day: maxPerDay,
    },
    settings: {
      name: campaignName,
      track_settings: [
        config.smartlead?.disableOpenTracking === false ? "" : "DONT_TRACK_EMAIL_OPEN",
        config.smartlead?.disableClickTracking === false ? "" : "DONT_TRACK_LINK_CLICK",
      ].filter(Boolean),
      stop_lead_settings: "REPLY_TO_AN_EMAIL",
      send_as_plain_text: true,
      force_plain_text: true,
      enable_ai_esp_matching: false,
      auto_pause_domain_leads_on_reply: true,
      add_unsubscribe_tag: true,
      max_leads_per_day: maxPerDay,
    },
    senderEmails,
  };
}

function buildGapBasedSequences(config) {
  const footer = `Mike Egidio | GetMeFound, a service of AI Outsource Hub LLC | ${config.brand?.physicalAddress ?? "[mailing address]"} | Not interested? Reply "STOP" and I'll remove you.`;
  const withFooter = (body) => `${body.trim()}\n\n${footer}`;
  return [
    {
      seq_number: 1,
      subject: "quick {{business_name}} note",
      email_body: withFooter(`Hi {{owner_first_name}},

{{gap_hook}}

Here's why it matters: Google and AI like ChatGPT now pick just one or two local {{category}}s to recommend, and it's the most complete, active profile that wins, not the biggest.

I put together a free report showing exactly where {{business_name}} stands. Want it? Just reply "YES."

- Mike`),
      seq_delay_details: { delay_in_days: 0 },
    },
    {
      seq_number: 2,
      subject: "{{business_name}} in {{city}}",
      email_body: withFooter(`Hi {{owner_first_name}},

Circling back on {{business_name}}. When someone in {{city}} asks Google or ChatGPT for a {{category}}, they get one or two names, and a few of your competitors are set up to be those names. The gap closes fast.

Want the free report showing where you stand? Reply "YES."

- Mike`),
      seq_delay_details: { delay_in_days: 3 },
    },
    {
      seq_number: 3,
      subject: "is {{business_name}} invisible to AI?",
      email_body: withFooter(`Hi {{owner_first_name}},

More people skip Google's list and just ask AI "best {{category}} in {{city}}?" It names one or two businesses based on signals most owners never see, and right now {{business_name}} likely isn't one of them.

I'll show you what AI sees, free. Reply "YES."

- Mike`),
      seq_delay_details: { delay_in_days: 4 },
    },
    {
      seq_number: 4,
      subject: "closing this out",
      email_body: withFooter(`Hi {{owner_first_name}},

I've nudged a couple times about {{business_name}}'s visibility, so I'll leave it here. If you ever want that free report, just reply "YES" and it's yours. Either way, all the best.

- Mike`),
      seq_delay_details: { delay_in_days: 4 },
    },
  ];
}

function validatePacket({ rows, sequence, config, sequenceOnly }) {
  const blockers = [];
  const warnings = [];
  const forbiddenDomains = new Set((config.smartlead?.forbiddenSenderDomains ?? []).map((item) => String(item).toLowerCase()));
  const address = String(config.brand?.physicalAddress ?? "");
  const ctaPath = String(config.brand?.ctaPath ?? "/lp/get-found");

  if (!sequenceOnly && !rows.length) blockers.push("ready_csv_empty");
  if (!sequence?.smartleadSettings) warnings.push("sequence_packet_missing_smartlead_settings");

  const emails = new Set();
  for (const [index, row] of rows.entries()) {
    const label = row.email || `row_${index + 1}`;
    if (!isEmail(row.email)) blockers.push(`${label}:invalid_email`);
    if (emails.has(row.email)) blockers.push(`${label}:duplicate_email`);
    emails.add(row.email);
    if (!leadField(row, "business_name", "company_name", "name")) blockers.push(`${label}:missing_business_name`);
    if (!leadField(row, "owner_first_name", "first_name")) blockers.push(`${label}:missing_owner_first_name`);
    if (!row.website) blockers.push(`${label}:missing_website`);
    if (!row.segment) blockers.push(`${label}:missing_segment`);
    if (!row.gap_hook) blockers.push(`${label}:missing_gap_hook`);
    if (!isUrl(row.report_url)) blockers.push(`${label}:missing_report_url`);
    if (!row.assigned_sender) blockers.push(`${label}:missing_assigned_sender`);
    const senderDomain = String(row.assigned_sender_domain || row.assigned_sender.split("@").at(1) || "").toLowerCase();
    if (forbiddenDomains.has(senderDomain)) blockers.push(`${label}:forbidden_sender_domain`);

    if (/\b(canada| ca\b|ontario|quebec|british columbia|alberta)\b/i.test(`${row.country ?? ""} ${row.address ?? ""}`)) {
      blockers.push(`${label}:excluded_canada`);
    }
  }

  for (const step of buildGapBasedSequences(config)) {
    const key = `sequence_${step.seq_number}`;
    const body = String(step.email_body ?? "");
    if (!body) blockers.push(`${key}_missing`);
    if (!body.includes(address)) blockers.push(`${key}_missing_physical_address`);
    if (!/\breply\s+"?stop"?\b|\bopt[- ]?out\b|\bunsubscribe\b/i.test(body)) blockers.push(`${key}_missing_opt_out`);
    if (body.includes(ctaPath)) blockers.push(`${key}_cold_email_contains_cta_link`);
    if (countLinks(body) > 0) blockers.push(`${key}_cold_email_contains_link`);
    if (/\btestimonial\b|\bcase stud(y|ies)\b|\bour customers\b|\bguaranteed ranking\b|\brank #?1\b/i.test(body)) {
      blockers.push(`${key}_disallowed_claim`);
    }
  }

  return { blockers, warnings };
}

async function applySmartleadDraft({ payloads, args, rows }) {
  const apiKey = process.env.SMARTLEAD_API_KEY?.trim();
  if (!apiKey) throw new Error("SMARTLEAD_API_KEY is not set.");

  const actions = [];
  const campaigns = normalizeArray(await smartleadGet("/campaigns/", apiKey));
  let campaign = args["campaign-id"]
    ? campaigns.find((item) => Number(item.id) === Number(args["campaign-id"]))
    : campaigns.find((item) => same(item.name, payloads.campaign.name));

  if (!campaign) {
    const created = await smartleadPost("/campaigns/create", apiKey, { name: payloads.campaign.name });
    actions.push({ step: "create_campaign", response: pickCampaign(created?.campaign ?? created) });
    campaign = created?.campaign ?? created;
  } else {
    actions.push({ step: "create_campaign", skipped: true, reason: "campaign_exists", campaign: pickCampaign(campaign) });
  }

  if (!campaign?.id) throw new Error("Could not resolve SmartLead campaign id.");

  const accounts = normalizeArray(await smartleadGet("/email-accounts/", apiKey));
  const senderAccounts = payloads.senderEmails.map((email) => {
    const account = accounts.find((candidate) => same(candidate.from_email ?? candidate.email, email));
    if (!account) throw new Error(`SmartLead sender account not found: ${email}`);
    return { id: Number(account.id), email };
  });

  const existingSequences = normalizeArray(await smartleadGet(`/campaigns/${campaign.id}/sequences`, apiKey));
  const existingByStep = new Map(existingSequences.map((item) => [Number(item.seq_number), item.id ?? item.seq_id ?? item.sequence_id]));
  const sequencePayload = {
    sequences: payloads.sequence.sequences.map((item) => ({
      id: existingByStep.get(Number(item.seq_number)) ?? null,
      ...item,
    })),
  };
  actions.push({ step: "replace_existing_sequences", existingCount: existingSequences.length, response: await smartleadPost(`/campaigns/${campaign.id}/sequences`, apiKey, sequencePayload) });

  if (!args["sequence-only"]) {
    actions.push({
      step: "link_sender_accounts",
      response: await smartleadPost(`/campaigns/${campaign.id}/email-accounts`, apiKey, {
        email_account_ids: senderAccounts.map((account) => account.id),
      }),
    });
  }

  if (!args["sequence-only"]) {
    const existingLeads = normalizeLeads(await smartleadGet(`/campaigns/${campaign.id}/leads`, apiKey));
    const existingEmails = new Set(existingLeads.map((lead) => normalizeEmail(lead.email)));
    const missingRows = rows.filter((row) => !existingEmails.has(normalizeEmail(row.email)));
    if (missingRows.length) {
      const addLeadResponse = await smartleadPost(`/campaigns/${campaign.id}/leads`, apiKey, {
        ...payloads.leads,
        lead_list: payloads.leads.lead_list.filter((lead) => missingRows.some((row) => same(row.email, lead.email))),
      });
      actions.push({ step: "add_leads", count: missingRows.length, response: addLeadResponse });
    } else {
      actions.push({ step: "add_leads", skipped: true, reason: "target_leads_already_exist" });
    }

    actions.push({ step: "update_schedule", response: await smartleadPost(`/campaigns/${campaign.id}/schedule`, apiKey, payloads.schedule) });
  }
  const settings = args["sequence-only"] ? { ...payloads.settings } : payloads.settings;
  if (args["sequence-only"]) delete settings.max_leads_per_day;
  actions.push({ step: "update_settings", response: await smartleadPost(`/campaigns/${campaign.id}/settings`, apiKey, settings) });
  actions.push({ step: "activate_campaign", skipped: true, reason: "GMF builder never activates campaigns; run deliverability audit and get Mike approval first." });

  return actions;
}

function writeOutputs({ date, outbox, config, payloads, validation, rows, sequence, actions }) {
  const payloadPath = resolve(outbox, `gmf-smartlead-draft-payload-${date}.json`);
  const validationPath = resolve(outbox, `gmf-smartlead-draft-validation-${date}.json`);
  writeText(payloadPath, `${JSON.stringify({ payloads, rows: rows.length, sequenceName: sequence.name ?? "", actions }, null, 2)}\n`);
  writeText(validationPath, `${JSON.stringify(validation, null, 2)}\n`);
  return {
    payloadJson: payloadPath,
    validationJson: validationPath,
    currentReport: resolve(config.reporting?.currentSmartleadDraftReport ?? "docs/client-ops-ledger/gmf-smartlead-draft-current.md"),
  };
}

function renderReport({ date, readyCsv, sequenceJson, config, rows, validation, payloads, canApply, actions, paths }) {
  const bySender = countBy(rows, "assigned_sender_domain");
  const bySegment = countBy(rows, "segment");
  const byTier = countBy(rows, "niche_tier");
  return `# GMF SmartLead Draft Builder

Date: ${date}
Mode: ${canApply ? "apply" : "dry run"}
Live sends: no

## Inputs

- Ready CSV: \`${readyCsv ? resolve(readyCsv) : "sequence-only"}\`
- Sequence packet: \`${resolve(sequenceJson)}\`
- Campaign name: ${payloads.campaign.name}
- Cold-email CTA: reply \`YES\` (no cold-email links); report URL is synced only as a SmartLead custom field for the positive-reply auto-response.

## Validation

Status: ${validation.blockers.length ? "HOLD" : "PASS"}

Blockers:
${validation.blockers.map((item) => `- ${item}`).join("\n") || "- None"}

Warnings:
${validation.warnings.map((item) => `- ${item}`).join("\n") || "- None"}

## Campaign Payload Summary

| Item | Value |
|---|---:|
| Leads | ${rows.length} |
| Sequence steps | ${payloads.sequence.sequences.length} |
| Sender inboxes | ${payloads.senderEmails.length} |
| Max new leads/day | ${payloads.schedule.max_new_leads_per_day} |
| Min minutes between emails | ${payloads.schedule.min_time_btw_emails} |

By tier:
${renderCounts(byTier)}

By segment:
${renderCounts(bySegment)}

By sender domain:
${renderCounts(bySender)}

## SmartLead Settings

- Open tracking disabled: ${payloads.settings.track_settings.includes("DONT_TRACK_EMAIL_OPEN") ? "yes" : "no"}
- Click tracking disabled: ${payloads.settings.track_settings.includes("DONT_TRACK_LINK_CLICK") ? "yes" : "no"}
- Plain text: ${payloads.settings.send_as_plain_text ? "yes" : "no"}
- Stop on reply: ${payloads.settings.stop_lead_settings === "REPLY_TO_AN_EMAIL" ? "yes" : "no"}
- Suppression import rules: global blocklist, unsubscribe list, duplicate leads, and community bounce list are honored.
- Activation: blocked by this script.
- Sales Manager capacity gate: campaign activation still requires confirmation that Get Found delivery can stay inside 48 hours.
- Channel doctrine: cold email validates the message first; LinkedIn outbound is excluded.

## Actions

${actions.length ? actions.map((action) => `- ${action.step}: ${action.skipped ? `skipped (${action.reason})` : "completed"}`).join("\n") : "- Dry run only; no SmartLead mutation."}

## Outputs

- Payload JSON: \`${paths.payloadJson}\`
- Validation JSON: \`${paths.validationJson}\`

## Next Gate

Sender may use this packet only to create or inspect a paused SmartLead draft. Before any activation, run:

\`\`\`bash
npm run smartlead:deliverability-audit -- --campaign-id <id>
\`\`\`

Then Auditor reviews the PASS/WATCH/HOLD result and Manager asks Mike for the exact final send approval if no agent-owned blockers remain.
`;
}

async function smartleadGet(path, apiKey) {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  const response = await fetch(url, { headers: { accept: "application/json" } });
  return parseSmartleadResponse(path, response);
}

async function smartleadPost(path, apiKey, body) {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  const response = await fetch(url, {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseSmartleadResponse(path, response);
}

async function smartleadDelete(path, apiKey) {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  const response = await fetch(url, {
    method: "DELETE",
    headers: { accept: "application/json" },
  });
  return parseSmartleadResponse(path, response);
}

async function parseSmartleadResponse(path, response) {
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok) throw new Error(`${path}: ${response.status} ${typeof body === "string" ? body : JSON.stringify(body)}`);
  return body;
}

function isApplyApproved(args) {
  return /^(1|true|yes|approved)$/i.test(String(process.env.GMF_SMARTLEAD_APPLY_OK ?? "")) && Boolean(String(args["approval-note"] ?? "").trim());
}

function chooseMinBetween(config, seed) {
  const range = config.smartlead?.minTimeBetweenEmailsMinutesRange ?? [18, 32];
  const min = number(range[0] ?? 18);
  const max = number(range[1] ?? 32);
  if (max <= min) return min;
  const hash = [...String(seed)].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return min + (hash % (max - min + 1));
}

function latestPath(pattern) {
  const normalized = pattern.replaceAll("\\", "/");
  const slash = normalized.lastIndexOf("/");
  const dir = slash >= 0 ? normalized.slice(0, slash) : ".";
  const filePattern = slash >= 0 ? normalized.slice(slash + 1) : normalized;
  const regex = new RegExp(`^${filePattern.split("*").map((part) => part.replace(/[.+^${}()|[\]\\]/g, "\\$&")).join(".*")}$`);
  const absoluteDir = resolve(dir);
  if (!existsSync(absoluteDir)) throw new Error(`No directory for latest file lookup: ${absoluteDir}`);
  const matches = readdirSync(absoluteDir)
    .filter((name) => regex.test(name))
    .map((name) => resolve(absoluteDir, name))
    .sort();
  const latest = matches.at(-1);
  if (!latest) throw new Error(`No file matched ${pattern}`);
  return latest;
}

function readJson(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) throw new Error(`JSON not found: ${absolute}`);
  return JSON.parse(readFileSync(absolute, "utf8"));
}

function readCsv(path) {
  const absolute = resolve(path);
  if (!existsSync(absolute)) throw new Error(`CSV not found: ${absolute}`);
  const raw = readFileSync(absolute, "utf8");
  const rows = parseCsv(raw);
  return rows.filter((row) => Object.values(row).some((value) => String(value).trim()));
}

function parseCsv(raw) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < raw.length; index++) {
    const char = raw[index];
    const next = raw[index + 1];
    if (quoted && char === '"' && next === '"') {
      field += '"';
      index++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ",") {
      row.push(field);
      field = "";
    } else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift()?.map((item) => item.trim()) ?? [];
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function writeText(path, text) {
  mkdirSync(dirname(resolve(path)), { recursive: true });
  writeFileSync(path, text);
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = String(row[key] || "unknown");
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function renderCounts(counts) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return entries.length ? entries.map(([key, value]) => `- ${key}: ${value}`).join("\n") : "- None";
}

function countLinks(value) {
  return [...String(value ?? "").matchAll(/https?:\/\/[^\s<>"')]+/g)].length;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? ""));
}

function isUrl(value) {
  try {
    const url = new URL(String(value ?? ""));
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function leadField(row, ...keys) {
  for (const key of keys) {
    const value = row?.[key];
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return "";
}

function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.campaigns)) return value.campaigns;
  return [];
}

function normalizeLeads(value) {
  return normalizeArray(value).map((row) => ({
    id: row.lead?.id ?? row.id ?? row.lead_id ?? row.email_lead_id,
    email: row.lead?.email ?? row.email ?? row.lead_email,
  }));
}

function pickCampaign(campaign) {
  return {
    id: campaign?.id ?? "",
    name: campaign?.name ?? "",
    status: campaign?.status ?? "",
  };
}

function same(a, b) {
  return String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function loadEnv(path) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      index++;
    }
  }
  return args;
}

function todayEastern() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function sanitize(value) {
  return String(value)
    .replace(/api_key=[^&\s]+/gi, "api_key=REDACTED")
    .replace(/SMARTLEAD_API_KEY=[^&\s]+/gi, "SMARTLEAD_API_KEY=REDACTED");
}

function printHelp() {
  console.log(`
Build a guarded SmartLead draft packet from the GMF prospecting ready CSV.

Dry run:
  npm run gmf:smartlead-draft

Use explicit files:
  npm run gmf:smartlead-draft -- --csv tmp-gmf-prospecting-smartlead-ready-2026-05-29.csv --sequence docs/client-ops-ledger/outbox/gmf-prospecting-sequence-2026-05-29.json

Apply to SmartLead as a paused/drafted setup only:
  $env:GMF_SMARTLEAD_APPLY_OK='yes'
  npm run gmf:smartlead-draft -- --apply --approval-note "Auditor approved paused draft setup only"

Replace only the paused campaign drip without uploading leads:
  $env:GMF_SMARTLEAD_APPLY_OK='yes'
  npm run gmf:smartlead-draft -- --sequence-only --campaign-id 3379589 --apply --approval-note "Replace old drip with gap-based no-link sequence"

This script never activates a campaign.
`);
}
