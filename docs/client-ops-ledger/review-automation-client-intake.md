# Review Automation Client Intake

Status: v1 live intake
Owner: Manager
Primary agents: Local Visibility Manager, Reviews Manager, GHL Expert
Last updated: 2026-05-21

## Purpose

This form lets a client tell AOH they are ready for setup.

The important trigger is Google Business Profile access:

- client adds the AOH business-domain Google login as Manager
- client submits the intake form
- Manager routes the setup packet to the right agents
- Local Visibility Manager verifies access
- Reviews Manager prepares the review automation flow
- GHL Expert handles HighLevel setup only after access is clear

## Live Form

```text
/intake/review-automation
```

## Intake Routing

When the form is submitted, the API forwards a setup packet to:

- `GHL_CLIENT_INTAKE_WEBHOOK_URL`, if set
- otherwise `GHL_CONTACT_WEBHOOK_URL` or `GHL_WEBHOOK_URL`
- `SLACK_CLIENT_INTAKE_WEBHOOK_URL`, if set
- otherwise `SLACK_MISSION_CONTROL_WEBHOOK_URL` or `SLACK_WEBHOOK_URL`

## Client Access Language

Use Manager access by default.

Client-facing language:

```text
Add our business email as Manager in Google Business Profile settings under People and access. We do not need your Google password.
```

Owner access is not the default. If a client selects Owner, Manager should flag it for review and confirm why it was needed.

## Agent Workflow

1. Client submits intake form.
2. Manager receives setup packet.
3. Local Visibility Manager checks GBP access and profile basics.
4. Reviews Manager prepares review automation setup.
5. GHL Expert prepares HighLevel setup after access is clear.
6. Manager reports ready, blocked, or needs client help.

## Safety Rules

- No password sharing.
- Default GBP role is Manager.
- Public Google profile changes need approval before publishing.
- HighLevel AI features stay OFF unless Mike manually approves them.
