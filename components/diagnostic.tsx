import Link from "next/link";
import { ArrowRight } from "lucide-react";

const painPoints = [
  {
    title: "Reviews are slipping",
    consequence: "Customers check before they call. Fewer stars, fewer calls.",
    href: "/reviews",
  },
  {
    title: "Phone rings to voicemail",
    consequence: "Every missed call is a job that went to someone else.",
    href: "/receptionist",
  },
  {
    title: "Need more leads",
    consequence: "You do great work, but the calendar has gaps.",
    href: "/sales-rep",
  },
  {
    title: "Site looks dated",
    consequence: "Customers leave before they learn what you do.",
    href: "/site-refresh",
  },
];

export function Diagnostic() {
  return (
    <section id="diagnostic" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            What&apos;s hurting?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Pick the one that costs you most. We&apos;ll show you what changes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {painPoints.map((point, index) => (
            <Link
              key={point.href}
              href={point.href}
              className="group relative bg-card border border-border rounded-xl p-6 hover:border-accent/50 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(14,165,233,0.15)] transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground group-hover:text-accent transition-colors">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {point.consequence}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
