/**
 * The three treatments of "Tretmani i cijene" in the new design (landing-redesign).
 * Names and prices are in messages under `v2.treatments.items.{key}`; `code` is the booking app's
 * catalogue code, sent as ?usluga=. Pazusi and Noge kompletne are not here (the hero offer and the
 * time offer). Chosen by Ivan, 2026-11-04, from the app's catalogue.
 */
export type TreatmentV2 = {
  key: string;
  code: string;
};

export const treatmentsV2: readonly TreatmentV2[] = [
  { key: "bikini", code: "alc_bikini_groin_f" },
  { key: "chest", code: "alc_chest" },
  { key: "back", code: "alc_back_full" },
];
