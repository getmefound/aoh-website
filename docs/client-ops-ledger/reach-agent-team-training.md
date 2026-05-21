# Reach Agent Team Training

Purpose: move recurring Reach work from Codex/operator cleanup to the agent team.

Codex should train, repair, and improve the system. The AOH agents should run the daily job, explain the status, own blockers, and bring Mike only real business decisions.

## Current Rule

The Reach Warmup Autopilot is approved for normal daily operation inside guardrails.

- Reviews and AI Visibility can run when ready.
- Relay waits until it has enough clean contacts and `ready_for_drip=yes`.
- New Outscraper calls can run inside the configured caps.
- HighLevel AI features stay OFF.
- Manual overrides still need a clear approval path.

## Agent Ownership

| Agent | Owns | Must do now | Escalates when |
|---|---|---|---|
| Manager | Daily control | Read the warmup summary, explain what happened, assign blockers, and keep Mike out of row decisions. | Spend cap, tool failure, or live-action exception is needed. |
| Scout | Business discovery | Find better businesses first, rotate weak searches, and avoid repeating poor searches. | A lane cannot reach the minimum clean count inside the cap. |
| Sender + verifier | Email quality | Verify before import/start and remove bad, unknown, catchall, duplicate, or personal-risk rows. | Verification quality is too low or selected rows fall below minimum. |
| Sales Manager | List quality | Decide if the businesses are worth contacting and hold questionable rows. | Niche, offer, or row quality needs human judgment. |
| GHL Expert | Send readiness | Confirm sender domain, workflow sender nodes, tags, warmup status, and HighLevel AI toggles OFF. | `ready_for_drip` should stay no or GHL screens do not match the lane. |
| Systems Director | Automation safety | Watch GitHub workflows, cron timing, API access, costs, caps, and same-day rerun behavior. | Caps need to increase, credentials fail, or workflows repeatedly fail. |
| Sorter | Reply handling | Classify interested, book call, send info, bad fit, unsubscribe, and unclear replies. | Replies are warm, risky, or unclear. |
| Booker | Booked calls | Move interested replies to the calendar with clean context. | Calendar availability or handoff context is unclear. |

## Training Commands

Use these in Slack or locally:

```text
Manager, train Reach team
Manager, run Reach Cold Email Campaign
Manager, explain the Reach result
Sales Manager, review Reach QA
GHL Expert, check Reach readiness
Systems Director, check risks before this campaign
Scout, what prospect lane should we test next
Sender, prepare the next import-only plan
```

Local equivalents:

```bash
npm run agent:command -- --command "Manager, train Reach team"
npm run agent:command -- --command "Manager, run Reach Cold Email Campaign"
npm run agent:command -- --command "Sales Manager, review Reach QA"
npm run agent:command -- --command "GHL Expert, check Reach readiness"
```

## What Codex Should Stop Doing Manually

Codex should not be the normal daily operator for:

- reading every warmup report for the team
- telling Mike basic lane status
- deciding when a normal capped refill should run
- explaining the same ready/not-ready blocker repeatedly
- manually updating MC when the ledger already has the answer

Codex should step in for:

- broken workflows
- unclear automation behavior
- missing telemetry
- better cost controls
- new agent training
- new client/job types

## Today's Training Result

As of 2026-05-21:

- Reviews started warmup with 12 OK contacts.
- AI Visibility started warmup with 20 OK contacts.
- Relay ran capped refill, reached 5 OK contacts, and still needs 10.
- Relay will rotate to the next configured searches on the next auto run.
- The runner now preserves executed reports on same-day reruns.

