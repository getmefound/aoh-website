import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection } from "@/components/PageBody";
import { ContactForm } from "@/components/ContactForm";
import { GhlContactEmbed } from "@/components/GhlContactEmbed";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about AOH? We answer them. Email support@aioutsourcehub.com or send us a message.",
  alternates: { canonical: "/contact" },
};

const breadcrumb = pageBreadcrumbs("Contact", "/contact");

export default function ContactPage() {
  const ghlEmbedSrc = process.env.NEXT_PUBLIC_GHL_CONTACT_FORM_EMBED_URL?.trim();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PageHeader
        eyebrow="Contact"
        title="Talk to a human."
        subtitle="Questions about pricing, setup, or whether AOH is right for your business? We answer them — usually within a few hours."
      />
      <PageBody>
        <PageSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Direct contact</h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                Email is the fastest way to reach us. Most messages get a reply the same day.
              </p>
              <ul className="space-y-3 text-[var(--color-text-body)]">
                <li>
                  <span className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold mb-1">
                    Email
                  </span>
                  <a
                    href="mailto:support@aioutsourcehub.com"
                    className="text-[var(--color-accent)] hover:underline font-medium"
                  >
                    support@aioutsourcehub.com
                  </a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold mb-1">
                    Website
                  </span>
                  <a
                    href="https://aioutsourcehub.com"
                    className="text-[var(--color-accent)] hover:underline font-medium"
                  >
                    aioutsourcehub.com
                  </a>
                </li>
              </ul>
            </div>

            {ghlEmbedSrc ? <GhlContactEmbed src={ghlEmbedSrc} /> : <ContactForm />}
          </div>
        </PageSection>
      </PageBody>
    </>
  );
}
