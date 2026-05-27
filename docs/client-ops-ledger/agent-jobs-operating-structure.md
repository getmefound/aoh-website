# Agent Jobs Operating Structure

Status: active recommendation
Owner: Manager
Recorded: 2026-05-27

## Recommendation

Use Monday to mirror the business journey, not the VPS folder tree.

The VPS/client folders should mirror each client account and proof storage. Monday should show who owns the next action, what stage the work is in, whether a human is needed, and where proof lives.

Do not create one Monday board per client. At 50 clients that becomes impossible to scan. Use one company-wide `Agents Jobs` board with client columns, lifecycle groups, saved views, and proof links.

## Board System

| Layer | Tool | Purpose |
|---|---|---|
| Owner work queue | Monday `Agents Jobs` | Every agent/human job, organized by journey stage |
| Client account memory | Client registry + VPS/Drive folders | One stable client record and folder per client |
| Owner reporting | Mission Control | Summary reports, blockers, client health, revenue picture |

Slack is not the system of record. Slack is for job-sent notices, human-needed alerts, and on-demand questions.

## Monday Groups

Groups should follow the client/company journey:

1. Human Needed
2. 01 Prospecting - Cold Email
3. 02 Sales & Signup
4. 03 Client Onboarding
5. 04 Launch / First 14 Days
6. 05 Recurring Runs
7. 06 Client Success / Reports
8. 07 Upsell / Expansion
9. 08 Systems / Incidents
10. Done

Use `Recurring Runs`, not `Cron`, in owner-facing views. Cron is an implementation detail. Recurring Runs means daily, weekly, monthly, or event-triggered agent jobs.

## Client Folder Mirror

Every paying client should get a stable `Client ID` before agents touch the account.

Recommended client ID:

```text
GMF-0001
```

Recommended folder slug:

```text
GMF-0001-client-name
```

Recommended VPS folder pattern:

```text
/root/gmf-clients/GMF-0001-client-name/
```

Suggested subfolders:

```text
01-intake
02-access
03-assets
04-workflows
05-proof
06-reports
07-exports
99-archive
```

Monday stores the `Client ID`, `Client Name`, and `Client Folder` path. The folder stores assets, reports, proof, exports, and recovery material.

## Journey Map

### 01 Prospecting - Cold Email

Purpose: get clients.

Examples: Smartlead readiness, cold email seed campaign, social watchlist, lead list build, reply sorting, booked-call handoff.

For now this group is cold-email only. Keep other prospecting channels, such as social prospecting or partnerships, out of this group until Mike approves expanding the prospecting engine.

Prospecting jobs should usually leave `Client ID`, `Client Name`, and `Client Folder` blank. Those fields start after a prospect becomes a paying client.

Primary agents: Manager, Sales Manager, Scout, Sender, Coach, Sorter, Booker, Reporter.

### 02 Sales & Signup

Purpose: convert prospect to paying client.

Examples: discovery call prep, proposal packet, checkout/payment verification, plan assignment, onboarding intake link, client folder/client ID creation.

Primary agents: Manager, Sales Manager, Client Success, Systems Director.

### 03 Client Onboarding

Purpose: get access and prepare safe execution.

Examples: Google Business Profile access, review link capture, customer list/upload path, sender/domain readiness, A2P readiness, client hub setup, baseline visibility report.

Primary agents: Manager, Profile Manager, Reviews Manager, Systems Director, Auditor.

### 04 Launch / First 14 Days

Purpose: complete first value delivery.

Examples: Get Found setup, first email review request setup, first GBP post, proof page/client hub check, first report delivered, first safety audit.

Primary agents: Profile Manager, Reviews Manager, Auditor, Reporter, Client Success.

### 05 Recurring Runs

Purpose: scheduled upkeep.

Examples: weekly GBP post, review request readiness, weekly visibility drift check, review monitoring, monthly report generation, monthly AEO/citation check, recurring safety audit.

Primary agents: Profile Manager, Reviews Manager, Systems Director, Auditor, Reporter, Client Success.

### 06 Client Success / Reports

Purpose: retention and proof.

Examples: monthly client recap, review/sentiment summary, visibility report, at-risk note, renewal prep, support follow-up.

Primary agents: Client Success, Reporter, Coach, Manager.

### 07 Upsell / Expansion

Purpose: grow account value responsibly.

Examples: Stay Found to Review Power recommendation, Review Power to AI Ready recommendation, A2P/SMS upgrade packet, AI voice readiness packet, custom agent/CRM scoping.

Primary agents: Client Success, Sales Manager, Coach, Systems Director, Manager.

### 08 Systems / Incidents

Purpose: keep the machine healthy.

Examples: broken API access, failed deploy, failed scheduled run, backup/security issue, billing/tool problem, data mismatch, HighLevel AI feature risk.

Primary agents: Systems Director, Auditor, Manager.

## Service Lines

Use these service-line labels:

- Prospecting
- Get Found
- Stay Found
- Review Power
- AI Ready Bundle
- Presence Refresh
- Social Reach
- Owner Morning Brief
- Systems
- Client Success
- Upsell

## Views Mike Should Use

Start with these saved views in Monday:

- Human Needed
- Today / Overdue
- Prospecting Engine
- Client Launches
- Recurring Runs
- At Risk
- By Client
- Done This Week

## Slack Rule

Manager may notify Slack when:

- a new job is sent or assigned
- human involvement is needed
- a job is blocked by access, spend, reputation, billing, legal, or client risk
- a report is ready for Mike

Routine status changes stay in Monday unless Mike asks.

## Mission Control Rule

Mission Control should summarize:

- what agents are doing today
- human-needed blockers
- client health
- recurring run health
- prospecting funnel
- revenue, churn risk, and upsell opportunities

It should not duplicate every Monday row.
