import type { CollectionEntry } from "astro:content";

// the fields on each entry come from the zod schemas in src/content.config.ts.
// this file only names the shapes so there is one place to look for them.
export type Post = CollectionEntry<"posts">;
export type Til = CollectionEntry<"til">;
export type DevLog = CollectionEntry<"devlog">;
export type Link = CollectionEntry<"links">;
export type Project = CollectionEntry<"projects">;
export type Feature = CollectionEntry<"features">;

export type FeedKind = "post" | "til" | "devlog" | "link" | "feature";

// one row in a list on the home page or an index: enough to render a
// date and a title with a link, whatever collection it came from
export interface FeedItem {
  kind: FeedKind;
  title: string;
  date: Date;
  url: string;
}
