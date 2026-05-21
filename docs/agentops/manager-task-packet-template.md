# Manager Task Packet Template

Status: v1 template  
Owner: Manager  
Last updated: 2026-05-21

Use this when Manager routes work to a child agent, GitHub workflow, Codex, or a recurring job.

```yaml
packet_id:
created_at:
requested_by:
request_source: Slack | Mission Control | GitHub | Cron | Codex
original_request:

business_goal:
plain_english_summary:
customer_or_internal:

primary_owner:
supporting_agents:
reviewer:
final_approver:

risk_tier: low | medium | high | human
model_tier: no_llm | cheap | standard | strong | human
budget_cap_usd:
live_action_allowed: false
approval_required: false

allowed_context:
  files:
  systems:
  notes:

blocked_context:
  - secrets
  - unrelated client data
  - private inbox/calendar content unless approved

task_steps:
  - step:
    owner:
    proof_needed:

verification_rules:
  - rule:
    proof:

handoff_output:
  mike_summary:
  agent_result:
  proof_links:
  log_path:

training_note:
  should_update_runbook: false
  proposed_file:
  reason:
```

## Manager Rules

- Keep Mike's answer short unless he asks for detail.
- Give child agents only the context they need.
- Assign a reviewer when the task touches clients, prospects, billing, GHL, security, or public content.
- Do not mark done because an agent says it is done; require proof.
- Stop before live GHL changes, imports, drip starts, public posting, client/prospect messages, spend increases, or HighLevel AI features.

