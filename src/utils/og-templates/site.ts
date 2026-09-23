import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

// satori takes a react-like element tree; this is the shape it reads
type OgElement = Parameters<typeof satori>[0];

// the site-wide social card: title and tagline in a bordered box
export default async function siteOgImage(): Promise<string> {
  const element: OgElement = {
    type: "div",
    props: {
      style: {
        background: "#fefbfb",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: "-1px",
              right: "-1px",
              border: "4px solid #000",
              background: "#ecebeb",
              opacity: "0.9",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              margin: "2.5rem",
              width: "88%",
              height: "80%",
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              border: "4px solid #000",
              background: "#fefbfb",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              margin: "2rem",
              width: "88%",
              height: "80%",
            },
            children: {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  margin: "20px",
                  width: "90%",
                  height: "90%",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "90%",
                        maxHeight: "90%",
                        overflow: "hidden",
                        textAlign: "center",
                      },
                      children: [
                        {
                          type: "p",
                          props: {
                            style: { fontSize: 72, fontWeight: "bold" },
                            children: SITE.title,
                          },
                        },
                        {
                          type: "p",
                          props: {
                            style: { fontSize: 28 },
                            children: SITE.desc,
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        marginBottom: "8px",
                        fontSize: 28,
                      },
                      children: {
                        type: "span",
                        props: {
                          style: { overflow: "hidden", fontWeight: "bold" },
                          children: new URL(SITE.website).hostname,
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  };

  return satori(element, {
    width: 1200,
    height: 630,
    embedFont: true,
    fonts: await loadGoogleFonts(SITE.title + SITE.desc + SITE.website),
  });
}
