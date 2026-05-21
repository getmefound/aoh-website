# AOH AgentOps Current-State Review

Date: 2026-05-21  
Owner: Mike Egidio  
Reviewer: Codex  
Scope: Manager-agent training, Slack command flow, OpenClaw/VPS references, Obsidian knowledge, GitHub/Vercel automation, and current safety gaps.

## Executive Summary

AOH already has a real v1 AgentOps layer. Slack can talk to Manager, Mission Control shows agent work, GitHub Actions run recurring Reach and Morning Brief jobs, and Obsidian notes are synced into the repo as training/reference material.

The bottleneck is not "more agents." The bottleneck is that Manager behavior is split across several places:

- live Slack code in `app/api/agent/slack/route.ts`
- local command code in `scripts/agent-command-center.mjs`
- routing/training docs in `docs/`
- Mission Control display data in `lib/control/`
- Obsidian sync notes in `content/coach/obsidian-sync/`

That means Manager can answer basic commands, but there is no single repeatable training and evaluation loop yet. Improving the Manager still depends too much on Mike/Codex manually testing Slack, reading the answer, then editing docs or code.

Best safe next move: keep the current stack and add a versioned Manager training/eval layer around it. Do not rebuild OpenClaw, Slack, Obsidian, or Vercel.

## 1. What Already Exists

### Slack Manager Interface

Current live endpoint:

- `app/api/agent/slack/route.ts`

It supports:

- Slack request verification with signing secret.
- `/manager` slash-style commands.
- Slack Event API messages.
- Vercel Cron polling fallback through `/api/agent/slack?poll=1`.
- Manager notify endpoint for GitHub/Vercel jobs to post back to Slack.
- Direct agent addressing such as `GHL Expert, check Reach readiness`.
- Fast acknowledgement for slower commands.
- GitHub Actions dispatch for Reach warmup autopilot.

Main Slack runbook:

- `docs/client-ops-ledger/slack-agent-command-runbook.md`

Slack app manifest:

- `docs/client-ops-ledger/slack-app-manifest.yml`

### Local Command Center

Current local command runner:

- `scripts/agent-command-center.mjs`

It supports:

- `npm run agent:command -- --command "Manager, status"`
- `npm run agent:brief`
- `npm run agent:slack`
- Slack webhook posting when configured.
- Outbox markdown logging.
- Reach, GHL readiness, model routing, owner peek, morning brief, and approval responses.

### Mission Control

Mission Control pages exist under:

- `app/mike-mc/`
- `app/mike-mc/jobs/`
- `app/mike-mc/jobs/reach-cold-email-campaign/`
- `app/mike-mc/morning-brief/`
- `app/mike-mc/ops/`
- `app/mike-mc/team/`

Supporting data lives in:

- `lib/control/team.ts`
- `lib/control/mission.ts`
- `lib/control/internal-jobs.ts`
- `lib/control/job-costs.ts`
- `lib/control/morning-brief.ts`
- `lib/control/fetchers.ts`

### Agent Operating Docs

Important docs already exist:

- `docs/AGENT_OPERATING_MODEL.md`
- `docs/MANAGER_ROUTING_SKILL_PACK.md`
- `docs/MANAGER_GHL_OVERVIEW_SKILL_PACK.md`
- `docs/client-ops-ledger/aoh-agent-company-operating-model.md`
- `docs/client-ops-ledger/agent-model-routing-policy.md`
- `docs/client-ops-ledger/reach-agent-team-training.md`
- `docs/client-ops-ledger/morning-brief-skill-pack.md`

### Recurring Jobs

GitHub Actions already run or can manually run:

- `.github/workflows/reach-discovery-first.yml`
- `.github/workflows/reach-warmup-autopilot.yml`
- `.github/workflows/reach-manager-check.yml`
- `.github/workflows/morning-brief.yml`
- `.github/workflows/weekly-report-smoke.yml`

Vercel Cron exists:

- `vercel.json` calls `/api/agent/slack?poll=1` every minute.

### Obsidian Sync

Obsidian content is synced into:

- `content/coach/obsidian-sync/`

Sync script:

- `scripts/sync-coach-obsidian.ps1`

The sync manifest shows the latest sync copied key training docs from the local Obsidian vault path.

## 2. What Appears Complete

