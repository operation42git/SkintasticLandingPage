/**
 * The three treatments of "Tretmani i cijene" in the new design (landing-redesign).
 * Names and prices are in messages under `v2.treatments.items.{key}`; `code` is the booking app's
 * catalogue code, sent as ?usluga=. Pazusi is not here: it is the hero offer.
 * Prices come from the live catalogue; a bracket placeholder until it can be read.
 */
export type TreatmentV2 = {
  key: string;
  code: string;
};

export const treatmentsV2: readonly TreatmentV2[] = [
  { key: "faceNeck", code: "pkg_face_neck" },
  { key: "intimate", code: "alc_intimate_full_f" },
  { key: "back", code: "alc_back_full" },
];
