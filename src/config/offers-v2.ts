/**
 * The offers of "Povoljniji termini" in the new design (landing-redesign). They will be set in the
 * Skintastic app (Administracija) and read from it; until that exists the list is empty, so the
 * section is hidden. `?dizajn=novo&ponude=demo` shows a fixed preview set.
 */
export type OfferWindowV2 = {
  name: string;
  percent: number;
  days: string;
  hours: string;
  studio: string;
  /** YYYY-MM-DD, the last day the offer runs. */
  validUntil?: string;
  code: string;
};

export const OFFERS_DEMO_PARAM = "ponude";

const DEMO: readonly OfferWindowV2[] = [
  { name: "Noge kompletne", percent: 30, days: "Uto i Čet", hours: "13:00–16:00", studio: "Zapad", code: "alc_legs_full" },
  {
    name: "Lice i vrat",
    percent: 20,
    days: "Pon–Pet",
    hours: "8:00–11:00",
    studio: "Zapad i Istok",
    validUntil: "2026-11-30",
    code: "pkg_face_neck",
  },
  { name: "Svi tretmani", percent: 10, days: "Pon–Pet", hours: "do 11:00", studio: "Oba studija", code: "" },
];

/** The production source: nothing yet. */
const LIVE: readonly OfferWindowV2[] = [];

function stillValid(offer: OfferWindowV2, now: Date): boolean {
  if (!offer.validUntil) return true;
  return now.getTime() <= new Date(`${offer.validUntil}T23:59:59`).getTime();
}

/** The active offers, highest discount first, at most 3. */
export function activeOffersV2(search: string, now = new Date()): OfferWindowV2[] {
  const demo = new URLSearchParams(search).get(OFFERS_DEMO_PARAM) === "demo";
  return (demo ? DEMO : LIVE)
    .filter((offer) => stillValid(offer, now))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);
}
