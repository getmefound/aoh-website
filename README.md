# aoh-website

Live at **[aioutsourcehub.com](https://aioutsourcehub.com)** — the marketing site for [AI Outsource Hub](https://aioutsourcehub.com), a service that runs AI tools on behalf of local businesses.

> **Hiring devs?** Read this whole README before quoting. Half the things people pitch us are already done. Real scope is at the bottom under [What we're hiring for](#what-were-hiring-for).

## Stack

- **Next.js 16** (App Router, Turbopack, Server Components)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**
- **framer-motion** for animations
- **Vercel** hosting (free tier, auto-deploy from GitHub `main`)
- **V0** (premium) for AI-assisted UI generation, bidirectional GitHub sync
- **Cloudflare Turnstile** for form spam protection
- **GHL (GoHighLevel)** webhook for lead capture

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
```

## What's already done (don't quote for these)

### Pages — 12 routes, all server-rendered + static-prerendered
- `/` home with hero, revenue calculator, services grid, social proof, FAQ
- `/about`, `/pricing`, `/contact`, `/faq`, `/privacy`, `/terms`
- 5 service pages: `/reviews`, `/ai-visibility`, `/relay`, `/studio`, `/rankings`

### SEO — full foundation, indexed in Google
- `app/sitemap.ts` — programmatic sitemap of all routes
- `app/robots.ts` + `public/llms.txt` — AI-crawler-friendly (GPTBot, ClaudeBot, PerplexityBot, etc. all explicitly allowed)
- `app/opengraph-image.tsx` — auto-generates 1200×630 branded OG image via `next/og`
- Per-page metadata: unique title, description, `alternates.canonical`
- JSON-LD on every page: `Organization` + `WebSite` (root), `Service` schema (each service page), `BreadcrumbList` (sub-pages), `FAQPage` (home + `/faq`)
- `next.config.ts` 301/308 redirects from ~150 old WordPress URLs → closest new equivalents
- Verified domain in Google Search Console (DNS TXT)

### Lead capture
- `/api/report` POST endpoint: validates email, Cloudflare Turnstile check, in-memory rate-limit (3/hour/IP), forwards to GHL webhook
- Hero form on `/` is wired end-to-end and converting
- A/B variant logic in payload (`campaign`, `visualVariant` fields)

### Brand
- Locked design system in `app/globals.css` — CSS variables for colors (cream `#F8F6F1`, navy `#0A1628`, accent green `#2D6A4F`), Geist font family
- Components: `Navbar`, `Footer`, `PageHeader`, `PageBody` (with `PageSection`, `CtaBlock`), `RevenueCalculator`, `HeroEmailForm`, `HeroVisualAI`, `HeroVisualReviews`, `FAQ`, `SocialProof`
- Existing animations: `hero-roll-up` and `fade-up` keyframes, `prefers-reduced-motion` respected

### Infra
- Auto-deploy from `main` to Vercel
- V0 bidirectional sync (V0 chats commit to per-chat branches)
- Vercel preview URLs per branch: `aoh-website-git-<branch>-aoh-inc.vercel.app`

## What we're hiring for

**Two streams, one engineer:**

### Stream A — Polish + finish AOH's own site (this repo)

| Item | Scope |
|---|---|
| Mobile menu | Navbar has the hamburger button. Slide-out drawer logic is not built. Wire it. |
| `/contact` form POST | UI exists. No backend handler. Add a `/api/contact` route mirroring `/api/report` (validate, Turnstile, GHL webhook). |
| Scroll-triggered animations | Replace static blocks with framer-motion `whileInView` reveals on service pages, FAQ accordions, pricing cards. Tasteful, not casino-style. |
| Hero visuals refinement | `HeroVisualAI` + `HeroVisualReviews` exist. Tune motion, timing, and the alternation logic. |
| Page transitions | Optional. View-transitions API or framer-motion layout animations between routes. |
| Lighthouse pass | Never audited. Target Lighthouse 95+ across the board. Image optimization, font loading, render-blocking JS. |
| Accessibility pass | Full WCAG 2.1 AA sweep. Keyboard nav, focus states, ARIA on the FAQ accordion + Navbar dropdown, alt text audit. |

**Stream A is one-time work. Estimated 20-40 hours.**

### Stream B — Recurring client website rebuilds

This is where the actual ongoing revenue is. AOH sells a [premium "Rebuild" tier](https://aioutsourcehub.com/ai-visibility) at **$3,499 setup + $249/month** to existing clients. Each Rebuild = a custom Next.js site built on this design system for a real local business client.

| Per-client scope | Detail |
|---|---|
| Effort | 25–35 hours per client |
| Stack | This exact stack (Next.js 16, Tailwind v4, this design system) |
| Deliverable | Hosted on Vercel, multi-page, full SEO foundation (we ship the same `sitemap.ts` + JSON-LD pattern), client-specific niche schema (`VeterinaryCare`, `FuneralHome`, etc.), Lighthouse 95+ |
| Compensation | $60/hr (≈$1,800 per Rebuild client). Mike handles client comms + ongoing schema work; you build the site. |
| Cadence | Project-based as Rebuild clients sign |
| Brand handling | Each client's brand layered onto AOH's locked component primitives (PageHeader, PageBody, etc.). Don't rebuild the design system per client — extend it. |

**Stream B is ongoing. We expect 1-3 Rebuild client builds per quarter at first, scaling up.**

### What we're NOT hiring for (already covered)

- ❌ "Build out a multi-page Next.js site" — done
- ❌ "Add a sitemap and robots.txt" — done
- ❌ "Set up Vercel hosting" — done
- ❌ "Add structured data / schema markup" — done, with niche-specific subtype expansion as Pro-tier client work
- ❌ "Set up SEO" — full foundation in place, GSC verified, sitemap submitted
- ❌ "Migrate from WordPress" — done; 301 redirects in `next.config.ts` cover the orphans
- ❌ "Add a contact form UI" — UI is built, only the POST handler is missing (one route file)
- ❌ "Hook up V0 / GitHub / Vercel" — all three connected and live
- ❌ Backend / database / auth — none of that lives in this repo. AOH's agent fleet runs on a separate VPS; this is the marketing surface.

## How to apply

Read the [What we're hiring for](#what-were-hiring-for) section above. Then email **support@aioutsourcehub.com** with:

1. Three Next.js + Tailwind sites you've shipped (links, not screenshots)
2. One Lighthouse score from your favorite recent project (real, not aspirational)
3. Your hourly rate
4. A one-paragraph note on which Stream interests you more (A polish, B client builds, or both) and why

Don't send a generic dev-portfolio email. We read all of these and the cookie-cutter ones go in the trash.

## Repo layout

```
app/                    # routes (App Router)
  api/report/route.ts   # lead-capture POST endpoint
  <route>/page.tsx      # one per route
  layout.tsx            # root metadata + JSON-LD
  sitemap.ts            # programmatic sitemap
  robots.ts             # programmatic robots.txt
  opengraph-image.tsx   # 1200×630 OG image generator
components/             # shared UI
  hero/                 # hero-specific
  sections/             # page-section primitives
lib/
  faq.ts                # FAQ data + JSON-LD schema
  seo.ts                # SITE_URL + breadcrumb helper
  email-validation.ts
public/                 # static assets, llms.txt, brand SVGs
next.config.ts          # WP-redirect map
middleware.ts           # rate-limit on /api/report (rename to proxy.ts in Next 16 idiomatic form — TODO)
```

## Conventions

- This is **Next.js 16** — APIs differ from 14/15. Read `node_modules/next/dist/docs/` before assuming.
- Every page exports `metadata` with `alternates.canonical`. Don't skip canonical.
- JSON-LD lives on the page that owns it (Service schema on the service page, not centralized).
- FAQ data has one source of truth: `lib/faq.ts`.
- Brand colors are CSS variables in `app/globals.css`. Don't hardcode hex.
- No new comments unless the WHY is non-obvious.
- Vercel auto-deploys `main`. Always work on a feature branch + open a PR.

## License

Proprietary — AI Outsource Hub. All rights reserved.
