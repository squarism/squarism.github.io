import type satori from "satori";

// satori takes a react-like element tree; this is the shape it reads
export type OgElement = Parameters<typeof satori>[0];

// dark theme values from src/styles/tokens.css. social cards are always dark
export const colors = {
  bg: "#0f0f0f",
  fg: "#e7e7e7",
  body: "#cfcfcf",
  muted: "#8a8a8a",
  accent: "#b8923f",
} as const;

// the header's grid mark: a 3x3 of squares, the top row and left column in
// ink, the centre in accent, the rest empty. `cell` is one square's size in
// pixels; satori has no css grid, so it is rows of flex
export function gridMark(cell: number): OgElement {
  const gap = Math.max(2, Math.round(cell / 3));
  const rows: ("ink" | "accent" | "none")[][] = [
    ["ink", "ink", "ink"],
    ["ink", "accent", "none"],
    ["ink", "none", "none"],
  ];
  return {
    type: "div",
    props: {
      style: { display: "flex", flexDirection: "column", gap },
      children: rows.map(row => ({
        type: "div",
        props: {
          style: { display: "flex", gap },
          children: row.map(kind => ({
            type: "div",
            props: {
              style: {
                width: cell,
                height: cell,
                background:
                  kind === "ink" ? colors.fg : kind === "accent" ? colors.accent : "transparent",
              },
            },
          })),
        },
      })),
    },
  };
}
