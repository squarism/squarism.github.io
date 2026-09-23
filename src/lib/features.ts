import { getCollection } from "astro:content";
import type { Feature } from "@/types/content";
import { SITE } from "@/config";

export function getFeatureUrl(feature: { id: string }): string {
  return `/features/${feature.id}/`;
}

// features with an order first, ascending, then the rest newest first.
// drafts out. same rule as projects.
export async function getFeatures(): Promise<Feature[]> {
  const features = await getCollection("features");
  return features
    .filter(f => !f.data.draft)
    .sort((a, b) => {
      const ao = a.data.order ?? Infinity;
      const bo = b.data.order ?? Infinity;
      if (ao !== bo) return ao - bo;
      return b.data.date.getTime() - a.data.date.getTime();
    });
}

// the named hero feature from config, or null when unset or not found
export async function getHeroFeature(): Promise<Feature | null> {
  if (!SITE.heroFeature) return null;
  const features = await getFeatures();
  return features.find(f => f.id === SITE.heroFeature) ?? null;
}
