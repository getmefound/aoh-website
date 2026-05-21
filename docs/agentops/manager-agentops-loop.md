# Manager AgentOps Loop

Status: v1 safe foundation  
Owner: Manager  
Reviewer: Systems Director + Codex  
Last updated: 2026-05-21

## Purpose

Replace the manual copy/paste training loop with a repeatable loop that can be tested from the repo.

Current manual loop:

```text
Mike asks Slack
Manager answers
Mike copies issue to Codex
Codex edits docs/code
Mike tests again
```

Target loop:

```text
Slack command or eval scenario
-> Manager creates a structured task packet
-> Manager routes to the right agent or workflow
-> response is checked against scenarios
-> result is logged
-> lessons become versioned doc/code changes
-> GitHub runs evals before changes ship
```

## Operating Rules

- Manager does not randomly learn from chat history.
- Manager improves through versioned files in GitHub.
- Obsidian stays the owner knowledge base; only selected synced docs become runtime/training sources.
- Slack stays the command layer.
- OpenClaw stays the agent runtime.
- Codex stays the implementation and repair layer.
- HighLevel AI features stay OFF unless Mike manually authorizes them.

## Versioned Files

| File | Job |
|---|---|
| `docs/aoh-agentops-current-state-review.md` | Current-state review and known bottlenecks. |
| `docs/agentops/manager-task-packet-template.md` | Standard packet Manager should create before routing work. |
| `docs/agentops/manager-routing-table.json` | Versioned intent-to-owner routing map. |
| `docs/agentops/manager-eval-scenarios.json` | Test cases for Manager behavior. |
| `docs/agentops/manager-training-change-template.md` | Template for proposing a training/runbook/code change. |
| `scripts/manager-agent-eval.mjs` | Local eval runner. |

## Commands

Run all Manager evals:

```bash
npm run agent:eval
```

Run one scenario:

```bash
npm run agent:eval -- --scenario owner_run_today
```

List scenarios:

```bash
npm run agent:eval -- --list
```

Pull recent Slack Manager questions as training candidates:

```bash
npm run agent:slack-candidates
npm run agent:slack-candidates -- --hours 24
```

This writes raw candidate files to `docs/client-ops-ledger/outbox`, which is intentionally gitignored. Review and sanitize them before adding permanent examples to `docs/agentops/manager-eval-scenarios.json`.

If the local machine does not have `SLACK_BOT_TOKEN`, run the GitHub Action:

```text
Actions -> Manager Slack Training Candidates -> Run workflow
```

That uploads the raw candidate files as a workflow artifact instead of committing private Slack text.

## Pass/Fail Meaning

An eval pass means Manager's current local command response still matches the minimum owner, routing, and safety expectations for that scenario.

An eval fail means one of these needs to change:

- the Manager response code
- the routing table
- the eval scenario
- the source ledger/doc the response is reading from

Do not "fix" an eval by weakening it unless the business rule changed.

## First Use

Use this loop before changing Manager behavior:

1. Add or update a scenario in `docs/agentops/manager-eval-scenarios.json`.
2. Run `npm run agent:eval`.
3. Update docs/code.
4. Run `npm run agent:eval` again.
5. Commit the scenario and the fix together.

Use this loop for real Slack questions:

1. Run `npm run agent:slack-candidates`.
2. Review the outbox summary.
3. Promote only useful, sanitized questions into `docs/agentops/manager-eval-scenarios.json`.
4. Run `npm run agent:eval`.
5. Fix Manager if needed, then commit the eval and fix together.
