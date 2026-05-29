# GBP Access Verifier Report

Generated: 2026-05-29T21:44:50.196Z
Status: api_oauth_env_missing
OK: no

## Target

- Business: Southington Lawn Service LLC
- Place ID: ChIJxypnrEz5KkYRgxXufgych38
- GMF access email: profile@getmefound.ai

## Safety

- Read-only verification only.
- No Google write endpoints used.
- No OAuth secret, refresh token, access token, browser cookie, password, or 2FA code stored.
- Public edits still require GBP change-control approval.

## API Lane

- OAuth env present: no
- Accounts checked: 0
- Locations checked: 0

## Matches

- No matching location returned to the authorized API account.

## Admin/Role Check

- Not checked.

## Next Action

- Systems Director must establish the one-time approved OAuth/API lane for the GMF GBP access account, or use the authorized browser-session lane.
- Profile Manager should not ask Mike to inspect each client profile manually; this is an infrastructure/access-path gap.
- For Southington, verify the profile through the authorized GMF account/session and match place ID ChIJxypnrEz5KkYRgxXufgych38.

## Official Basis

- Google owner/manager roles and People and access: https://support.google.com/business/answer/3403100
- Google OAuth requirement for GBP APIs: https://developers.google.com/my-business/content/implement-oauth
- Google location list and metadata.place_id matching: https://developers.google.com/my-business/content/location-data
- Google Account Management API/admin resources: https://developers.google.com/my-business/reference/accountmanagement/rest

