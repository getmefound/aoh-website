# Manager Training Change Proposal

Status: v1 template  
Owner: Coach + Manager  
Reviewer: Systems Director or Codex  
Last updated: 2026-05-21

Use this when Manager gives a weak answer, routes to the wrong owner, misses a safety rule, or makes Mike babysit work the agent team should handle.

## Proposal

```yaml
proposal_id:
date:
reported_by:
source:
related_command:
related_eval_id:

what_happened:
why_it_matters:
desired_behavior:

files_to_change:
  - path:
    reason:

eval_to_add_or_update:
  id:
  command:
  must_include:
  must_not_include:

risk:
approval_needed_from_mike: false
```

## Rules

- If this affects live client/prospect action, require Mike approval.
- If this affects Slack command behavior, add or update an eval.
- If this affects a specialist agent, update that agent's skill/runbook too.
- If docs and code disagree, code is the current behavior and docs are the intended behavior until fixed.

