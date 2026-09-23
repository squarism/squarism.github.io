import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { getFeatures, getFeatureUrl } from "@/lib/content";
import { SITE } from "@/config";

export async function GET() {
  const [posts, features] = await Promise.all([
    getCollection("posts"),
    getFeatures(),
  ]);
  const sortedPosts = getSortedPosts(posts);
  const items = [
    ...sortedPosts.map(({ data, id, filePath }) => ({
      link: getPath(id, filePath),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.updated ?? data.date),
    })),
    ...features.map(feature => ({
      link: getFeatureUrl(feature),
      title: feature.data.title,
      description: feature.data.description,
      pubDate: new Date(feature.data.updated ?? feature.data.date),
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items,
  });
}
