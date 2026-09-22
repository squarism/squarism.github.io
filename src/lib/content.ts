import { getCollection, type CollectionEntry } from "astro:content";
import { getPath } from "@/utils/getPath";
import { generateTILSlug, generateDevLogSlug } from "@/utils/generateSlug";
import { SITE } from "@/config";

export type Post = CollectionEntry<"posts">;
export type TIL = CollectionEntry<"til">;
export type DevLog = CollectionEntry<"devlog">;
export type Link = CollectionEntry<"links">;
export type ContentItem = Post | TIL | DevLog | Link;

export type UnifiedPost = Post & {
  inferredType: "blog" | "til" | "devlog";
  url: string;
};

/**
 * Get recent posts with optional filtering
 */
export async function getRecentPosts({
  limit = SITE.recentPostsLimit,
  excludeDrafts = true,
}: {
  limit?: number;
  excludeDrafts?: boolean;
} = {}): Promise<Post[]> {
  const posts = await getCollection("posts");

  return posts
    .filter(post => {
      if (excludeDrafts && post.data.draft) return false;
      return true;
    })
    .sort((a, b) => {
      const aDate = a.data.updated || a.data.date;
      const bDate = b.data.updated || b.data.date;
      return bDate.getTime() - aDate.getTime();
    })
    .slice(0, limit);
}

/**
 * Get all posts (for blog index)
 */
export async function getAllPosts({
  excludeDrafts = true,
}: {
  excludeDrafts?: boolean;
} = {}): Promise<Post[]> {
  const posts = await getCollection("posts");

  return posts
    .filter(post => {
      if (excludeDrafts && post.data.draft) return false;
      return true;
    })
    .sort((a, b) => {
      const aDate = a.data.updated || a.data.date;
      const bDate = b.data.updated || b.data.date;
      return bDate.getTime() - aDate.getTime();
    });
}

/**
 * Get a single post by id
 */
export async function getPostById(id: string): Promise<Post | undefined> {
  const posts = await getCollection("posts");
  return posts.find(post => post.id === id);
}

interface UrlablePost {
  id: string;
  filePath?: string;
  url?: string;
}

export function getPostUrl(post: UrlablePost): string {
  if (post.url) return post.url;
  return getPath(post.id, post.filePath);
}

/**
 * first image in a post body (markdown or html img), used for list thumbnails
 * and the "has an image" marker
 */
export function getFirstImage(post: { body?: string }): string | null {
  const body = post.body ?? "";
  const markdownImage = body.match(/!\[[^\]]*\]\(([^)\s]+)/);
  if (markdownImage) return markdownImage[1];
  const htmlImage = body.match(/<img[^>]+src=["']([^"']+)["']/);
  if (htmlImage) return htmlImage[1];
  return null;
}

/**
 * group posts by year, newest year first, posts newest first within a year
 */
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
      posts: items.sort((a, b) => b.data.date.getTime() - a.data.date.getTime()),
    }));
}

/**
 * Get related posts based on tags
 */
export async function getRelatedPosts(
  currentPost: Post,
  limit = 3
): Promise<Post[]> {
  const posts = await getAllPosts({ excludeDrafts: true });
  const otherPosts = posts.filter(post => post.id !== currentPost.id);

  // calculate relevance score based on shared tags
  const scored = otherPosts.map(post => {
    const sharedTags = post.data.tags.filter(tag =>
      currentPost.data.tags.includes(tag)
    );
    return {
      post,
      score: sharedTags.length,
    };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

/**
 * Get recent TIL entries
 */
export async function getRecentTIL({
  limit = 6,
  excludeDrafts = true,
}: {
  limit?: number;
  excludeDrafts?: boolean;
} = {}): Promise<TIL[]> {
  const tilEntries = await getCollection("til");

  return tilEntries
    .filter(til => {
      if (excludeDrafts && til.data.draft) return false;
      return true;
    })
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, limit);
}

/**
 * Get recent dev log entries
 */
export async function getRecentDevLog({
  limit = 5,
  excludeDrafts = true,
}: {
  limit?: number;
  excludeDrafts?: boolean;
} = {}): Promise<DevLog[]> {
  const devlogEntries = await getCollection("devlog");

  return devlogEntries
    .filter(entry => {
      if (excludeDrafts && entry.data.draft) return false;
      return true;
    })
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, limit);
}

/**
 * Get all unique tags from all content types
 */
export async function getAllTags(): Promise<string[]> {
  const [posts, tilEntries] = await Promise.all([
    getAllPosts({ excludeDrafts: true }),
    getRecentTIL({ limit: 1000, excludeDrafts: true }),
  ]);

  const allTags = new Set<string>();

  posts.forEach(post => {
    post.data.tags.forEach(tag => allTags.add(tag));
  });

  tilEntries.forEach(til => {
    til.data.tags.forEach(tag => allTags.add(tag));
  });

  return Array.from(allTags).sort();
}

/**
 * Get the named hero post from config
 */
export async function getHeroPost(): Promise<Post | null> {
  if (!SITE.heroPost) return null;

  const posts = await getAllPosts({ excludeDrafts: true });
  const heroPost = posts.find(post =>
    post.id === SITE.heroPost ||
    post.id.includes(SITE.heroPost) ||
    post.id.endsWith(SITE.heroPost)
  );
  return heroPost ?? null;
}

/**
 * Get content by tag
 */
export async function getContentByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts({ excludeDrafts: true });
  return posts
    .filter(post => post.data.tags.includes(tag))
    .sort((a, b) => {
      const aDate = a.data.updated || a.data.date;
      const bDate = b.data.updated || b.data.date;
      return bDate.getTime() - aDate.getTime();
    });
}

