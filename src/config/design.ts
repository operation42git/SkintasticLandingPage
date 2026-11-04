/**
 * The discreet switch between the current design and the new one (landing-redesign).
 * Everyone sees the current design. `?dizajn=novo` turns the new one on and remembers it in
 * localStorage; `?dizajn=sada` or the switch's "Sada" turns it off and forgets it.
 */
export type Design = "sada" | "novo";

export const DESIGN_STORAGE_KEY = "skt_design";
export const DESIGN_PARAM = "dizajn";

function readStored(): Design {
  try {
    return window.localStorage.getItem(DESIGN_STORAGE_KEY) === "novo" ? "novo" : "sada";
  } catch {
    return "sada";
  }
}

export function rememberDesign(design: Design): void {
  try {
    if (design === "novo") window.localStorage.setItem(DESIGN_STORAGE_KEY, "novo");
    else window.localStorage.removeItem(DESIGN_STORAGE_KEY);
  } catch {
    // Storage blocked: the current design shows, nothing to remember.
  }
}

/** The design for this page view: the URL parameter first (and remembered), else what was stored. */
export function designFromPage(search: string): Design {
  const asked = new URLSearchParams(search).get(DESIGN_PARAM);
  if (asked === "novo" || asked === "sada") {
    rememberDesign(asked);
    return asked === "novo" && readStored() === "novo" ? "novo" : "sada";
  }
  return readStored();
}

/**
 * The new design's hero video (landing-redesign row 2): the person gives the file and its poster
 * (e.g. /images/v2/hero.mp4 and /images/v2/hero-poster.jpg). Empty: the hero shows a linen block.
 */
export const HERO_VIDEO_V2 = { src: "/videos/v2/hero.mp4", poster: "/videos/v2/hero-poster.jpg" };

/**
 * The new design's Povoljniji termini image (landing-redesign row 4): the person gives it
 * (e.g. /images/v2/offers-calendar.jpg). Empty: a stone tint where the image would show.
 */
export const OFFERS_IMAGE_V2 = "";

/**
 * The new design's FAQ groups (landing-redesign row 11): each maps to the existing `faq.items` by index
 * (0-based, end exclusive); the label is `v2.faq.groups.{key}`.
 */
export const FAQ_GROUPS_V2 = [
  { key: "treatment", from: 0, to: 4 },
  { key: "results", from: 4, to: 6 },
  { key: "technology", from: 6, to: 10 },
] as const;
