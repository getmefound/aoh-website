# AOH Report Flow Map

Status: source of truth for homepage/campaign report routing
Owner: Manager
Specialist: GHL Expert
Reviewer: Auditor

## Why This Exists

AOH has more than one "report" path. Agents must not assume a workflow named
"Marketing Audit Report Ordered" is the same thing as the public homepage
report form.

Before changing, testing, or wiring reports, Manager must identify which lane is
being discussed.

## Lane 1: Public Homepage Free Report

Purpose:

- A visitor on `https://aioutsourcehub.com` requests a free report from the
  homepage.

Website entrypoint:

- `POST /api/report`
- source file: `app/api/report/route.ts`

Website expectation:

- The website forwards the submission to `process.env.GHL_WEBHOOK_URL`.
- If `GHL_WEBHOOK_URL` is missing, the homepage can accept a request but GHL may
  not receive it.

Current operational blocker:

- Vercel production is missing the correct `GHL_WEBHOOK_URL` value.
- The weekly smoke test fails until the correct receiving endpoint is added.

What GHL Expert must find:

- The exact GHL receiving endpoint for public homepage report submissions.
- This may be an Inbound Webhook trigger URL, a GHL form endpoint, or another
  intentional receiving route.
- Do not guess from workflow names. Verify the actual receiving mechanism.

Proof required:

- GHL workflow/form/trigger name
- receiving URL copied from the GHL UI or proven source
- whether it is an Inbound Webhook, GHL form, or other receiver
- test homepage report request reaches GHL
- Auditor confirms no secret/token is exposed

## Lane 2: Campaign Marketing Audit Request Form

Purpose:

- Internal or outbound campaign flow requests/generates a marketing audit for a
  prospect/contact.

Likely GHL workflow names:

- `Marketing Audit Report Ordered`
- `AI Visibility Report Ordered`
- `First Report Engagement Tagging`

Important distinction:

- A trigger named "Marketing Audit Request Form" may belong to campaign
  execution, not the public website homepage.
- Do not use this lane for `GHL_WEBHOOK_URL` unless GHL Expert verifies it is
  intentionally the receiver for public homepage submissions too.

## Callback Back To Website

Purpose:

- After GHL generates a report, it tells the website the report is ready.

Direction:

- GHL -> website

URL:

- `https://aioutsourcehub.com/api/report/callback`

Important:

- This callback URL is not the missing `GHL_WEBHOOK_URL`.
- The callback token is a secret. Do not paste it in chat or screenshots.
- If exposed, Auditor should rotate it in both Vercel and GHL.

## Routing Rule

For any report-flow issue:

1. Manager identifies the lane:
   - public homepage free report
   - campaign marketing audit/report
   - callback/status update
2. Manager assigns GHL Expert for HighLevel inspection.
3. Auditor reviews proof before the flow is marked done.
4. Codex/Website only wires Vercel/API/code after GHL Expert provides the
   verified receiving URL or endpoint.

## Anti-Confusion Checks

Ask these before doing work:

- Is this visitor-facing homepage traffic or campaign traffic?
- Is this website-to-GHL intake, or GHL-to-website callback?
- What exact workflow/form/trigger receives the data?
- What proof shows a test request arrived in GHL?
- Are any secrets visible in the output?
