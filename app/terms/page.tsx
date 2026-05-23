import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection } from "@/components/PageBody";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for GetMeFound. No long-term contracts. Cancel anytime. Plain-language terms covering what you get and what we expect.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="Plain-language terms covering GetMeFound services, billing, data access, and cancellation."
      />
      <PageBody>
        <PageSection>
          <div className="space-y-10">
            <p className="text-sm text-[var(--color-text-muted)]">Last updated: May 22, 2026</p>

            <div>
              <h2 className="text-2xl font-bold mb-3">No long-term contracts</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                GetMeFound services are month-to-month unless a separate written agreement says
                otherwise. You can cancel by emailing{" "}
                <a href="mailto:support@getmefound.ai" className="text-[var(--color-accent)] hover:underline">
                  support@getmefound.ai
                </a>
                . When you cancel, we stop billing at the end of the current billing period and
                wind down active services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">What you get</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                You get the services described on the page, proposal, or checkout you approved.
                Search systems, maps, AI answers, and review platforms change over time, so we do
                not promise a specific ranking or recommendation outcome. We do promise to operate
                the work competently, transparently, and consistently.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">What we expect from you</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                You agree to provide accurate business information and access to the accounts or
                integrations needed to perform the service. You are responsible for following
                platform rules, including review policies, messaging consent rules, and spam laws.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Billing and refunds</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Plans are billed monthly in advance. Monthly fees are not refundable once the
                billing period starts, but there are no cancellation penalties. One-time setup
                fees are refundable only before setup work begins. If you believe there is a
                billing mistake, email us and we will review it.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Communications</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                We may contact you by email, phone, or SMS for onboarding, service alerts, account
                updates, and support. If a service includes outreach or customer messaging, you
                confirm that any contact lists you provide have the required consent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Liability</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                GetMeFound is not liable for losses caused by third-party platform changes,
                account restrictions, customer behavior, inaccurate information you provide, or
                factors outside our reasonable control. Our liability is capped at the amount you
                paid us in the 90 days before the issue.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Changes to these terms</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                If we change these terms in a way that materially affects active clients, we will
                provide notice before the change takes effect.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Contact</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Questions? Email{" "}
                <a href="mailto:support@getmefound.ai" className="text-[var(--color-accent)] hover:underline">
                  support@getmefound.ai
                </a>
                .
              </p>
            </div>
          </div>
        </PageSection>
      </PageBody>
    </>
  );
}
