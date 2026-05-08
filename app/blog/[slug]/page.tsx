import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageBody, PageSection } from "@/components/PageBody";
import { getAllSlugs, getPost } from "@/lib/blog";
import { SITE_URL, breadcrumbSchema } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      url: `${SITE_URL}/blog/${post.slug}`,
      ...(post.ogImage ? { images: [post.ogImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(post.ogImage ? { images: [post.ogImage] } : {}),
    },
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "AI Outsource Hub",
      url: SITE_URL,
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    ...(post.ogImage ? { image: post.ogImage } : {}),
  };

  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <article className="bg-[var(--color-bg-page)]">
        <header className="bg-[var(--color-hero-bg)] text-[var(--color-hero-text)] py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <Link
              href="/blog"
              className="inline-block text-sm text-[var(--color-hero-subtext)] hover:text-[var(--color-hero-text)] mb-6 transition-colors"
            >
              ← All posts
            </Link>
            <p className="text-xs uppercase tracking-wider text-[var(--color-hero-subtext)] font-semibold mb-4">
              {formatDate(post.date)} · {post.readingMinutes} min read
            </p>
            <h1 className="font-semibold leading-[1.1] tracking-tight text-3xl md:text-5xl mb-6">
              {post.title}
            </h1>
            <p className="text-lg text-[var(--color-hero-subtext)] leading-relaxed">
              {post.description}
            </p>
          </div>
        </header>

        <PageBody>
          <PageSection>
            <div
              className="post-content max-w-3xl mx-auto text-[var(--color-text-body)] text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </PageSection>
        </PageBody>
      </article>
    </>
  );
}
