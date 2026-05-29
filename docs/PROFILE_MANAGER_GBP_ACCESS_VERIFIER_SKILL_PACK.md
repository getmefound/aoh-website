# Profile Manager GBP Access Verifier Skill Pack

Status: Active
Owner: Profile Manager
Reviewer: Systems Director / Auditor
Effective date: 2026-05-29

## Mission

Verify that GMF has Google Business Profile access for a client without using Mike as the manual checker.

## Core Rule

Mike is not the per-client verifier. Profile Manager must use agent-owned access first:

1. Read-only OAuth/API verifier.
2. Controlled authorized GMF browser session.
3. Client/public evidence only as fallback.

Ask Mike only for one-time GMF account authorization, account recovery, destructive credential action approval, public edit approval, or a blocker proven after the agent-owned lanes fail.

## Access Email Rule

Use the configured GMF GBP access email.

Current active GBP invite account:

- `profile@getmefound.ai`
- Real paid Google Workspace user
- Send/receive/reply proof passed 2026-05-29

Resolution order:

1. `NEXT_PUBLIC_GMF_GBP_INVITE_EMAIL`
2. `NEXT_PUBLIC_AOH_GBP_INVITE_EMAIL`
3. fallback `profile@getmefound.ai`

Routine GBP operations should use `profile@getmefound.ai`. Keep `mike@getmefound.ai` for owner identity and backup/admin control.

## Lane A - API Verifier

Command:

```bash
npm run gbp:access-verify -- --place-id <place_id> --business-name "<business name>"
```

What it proves:

- OAuth/API lane is configured or not.
- Target place ID is visible to the authorized account.
- Read-only location facts can be captured without public edits.
- Admin/role can be checked when the Account Management API returns it.

What it never does:

- write GBP data
- publish posts/photos
- reply to reviews
- print secrets
- store refresh/access tokens
- store browser cookies

## Lane B - Authorized Browser Session

Use when API approval/OAuth is missing or failing.

Profile Manager opens Google Business Profile through the controlled GMF account/session and records:

- signed-in GMF account label, without sensitive personal details
- exact profile/business name
- place/profile identity
- People and access role or pending state
- clean profile/Maps URL
- review count/rating
- website, hours, category, services, address/service area, photos

Do not store:

- passwords
- 2FA/recovery codes
- raw login links
- session cookies
- personal Google account screenshots

## Lane C - Client/Public Fallback

Use only while A/B are being repaired.

Allowed sources:

- Google public profile and review-link redirects
- client-originated email signatures
- client website
- Yardbook/public directories
- Slack history
- Gmail connector search for business evidence
- existing proof artifacts

Not enough for Done:

- private Manager role
- accepted invite state
- exact dashboard identity
- edit readiness

## Southington Test Run

Target:

- Business: `Southington Lawn Service LLC`
- Place ID: `ChIJxypnrEz5KkYRgxXufgych38`
- Review URL: `https://g.page/r/CYMV7n4MnId_EB0/review`

Run:

```bash
npm run gbp:access-verify -- --place-id ChIJxypnrEz5KkYRgxXufgych38 --business-name "Southington Lawn Service LLC"
```

Done proof:

- `docs/client-ops-ledger/gbp-access-verifier-current.md` exists.
- If status is `access_confirmed`, Auditor reviews the proof and Profile Manager captures live GBP facts.
- If status is `api_oauth_env_missing`, Systems Director owns the OAuth/browser-session infrastructure job.
- If status is `location_not_visible_to_authorized_account`, Account Manager sends the corrected client access request.

## Handoff Rules

Profile Manager -> Auditor:

- access proof report
- live facts captured
- risk notes

Systems Director -> Profile Manager:

- API lane ready, or
- authorized browser-session lane ready, or
- one-time account authorization blocker documented

Account Manager -> Client:

- corrected invite instructions
- reminder cadence
- no password request

Manager -> Mike:

- only one exact owner-needed ask after all agent lanes are exhausted

## Sources

- Google owner/manager roles and People and access: https://support.google.com/business/answer/3403100
- Google OAuth for GBP APIs: https://developers.google.com/my-business/content/implement-oauth
- Google location data and `metadata.place_id`: https://developers.google.com/my-business/content/location-data
- Google Account Management API/admin resources: https://developers.google.com/my-business/reference/accountmanagement/rest
