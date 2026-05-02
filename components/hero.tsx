import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground text-balance animate-fade-up">
          We run AI for local businesses. You don&apos;t learn it.
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance animate-fade-up animation-delay-100">
          The phone gets answered. Reviews go up. You keep doing the work that pays you.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-200">
          <Link
            href="#diagnostic"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
          >
            Run my free diagnostic
          </Link>
          <Link
            href="#services"
            className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
          >
            See what we run
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
