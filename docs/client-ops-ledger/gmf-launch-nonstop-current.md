# GMF Launch Nonstop Runner

Generated: 2026-05-29T18:23:16.701Z
Status: running
Launch date: 2026-06-01

## What Changed Operationally

- Paid Get Found purchases create a high-priority fulfillment task immediately.
- Vercel cron checks the launch queues every 15 minutes and rescues stale free-report deliveries.
- GitHub Actions refreshes safe launch proof every 15 minutes without starting live sends.
- Vague waiting is treated as a defect unless it is access, client, vendor, approval, or a safety timer.

## Artificial Waits To Remove

- None detected in this run.

## True Blockers

- None detected from available local/secret-name evidence.

## Workstreams

| Workstream | Owner | Status | Next action | Proof |
|---|---|---|---|---|
| signup_to_fulfillment | Systems Director + Profile Manager | running_capable | Paid Get Found checkout creates an internal fulfillment task immediately. | lib/free-visibility-report.ts |
| free_visibility_report | Website Automation + Systems Director | running_capable | Homepage form runs automated report email; launch cron rescues stale under-5-minute failures. | app/api/audit-request/route.ts + app/api/launch/nonstop/route.ts |
| cold_email_prep | Sales Manager + Scout + Sender + Auditor | proof_refreshed | Keep refreshing prospecting engine, SmartLead draft, and guardrails until live-send approval packet is ready. | docs/client-ops-ledger/gmf-prospecting-engine-current.md |
| stuck_work_rescue | Manager + Systems Director | scheduled | Every active/waiting item must be runnable, scheduled, manual-audit, access-blocked, or owner-needed with proof. | scripts/manager-agent-watchdog.mjs |
| live_runtime | Systems Director | scheduled | Vercel cron checks live queues every 15 minutes; GitHub Actions refreshes launch proof every 15 minutes. | vercel.json + .github/workflows/gmf-launch-nonstop.yml |

## Safe Commands

| Command | Required | Status | Summary |
|---|---:|---|---|
| gmf_prospecting | Yes | pass | "nurtureJson": "C:\\Users\\micha\\Documents\\aoh-website\\docs\\client-ops-ledger\\outbox\\gmf-prospecting-nurture-2026-05-29.json", / "metricsTemplateCsv": "C:\\Users\\micha\\Documents\\aoh-website\\docs\\client-ops-ledger\\outbox\\gmf-prospecting-metrics-template-2026-05-29.csv" / } / } |
| smartlead_draft | Yes | pass | "currentReport": "C:\\Users\\micha\\Documents\\aoh-website\\docs\\client-ops-ledger\\gmf-smartlead-draft-current.md" / }, / "actions": [] / } |
| guardrails | Yes | pass | "pauseCsv": "C:\\Users\\micha\\Documents\\aoh-website\\docs\\client-ops-ledger\\outbox\\gmf-prospecting-pause-recommendations-2026-05-29.csv", / "summaryJson": "C:\\Users\\micha\\Documents\\aoh-website\\docs\\client-ops-ledger\\outbox\\gmf-prospecting-guardrails-2026-05-29.json" / } / } |
| agent_watchdog | No | pass | "nextAction": "Sales Manager/Auditor require deliverability audit PASS before asking Mike for final live-send approval. WATCH needs Auditor exception; HOLD blocks launch." / } / ] / } |

## Schedule Proof

- Vercel launch cron: yes
- GitHub launch workflow: yes
- Slack agent poll cron: yes

