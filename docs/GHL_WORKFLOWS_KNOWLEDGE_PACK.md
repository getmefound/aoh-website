# GHL Workflows Knowledge Pack

Status: draft v1
Last researched: 2026-05-16
Owner agent: GHL Expert
Scope: HighLevel workflow triggers, actions, routing, waits, trigger links, webhooks, and testing.

## Job

GHL Expert owns the design, configuration, and QA of HighLevel workflows.

Workflows should be reliable, readable, testable, and safe to run at client scale.

## Core Workflow Model

A workflow is an automated sequence.

Basic pattern:

1. Trigger starts the workflow.
2. Actions run after the trigger.
3. Waits and If/Else steps control timing and paths.
4. Logs/tests prove it works.

Common workflow jobs:

- lead follow-up
- appointment reminders
- customer onboarding
- review requests
- CRM updates
- task creation
- webhook integrations
- internal alerts

## Triggers

Triggers start workflows. HighLevel groups triggers by categories such as:

- Contact
- Events
- Appointments
- Opportunities
- Payments
- Communication
- Facebook/Instagram events
- IVR
- Google Ads
- Ecommerce

GHL Expert should choose triggers based on the object that needs to be available later in the workflow.

Important rule: workflow payload/context matters. If later actions need appointment or opportunity data, use a trigger that provides that context or add a lookup step where possible.

## Actions

Actions are the steps after the trigger.

Common AOH actions:

- send SMS
- send email
- send review request
- create/update contact
- create opportunity
- update opportunity
- assign user
- add/remove tag
- create task
- wait
- if/else
- webhook/custom webhook
- internal notification

Each action should have a clear internal name so execution logs are readable.

## Wait Action

Wait pauses a contact in a workflow.

Wait can be:

- time based
- until appointment/event time
- until a condition is met
- until contact replies
- until trigger link clicked
- until email opened/clicked/unsubscribed/bounced
- limited to business windows
- ended by timeout

Use Wait to avoid rushed or irrelevant automation.

Examples:

- wait 1 day before follow-up
- wait until appointment start time minus 2 hours
- wait until review link clicked or 2 days pass
- wait for reply before sending another message

## If/Else Action

If/Else routes contacts down different branches based on data or behavior.

Use it for:

- replied vs no reply
- clicked vs not clicked
- customer type
- rating/sentiment
- opportunity value
- appointment status
- contact field value

Important:

- the None branch always exists
- use AND/OR segments intentionally
- select/dropdown fields may require option IDs when using dynamic values
- insert a Wait before If/Else when the condition needs time to happen

## Trigger Links

Trigger links redirect the user and record the click in the contact activity timeline.

Use cases:

- review link clicked
- appointment confirmation
- offer clicked
- unsubscribe by channel
- interest signals

Important:

- supported in SMS, Email, GMB, and FB/IG/WhatsApp DMs
- a raw custom value URL will not fire a trigger link click
- create the trigger link first
- point the trigger link to a static URL or custom value
- insert the actual trigger link into the message

## Webhooks

Inbound webhooks receive data from external apps into HighLevel.

Outbound/custom webhooks send data from HighLevel to external apps.

Use inbound webhooks for:

- POS/CRM customer completed events
- payment or invoice events
- form events from external systems
- support ticket events

Use outbound/custom webhooks for:

- sending HighLevel contact/event data to another system
- Slack alerts
- Google Sheet logging
- custom dashboards

Webhook QA:

- test with a known contact
- use a webhook testing tool when needed
- confirm method, URL, headers, auth, body, and payload
- check execution logs
- confirm receiving system accepted the payload

## Opportunity Actions

Create Opportunity creates a new opportunity in a selected pipeline and stage.

Update Opportunity modifies an existing opportunity. If the workflow was not triggered by an opportunity, GHL Expert may need a Find Opportunity step or another reliable way to identify the target.

For new workflows, prefer granular Create Opportunity and Update Opportunity actions over older combined actions.

## Review Request Action

The Review Request workflow action sends review requests through Reputation settings.

Before using it:

- Reputation review link is set
- SMS/email templates are assigned
- channel is enabled
- contact has phone/email
- compliance/consent is considered

## Testing And Launch

Before publishing:

- read every trigger condition
- name every important action clearly
- test happy path
- test no-reply path
- test missing-data path
- check execution logs
- confirm tags/opportunities/tasks update correctly
- confirm messages contain the right links/custom values
- confirm no accidental duplicate sends
- confirm workflow is published only when ready

## Common Failure Patterns

Wrong trigger:

- later steps do not have needed appointment/opportunity data

No wait before branch:

- If/Else evaluates before the contact has time to reply/click/open

Raw custom value instead of trigger link:

- click tracking/branching does not fire

Missing channel setup:

- SMS/email/review request action cannot send

Webhook payload mismatch:

- receiving system rejects the request or misses fields

Duplicate workflow enrollment:

- contact gets repeated messages or duplicate opportunities

## Source Links

- Getting started with workflows: https://help.gohighlevel.com/support/solutions/articles/155000002288
- Workflow triggers list: https://help.gohighlevel.com/support/solutions/articles/155000002292-a-list-of-workflow-triggers
- Wait action: https://help.gohighlevel.com/support/solutions/articles/155000002470-workflow-action-wait
- If/Else action: https://help.gohighlevel.com/support/solutions/articles/155000002471-workflow-action-if-else
- Trigger links overview: https://help.gohighlevel.com/support/solutions/articles/48000981404-trigger-links-overview
- Inbound webhook trigger: https://help.gohighlevel.com/support/solutions/articles/155000003147-trigger-inbound-webhook
- Webhooks in HighLevel/Zapier: https://help.gohighlevel.com/support/solutions/articles/155000001183-how-to-use-webhooks-in-highlevel-zapier-
- Custom webhook action: https://help.gohighlevel.com/support/solutions/articles/155000003305/
- Outbound webhook action: https://help.gohighlevel.com/en/support/solutions/articles/155000003299-actions-webhook
- Create Opportunity action: https://help.gohighlevel.com/support/solutions/articles/155000004752-workflow-action-create-opportunity
- Update Opportunity action: https://help.gohighlevel.com/support/solutions/articles/155000004753-workflow-action-update-opportunity
- Review Request action: https://help.gohighlevel.com/support/solutions/articles/155000003291-workflow-action-review-request
