import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import readingTime from "reading-time";

const BLOG_DIR = join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  ogImage?: string;
  readingMinutes: number;
};

export type Post = PostMeta & {
  html: string;
  raw: string;
};

async function listFiles(): Promise<string[]> {
  if (!existsSync(BLOG_DIR)) return [];
  const entries = await readdir(BLOG_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".md"))
    .map((e) => e.name);
}

async function loadFile(filename: string): Promise<Post> {
  const slug = filename.replace(/\.md$/, "");
  const raw = await readFile(join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const html = await marked.parse(content, { async: true });
  const rt = readingTime(content);

  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: typeof data.date === "string" ? data.date : "1970-01-01",
    author: typeof data.author === "string" ? data.author : "AI Outsource Hub",
    tags: Array.isArray(data.tags) ? data.tags.filter((t): t is string => typeof t === "string") : [],
    ogImage: typeof data.ogImage === "string" ? data.ogImage : undefined,
    readingMinutes: Math.max(1, Math.round(rt.minutes)),
    html,
    raw: content,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const files = await listFiles();
  const posts = await Promise.all(files.map(loadFile));
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  const filename = `${slug}.md`;
  if (!existsSync(join(BLOG_DIR, filename))) return null;
  return loadFile(filename);
}

export async function getAllSlugs(): Promise<string[]> {
  const files = await listFiles();
  return files.map((f) => f.replace(/\.md$/, ""));
}
