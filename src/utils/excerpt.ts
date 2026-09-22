// list pages show a hand-written one-line excerpt from frontmatter and nothing
// else. no body scraping, no <!-- more --> splitting: those produced multi-
// paragraph blobs on the home page.
interface ExcerptablePost {
  data: Record<string, unknown>;
}

export function getPostExcerpt(post: ExcerptablePost): string {
  const excerpt = post.data.excerpt;
  return typeof excerpt === "string" ? excerpt.trim() : "";
}

// the hero card has room for a paragraph, so it may fall back to the text
// above the <!-- more --> marker when no hand-written excerpt exists
export function getHeroExcerpt(post: ExcerptablePost & { body?: string }): string {
  const handWritten = getPostExcerpt(post);
  if (handWritten) return handWritten;
  const body = post.body ?? "";
  const cut = body.indexOf("<!-- more -->");
  const lead = cut === -1 ? "" : body.slice(0, cut);
  return lead
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
