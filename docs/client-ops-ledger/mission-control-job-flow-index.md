# Mission Control Job Flow Index

Status: active Mission Control view
Owner: Manager
Last updated: 2026-05-21

## Purpose

Mission Control now separates job visibility into three plain buckets:

1. Commercial Reach, the standard outbound job AOH can explain and sell.
2. The internal Reach cold email room, where warmup, QA, import-only, and send gates are tracked.
3. Optional custom agents and CRM connections, used only when a client needs deeper automation.

This keeps the front page useful as more agent jobs are added.

## Mission Control Links

| View | URL | Use |
|---|---|---|
| Front page job index | `/mike-mc` | Start here for active rooms and job links. |
| Commercial Reach sales story | `/mike-mc/jobs#commercial-reach` | Explain what a business is buying. |
| Commercial Reach step flow | `/mike-mc/jobs#commercial-reach-steps` | Show the step-by-step agent handoff from discovery to booking. |
| Optional custom agent layer | `/mike-mc/jobs#custom-agent-layer` | Show CRM/POS/webhook/custom-agent work separately from standard Reach. |
| Reach cold email room | `/mike-mc/jobs/reach-cold-email-campaign` | Track current lane QA, import-only state, drip readiness, and send stop signs. |
| Scheduled job cost ledger | `/mike-mc/jobs` | Track cadence, owner, cost estimate, and worth-it checks. |

## Commercial Reach

Commercial Reach is the standard job:

1. Pick the lane, market, and daily cap.
2. Run business discovery first.
3. Score and shortlist businesses.
4. Find and verify business emails.
5. Create clean prospect records.
6. Send reply-first outreach after safety gates pass.
7. Route replies and report requests.
8. Book interested prospects.
9. Review cost and improve the next run.

This is the version to explain to most businesses. It does not require connecting to the client's CRM.

## Optional Custom Agents And CRM

Custom agents begin only after the client actually needs the deeper layer:

1. Confirm the custom automation need.
2. Collect access and intake.
3. Connect CRM, POS, CSV, or webhook sources.
4. Build custom agent instructions.
5. Trigger delivery jobs from real events.
6. QA and monitor the client agent.

Do not bundle this into the basic Reach promise. It is an add-on for clients that need agents working from their systems.

## Safety Boundary

The Reach cold email room still controls live sending:

- import-only is not start-drip approval
- pre-send verification is required before start-drip
- GHL reply routing, unsubscribe handling, sender-domain safety, and first-hour watch must pass
- HighLevel AI features remain OFF unless Mike manually authorizes them

