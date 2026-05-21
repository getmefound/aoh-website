# Local Visibility Manager GBP Training Loop

Status: v1 client-zero
Owner: Local Visibility Manager
Reviewer: Manager
Last updated: 2026-05-21

## Plain-English Goal

Train the Google Business Profile agent on AOH first.

The agent should learn how to get access, inspect the profile, draft a safe update, and explain the process to a business owner before AOH asks a client to do the same thing.

## What The Agent Must Know

- "GMB" is the old common name. Use "Google Business Profile" or "GBP" with clients.
- The client should add the AOH Google email under Business Profile settings -> People and access.
- Default access is Manager.
- No one should share a Google password.
- Manager access is enough for normal profile work.
- Owner access is only for admin/ownership work and needs separate approval.
- Public profile changes, posts, photos, services, and description edits need Mike approval during the AOH test.
- GHL Expert helps only if the profile needs to connect into HighLevel.
- HighLevel AI features stay OFF unless Mike manually approves them.

## AOH Client-Zero Run

Input needed:

- AOH Google email that should receive GBP invites
- AOH Business Profile link or search name
- one safe update Mike is willing to test

Local Visibility Manager run:

1. Check whether AOH has been invited and whether the invite was accepted.
2. Confirm the role is Manager unless Mike specifically approved Owner.
3. Check profile basics: name, service area/address, phone, website, hours, categories, services, photos, posts, review link, and unanswered reviews.
4. Draft one safe update.
5. List proof needed for the future client instructions.
6. Ask Mike for approval before anything public changes.
7. Log what worked and what needs to be clearer for clients.

## Required Response Format

```text
Local Visibility Manager - GBP client-zero status

Access:
- ...

Profile gaps:
- ...

Draft update:
- ...

Needs Mike:
- ...

Next handoff:
- ...
```

## What Good Looks Like

- Mike can understand the status in under 30 seconds.
- A future client can follow the invite instructions without a call.
- The agent never asks for a password.
- The agent does not publish anything public without approval.
- The process can be reused for Review Automation, AI Visibility, and any local profile service AOH sells.

## Sources

- Google Business Profile owner and manager access: https://support.google.com/business/answer/3403100
- Google Business Profile edits: https://support.google.com/business/answer/3039617
- Google Business Profile posts: https://support.google.com/business/answer/7342169
