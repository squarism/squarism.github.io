import { describe, expect, it, vi } from "vitest";
import { buildRedirects, datePrefix, legacyPaths } from "@/lib/redirects";

vi.mock("astro:content", () => ({ getCollection: vi.fn() }));

function post(slug: string, date: string, aliases: string[] = []) {
  return {
    id: `2018/${slug}`,
    filePath: `src/content/posts/2018/${slug}.md`,
    data: { date: new Date(date), aliases },
  };
}

describe("datePrefix", () => {
  it("formats the utc date the way jekyll did", () => {
    expect(datePrefix(new Date("2018-11-08T00:00:00.000Z"))).toBe("2018/11/08");
    expect(datePrefix(new Date("2019-01-02T00:00:00.000Z"))).toBe("2019/01/02");
  });
});

describe("legacyPaths", () => {
  it("gives every post its old dated path", () => {
    expect(legacyPaths(post("a-thing", "2018-11-08"))).toEqual([
      "2018/11/08/a-thing",
    ]);
  });

  it("puts a bare alias under the post date", () => {
    const p = post("testing-is-a-gradient-spectrum", "2018-11-08", [
      "testing-is-a-spectrum",
    ]);
    expect(legacyPaths(p)).toContain("2018/11/08/testing-is-a-spectrum");
  });

  it("takes a full path alias as is", () => {
    const p = post("a-thing", "2018-11-08", ["/2017/old/shape/"]);
    expect(legacyPaths(p)).toContain("2017/old/shape");
  });
});

describe("buildRedirects", () => {
  it("resolves the renamed testing post", () => {
    const redirects = buildRedirects([
      post("testing-is-a-gradient-spectrum", "2018-11-08", [
        "testing-is-a-spectrum",
      ]),
    ]);
    expect(redirects).toContainEqual({
      from: "2018/11/08/testing-is-a-spectrum",
      to: "/posts/testing-is-a-gradient-spectrum",
    });
  });

  it("fails the build when two posts claim one old path", () => {
    expect(() =>
      buildRedirects([
        post("one", "2018-11-08", ["same"]),
        post("two", "2018-11-08", ["same"]),
      ])
    ).toThrow(/claimed by both/);
  });

  it("ignores a post repeating its own path", () => {
    const redirects = buildRedirects([post("one", "2018-11-08", ["one"])]);
    expect(redirects).toHaveLength(1);
  });
});
