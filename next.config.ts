import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/about-us/", destination: "/about", permanent: true },
      { source: "/faqs", destination: "/faq", permanent: true },
      { source: "/faqs/", destination: "/faq", permanent: true },
      { source: "/team", destination: "/about", permanent: true },
      { source: "/team/", destination: "/about", permanent: true },
      { source: "/why-ai", destination: "/ai-visibility", permanent: true },
      { source: "/why-ai/", destination: "/ai-visibility", permanent: true },
      { source: "/zemfar-why-ai", destination: "/ai-visibility", permanent: true },
      { source: "/zemfar-why-ai-v2", destination: "/ai-visibility", permanent: true },
      { source: "/ai-voice-agents", destination: "/relay", permanent: true },
      { source: "/ai-voice-agents/", destination: "/relay", permanent: true },
      { source: "/ai-powered-services", destination: "/", permanent: true },
      { source: "/ai-powered-services/", destination: "/", permanent: true },
      { source: "/ai-powered-services-old", destination: "/", permanent: true },
      { source: "/ai-products-services", destination: "/", permanent: true },
      { source: "/ai-automations", destination: "/", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/privacy-policy/", destination: "/privacy", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
      { source: "/terms-and-conditions/", destination: "/terms", permanent: true },
      { source: "/terms-and-disclosures", destination: "/terms", permanent: true },
      { source: "/terms-and-disclosures/", destination: "/terms", permanent: true },
      { source: "/review-boost", destination: "/reviews", permanent: true },
      { source: "/review-boost/", destination: "/reviews", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/", destination: "/", permanent: true },
      { source: "/custom-solutions", destination: "/contact", permanent: true },
      { source: "/custom-solutions/", destination: "/contact", permanent: true },

      { source: "/:slug(zemfar-.*)", destination: "/", permanent: true },

      { source: "/service/:path*", destination: "/", permanent: true },
      { source: "/service_category/:path*", destination: "/", permanent: true },
      { source: "/product/:path*", destination: "/", permanent: true },
      { source: "/product-category/:path*", destination: "/", permanent: true },
      { source: "/product-tag/:path*", destination: "/", permanent: true },
      { source: "/portfolio/:path*", destination: "/", permanent: true },
      { source: "/portfolio_category/:path*", destination: "/", permanent: true },
      { source: "/category/:path*", destination: "/", permanent: true },
      { source: "/tag/:path*", destination: "/", permanent: true },
      { source: "/elementskit-content/:path*", destination: "/", permanent: true },
      { source: "/header/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
