export const SITE = {
  website: "https://squarism.com/",
  author: "@squarism",
  profile: "https://squarism.com/",
  // the tagline: under the wordmark on the social card, the meta description,
  // and the rss feed description
  desc: "Notes on the systems we work with.",
  title: "SQUARISM",
  // social card for pages without their own: a file under public/, or "" for
  // the generated /og.png (see src/utils/og-templates/site.ts)
  ogImage: "",
  lightAndDarkMode: true,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  // per-post social cards rendered at build time from the post title
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "America/Los_Angeles",

  // hero post: matches a post id/filename in src/content/posts
  heroPost: "a-network-in-rust-part-1",

  // hero feature: a folder name in src/content/features. "" for none
  heroFeature: "downtime",
} as const;

// posts live at BLOG_PATH/YYYY/slug.md; the year folder never appears in the URL
export const BLOG_PATH = "src/content/posts";
