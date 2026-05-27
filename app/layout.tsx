import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CheckoutClickTracker } from "@/components/checkout/CheckoutClickTracker";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getmefound.ai"),
  title: {
    default: "GetMeFound — Google’s AI Picks Who Gets Found",
    template: "%s - GetMeFound",
  },
  description:
    "Google’s AI now recommends one or two local businesses — not ten pages. We make yours the one it picks. Done for you in 48 hours. No contract.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "GetMeFound — Google Doesn’t Rank You Anymore. It Picks You.",
    description:
      "Done-for-you Google visibility, reviews, and AI search presence for local businesses. No contracts. Live in 48 hours.",
    url: "https://getmefound.ai",
    siteName: "GetMeFound",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GetMeFound — Google Doesn’t Rank You Anymore. It Picks You.",
    description:
      "Done-for-you Google visibility, reviews, and AI search presence for local businesses. No contracts. Live in 48 hours.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GetMeFound",
  url: "https://getmefound.ai",
  description:
    "Google's AI now picks who gets found. We make sure it picks your business. Done-for-you setup in 48 hours.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "support",
    email: "support@getmefound.ai",
  },
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GetMeFound",
  url: "https://getmefound.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-accent-text)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)]"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Navbar />
        {children}
        <Footer />
        <CheckoutClickTracker />
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
