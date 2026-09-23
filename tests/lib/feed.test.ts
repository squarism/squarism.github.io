import { describe, expect, it, vi } from "vitest";
import type { DevLog, Feature, FeedItem, Link, Post, Til } from "@/types/content";
import {
  devLogToFeedItem,
  featureToFeedItem,
  linkToFeedItem,
  postToFeedItem,
  sortFeed,
  tilToFeedItem,
} from "@/lib/feed";

vi.mock("astro:content", () => ({ getCollection: vi.fn() }));

const date = new Date("2024-03-04");

describe("feed item converters", () => {
  it("maps a post to its /posts url", () => {
    const post = {
      id: "2024/a-network-in-rust-part-3",
      filePath: "src/content/posts/2024/a-network-in-rust-part-3.md",
      data: { title: "A network in Rust", date },
    } as unknown as Post;
    expect(postToFeedItem(post)).toEqual({
      kind: "post",
      title: "A network in Rust",
      date,
      url: "/posts/a-network-in-rust-part-3",
    });
  });

  it("maps a til to a slug under /til", () => {
    const til = { id: "x", data: { title: "Fish Loops", date } } as unknown as Til;
    expect(tilToFeedItem(til)).toEqual({
      kind: "til",
      title: "Fish Loops",
      date,
      url: "/til/fish-loops/",
    });
  });

  it("maps a devlog entry to a dated slug under /devlog", () => {
    const entry = { id: "x", data: { title: "Stuck on it", date } } as unknown as DevLog;
    const item = devLogToFeedItem(entry);
    expect(item.kind).toBe("devlog");
    expect(item.url).toMatch(/^\/devlog\/.*stuck-on-it\/$/);
  });

  it("points a link at the bookmarked page itself", () => {
    const link = {
      id: "x",
      data: { title: "Elsewhere", date, url: "https://example.com/a" },
    } as unknown as Link;
    expect(linkToFeedItem(link).url).toBe("https://example.com/a");
  });

  it("maps a feature to /features/<id>/", () => {
    const feature = { id: "downtime", data: { title: "Downtime", date } } as unknown as Feature;
    expect(featureToFeedItem(feature).url).toBe("/features/downtime/");
  });
});

describe("sortFeed", () => {
  it("orders newest first without mutating the input", () => {
    const item = (title: string, day: string): FeedItem => ({
      kind: "post",
      title,
      date: new Date(day),
      url: `/${title}`,
    });
    const input = [item("mid", "2022-01-01"), item("new", "2024-01-01"), item("old", "2020-01-01")];
    expect(sortFeed(input).map(i => i.title)).toEqual(["new", "mid", "old"]);
    expect(input.map(i => i.title)).toEqual(["mid", "new", "old"]);
  });
});
