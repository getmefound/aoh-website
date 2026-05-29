# Profile Mailbox Proof

Date: 2026-05-29
Owner: Systems Director
Reviewer: Manager / Auditor
Account: `profile@getmefound.ai`

## Result

Pass. `profile@getmefound.ai` is a real monitored Google Workspace mailbox for GBP/profile access.

## Evidence

- Gmail connector found message ID `19e75af33fe2ec0e`.
- From: `GetMeFound Profile <profile@getmefound.ai>`
- To: `mike@getmefound.ai` and `4egidio@gmail.com`
- Subject: `Profile GBP access test`
- Timestamp: 2026-05-29 17:41 ET
- Gmail connector found reply message ID `19e75af66cce25b1`.
- Reply from `4egidio@gmail.com` to `profile@getmefound.ai` was received.

## Operating Decision

Use `profile@getmefound.ai` as the official Google Business Profile Manager invite account.

Keep `mike@getmefound.ai` for owner identity, vendor/admin control, and backup.

## Follow-Up

- Local env: `NEXT_PUBLIC_GMF_GBP_INVITE_EMAIL=profile@getmefound.ai`
- Vercel Production: variable added
- Vercel Development: variable added
- Vercel Preview: not added because Vercel reported the project has no connected Git repository for branch-scoped preview variables
- GBP verifier rerun: target invite email now resolves to `profile@getmefound.ai`
