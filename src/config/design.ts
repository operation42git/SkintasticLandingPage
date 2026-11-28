/** The landing's design assets (landing-redesign). The previous design was retired on 2026-11-24 (Ivan). */

/**
 * The new design's hero video (landing-redesign row 2): the person gives the file and its poster
 * (e.g. /images/v2/hero.mp4 and /images/v2/hero-poster.jpg). Empty: the hero shows a linen block.
 */
// Ivan, 2026-11-16: a square cut of the studio's reel (reception logo, branded sheet, therapist at work, laser
// close-up; no faces), shown in a square box beside the text on the laptop.
export const HERO_VIDEO_V2 = { src: "/videos/v2/hero-square.mp4", poster: "/videos/v2/hero-square-poster.jpg" };

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
  { key: "savka", photo: "/images/v2/staff-savka.jpg" },
] as const;
