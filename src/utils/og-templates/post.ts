import satori from "satori";
import type { Post } from "@/types/content";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";
import { colors, gridMark, type OgElement } from "./shared";

// a post's social card: its title big, the site's mark and wordmark along the
// bottom. dark theme colours to match the site card
export default async function postOgImage(post: Post): Promise<string> {
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
          type: "p",
          props: {
            style: {
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              margin: 0,
              maxHeight: 380,
              overflow: "hidden",
            },
            children: post.data.title,
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 28 },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", gap: 18 },
                  children: [
                    gridMark(16),
                    {
                      type: "span",
                      props: {
                        style: { fontWeight: 700, letterSpacing: "-0.03em", fontSize: 36 },
                        children: SITE.title.toLowerCase(),
                      },
                    },
                  ],
                },
              },
              {
                type: "span",
                props: { style: { color: colors.muted }, children: post.data.author },
              },
            ],
          },
        },
      ],
    },
  };

  return satori(element, {
    width: 1200,
    height: 630,
    embedFont: true,
    fonts: await loadGoogleFonts(post.data.title + post.data.author + SITE.title.toLowerCase()),
  });
}
