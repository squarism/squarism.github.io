import { afterEach, describe, expect, it, vi } from "vitest";
import type { Post } from "@/types/content";
import { getFirstImage, groupByYear, isPublished, sortPosts } from "@/lib/posts";

vi.mock("astro:content", () => ({ getCollection: vi.fn() }));

// only the fields the helpers under test read
const post = (over: {
  id?: string;
  date: string;
  updated?: string;
  draft?: boolean;
}): Post =>
  ({
    id: over.id ?? "2024/example",
    collection: "posts",
    data: {
      title: "example",
      date: new Date(over.date),
      updated: over.updated ? new Date(over.updated) : undefined,
      draft: over.draft,
      tags: [],
      author: "me",
    },
  }) as unknown as Post;

describe("isPublished", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("drops drafts even in dev", () => {
    vi.stubEnv("DEV", true);
    expect(isPublished(post({ date: "2020-01-01", draft: true }))).toBe(false);
  });

  it("shows a future post in dev", () => {
    vi.stubEnv("DEV", true);
    expect(isPublished(post({ date: "2999-01-01" }))).toBe(true);
  });

  it("hides a future post in a build", () => {
    vi.stubEnv("DEV", false);
    const now = new Date("2024-06-01T12:00:00Z").getTime();
    expect(isPublished(post({ date: "2024-06-02" }), now)).toBe(false);
  });

  it("shows a post dated a few minutes ahead, within the margin", () => {
    vi.stubEnv("DEV", false);
    const now = new Date("2024-06-01T11:50:00Z").getTime();
    expect(isPublished(post({ date: "2024-06-01T12:00:00Z" }), now)).toBe(true);
  });
});

describe("sortPosts", () => {
  it("orders newest first and lets an updated date count", () => {
    const old = post({ id: "old", date: "2020-01-01" });
    const bumped = post({ id: "bumped", date: "2019-01-01", updated: "2024-01-01" });
    const recent = post({ id: "recent", date: "2023-01-01" });
    expect(sortPosts([old, recent, bumped]).map(p => p.id)).toEqual([
      "bumped",
      "recent",
      "old",
    ]);
  });
});

describe("groupByYear", () => {
  it("groups newest year first, newest post first within a year", () => {
    const groups = groupByYear([
      post({ id: "a", date: "2023-02-01" }),
      post({ id: "b", date: "2024-06-15" }),
      post({ id: "c", date: "2023-05-01" }),
    ]);
    expect(groups.map(g => g.year)).toEqual([2024, 2023]);
    expect(groups[1].posts.map(p => p.id)).toEqual(["c", "a"]);
  });
});

describe("getFirstImage", () => {
  it("finds a markdown image", () => {
    expect(getFirstImage("text\n\n![alt](/img/a.png)\n")).toBe("/img/a.png");
  });

  it("finds an html image", () => {
    expect(getFirstImage('<p><img src="/img/b.jpg" alt=""></p>')).toBe("/img/b.jpg");
  });

  it("returns null when there is no image or no body", () => {
    expect(getFirstImage("just words")).toBeNull();
    expect(getFirstImage(undefined)).toBeNull();
  });
});
