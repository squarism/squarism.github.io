import { getCollection } from "astro:content";
import type { DevLog, Feature, FeedItem, Link, Post, Til } from "@/types/content";
import { generateDevLogSlug, generateTILSlug } from "@/utils/generateSlug";
import { getPostUrl, getPosts } from "./posts";
import { getFeatureUrl, getFeatures } from "./features";

export const postToFeedItem = (post: Post): FeedItem => ({
  kind: "post",
  title: post.data.title,
  date: post.data.date,
  url: getPostUrl(post),
});

export const tilToFeedItem = (til: Til): FeedItem => ({
  kind: "til",
  title: til.data.title,
  date: til.data.date,
  url: `/til/${generateTILSlug(til)}/`,
});

export const devLogToFeedItem = (entry: DevLog): FeedItem => ({
  kind: "devlog",
  title: entry.data.title,
  date: entry.data.date,
  url: `/devlog/${generateDevLogSlug(entry)}/`,
});

// a link points off-site, so its url is the bookmarked page itself
export const linkToFeedItem = (link: Link): FeedItem => ({
  kind: "link",
  title: link.data.title,
  date: link.data.date,
  url: link.data.url,
});

export const featureToFeedItem = (feature: Feature): FeedItem => ({
  kind: "feature",
  title: feature.data.title,
  date: feature.data.date,
  url: getFeatureUrl(feature),
});

// newest first
export function sortFeed(items: FeedItem[]): FeedItem[] {
  return [...items].sort((a, b) => b.date.getTime() - a.date.getTime());
}

// everything on the site as one list, newest first, drafts out
export async function getFeed(): Promise<FeedItem[]> {
  const notDraft = ({ data }: { data: { draft?: boolean } }) => !data.draft;
  const [posts, tils, devlogs, links, features] = await Promise.all([
    getPosts(),
    getCollection("til", notDraft),
    getCollection("devlog", notDraft),
    getCollection("links", notDraft),
    getFeatures(),
  ]);
  return sortFeed([
    ...posts.map(postToFeedItem),
    ...tils.map(tilToFeedItem),
    ...devlogs.map(devLogToFeedItem),
    ...links.map(linkToFeedItem),
    ...features.map(featureToFeedItem),
  ]);
}
