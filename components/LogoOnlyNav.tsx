import Link from "next/link";

export function LogoOnlyNav({ backHref = "/pricing", backLabel = "← All plans" }: { backHref?: string; backLabel?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-(--color-hero-bg)/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-hero-text"
          aria-label="GetMeFound home"
        >
          GetMeFound
        </Link>
        <Link
          href={backHref}
          className="text-sm text-hero-subtext/70 transition-colors hover:text-hero-text"
        >
          {backLabel}
        </Link>
      </div>
    </header>
  );
}
