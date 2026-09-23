import { getCollection } from "astro:content";
import type { Post } from "@/types/content";
import { getPath } from "@/utils/getPath";
import { SITE } from "@/config";

interface UrlablePost {
  id: string;
  filePath?: string;
}

export function getPostUrl(post: UrlablePost): string {
  return getPath(post.id, post.filePath);
}

// a post is published when it is not a draft and its date has passed, with a
// small margin so a post dated a few minutes ahead still makes the build. in
// dev everything shows.
export function isPublished(post: Post, now = Date.now()): boolean {
  const publishAt = post.data.date.getTime() - SITE.scheduledPostMargin;
  return !post.data.draft && (import.meta.env.DEV || now > publishAt);
}

// newest first, by the updated date when there is one
export function sortPosts(posts: Post[]): Post[] {
  const stamp = (p: Post) => (p.data.updated ?? p.data.date).getTime();
  return [...posts].sort((a, b) => stamp(b) - stamp(a));
}

// every published post, newest first
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("posts");
  return sortPosts(posts.filter(p => isPublished(p)));
}

// the named hero post from config, or null when unset or not found
export async function getHeroPost(): Promise<Post | null> {
  if (!SITE.heroPost) return null;
  const posts = await getPosts();
  return posts.find(p => p.id === SITE.heroPost || p.id.endsWith(SITE.heroPost)) ?? null;
}

// first image in a body (markdown or html img), for list thumbnails
export function getFirstImage(body: string | undefined): string | null {
  const text = body ?? "";
  const markdownImage = text.match(/!\[[^\]]*\]\(([^)\s]+)/);
  if (markdownImage) return markdownImage[1];
  const htmlImage = text.match(/<img[^>]+src=["']([^"']+)["']/);
  if (htmlImage) return htmlImage[1];
  return null;
}

// group by year, newest year first, newest first within a year
export function groupByYear<T extends { data: { date: Date } }>(
  posts: T[]
): { year: number; posts: T[] }[] {
  const groups = new Map<number, T[]>();
  for (const post of posts) {
    const year = post.data.date.getFullYear();
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, items]) => ({
      year,
      posts: [...items].sort((a, b) => b.data.date.getTime() - a.data.date.getTime()),
    }));
}
