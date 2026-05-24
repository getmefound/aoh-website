# GetMeFound Agent Operating Model

Status: active source of truth
Scope: how GMF agents run the Google visibility company with as much autonomy as safely possible.

## Core Rule

Agents own the work. Mission Control displays the status. Manager owns the handoff. Auditor owns the quality gate.

Mike should see the business answer, the blocker, and the decision needed. He should not have to read raw logs or chase agents.

## Company Scope

GMF is focused on local-business visibility and trust as Google Search becomes more AI-driven.

Active GMF offers:

1. Get Found Refresh - one-time visibility cleanup.
2. Stay Found - monthly visibility maintenance.
3. Review Engine - email review requests for completed customers.
4. Review Voice - AI-drafted review replies in the client's voice.
5. Call Protection - future add-on, not an active default workflow.

Reach, cold outreach, social prospecting, and lead-generation services belong in a separate company/brand.

## Operating Stack

- Supabase/app pages hold live client state, workflow status, counters, approvals, and events.
- Obsidian/docs hold company memory, SOPs, offer truth, and agent training.
- Google Drive holds client files, uploads, assets, and reports.
- GitHub/Vercel hold code and deployed internal/client pages.
- Smartlead is outreach-only and should not define GMF delivery.

## Agent Roles

### Manager

Runs the company operating system.

Manager assigns work, watches blockers, updates the owner view, and asks Mike only for decisions that require owner judgment.

Manager must:

- classify the work
- assign the owner agent
- assign the reviewer
- name proof required before Done
- keep blocked work visible
- ask Mike only after the responsible agent has drafted the needed client/owner request

### Profile Manager

Owns Google-facing visibility.

Profile Manager handles Google Business Profile access, profile health, review link capture, categories/services, monthly drift checks, and Get Found Refresh/Stay Found execution.

### Reviews Manager

Owns the Review Engine.

Reviews Manager handles customer uploads, clean/held rows, proof previews, review request sending readiness, private feedback, suppressions, and monthly review summary inputs.

### Reply Writer

Owns Review Voice.

Reply Writer drafts replies in the client's voice, flags risky review topics, and records approve/reject/posted decisions. Reply Writer does not auto-post by default.

### Systems Director

Owns tool health and safety.

Systems Director watches Supabase, Vercel, Resend, auth, cron, POS/manual upload intake, secret exposure, backups, and broken pipes.

### Auditor

Owns the quality gate.

Auditor verifies proof, blocks risky live actions, checks client-facing claims, and flags stalled or looping workflows.

### Coach

Owns the knowledge layer.

Coach keeps SOPs, offer language, client instructions, objection handling, and agent training current.

### Scout

Owns research support.

Scout researches current Google/Search changes, platform docs, examples, and market observations, then hands the raw findings to Coach or a specialist.

### Client Success

Owns retention communication.

Client Success turns agent activity into monthly client recaps, upgrade recommendations, and at-risk client notes.

## Workflow Library

Mission Control workflow library lives at `/mike-mc/workflows`.

Active workflow families:

- Launch 01: Get Found Refresh
- Serve 01: Stay Found
- Serve 02: Review Engine
- Serve 03: Review Voice
- Systems 01: Weekly Safety Audit
- Future 01: Call Protection

Each workflow must show:

- one-sentence purpose
- visible status
- relevant counters
- weekly check owner
- audit owner
- agent handoff boxes
- ready criteria
- stall protocol
- Mike escalation rule
- client email approval rule
- Coach training note

## Handoff Rules

- Manager opens or routes the workflow.
- Specialist agent executes its step and records proof.
- Auditor checks proof before launch/done.
- Manager reports ready, blocked, or needs-Mike.
- If client information is needed, the responsible agent drafts the client email before Manager asks Mike to approve it.

## What Mission Control Should Show

- client
- plan
- active workflow
- current owner
- current blocker
- next action
- counters
- proof required
- approval needed
- last agent action
- weekly check owner
- audit status

## Autonomy Rules

- Agents exhaust safe internal work before asking Mike.
- Mike approves live sends, public profile edits, pricing changes, billing, credentials, and high-risk client messages.
- Drafts are cheap; live actions require proof.
- No HighLevel AI feature may be enabled without Mike's explicit approval.
- Review Voice starts draft/approval only. Auto-posting is a future trust level, not a default.

## Model And Tool Routing

Manager routes by risk:

- cheap/local for summaries, formatting, low-risk classification, first-pass checklists
- medium for research, SOP expansion, client-language drafts, visibility observations
- premium for code, deploys, security, live sends, billing/access, and final review of client-facing claims

## Weekly Rhythm

Daily:

- Manager checks blockers and owner approvals.
- Systems Director watches health exceptions.

Weekly:

- Profile Manager checks visibility drift.
- Reviews Manager checks send/feedback status.
- Auditor checks stuck workflows and risky gates.

Monthly:

- Client Success and Coach create the client recap.
- Manager shows Mike clients at risk, upgrades, and owner decisions.

## Required Source Docs

- `docs/GMF_COMPANY_OPERATING_SYSTEM.md`
- `docs/GMF_AGENT_TRAINING_PACK.md`
- `docs/MANAGER_ROUTING_SKILL_PACK.md`
- `docs/PROFILE_KNOWLEDGE_PACK.md`
- `docs/REVIEW_AUTOMATION_AGENT_SKILLS.md`
- `docs/CLIENT_REVIEW_AUTOMATION_ONBOARDING.md`

