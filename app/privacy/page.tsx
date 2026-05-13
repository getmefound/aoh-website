import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection } from "@/components/PageBody";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How AI Outsource Hub collects, uses, and protects your information. We collect only what we need to deliver our services.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How AI Outsource Hub collects, uses, and protects your information. Plain language. No dark patterns."
      />
      <PageBody>
        <PageSection>
          <div className="prose-section space-y-10 text-[var(--color-text-body)]">
            <p className="text-sm text-[var(--color-text-muted)]">Last updated: May 13, 2026</p>

            <div>
              <h2 className="text-2xl font-bold mb-3">What we collect</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                When you request a free report, we collect your business email and the URL of
                your business website. When you become a client, we collect the information
                needed to operate the AI tools on your behalf — business name, address, phone
                number, Google Business Profile URL, social account credentials (via OAuth), and
                a few words describing your brand voice.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">How we use it</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                We use your information to deliver the services you signed up for — sending review
                requests to your customers, posting AI responses on your behalf, optimizing your
                profiles, and producing content for your accounts. We do not sell your data. We do
                not share it with third parties for advertising.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Customer data</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                When AOH sends a review request to your customer, we transmit the customer's name
                and contact info via SMS or email. We retain these records for the duration of
                the engagement and delete them on request or when you cancel.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Payment information</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                We use{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  Stripe
                </a>
                {" "}to process payments. Your card details are submitted directly to Stripe and
                never touch AOH servers. We retain billing records (name, business name, amount,
                date — not card numbers) for tax and accounting purposes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Voice data (Relay AI receptionist)</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-3">
                If you use our Relay AI receptionist service, inbound calls to your business are
                answered, transcribed, and processed by AI to qualify leads, book appointments,
                and route messages. Call recordings and transcripts are retained for 90 days for
                quality, training, and dispute resolution — then deleted unless you've requested
                retention for a specific business reason.
              </p>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                In states that require it (California, Florida, Illinois, and others with
                two-party-consent laws), Relay discloses at call start that the call is being
                handled by an AI assistant and may be recorded. Callers can ask to speak with a
                human at any time.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Third parties we work with</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-3">
                To operate the services, we rely on a handful of vendors. We share with each only
                what they need to do their part:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-muted)] leading-relaxed">
                <li><strong>Stripe</strong> — payment processing</li>
                <li><strong>Hub360ai / GoHighLevel</strong> — CRM, SMS, email, scheduling, voice routing</li>
                <li><strong>Twilio</strong> — phone numbers and SMS delivery (via Hub360ai)</li>
                <li><strong>Anthropic, OpenAI, Google</strong> — AI model providers for content, voice handling, and review responses. Your data is sent only when actively processing a request; under their business APIs, this data is not used to train their models</li>
                <li><strong>Vercel</strong> — website hosting</li>
                <li><strong>Google Workspace</strong> — internal team email</li>
              </ul>
              <p className="text-[var(--color-text-muted)] leading-relaxed mt-3">
                None of these vendors sell your data or use it for their own advertising.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Cookies and analytics</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                We use minimal first-party analytics to understand which pages perform. We do not
                use third-party advertising trackers on aioutsourcehub.com.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Your rights</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                You can request a copy of your data, correct inaccuracies, or have your data
                deleted by emailing{" "}
                <a
                  href="mailto:support@aioutsourcehub.com"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  support@aioutsourcehub.com
                </a>
                . We respond within 30 days.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">California residents (CCPA / CPRA)</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                If you live in California, you have the right to know what personal information we
                hold, request a copy, correct it, delete it, or limit how we use it. We do not
                sell or share personal information for cross-context behavioral advertising — the
                kind that triggers CCPA's "Do Not Sell" requirement. Email{" "}
                <a
                  href="mailto:support@aioutsourcehub.com"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  support@aioutsourcehub.com
                </a>
                {" "}to exercise these rights. We respond within 45 days.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Changes to this policy</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                If we change this policy in a way that materially affects how we use your data,
                we'll email you 30 days in advance. You can cancel before the change takes effect.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Contact</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Questions about this policy? Email{" "}
                <a
                  href="mailto:support@aioutsourcehub.com"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  support@aioutsourcehub.com
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
