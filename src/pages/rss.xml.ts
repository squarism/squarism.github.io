import rss from "@astrojs/rss";
import { getPosts, getPostUrl } from "@/lib/posts";
import { getFeatures, getFeatureUrl } from "@/lib/features";
import { SITE } from "@/config";

export async function GET() {
  const [posts, features] = await Promise.all([getPosts(), getFeatures()]);
  const items = [
    ...posts.map(post => ({
      link: getPostUrl(post),
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.updated ?? post.data.date),
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
