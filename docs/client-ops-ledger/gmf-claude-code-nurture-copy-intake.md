# GMF Claude Code Nurture Copy Intake

Status: Waiting for incoming copy packet
Owner: Sales Manager
Reviewer: Coach / Auditor
Created: 2026-05-29

## Owner Instruction

Mike is having Claude Code create the nurture emails. Use those emails as the source copy packet.

## Routing

| Agent | Responsibility |
|---|---|
| Sales Manager | Accepts the incoming Claude Code copy as source material and maps it to the funnel stage |
| Coach | Edits for GMF voice, authority, specificity, no testimonials, one CTA, and offer accuracy |
| Auditor | Checks CAN-SPAM, suppression/stop rules, sender lane, opt-out, physical address, and unsupported claims |
| Sender | Builds only the approved version in Smartlead/Resend |
| Systems Director | Wires event triggers and stop rules after copy is approved |
| Reporter | Stores the final approved packet and updates owner-facing status |

## Funnel Buckets To Map

- Cold prospect click follow-up
- Homepage visibility-report request follow-up
- Post-report engaged non-buyer nurture
- Get Found purchase to Stay Found upsell
- Breakup/hold sequence

## Rules

- Do not send live emails from this packet until Auditor approval and Mike's required live-send approval gate, where applicable.
- No testimonials or implied customer proof.
- No rank guarantees.
- One clear CTA per email.
- Use `The Visibility Engine` language consistently.
- Include physical mailing address and opt-out where the email is commercial.
- Stop on reply, opt-out, hard bounce, form fill, or purchase according to the workflow.

## Current Next Step

Sales Manager waits for the Claude Code copy to appear in the repo/workspace, then assigns Coach/Auditor review before Sender builds any sequence.
