// Team profile kit — banner config + paste-ready profile copy per surface.
// Powers /preview/team-profiles and the /api/team-banner/[slug] route.

export type SurfaceKey =
  | "linkedin-company"
  | "facebook"
  | "x"
  | "instagram"
  | "gbp"
  | "mike"
  | "kip"
  | "teri";

export type ProfileLink = {
  field: string;
  value: string;
};

export type Surface = {
  key: SurfaceKey;
  label: string;
  type: "company" | "person";
  // Banner dimensions for the live platform
  bannerWidth: number | null;
  bannerHeight: number | null;
  // Source AI photo (sits at /public/banners/<slug>.jpg) — null when surface has no banner
  photoSlug: string | null;
  // Text overlay lines for the Satori banner composite
  overlay: {
    headlineLines: string[]; // primary copy
    accentLine?: string; // url or secondary
    align: "left" | "right" | "bottom-right" | "lower-left-and-upper-right";
  } | null;
  // Profile copy that goes into the platform
  profile: {
    headlineOrTagline?: { label: string; text: string; charLimit?: number };
    bio?: { label: string; text: string; charLimit?: number };
    about?: { label: string; text: string };
    extras?: { label: string; text: string }[];
  };
  // Things to paste into profile fields (website, contact, links, specialties, etc.)
  links: ProfileLink[];
};

const ABOUT_AOH_BOILERPLATE = `**About AI Outsource Hub:** We run AI for local businesses — done-for-you Review Automation, AI Visibility, AI receptionists, outbound, and content. No dashboards. Six services starting at $49/mo. You run the business. We run the AI. → aioutsourcehub.com`;

