# Monday Prospecting Core Setup

Status: live Monday board connected; expanding into company-wide Agent Jobs board
Owner: Manager
Recorded: 2026-05-27

## Board

Board name: Agents Jobs

Live board name: Agents Jobs

Live board ID: `18415045648`

Purpose: owner-visible work board for prospecting, signup, onboarding, launch, recurring runs, reports, upkeep, upsell, incidents, approvals, blockers, due dates, and proof links.

## Suggested Groups

- Human Needed
- 01 Prospecting - Cold Email
- 02 Sales & Signup
- 03 Client Onboarding
- 04 Launch / First 14 Days
- 05 Recurring Runs
- 06 Client Success / Reports
- 07 Upsell / Expansion
- 08 Systems / Incidents
- Done

## Suggested Columns

| Column | Type | Purpose |
|---|---|---|
| Item | Name | Plain-English job title |
| Status | Status | Human Needed, Agent Working, Blocked, Ready, Done |
| Owner | Person/Text | Human or agent owner |
| Priority | Status | High, Medium, Low |
| Due Date | Date | When next movement is expected |
| Human Needed | Status | Yes or No |
| System | Text | Smartlead, Mission Control, Slack, Langfuse, Vercel, etc. |
| Proof Link | Link/Text | Report, commit, trace, or runbook proof |
| Next Action | Long Text | What happens next |
| Notes | Long Text | Short context |
| Client ID | Text | Stable client/account ID |
| Client Name | Text | Business/client name |
| Lifecycle | Status | Journey stage |
| Service Line | Status | Offer/service line |
| Job Type | Status | Work type |
| Cadence | Status | One-time, daily, weekly, monthly, or event-triggered |
| Risk Level | Status | Low, medium, high |
| Approval Type | Status | None, Mike, client, technical, spend |
| Reviewer | Text | Auditor/reviewer role |
| Client Folder | Text | VPS/Drive/client folder path |
| Source / Trigger | Text | Why the job exists |
| Mission Control | Link | Owner-facing report/view |
| Langfuse Trace | Link | Agent trace/debug proof when needed |

## Item #1

Item: Refresh Smartlead API access

Live item ID: `12115656169`

Group: Human Needed

Status: Human Needed

Owner: Mike

Priority: High

Due Date: 2026-05-27

Human Needed: Yes

System: Smartlead

Proof Link: `docs/client-ops-ledger/prospecting-smartlead-preflight-current.md`

Next Action: Generate/confirm a valid Smartlead API key, store it securely, add it locally and in Vercel production, then re-run `npm run prospecting:preflight`.

Notes: This is the first prospecting job because live Smartlead sends must not run until API access and warmup readiness are proven.

## Current Core Setup Items

| Item | Monday ID | Group | Status |
|---|---:|---|---|
| Refresh Smartlead API access | `12115656169` | Human Needed | Human Needed |
| Connect Monday API to agents | `12115707896` | Done | Done |
| Build prospecting Mission Control reports | `12115719355` | 01 Prospecting - Cold Email | Agent Working |

## Current Integration Status

`MONDAY_API_TOKEN` is configured locally in `.env.local` and was used to create the live `Agents Jobs` board and the first human-needed job.

The token is not committed to git. Agents must use an approved local script or internal endpoint to write to Monday rather than carrying the raw token in prompts or notes.

Approved local writer:

```bash
npm run monday:agent-job
```

Allowed writer roles:

- Manager
- Systems Director
- Reporter

Scout, Sender, Coach, Sorter, Booker, and other specialist agents must report through Manager or a controlled workflow. They should not carry `MONDAY_API_TOKEN`.

Verified behavior:

- `Manager` can create/update items.
- `Reporter` can create/update items.
- `Scout` is blocked from writing directly.
- Manager can notify Slack when a job is sent by adding `--notify-slack`.
- Slack job notifications go to `#04-gmf-ops` through `SLACK_BOT_TOKEN`.

The import-ready row remains saved in `docs/client-ops-ledger/monday-prospecting-core-setup-import.csv` as fallback documentation.

## Script Examples

List visible jobs:

```bash
npm run monday:agent-job -- --action list
```

Ensure groups and columns exist:

```bash
npm run monday:agent-job -- --action setup --role Manager
```

Create or update the first human-needed item:

```bash
npm run monday:agent-job -- --action create --role Manager --name "Refresh Smartlead API access" --group "Human Needed" --status "Human Needed" --owner Mike --agent-owner "Manager / Systems Director" --system Smartlead --human-needed yes --priority High --due 2026-05-27 --budget 0 --proof "https://github.com/mje-gmf/website/blob/main/docs/client-ops-ledger/prospecting-smartlead-preflight-current.md" --proof-text "Smartlead preflight report" --next-action "Refresh the Smartlead API key, add it locally and in production, then rerun npm run prospecting:preflight." --upsert
```

Notify Slack when Manager sends a new job:

```bash
npm run monday:agent-job -- --action create --role Manager --name "Build prospecting Mission Control reports" --group "01 Prospecting - Cold Email" --status "Agent Working" --agent-owner "Reporter / Systems Director" --system "Mission Control" --lifecycle "01 Prospecting - Cold Email" --service-line "Prospecting" --job-type "Reporting" --human-needed no --notify-slack --upsert
```

Full journey structure: `docs/client-ops-ledger/agent-jobs-operating-structure.md`.
