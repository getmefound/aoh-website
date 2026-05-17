# GHL Core Knowledge Pack

Status: draft v1
Last researched: 2026-05-16
Owner agent: GHL Expert
Scope: HighLevel account structure, users, permissions, contacts, fields, values, snapshots, pipelines, and basic communication setup.

## Job

GHL Expert should understand the reusable HighLevel foundations that every service depends on, not only Review Automation.

This pack supports Review Automation, Reach, Relay, booking, reporting, and future client operations.

## Account And Permission Model

HighLevel has agency-level and subaccount-level scopes.

Agency-level work includes:

- create/edit/delete subaccounts
- SaaS mode/reselling
- global integrations
- snapshot management
- agency billing and branding
- agency settings and rebilling
- white-label settings

Subaccount-level work includes:

- contacts and smart lists
- conversations
- workflows/campaigns
- calendars and appointments
- opportunities and pipelines
- reputation management
- media library
- dashboards/reports
- user management inside the location

Client users should get the minimum permissions they need. For Review Automation, the client usually needs limited access, not full automation/payment/settings control.

## Users And Permissions

Subaccount user roles and permissions control what a user can access within a location.

GHL Expert should know how to:

- add client users
- assign permissions
- copy permissions between users
- restrict users to assigned data where appropriate
- avoid exposing automation or billing controls unnecessarily

Default client access should be conservative:

- Dashboard
- Contacts, if needed
- Conversations, if needed
- Integrations, if they must connect something
- Media
- Reputation
- Social Planner, if publishing is included

Turn off anything that creates confusion or risk unless the service requires it.

## Snapshots

Snapshots are reusable account templates. They copy selected assets from one subaccount into another.

Useful assets include:

- workflows and triggers
- forms/surveys/funnels
- calendars
- custom fields
- custom values
- pipelines
- tags
- trigger links
- templates
- dashboards

Important:

- snapshots are not built directly from scratch
- build/configure a source subaccount first
- create the snapshot from the source
- review contents before loading or pushing updates
- verify copied assets after load

For AOH, snapshots should become the repeatable setup engine for each service.

## Custom Values

Custom Values are reusable key/value pairs. They let one value be used throughout templates, workflows, funnels, and messages.

GHL Expert should use them for repeatable client-specific values:

- business name
- owner name
- address
- phone
- website
- logo link
- Google review link
- calendar link
- support email
- offer URLs
- reply signatures

Rule: update custom values before turning on workflows.

## Custom Fields

Custom Fields store extra contact/opportunity/business-specific data beyond standard fields.

Use custom fields for:

- lead type
- service interest
- POS/CRM system
- preferred contact method
- consent status
- onboarding status
- review campaign preferences
- client-specific workflow data

Use custom values for reusable constants. Use custom fields for per-contact or per-record data.

## Contacts And Imports

HighLevel imports contacts through CSV.

Important import rules:

- CSV format only
- header row required
- every row needs at least one identifying field, usually name, email, or phone
- clean duplicate records before import
- clean phone formatting
- map fields carefully
- unmapped columns can be ignored
- admin permissions are usually required
- import status and errors can be reviewed in Bulk Actions

Optional import actions:

- create SmartList for imported contacts
- tag imported contacts
- add imported contacts to workflow
- import opportunities at the same time if the CSV has pipeline/stage/status fields

Sorter prepares lists. GHL Expert imports them.

## Bulk Actions

Bulk actions are powerful and can create irreversible changes.

Use caution with:

- bulk email
- bulk SMS
- bulk tag add
- bulk email verification
- bulk contact/company updates

Consent matters. HighLevel warns that importing contacts without proper consent can hurt sending reputation through bounces, unsubscribes, spam complaints, and blocklists.

## Pipelines And Opportunities

Pipelines visually track opportunities through stages.

Use pipelines for:

- sales
- onboarding
- service delivery
- renewals
- support/escalations

Good pipeline stages are action-oriented and clearly defined.

Examples:

- New Inquiry
- Qualified
- Appointment Scheduled
- Payment Collected
- Onboarding
- Waiting on Client
- Live
- Needs Attention

Deleting a stage should move existing opportunities to another stage, not lose them.

Opportunities can be created and updated by workflows. Prefer newer granular actions such as Create Opportunity and Update Opportunity instead of older combined actions when building new workflows.

## Communication Setup

Email, phone, and SMS setup enables client communication from HighLevel.

GHL Expert should know:

- email domain setup improves deliverability and sender reputation
- phone numbers are configured in Settings
- forwarding can route calls to a real number
- contacts can be messaged by SMS/email/phone from the contact record
- bulk SMS/email must be handled carefully with consent and pacing

For AOH services, message sending should be tested before launch.

## QA Checklist

Before a client account is considered core-ready:

- subaccount exists
- business settings are correct
- client user exists with safe permissions
- snapshot loaded if needed
- custom values updated
- custom fields exist if needed
- tags exist if needed
- pipeline/stages exist if needed
- contacts import process is defined
- phone/email/SMS setup tested if used
- billing/rebilling risks are known

## Source Links

- Admin vs user permissions: https://help.gohighlevel.com/en/support/solutions/articles/48001078296-admin-vs-user-permissions
- Subaccount roles and permissions: https://help.gohighlevel.com/support/solutions/articles/155000002544/
- Snapshots overview: https://help.gohighlevel.com/support/solutions/articles/48000982511-snapshots-overview
- Create snapshots: https://help.gohighlevel.com/support/solutions/articles/48000982512-creating-new-snapshots-in-highlevel
- Custom values settings: https://help.gohighlevel.com/support/solutions/articles/155000004705-custom-values-settings
- How to use custom values: https://help.gohighlevel.com/support/solutions/articles/48001161575
- Custom fields: https://help.gohighlevel.com/support/solutions/articles/48001161579-how-to-use-custom-fields
- Import contacts CSV: https://help.gohighlevel.com/en/support/solutions/articles/155000004432
- CSV formatting for imports: https://help.gohighlevel.com/support/solutions/articles/155000005143
- Contact bulk actions FAQ: https://help.gohighlevel.com/support/solutions/articles/155000002427-contacts-and-bulk-actions-faqs
- Pipelines overview: https://help.gohighlevel.com/support/solutions/articles/155000001982-understanding-pipelines
- Create pipelines: https://help.gohighlevel.com/en/support/solutions/articles/155000001985
- Create Opportunity action: https://help.gohighlevel.com/support/solutions/articles/155000004752-workflow-action-create-opportunity
- Update Opportunity action: https://help.gohighlevel.com/support/solutions/articles/155000004753-workflow-action-update-opportunity
- Email, phone, SMS setup: https://help.gohighlevel.com/support/solutions/articles/155000005058-getting-started-setup-email-phone-and-sms