/**
 * Get unified feed of all content types (blog posts, TIL, DevLog)
 * Merges posts from the posts collection with legacy til/devlog collections
 * Returns all items sorted chronologically
 */
export async function getUnifiedFeed({
  limit,
  excludeDrafts = true,
}: {
  limit?: number;
  excludeDrafts?: boolean;
} = {}): Promise<UnifiedPost[]> {
  const [posts, tilEntries, devlogEntries] = await Promise.all([
    getCollection("posts"),
    getCollection("til"),
    getCollection("devlog"),
  ]);

  const unifiedPosts: UnifiedPost[] = [];

  // add regular posts with type detection
  posts.forEach(post => {
    if (excludeDrafts && post.data.draft) return;

    // infer type from frontmatter or folder path
    let inferredType: "blog" | "til" | "devlog" = "blog";

    if (post.data.type) {
      inferredType = post.data.type;
    } else if (post.id.includes("til/")) {
      inferredType = "til";
    } else if (post.id.includes("devlog/")) {
      inferredType = "devlog";
    }

    unifiedPosts.push({
      ...post,
      inferredType,
      url: getPostUrl(post),
    });
  });

  // add legacy TIL entries (for backwards compatibility)
  tilEntries.forEach(til => {
    if (excludeDrafts && til.data.draft) return;

    // convert TIL entry to Post-like structure
    const tilAsPost: UnifiedPost = {
      ...til,
      collection: "posts" as const,
      inferredType: "til",
      url: `/til/${generateTILSlug(til)}/`,
      data: {
        ...til.data,
        title: til.data.title,
        date: til.data.date,
        tags: til.data.tags,
        draft: til.data.draft,
        author: til.data.author,
        updated: undefined,
        headerImage: undefined,
        excerpt: undefined,
        ogImage: undefined,
        description: undefined,
        canonicalURL: undefined,
        timezone: undefined,
        type: "til" as const,
      },
    } as UnifiedPost;

    unifiedPosts.push(tilAsPost);
  });

  // add legacy DevLog entries (for backwards compatibility)
  devlogEntries.forEach(devlog => {
    if (excludeDrafts && devlog.data.draft) return;

    // convert DevLog entry to Post-like structure
    const devlogAsPost: UnifiedPost = {
      ...devlog,
      collection: "posts" as const,
      inferredType: "devlog",
      url: `/devlog/${generateDevLogSlug(devlog)}/`,
      data: {
        ...devlog.data,
        title: devlog.data.title,
        date: devlog.data.date,
        tags: [],
        draft: devlog.data.draft,
        author: devlog.data.author,
        updated: undefined,
        headerImage: undefined,
        excerpt: undefined,
        ogImage: undefined,
        description: undefined,
        canonicalURL: undefined,
        timezone: undefined,
        type: "devlog" as const,
      },
    } as UnifiedPost;

    unifiedPosts.push(devlogAsPost);
  });

  // sort chronologically by date
  const sorted = unifiedPosts.sort((a, b) => {
    const aDate = a.data.updated || a.data.date;
    const bDate = b.data.updated || b.data.date;
    return bDate.getTime() - aDate.getTime();
  });

  return limit ? sorted.slice(0, limit) : sorted;
}
