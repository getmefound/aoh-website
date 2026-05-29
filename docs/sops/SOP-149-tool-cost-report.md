# SOP 149 - Tool cost report

Status: Drafted
Version: 0.3
Owner: Systems Director
Reviewer: Auditor
Approver: SOP owner
Effective date: Set when Active
Next review: Set when Active
Source of truth: `docs/sops/SOP-149-tool-cost-report.md`

## Purpose

Make the `Tool cost report` workflow repeatable, auditable, and safe to delegate.

## Covered Master Map Rows

- Tool cost report

## Scope

This SOP covers daily and month-end cost visibility for AI tokens, recurring agent jobs, prospecting data, sending infrastructure, email delivery, database/runtime tools, and related vendor spend. It is a controlled draft and must pass SOP 000 testing gates before it can become Active.

## Trigger

- Daily morning brief
- Month end
- New vendor/API connection
- New paid campaign, cap increase, or scale decision
- Unexpected usage, billing alert, failed cost check, or suspected runaway agent loop

## Expected Output

- Morning Brief cost/token pulse
- Current estimated vs. actual spend status
- OpenAI/token telemetry status
- SmartLead, Outscraper, NoBounce/NeverBounce, Resend, Supabase, Vercel, and AI cost view
- Any Mike-needed spend approval, cap increase, billing risk, or anomaly clearly routed

## Roles

| Role | Responsibility |
|---|---|
| Owner | Systems Director owns daily token/tool-cost monitoring and keeps this SOP current |
| Operator | Systems Director or assigned cost-monitor agent performs checks and reports gaps or blockers |
| Reviewer | Auditor checks proof, quality, missing telemetry, and risk controls |
| Improvement Owner | Agent Ness reviews waste, inefficient loops, and recurring cost/process improvements |
| Approver | SOP owner approves activation or material changes |

## Hard Rules

- Do not mark token or vendor spend green unless actual telemetry or invoice evidence is connected.
- Label estimates as estimates. Do not present local estimates as vendor invoices.
- Do not expose secret values, API keys, OAuth tokens, passwords, signing secrets, or sensitive billing details in docs, Slack, Monday, or Mission Control.
- Do not delete, rotate, revoke, downgrade, or replace credentials without explicit Mike approval and the credential-safety checklist.
- Do not increase spend caps, run paid enrichment at scale, resume prospect sends, or add paid seats/domains without the required approval gate.
- Do not perform client/prospect-facing action unless this SOP and required approvals allow it.
- Do not guarantee rankings, reviews, revenue, Google outcomes, AI visibility, approval timelines, or deliverability results.
- Stop and route risk before acting when billing, legal/privacy, reputation, access, deliverability, public claims, or live sends are involved.
- Money, refund, payout, pricing, vendor, and spend exceptions require Manager/Mike approval as defined by SOP 000.

## Procedure

1. Load the Morning Brief cost pulse and confirm the owner, reviewer, and improvement owner are visible.
2. Check whether actual token telemetry is available: OpenAI billing/admin API, usage export, Langfuse-style trace costs, or another approved token ledger.
3. If actual telemetry is missing, mark OpenAI/token status `Limited` and keep using local estimates only as estimates.
4. Check the local recurring-job ledger in `lib/control/job-costs.ts` for estimated daily burn, total estimate, job owner, and status.
5. Check prospecting budget controls in `config/gmf-prospecting.config.json`, including Outscraper run cap, review-scraper ban, NoBounce/NeverBounce verification, and SmartLead pause/approval state.
6. Check vendor/runtime status without exposing secrets: SmartLead, Outscraper, NoBounce/NeverBounce, Resend, Supabase, Vercel, Slack, Gmail, and OpenAI.
7. Compare actual telemetry, if available, against estimates. Flag unexplained variance, runaway loops, failed retries, duplicate sends, or unexpected paid API calls.
8. Record the daily result in `docs/client-ops-ledger/cost-token-monitor-current.md` and surface the summary on Morning Brief.
9. If there is a spend/cap/billing/credential risk, Manager escalates the smallest exact owner-needed ask to Mike by Slack DM.
10. Agent Ness turns repeated waste or inefficient process into a business-improvement recommendation.

## Required Proof

- Morning Brief cost/token pulse visible
- `docs/client-ops-ledger/cost-token-monitor-current.md`
- Local estimate source: `lib/control/job-costs.ts`
- Prospecting cap source: `config/gmf-prospecting.config.json`
- Token telemetry source and status, or explicit `Limited` note if actual telemetry is not connected
- SmartLead/Outscraper/NoBounce/NeverBounce/Resend/Supabase/Vercel/OpenAI status evidence where available
- Work record or Monday item
- Date/time, owner, and status
- Configuration/check result, non-secret logs, and rollback note when relevant
- Blocker/escalation note if not complete

## What To Log

- Status: pass, watch, blocked, done, held, or escalated
- Owner/operator
- Related client, prospect, partner, system, report, or financial record
- Output/proof link
- Next owner and due date
- Exception or escalation reason, if any
- Whether the number is actual telemetry, vendor invoice, or local estimate
- Whether Mike approval is needed for spend, cap, credential, or billing action

## Communication Rule

Use GMF-safe language. Keep messages short, specific, and tied to observable facts. Do not send client/prospect-facing communication from this SOP unless the owner role is authorized to do so and all required approvals exist.

## Mike Escalation Rule

Escalate to Mike only for pricing, offers, refunds, billing, commissions, tool spend, legal/privacy risk, reputation risk, public promises, credential ownership, HighLevel AI feature toggles, live prospecting clearance, direct checkout, agentic checkout, payments, or merchant-of-record risk.

## Failure Or Blocker Handling

1. Stop unsafe action.
2. Record what failed or what is missing.
3. Assign the blocker to the correct owner.
4. Notify Manager if timeline, client/prospect experience, billing, access, reputation, or live-send safety is affected.
5. Notify Mike only if the Mike escalation rule applies.
6. Mark this SOP Needs Update if the documented process caused the failure.

## Review And Testing

| Gate | Status |
|---|---|
| Desktop review | In progress |
| Dry run | In progress |
| Live pilot | Pending |
| Audit | Pending |
| Release | Pending |

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded into first-pass role-specific controlled draft | Coach |
| 0.3 | 2026-05-29 | Added daily Morning Brief token/tool-cost monitor ownership, actual-vs-estimate rules, and Agent Ness improvement loop | Systems Director |

## Source Documents

- `docs/GMF_SOP_MASTER_MAP.md`
- `docs/GMF_SOP_VISUAL_MAP.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`
