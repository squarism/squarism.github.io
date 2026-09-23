import { describe, expect, it } from "vitest";
import { getPath } from "@/utils/getPath";

const base = "src/content/posts";

describe("getPath", () => {
  it("drops the year folder so posts live at /posts/slug", () => {
    expect(getPath("2024/a-network-in-rust-part-3", `${base}/2024/a-network-in-rust-part-3.md`)).toBe(
      "/posts/a-network-in-rust-part-3"
    );
  });

  it("omits the /posts base when asked, for route params", () => {
    expect(getPath("2020/no-advice", `${base}/2020/no-advice.md`, false)).toBe(
      "/no-advice"
    );
  });

  it("handles a post at the top level with no year folder", () => {
    expect(getPath("yyy-template", `${base}/yyy-template.md`)).toBe(
      "/posts/yyy-template"
    );
  });

  it("keeps non-year subfolders in the path", () => {
    expect(getPath("2019/series/part-one", `${base}/2019/series/part-one.md`)).toBe(
      "/posts/series/part-one"
    );
  });

  it("skips underscore-prefixed folders", () => {
    expect(getPath("2019/_drafts/idea", `${base}/2019/_drafts/idea.md`)).toBe(
      "/posts/idea"
    );
  });
});
