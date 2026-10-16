import { getPostUrl } from "@/lib/posts";

// the old jekyll site put every post at /YYYY/MM/DD/slug/. github pages
// cannot send a 301, so the build writes a stub page at each old path that
// points at the new one with a meta refresh and a canonical link. google and
// kagi treat that as a permanent redirect.
//
// every post gets its old dated path for free. a post whose slug changed
// lists the old ones in frontmatter:
//
//   aliases: ["testing-is-a-spectrum"]     under the post's own date
//   aliases: ["/2017/old-shape/thing/"]    a whole path, any shape

interface RedirectablePost {
  id: string;
  filePath?: string;
  data: {
    date: Date;
    aliases: string[];
  };
}

export interface Redirect {
  // the old path with no leading or trailing slash, as a rest param
  from: string;
  // the current url with leading slash and no trailing slash
  to: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

// dates are stored as utc midnight, so utc components give the jekyll date
export function datePrefix(date: Date): string {
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
  ].join("/");
}

function trimSlashes(path: string): string {
  return path.replace(/^\/+|\/+$/g, "");
}

export function legacyPaths(post: RedirectablePost): string[] {
  const to = getPostUrl(post);
  const slug = to.split("/").at(-1) ?? "";
  const prefix = datePrefix(post.data.date);
  const own = `${prefix}/${slug}`;
  const aliases = post.data.aliases.map(alias =>
    alias.startsWith("/")
      ? trimSlashes(alias)
      : `${prefix}/${trimSlashes(alias)}`
  );
  return [own, ...aliases];
}

// one redirect per old path across all posts. two posts claiming the same old
// path is a mistake in frontmatter, so the build fails rather than guessing
export function buildRedirects(posts: RedirectablePost[]): Redirect[] {
  const seen = new Map<string, string>();
  const redirects: Redirect[] = [];
  for (const post of posts) {
    const to = getPostUrl(post);
    for (const from of legacyPaths(post)) {
      const other = seen.get(from);
      if (other !== undefined && other !== to) {
        throw new Error(
          `redirect /${from}/ claimed by both ${other} and ${to}`
        );
      }
      if (other === undefined) {
        seen.set(from, to);
        redirects.push({ from, to });
      }
    }
  }
  return redirects;
}
