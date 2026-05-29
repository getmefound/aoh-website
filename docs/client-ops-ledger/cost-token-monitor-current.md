# Cost And Token Monitor

Date: 2026-05-29
Prepared by: Systems Director
Reviewer: Auditor
Improvement owner: Agent Ness

## Current Status

- Owner: Systems Director owns daily token/tool-cost monitoring.
- Reviewer: Auditor checks missing telemetry, unexpected spend, and cost-risk drift.
- Improvement owner: Agent Ness turns repeated waste, stalled loops, or inefficient agent work into improvement recommendations.
- OpenAI token status: Limited. `OPENAI_API_KEY` exists locally, but no OpenAI org billing/admin telemetry or Langfuse-style token feed is configured in the repo runtime.
- Actual token spend: Not truthfully available from local repo evidence yet.

## Current Estimate

- Estimated recurring agent/job cost ledger: about $7.27/day.
- Estimated local-ledger spend through 2026-05-29: about $114.97.
- Estimated operating/data spend needed through 2026-06-01: about $24.81, assuming the existing tool stack stays active and Outscraper remains capped at the configured $3/run.
- Live sends: $0 incremental campaign send spend recorded from the recent dry runs; SmartLead remains paused until approval.
- Homepage visibility report implementation: no live Resend email or paid Outscraper/NeverBounce production submission was triggered during the code/build verification.

## Rules

- Do not mark token costs green until actual billing/token telemetry is connected.
- Do not expose secret values in cost reports.
- Use estimates only when the report clearly labels them as estimates.
- Escalate to Mike only for new spend, cap increases, unexpected charges, or vendor billing risk.

## Next Monitor Step

Systems Director should connect a read-only billing/token telemetry source, then Auditor should compare actual OpenAI/vendor spend against the local estimate before the morning brief marks cost telemetry Live.
