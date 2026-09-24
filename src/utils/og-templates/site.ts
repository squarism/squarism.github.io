import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";
import { colors, gridMark, type OgElement } from "./shared";

// the site-wide social card: the grid mark and wordmark from the header, the
// tagline along the bottom. dark theme colours
export default async function siteOgImage(): Promise<string> {
  const element: OgElement = {
    type: "div",
    props: {
      style: {
        background: colors.bg,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 84px",
        fontFamily: "IBM Plex Mono",
        color: colors.fg,
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", gap: 36 },
            children: [
              gridMark(44),
              {
                type: "span",
                props: {
                  style: { fontSize: 112, fontWeight: 700, letterSpacing: "-0.04em" },
                  children: SITE.title.toLowerCase(),
                },
              },
            ],
          },
        },
        {
          type: "p",
          props: {
            style: { fontSize: 36, color: colors.body, margin: 0, maxWidth: 900, lineHeight: 1.4 },
            children: SITE.desc,
          },
        },
      ],
    },
  };

  return satori(element, {
    width: 1200,
    height: 630,
    embedFont: true,
    fonts: await loadGoogleFonts(SITE.title.toLowerCase() + SITE.desc),
  });
}
