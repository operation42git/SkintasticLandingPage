/**
 * The discreet switch between the current design and the new one (landing-redesign).
 * Everyone sees the current design. `?dizajn=novo` turns the new one on and makes this browser a tester:
 * both headers then show a button that flips between the designs (Ivan, 2026-11-06). `?dizajn=sada`
 * turns the new design off and ends testing, so the button goes away. Both are kept in localStorage.
 */
export type Design = "sada" | "novo";

export const DESIGN_STORAGE_KEY = "skt_design";
export const DESIGN_TESTER_KEY = "skt_design_tester";
export const DESIGN_PARAM = "dizajn";
/** Window event the header buttons send; DesignRoot listens and swaps the page. */
export const DESIGN_EVENT = "skt-design";

export function isDesignTester(): boolean {
  // The link decides first: the header renders before DesignRoot stores what the link asked for.
  const asked = new URLSearchParams(window.location.search).get(DESIGN_PARAM);
  if (asked === "novo" || asked === "sada") return asked === "novo";
  try {
    // A browser that already had the new design on before the flag existed counts as a tester too.
    const storage = window.localStorage;
    return storage.getItem(DESIGN_TESTER_KEY) === "1" || storage.getItem(DESIGN_STORAGE_KEY) === "novo";
  } catch {
    return false;
  }
}

function setTester(on: boolean): void {
  try {
    if (on) window.localStorage.setItem(DESIGN_TESTER_KEY, "1");
    else window.localStorage.removeItem(DESIGN_TESTER_KEY);
  } catch {
    // Storage blocked: no button, the URL parameter still works.
  }
}

/** The header button: remember the design, tell DesignRoot, start at the top of the page. */
export function chooseDesign(design: Design): void {
  rememberDesign(design);
  // Drop ?dizajn= from the address, so a reload keeps this choice instead of the link's.
  const url = new URL(window.location.href);
  if (url.searchParams.has(DESIGN_PARAM)) {
    url.searchParams.delete(DESIGN_PARAM);
    window.history.replaceState(window.history.state, "", url);
  }
  window.dispatchEvent(new CustomEvent<Design>(DESIGN_EVENT, { detail: design }));
  window.scrollTo(0, 0);
}

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
    setTester(asked === "novo");
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
export const OFFERS_IMAGE_V2 = "/images/v2/offers-calendar.jpg";

/**
 * The new design's FAQ groups (landing-redesign row 11): each maps to the existing `faq.items` by index
 * (0-based, end exclusive); the label is `v2.faq.groups.{key}`.
 */
export const FAQ_GROUPS_V2 = [
  { key: "treatment", from: 0, to: 4 },
  { key: "results", from: 4, to: 6 },
  { key: "technology", from: 6, to: 10 },
] as const;

/** The new design's O nama photo (landing-redesign row 9; Ivan, 2026-11-05: the mockup's photo, 382 × 370 px). */
export const ABOUT_IMAGE_V2 = "/images/v2/about-sun.jpg";

/**
 * The staff row in Zašto Skintastic? (landing-redesign row 7; Ivan, 2026-11-06). Names and roles are in messages
 * under `v2.why.staff.people.{key}`. The photos are temporary stills from the studio's reels: replace the files
 * (same names) with proper portraits when Ivan gives them.
 */
export const STAFF_V2 = [
  { key: "gabriella", photo: "/images/v2/staff-gabriella.jpg" },
  { key: "savka", photo: "/images/v2/staff-savka.jpg" },
] as const;
