import Link from "next/link";

export function Footer() {
  return (
    <footer id="contact" className="py-12 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Wordmark */}
          <div className="flex items-center gap-1">
            <span className="text-lg font-light text-foreground/80">AI</span>
            <span className="text-lg font-medium text-foreground">Outsource Hub</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <a
            href="mailto:hello@aioutsourcehub.com"
            className="hover:text-foreground transition-colors"
          >
            hello@aioutsourcehub.com
          </a>
          <p>&copy; 2026 AI Outsource Hub</p>
        </div>
      </div>
    </footer>
  );
}
