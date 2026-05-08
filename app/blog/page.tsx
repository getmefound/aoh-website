import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PageBody, PageSection } from "@/components/PageBody";
import { getAllPosts } from "@/lib/blog";
import { pageBreadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "How AI changes how customers find local businesses. Practical guides, honest pricing math, and the moves we run for clients.",
  alternates: { canonical: "/blog" },
};

const breadcrumb = pageBreadcrumbs("Blog", "/blog");

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <PageHeader
        eyebrow="Blog"
        title="How AI is changing local search."
        subtitle="Practical guides, honest pricing math, and the moves we actually run for clients."
      />
      <PageBody>
        <PageSection>
          {posts.length === 0 ? (
            <div className="text-[var(--color-text-muted)]">No posts yet.</div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((p) => (
                <li
                  key={p.slug}
                  className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-8 hover:shadow-lg transition-shadow"
                >
                  <Link href={`/blog/${p.slug}`} className="block group">
                    <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold mb-3">
                      {formatDate(p.date)} · {p.readingMinutes} min read
                    </p>
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                      {p.title}
                    </h2>
                    <p className="text-[var(--color-text-muted)] leading-relaxed">
                      {p.description}
                    </p>
                    {p.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="text-xs font-medium text-[var(--color-accent)] bg-[var(--color-accent-soft)] px-2.5 py-1 rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </PageSection>
      </PageBody>
    </>
  );
}
