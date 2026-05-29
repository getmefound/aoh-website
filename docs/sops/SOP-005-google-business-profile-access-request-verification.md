# SOP 005 - Google Business Profile Access Request And Verification

Status: Active
Version: 0.5
Owner: Profile Manager
Reviewer: Auditor
Approver: Manager
Effective date: 2026-05-29
Next review: 2026-06-29
Source of truth: `docs/sops/SOP-005-google-business-profile-access-request-verification.md`

## Purpose

Request, confirm, and verify Google Business Profile access without asking for passwords or editing the wrong profile.

## Covered Master Map Rows

- GBP access request
- GBP access verification

## Trigger

- New client needs Google Business Profile setup
- Client says access was sent
- Profile work cannot begin because access is missing or wrong

## Roles

| Role | Responsibility |
|---|---|
| Account Manager | Sends client access instructions and reminders |
| Profile Manager | Verifies profile, role, and access level |
| Auditor | Checks proof and wrong-profile risk |
| Manager | Routes unresolved access blockers |

## Hard Rules

- Never ask for the client's Google password.
- Client keeps ownership/control of their Google account and profile.
- Verify exact business name, address/service area, website, and phone before edits.
- Do not edit a GBP unless access, profile identity, and approval path are clear.
- Do not ask Mike for a GBP fact that Profile Manager can verify from existing GBP access.
- If Profile Manager has access, Profile Manager must inspect the profile first and document proof before any owner ask.
- Mike is not the per-client GBP verifier. Mike is only needed for one-time account authorization, owner-level account recovery, destructive credential changes, public edit approval, or a true access failure after agent-owned paths are exhausted.
- The client-facing invite account is the configured GMF GBP access email. Current active account is the real paid Workspace user `profile@getmefound.ai`.
- Current code reads `NEXT_PUBLIC_GMF_GBP_INVITE_EMAIL`, then `NEXT_PUBLIC_AOH_GBP_INVITE_EMAIL`, then defaults to `profile@getmefound.ai`.
- Keep `mike@getmefound.ai` for owner identity and backup/admin control, not routine profile work.

## Scalable Access Model

GBP access has two agent-owned verification lanes:

1. API/OAuth lane.
   - Systems Director maintains an approved Google Cloud OAuth path for the configured GMF GBP access account.
   - Profile Manager runs the read-only verifier:

```bash
npm run gbp:access-verify -- --place-id <place_id> --business-name "<business name>"
```

   - The verifier lists locations accessible to the authorized account, matches `metadata.place_id`, and writes proof without printing tokens.

2. Authorized browser-session lane.
   - Systems Director maintains a controlled, pre-authorized browser session for the configured GMF GBP access account.
   - Profile Manager uses the normal Google UI to verify the profile, People and access, and live fields.
   - The agent never asks for or stores passwords, 2FA codes, browser cookies, raw session tokens, or magic links.

If both lanes fail, Account Manager routes a corrected client access request. Manager asks Mike only if the GMF account/session itself requires owner action.

## Procedure

1. Prepare the access request.
   - Confirm business name, website, public GBP link if available, and primary contact.
   - Confirm the configured GMF GBP access email before sending instructions.
   - Send client instructions to add that email as a Manager on the correct Google Business Profile.

2. Client instruction text.

```text
We do not need your Google password. Please add our business email as a Manager on your Google Business Profile. That lets us help with profile updates, posts, photos, review links, and visibility checks while you stay in control.
```

3. Track the request.
   - Log sent date and due date.
   - If missing, follow up every two business days through Account Manager.

4. Verify access.
   - First run the agent-owned access verifier or authorized browser-session lane.
   - Confirm the invitation arrived and was accepted when that proof is visible.
   - Confirm role level is sufficient for planned work.
   - Confirm the profile matches the client record.
   - Use existing Profile Manager access before asking the owner for facts.
   - Capture available profile facts from access: clean profile URL, role, review count/rating, review link, website, hours, address/service-area setting, categories, services, and public contact data.
   - If the owner answers only one field, record that partial answer immediately instead of re-asking the whole checklist.
   - If the owner says they need to learn how to verify access, send a short guided walkthrough for the exact screen or account before escalating.
   - If the API lane reports `api_oauth_env_missing`, Systems Director owns the infrastructure fix; do not convert the client job into a Mike ask.

5. Capture proof.
   - Save profile URL, role/access proof, and verification note.
   - Do not store passwords or private Google account screenshots with sensitive personal data.

6. Hand off next step.
   - If access passes, Profile Manager may start GBP audit.
   - If access fails, route blocker to Account Manager or Manager.

## Required Proof

- Access request sent
- Correct GBP/profile URL
- Access role confirmation
- Profile identity verification
- Blocker or pass note

## Failure Or Blocker Handling

- Client cannot find GBP: Account Manager sends simpler instructions or requests a call route.
- Wrong profile invited: stop, document, and request correct profile access.
- Insufficient role: request correct role.
- Ownership issue: Manager escalates only if client cannot resolve and GMF work is blocked.
- API/OAuth missing: Systems Director opens or continues the GBP verifier infrastructure job; client work stays `Agent Working` until a client/owner action is actually proven.
- Authorized browser session missing: Systems Director creates the controlled session path and records whether one-time account authorization is needed.
- Partial owner answer: keep the known field, mark only the missing fields Human Needed, and ask the next smallest question.
- Owner does not know where to verify: Profile Manager sends step-by-step instructions for checking the signed-in Google account, profile controls, People and access, accepted/pending invite, and role.
- Existing access confirmed by owner: switch status to Agent Working and have Profile Manager verify directly before asking Mike again.

## Changelog

| Version | Date | Change | Owner |
|---|---|---|---|
| 0.1 | 2026-05-27 | Initial controlled scaffold from SOP master map | Coach |
| 0.2 | 2026-05-27 | Expanded password-free access request and profile verification workflow | Coach |
| 0.3 | 2026-05-27 | Added partial-answer capture and guided owner verification path from Southington pilot | Coach/Profile Manager |
| 0.4 | 2026-05-27 | Added exhaust-access-first rule before asking Mike for GBP facts | Manager/Profile Manager |
| 0.5 | 2026-05-29 | Activated scalable API/browser access verifier model and removed per-client Mike verification as normal process | Manager/Systems Director |

## Source Documents

- `docs/client-ops-ledger/gbp-client-access-and-update-test.md`
- `docs/GMF_CLIENT_LIFECYCLE_OPERATING_MODEL.md`
- `docs/sops/SOP-000-sop-creation-testing-governance-review.md`
- Google owner and manager roles: https://support.google.com/business/answer/3403100
- Google OAuth for Business Profile APIs: https://developers.google.com/my-business/content/implement-oauth
- Google location data and `metadata.place_id`: https://developers.google.com/my-business/content/location-data