- Basic Slack-to-Manager command flow is built.
- `/manager` command behavior is documented.
- Slack channel expectations are documented.
- Manager can give basic status, owner peek, agent list, model routing, morning brief, Reach status, Reach run-today status, and GHL readiness responses.
- Direct agent addressing exists at the command-router level.
- Reach autopilot has GitHub workflows, ledgers, outbox logs, and Slack follow-up posts.
- Morning Brief has a generator and GitHub scheduled workflow.
- HighLevel AI safety rule is consistently repeated in docs and command responses.
- Secrets are mostly referenced through env vars and GitHub/Vercel secrets.
- Local `.env*` files are ignored by git.
- The existing `npm run audit:security` sweep passed.

## 3. What Is Missing

### Missing Manager Eval Loop

There is no automated test that says:

- Mike asked this command.
- Manager chose the right owner.
- Manager created the right task packet.
- Manager included only needed context.
- Manager kept unsafe actions blocked.
- Manager gave Mike a short owner-level answer.
- Manager logged the result.
- Manager proposed a versioned improvement when it failed.

### Missing Single Runtime Source Of Truth

Manager routing exists in docs, but production behavior is hard-coded in:

- `app/api/agent/slack/route.ts`
- `scripts/agent-command-center.mjs`

Mission Control has another copy of agent/service ownership in:

- `lib/control/team.ts`
- `lib/control/mission.ts`
- `lib/control/internal-jobs.ts`

This creates drift. A doc can say Manager should route work one way while Slack code routes it another way.

### Missing Structured Task Packet

Manager needs a standard packet before handing work to a child agent:

- request
- intended outcome
- assigned owner
- reviewer
- context allowed
- source files
- tool permissions
- model tier
- budget cap
- approval gate
- verification checklist
- final summary format
- log path

Right now this exists conceptually in docs, but not as a reusable template/eval target.

### Missing Training Change Proposal Flow

There is no standard file/process for:

- what Manager got wrong
- what scenario exposed the mistake
- what doc or code should change
- which eval should be added
- who approves the training change

### Missing OpenClaw Runtime Proof In This Repo

This repo references OpenClaw and provides a login helper, but I did not find the actual OpenClaw agent runtime config for the 20 agents here. That may live on the VPS. If so, this repo cannot fully prove what OpenClaw agents are actually running without a synced/exported config.

## 4. What Is Fragile Or Too Manual

- Manager routing is duplicated between the Slack route and the local command-center script.
- Regex command matching will get brittle as more jobs are added.
- Agent lists differ across Slack code, Mission Control, docs, and operating-model notes.
- Some docs still use older names like Director/Auditor/Profile while newer pages use General Manager/Systems Director/Local Visibility Manager.
- The current loop still requires Mike or Codex to manually notice a bad Slack answer and decide what file to edit.
- Outbox logs are useful, but they are not an evaluation system.
- Mission Control displays work, but it does not yet enforce the handoff packet, proof checklist, or eval result.
- Obsidian is synced as files, but it is not yet a searchable runtime knowledge layer for Manager/GHL Expert.

## 5. Where Manager Is Currently Trained Or Configured

### Live Behavior

- `app/api/agent/slack/route.ts`
  - agent directory
  - command detection
  - Slack responses
  - GHL readiness responses
  - Reach command routing
  - GitHub Actions dispatch

- `scripts/agent-command-center.mjs`
  - local version of many of the same command behaviors
  - local outbox logging
  - Slack webhook posting

### Training/Policy Docs

- `docs/MANAGER_ROUTING_SKILL_PACK.md`
  - how Manager should classify work, route, assign reviewers, and require proof

- `docs/MANAGER_GHL_OVERVIEW_SKILL_PACK.md`
  - what Manager must know about GHL without becoming the GHL Expert

- `docs/client-ops-ledger/aoh-agent-company-operating-model.md`
  - org chart, department ownership, daily flow, job lifecycle

- `docs/client-ops-ledger/agent-model-routing-policy.md`
  - model/cost tiers and escalation rules

- `docs/client-ops-ledger/reach-agent-team-training.md`
  - Reach-specific ownership and training commands

### Display/Owner View

- `lib/control/mission.ts`
- `lib/control/team.ts`
- `lib/control/internal-jobs.ts`

These power Mission Control but are not currently the same source Manager uses to route Slack commands.

## 6. How Slack Currently Connects To Manager

Slack routes to:

- `https://aioutsourcehub.com/api/agent/slack`

The route supports:

- form payloads for slash commands
- JSON payloads for Slack Events
- Slack URL verification
- request signature verification
- allowed-channel checks
- async follow-up for slower commands
- Manager notify posts from GitHub/Vercel jobs
- cron polling fallback when Slack Events are not enough

Important env vars documented:

- `SLACK_SIGNING_SECRET`
- `SLACK_BOT_TOKEN`
- `MANAGER_NOTIFY_TOKEN`
- `REPORT_TEST_BYPASS_TOKEN`
- `AOH_OWNER_SLACK_USER_ID`
- `SLACK_AGENT_ALLOWED_CHANNEL_IDS`
- `CRON_SECRET`