export const TEAM: Surface[] = [
  // ============================================================
  // COMPANY PAGES
  // ============================================================
  {
    key: "linkedin-company",
    label: "LinkedIn — Company Page",
    type: "company",
    bannerWidth: 1128,
    bannerHeight: 191,
    photoSlug: "linkedin-company",
    overlay: {
      headlineLines: ["We run the AI.", "You run the business."],
      accentLine: "aioutsourcehub.com",
      align: "right",
    },
    profile: {
      headlineOrTagline: {
        label: "Tagline (under company name, ~120 char)",
        text: "Done-for-you AI for local businesses. We run it — you don't learn it. From $49/mo. Free audit at aioutsourcehub.com.",
        charLimit: 120,
      },
      about: {
        label: "About (paste into the company page About field)",
        text: `AI Outsource Hub runs the AI work for local businesses that don't have time to learn it.

Six done-for-you services starting at $49/month: review automation, AI visibility, 24/7 phone answering, content production, listings optimization, and outbound lead engine.

No app to download. No dashboard to learn. Updates by text and email, daily.

Built for plumbers, HVAC, lawn care, dental, vet, med spa, pet groomers, salons — the kind of business that should be running AI but doesn't have anyone to set it up.

Free online-presence audit on the site. No sales call required.

→ aioutsourcehub.com`,
      },
      extras: [
        {
          label: "Specialties (comma-separated, paste into Specialties field)",
          text: "Review Automation, AI Visibility, AI Voice Agents, Content Production, Listings Management, Lead Generation, Local SEO, Google Business Profile, AI Search Optimization, GEO, AEO",
        },
      ],
    },
    links: [
      { field: "Website", value: "https://aioutsourcehub.com" },
      { field: "Custom button label", value: "Visit website" },
      { field: "Custom button URL", value: "https://aioutsourcehub.com/?utm_source=linkedin&utm_medium=company" },
      { field: "Industry", value: "Marketing Services" },
    ],
  },
  {
    key: "facebook",
    label: "Facebook — Page",
    type: "company",
    bannerWidth: 820,
    bannerHeight: 312,
    photoSlug: "facebook",
    overlay: {
      headlineLines: ["More reviews. More calls.", "More booked jobs."],
      accentLine: "aioutsourcehub.com — from $49/mo",
      align: "bottom-right",
    },
    profile: {
      bio: {
        label: "Short description (255 char)",
        text: "Done-for-you AI services for local businesses. Reviews, phone answering, AI search visibility, and content — we run it, you don't learn it. From $49/mo. No app, no dashboard. Daily updates by text and email.",
        charLimit: 255,
      },
      about: {
        label: "Long description (About field)",
        text: `AI Outsource Hub runs AI for local businesses. Reviews, AI search visibility, AI receptionists, content, ads — handled for you. No dashboards to log into. No contracts. Just results.

Six services, starting at $49/mo. Built for plumbing, HVAC, lawn care, dental, vet, med spa, pet grooming, and salon owners who want their phone to ring more without learning more software.

aioutsourcehub.com`,
      },
    },
    links: [
      { field: "Website", value: "https://aioutsourcehub.com" },
      { field: "CTA button", value: "Book Now" },
      { field: "CTA button URL", value: "https://link.hub360ai.com/widget/booking/fVfL3Xth5gEW9mRjZS56" },
      { field: "Contact email", value: "support@aioutsourcehub.com" },
    ],
  },
  {
    key: "x",
    label: "X / Twitter",
    type: "company",
    bannerWidth: 1500,
    bannerHeight: 500,
    photoSlug: "x",
    overlay: {
      headlineLines: ["We run the AI.", "You run the shop."],
      accentLine: "AOH · aioutsourcehub.com",
      align: "lower-left-and-upper-right",
    },
    profile: {
      bio: {
        label: "Bio (160 char)",
        text: "Done-for-you AI for local businesses. Reviews · AI search · 24/7 phone · content. We run it — you don't learn it. From $49/mo. aioutsourcehub.com",
        charLimit: 160,
      },
    },
    links: [
      { field: "Website", value: "https://aioutsourcehub.com" },
      { field: "Location", value: "Built for local businesses, US-wide" },
      { field: "Pinned tweet", value: "Lead with the after-hours-payback post (highest-scoring in the social pack)" },
    ],
  },
  {
    key: "instagram",
    label: "Instagram (no banner — profile pic + bio)",
    type: "company",
    bannerWidth: null,
    bannerHeight: null,
    photoSlug: null,
    overlay: null,
    profile: {
      bio: {
        label: "Bio (150 char)",
        text: `Done-for-you AI for local businesses ↓
Reviews · AI search · 24/7 phone · content
From $49/mo · we run it, you don't learn it`,
        charLimit: 150,
      },
      extras: [
        {
          label: "Profile picture",
          text: "Use https://aioutsourcehub.com/logos/aoh-icon-400-navy.png (icon on navy bg, 400×400). LinkedIn / X / FB / GBP can use the same.",
        },
        {
          label: "Native bio links (Instagram supports 5 since 2023 — Edit profile → Links → Add external link)",
          text: `1. Review Automation pricing  →  https://aioutsourcehub.com/pricing#review-automation
2. AI Visibility pricing      →  https://aioutsourcehub.com/pricing#ai-visibility
3. Whole Stack pricing        →  https://aioutsourcehub.com/pricing#whole-stack
4. Relay pricing              →  https://aioutsourcehub.com/pricing#relay
5. Lost-Revenue Calculator    →  https://aioutsourcehub.com/#calculator`,
        },
      ],
    },
    links: [
      { field: "Category", value: "Marketing Agency" },
    ],
  },
  {
    key: "gbp",
    label: "Google Business Profile",
    type: "company",
    bannerWidth: 1408,
    bannerHeight: 768,
    photoSlug: "gbp-cover",
    overlay: null, // GBP cover stays as-is — AI photo has hand-drawn wordmark in it
    profile: {
      about: {
        label: "Business description (750 char)",
        text: `AI Outsource Hub runs the AI for local service businesses — plumbers, HVAC, dental, vet, med spa, pet groomers, salons, lawn care. We do six things: review automation, AI visibility (get cited in ChatGPT, Google AI, Claude), 24/7 bilingual phone answering, content production, listings management, and outbound lead generation. Plans start at $49/month. No app, no dashboard, no platform to learn — we run it for you and send daily updates by text and email. Free online-presence audit on our site. Built for owners who want AI working in their business without becoming experts in it.`,
      },
      extras: [
        {
          label: "Primary category",
          text: "Marketing Agency",
        },
        {
          label: "Additional categories",
          text: "Internet Marketing Service · Software Company · Business Management Consultant",
        },
        {
          label: "Services to list",
          text: "Review Automation ($49/mo) · AI Visibility ($179/mo) · Reach Lead Engine ($249/mo) · AI Phone Answering (Relay) · Content Production (Studio) · Listings Management",
        },
      ],
    },
    links: [
      { field: "Website", value: "https://aioutsourcehub.com" },
      { field: "Appointment URL", value: "https://link.hub360ai.com/widget/booking/fVfL3Xth5gEW9mRjZS56" },
      { field: "Logo", value: "https://aioutsourcehub.com/logos/aoh-icon-1080.png" },
    ],
  },

  // ============================================================
  // PERSONAL LINKEDIN — MIKE, KIP, TERI
  // ============================================================
  {
    key: "mike",
    label: "Mike Egidio — LinkedIn (personal)",
    type: "person",
    bannerWidth: 1584,
    bannerHeight: 396,
    photoSlug: "mike",
    overlay: {
      headlineLines: [
        "I built AOH so local-business owners",
        "can run their business —",
        "and we run the AI.",
      ],
      accentLine: "aioutsourcehub.com",
      align: "left",
    },
    profile: {
      headlineOrTagline: {
        label: "Headline (220 char)",
        text: "Founder, AI Outsource Hub · Done-for-you AI for local businesses — reviews, phones, AI search visibility, content · We run it, you don't learn it · From $49/mo · Free audit at aioutsourcehub.com",
        charLimit: 220,
      },
      about: {
        label: "About",
        text: `I run AI Outsource Hub.

AOH is built for one type of person: the owner of a local service business — plumber, HVAC, dental, vet, med spa, pet groomer, salon — who knows AI matters but won't hire a developer and won't sit through a dashboard tutorial.

So we run it for them. Six done-for-you services, starting at $49/month. No app to download. No dashboard to log into. Daily updates by text and email.

What we do:
· Review automation (collect, reply, rank on Google)
· AI visibility (get cited in ChatGPT, Google AI Overviews, Claude)
· 24/7 bilingual phone answering
· Content production
· Listings + GBP optimization
· Outbound lead engine

Before AOH I spent years watching small businesses get sold software they never used. AOH is the opposite of that — a service, not a tool.

Free presence audit on the site. No sales call needed to see it.

→ aioutsourcehub.com

---

${ABOUT_AOH_BOILERPLATE}`,
      },
      extras: [
        {
          label: "Featured links (pin 3 in Featured section)",
          text: "Free audit · Pricing · Latest blog post",
        },
      ],
    },
    links: [
      { field: "Contact email", value: "mike@aioutsourcehub.com" },
      { field: "Website", value: "https://aioutsourcehub.com" },
    ],
  },
  {
    key: "kip",
    label: "Kip Leathers — LinkedIn (personal)",
    type: "person",
    bannerWidth: 1584,
    bannerHeight: 396,
    photoSlug: "kip",
    overlay: {
      headlineLines: [
        "I find the right owners to talk to.",
        "Then I open the conversation.",
      ],
      accentLine: "aioutsourcehub.com",
      align: "left",
    },
    profile: {
      headlineOrTagline: {
        label: "Headline (220 char)",
        text: "Business Development, AI Outsource Hub · I find the local-business owners worth talking to — and open the conversation · Done-for-you AI from $49/mo · aioutsourcehub.com",
        charLimit: 220,
      },
      about: {
        label: "About",
        text: `I run business development at AI Outsource Hub.

My job is two things: find the local-business owners who'd actually benefit from done-for-you AI — and start the conversation in a way that doesn't waste their time.

AOH runs the AI work for plumbers, HVAC, dental, vet, med spa, pet groomers, salons, lawn care. Six services from $49/month. No app, no dashboard, no platform to learn.

If you run a local business and you've been ignoring "the AI thing" because it's too much to figure out — that's exactly who we built this for. Reach out and I'll show you what a free audit looks like for your business.

→ aioutsourcehub.com

---

${ABOUT_AOH_BOILERPLATE}`,
      },
      extras: [
        {
          label: "Featured links (pin 3 in Featured section)",
          text: "Free audit · Reviews service page · About AOH",
        },
      ],
    },
    links: [
      { field: "Contact email", value: "kip@aioutsourcehub.com" },
      { field: "Website", value: "https://aioutsourcehub.com" },
    ],
  },
  {
    key: "teri",
    label: "Teri Egidio — LinkedIn (personal)",
    type: "person",
    bannerWidth: 1584,
    bannerHeight: 396,
    photoSlug: "teri",
    overlay: {
      headlineLines: ["Day one feels handled.", "That's my job."],
      accentLine: "aioutsourcehub.com",
      align: "left",
    },
    profile: {
      headlineOrTagline: {
        label: "Headline (220 char)",
        text: "Sales Manager, AI Outsource Hub · I run inbound + onboarding so every new client's day one feels handled · Done-for-you AI for local businesses from $49/mo · aioutsourcehub.com",
        charLimit: 220,
      },
      about: {
        label: "About",
        text: `I run the inbound pipeline and onboarding at AI Outsource Hub.

Every new client at AOH talks to me first. My job: make sure day one feels handled — not like you just bought another piece of software you have to figure out.

AOH is done-for-you AI for local businesses: reviews, AI search visibility, 24/7 phone answering, content, listings, lead gen. Six services from $49/month. No app to download. No dashboard to learn. Updates by text and email, daily.

If you're an owner who's tired of being sold tools you never use — we're the opposite of that. Free audit on the site, no sales call required to see it.

→ aioutsourcehub.com

---

${ABOUT_AOH_BOILERPLATE}`,
      },
      extras: [
        {
          label: "Featured links (pin 3 in Featured section)",
          text: "Free audit · Pricing · How onboarding works",
        },
      ],
    },
    links: [
      { field: "Contact email", value: "teri@aioutsourcehub.com" },
      { field: "Website", value: "https://aioutsourcehub.com" },
    ],
  },
];
