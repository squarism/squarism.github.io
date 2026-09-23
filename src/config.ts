export const SITE = {
  website: "https://squarism.com/",
  author: "@squarism",
  profile: "https://squarism.com/",
  desc: "Programming, technology, and creative projects by Chris.",
  title: "SQUARISM",
  ogImage: "squarism-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 10,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  showBackButton: true,
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "America/Los_Angeles",

  // custom configuration options
  recentPostsLimit: 15,
  themeDefault: "system" as "system" | "light" | "dark",

  // hero post: matches a post id/filename in src/content/posts
  heroPost: "a-network-in-rust-part-1",

  // hero feature: a folder name in src/content/features. "" for none
  heroFeature: "downtime",
} as const;

// posts live at BLOG_PATH/YYYY/slug.md; the year folder never appears in the URL
export const BLOG_PATH = "src/content/posts";