## 7. How OpenClaw Agents Are Structured

In this repo, OpenClaw is treated as the agent runtime and live Mission Control target:

- `docs/client-ops-ledger/aoh-agent-company-operating-model.md`
- `docs/LAPTOP_DEATH_RECOVERY.md`
- `docs/BACKUP_READINESS_CHECKLIST.md`
- `docs/AOH_OPERATIONS_INDEX.md`

The public website includes an OpenClaw login helper:

- `app/api/openclaw/login/route.ts`

The actual OpenClaw agent definitions/configuration do not appear to be stored in this repo. The practical agent hierarchy is currently represented in docs and Mission Control code, not a verified OpenClaw export.

Implication: Manager can be trained in this repo, but verifying that OpenClaw is running the same instructions likely requires a VPS/OpenClaw config export or read-only status pull.

## 8. How GitHub, Vercel, And Codex Are Currently Involved

### GitHub

GitHub is already the versioned source for:

- docs
- Mission Control pages
- agent scripts
- Reach workflows
- Morning Brief workflow
- smoke tests

GitHub Actions can run recurring jobs and post back to Slack.

### Vercel

Vercel hosts:

- the public website
- Mission Control pages
- Slack HTTP listener
- OpenClaw login helper
- report/reply-router APIs
- Vercel Cron polling fallback

### Codex

Codex is currently the implementation and repair layer:

- edits repo files
- updates docs
- changes scripts/routes/pages
- runs tests/builds
- commits/pushes/deploys when requested

Codex is not yet inside a repeatable Manager-eval workflow. The manual loop is still:

1. Mike asks Manager in Slack.
2. Mike notices the answer.
3. Mike brings it to Codex.
4. Codex edits docs/code.
5. Mike tests again.

That is the exact loop to replace.

## 9. How Obsidian Is Being Used

Obsidian is being used as:

- strategy memory
- product truth
- brand voice
- agent architecture notes
- model-routing notes
- service/product research

The repo has synced copies under:

- `content/coach/obsidian-sync/`

Current status: useful as reference/training docs, not yet a live retrieval memory for agents.

Recommended role:

- Obsidian remains the owner-friendly knowledge base.
- GitHub stores the versioned runtime packs/evals.
- A future retrieval layer can index selected Obsidian/GitHub docs, but Manager should not randomly learn from chat history.

## 10. Security And Permission Risks

### Passed Checks

`npm run audit:security` passed. The safe scan found env variable references in tracked files, but no obvious committed literal secret values.

### Local Secret Files

Ignored local env files exist:

- `.env.canary`
- `.env.local`
- `.env.prod`
- `.env.vercel`

They contain secret-like categories such as GHL/HighLevel keys, Vercel/GitHub keys, and other tokens. They are ignored by git, which is good. Keep them out of screenshots, Slack, docs, and commits.

### OpenClaw Login Helper Risk

`app/api/openclaw/login/route.ts` renders the runtime `OPENCLAW_TOKEN` into a browser-submitted hidden form. The token is not committed to git, but the route can expose the token to anyone who can access that endpoint/page.

Recommended fix: put this route behind an owner-only check before using it as a public Mission Control button, or replace it with a server-to-server/session-based handoff that does not reveal the token to the browser.

Follow-up applied 2026-05-21: `/api/openclaw/login` now requires Basic Auth before it renders the OpenClaw login form. `OPENCLAW_LOGIN_PASSWORD` must be configured in Vercel Production or the route fails closed.

### Slack App Permissions

The Slack manifest includes broad read/write scopes for channels, groups, DMs, files, pins, reactions, and assistant features. That may be acceptable for an internal agent team, but it should be reviewed before client/team expansion.

Recommended fix: keep only the scopes required for the current command/brief workflow and add scopes only when a feature needs them.

### HighLevel AI Features

The repo consistently says HighLevel AI features must remain OFF unless Mike manually approves them. Keep this as a hard stop in all future evals.

## Recommended Safe Foundation

Build the foundation in this order:

1. Add a Manager task packet template.
2. Add a versioned routing/eval scenario file.
3. Add a local eval runner that sends test commands to the current command center and checks the response.
4. Add a GitHub Action that runs Manager evals on pull requests and manual dispatch.
5. Add a postmortem/training-change template.
6. Later, refactor Slack route and local command center to share one routing table instead of duplicating logic.

This keeps the current stack intact and gives Manager a training loop that is versioned, repeatable, and testable.
