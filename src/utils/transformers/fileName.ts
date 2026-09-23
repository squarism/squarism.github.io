import type { transformerNotationDiff } from "@shikijs/transformers";

type ShikiTransformer = ReturnType<typeof transformerNotationDiff>;

interface FileNameOptions {
  // v1: tab with rounded top corners at the top left.
  // v2: badge with a border, offset above the top left
  style?: "v1" | "v2";
  // drop the green dot before the name
  hideDot?: boolean;
}

// shiki transformer that labels a code block with the `file="name"` meta
// attribute, e.g. ```ts file="src/config.ts"
export const transformerFileName = ({
  style = "v2",
  hideDot = false,
}: FileNameOptions = {}): ShikiTransformer => ({
  name: "file-name",
  pre(node) {
    const fileNameOffset = style === "v1" ? "0.75rem" : "-0.75rem";
    node.properties.style =
      (node.properties.style || "") + `--file-name-offset: ${fileNameOffset};`;

    const raw = this.options.meta?.__raw?.split(" ");
    if (!raw) return;

    const metaMap = new Map<string, string>();
    for (const item of raw) {
      const [key, value] = item.split("=");
      if (!key || !value) continue;
      metaMap.set(key, value.replace(/["'`]/g, ""));
    }

    const file = metaMap.get("file");
    if (!file) return;

    this.addClassToHast(node, `mt-8 ${style === "v1" ? "rounded-tl-none" : ""}`);

    node.children.push({
      type: "element",
      tagName: "span",
      properties: {
        class: [
          "absolute py-1 text-foreground text-xs font-medium leading-4",
          hideDot
            ? "px-2"
            : "pl-4 pr-2 before:inline-block before:size-1 before:bg-green-500 before:rounded-full before:absolute before:top-[45%] before:left-2",
          style === "v1"
            ? "left-0 -top-6 rounded-t-md border border-b-0 bg-muted/50"
            : "left-2 top-(--file-name-offset) border rounded-md bg-background",
        ],
      },
      children: [{ type: "text", value: file }],
    });
  },
});
