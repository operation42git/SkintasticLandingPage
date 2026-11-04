import { Hanken_Grotesk, Newsreader } from "next/font/google";

// Not preloaded, and their classes go only on the new design's root: a visitor to the current
// design downloads neither font.
export const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--v2-font-display",
  display: "swap",
  preload: false,
});

export const hanken = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--v2-font-text",
  display: "swap",
  preload: false,
});
