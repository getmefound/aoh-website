export type CheckoutProduct = {
  slug: string;
  name: string;
  price: string;
  cadence: string;
  setup: string;
  summary: string;
  whatYouGet: string[];
  ctaUrl: string;
  ctaKind: "subscribe" | "book";
};

export const CHECKOUT_PRODUCTS: CheckoutProduct[] = [
  {
    slug: "get-found-refresh",
    name: "Get Found Refresh",
    price: "$149",
    cadence: "one-time",
    setup: "No contract",
    summary:
      "A fast Google-facing visibility cleanup for local businesses that need to look current and trustworthy.",
    whatYouGet: [
      "Google Business Profile basics reviewed",
      "Name, address, phone, website, category, hours, and services checked",
      "Review link and public trust signals checked",
      "Simple before/after notes",
      "One short action list for what to fix next",
    ],
    ctaUrl: "/contact",
    ctaKind: "subscribe",
  },
  {
    slug: "stay-found",
    name: "Stay Found",
    price: "$49",
    cadence: "/month",
    setup: "No contract",
    summary:
      "Monthly profile and visibility upkeep so the business does not go stale after the first cleanup.",
    whatYouGet: [
      "Monthly Google profile and local visibility check",
      "Profile drift and missing-info watch",
      "Review path and reputation signal check",
      "Simple monthly recap",
      "Recommended next move for the owner",
    ],
    ctaUrl: "/contact",
    ctaKind: "subscribe",
  },
  {
    slug: "review-engine",
    name: "Review Engine",
    price: "$149",
    cadence: "/month",
    setup: "No contract",
    summary:
      "Email-first review requests for current and future customers after a completed job, visit, or purchase.",
    whatYouGet: [
      "Email review requests to current and future customers",
      "Manual upload or POS/export workflow planning",
      "Google review link and review-ready timing",
      "Suppression list for customers who should not be asked",
      "Monthly sent, clicked, and review proof recap",
    ],
    ctaUrl: "/contact",
    ctaKind: "subscribe",
  },
  {
    slug: "review-voice",
    name: "Review Voice",
    price: "+$49",
    cadence: "/month",
    setup: "Add-on",
    summary:
      "AI review reply drafts in the client's voice, with approval-first safeguards before anything is posted.",
    whatYouGet: [
      "Client voice profile",
      "AI review reply drafts",
      "Escalation rules for sensitive reviews",
      "Approval-first workflow",
      "Manager audit trail",
    ],
    ctaUrl: "/contact",
    ctaKind: "subscribe",
  },
];

export function getCheckoutProduct(slug: string): CheckoutProduct | undefined {
  return CHECKOUT_PRODUCTS.find((p) => p.slug === slug);
}
