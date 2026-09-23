import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE, BLOG_PATH } from "@/config";

export { BLOG_PATH };
export const TIL_PATH = "src/content/til";
export const DEVLOG_PATH = "src/content/devlog";
export const LINKS_PATH = "src/content/links";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      updated: z.date().optional().nullable(),
      tags: z.array(z.string()).default(["others"]),
      headerImage: z.string().optional(),
      excerpt: z.string().optional(),
      draft: z.boolean().optional(),
      author: z.string().default(SITE.author),
      ogImage: image().or(z.string()).optional(),
      description: z.string().optional(),
      canonicalURL: z.string().optional(),
      timezone: z.string().optional(),
      type: z.enum(["blog", "til", "devlog"]).optional().default("blog"),
    }),
});

const til = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/til" }),
  schema: () =>
    z.object({
      title: z.string(),
      date: z.date(),
      tags: z.array(z.string()).default(["til"]),
      draft: z.boolean().optional(),
      author: z.string().default(SITE.author),
      category: z.string().optional(),
      source: z.string().optional(),
    }),
});

const devlog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/devlog" }),
  schema: () =>
    z.object({
      title: z.string(),
      date: z.date(),
      draft: z.boolean().optional(),
      author: z.string().default(SITE.author),
      project: z.string().optional(),
      mood: z
        .enum(["progress", "stuck", "breakthrough", "planning"])
        .optional(),
    }),
});

const links = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/links" }),
  schema: () =>
    z.object({
      title: z.string(),
      url: z.string().url(),
      date: z.date(),
      tags: z.array(z.string()).default([]),
      description: z.string(),
      draft: z.boolean().optional(),
      author: z.string().default(SITE.author),
    }),
});

// one folder per project under src/content/projects, each with an index.md and
// its image beside it. folders starting with "_" are templates and never load.
// the folder name is the id and the url: projects/microfile -> /projects/microfile
const projects = defineCollection({
  loader: glob({
    pattern: "[^_]*/index.md",
    base: "./src/content/projects",
    generateId: ({ entry }) => entry.split("/")[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.date(),
      repo: z.string().url().optional(),
      link: z.string().url().optional(),
      image: image().optional(),
      // lower numbers list first; projects without one follow, newest first
      order: z.number().int().optional(),
      draft: z.boolean().optional(),
    }),
});

// features: long-form rich posts, one folder per feature under src/content/features
// with an index.mdx so a feature can embed components (labs, diagrams). the
// folder name is the id and the url: features/downtime -> /features/downtime
const features = defineCollection({
  loader: glob({
    pattern: "[^_]*/index.mdx",
    base: "./src/content/features",
    generateId: ({ entry }) => entry.split("/")[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // one or two sentences. the standfirst under the headline, the card text
      // on /features and the home page, and the page description
      description: z.string(),
      date: z.date(),
      updated: z.date().optional().nullable(),
      tags: z.array(z.string()).default([]),
      // picture for the card on /features. not shown in the article itself
      image: image().optional(),
      author: z.string().default(SITE.author),
      // lower numbers list first; features without one follow, newest first
      order: z.number().int().optional(),
      draft: z.boolean().optional(),
    }),
});

export const collections = { posts, til, devlog, links, projects, features };
