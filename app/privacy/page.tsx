import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection } from "@/components/PageBody";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How GetMeFound collects, uses, and protects your information. We collect only what we need to deliver our services.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How GetMeFound collects, uses, and protects your information. Plain language. No dark patterns."
      />
      <PageBody>
        <PageSection>
          <div className="prose-section space-y-10 text-[var(--color-text-body)]">
            <p className="text-sm text-[var(--color-text-muted)]">Last updated: May 22, 2026</p>

            <div>
              <h2 className="text-2xl font-bold mb-3">What we collect</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                When you request a report or contact us, we collect the information you submit,
                such as your name, business email, business name, website, location, and message.
                When you become a client, we collect the access and business details needed to
                perform the service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">How we use it</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                We use your information to deliver reports, respond to inquiries, onboard clients,
                improve local visibility assets, operate approved integrations, and provide
                support. We do not sell your data and we do not share it with third parties for
                their advertising.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Customer and business data</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                If a service uses customer contact information, you are responsible for confirming
                that you have permission to use that information. We use customer data only to
                perform the service you approved and delete it on request when operationally
                practical and legally permitted.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Payment information</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Payment details are handled by our payment processor. We do not store full card
                numbers on our servers. We may retain billing records for tax, accounting, and
                dispute-resolution purposes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Third parties we work with</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-3">
                We use vendors to host the website, process forms, send email, run AI workflows,
                analyze site performance, and support client services. We share only what each
                vendor needs to do its job.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-muted)] leading-relaxed">
                <li><strong>Vercel</strong> - website hosting</li>
                <li><strong>Google Workspace</strong> - business email and files</li>
                <li><strong>OpenAI and other AI providers</strong> - AI processing for approved workflows</li>
                <li><strong>Payment processors</strong> - billing and receipts</li>
                <li><strong>CRM, email, analytics, and automation tools</strong> - client communication and operations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Cookies and analytics</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                We use minimal analytics to understand which pages perform and to improve the
                site. We do not sell visitor data.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Your rights</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                You can request a copy of your data, correct inaccuracies, or ask us to delete
                data by emailing{" "}
                <a href="mailto:support@getmefound.ai" className="text-[var(--color-accent)] hover:underline">
                  support@getmefound.ai
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Changes to this policy</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                If we change this policy in a way that materially affects active clients, we will
                provide notice before the change takes effect.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Contact</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Questions about this policy? Email{" "}
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
