export type LocationType = "bookable" | "teaser" | "external";

export type Location = {
  id: string;
  type: LocationType;
  /** App slug sent as ?centar=. Empty for teaser and external. */
  slug: string;
  name: string;
  /** Street address, or the teaser's area. */
  address: string;
  hours: string;
  parking: string;
  /** Teaser only. Empty means the badge is "Uskoro" on its own. */
  openingLabel: string;
  /** External site. A bracket placeholder is not a link. */
  url: string;
  image: string;
};

export const locations: Location[] = [
  {
    id: "istok",
    type: "bookable",
    slug: "zagreb-istok",
    name: "Skintastic Istok",
    address: "Drage Gervaisa 1, 10090 Zagreb",
    hours: "[RADNO VRIJEME]",
    parking: "[PARKIRANJE]",
    openingLabel: "",
    url: "",
    image: "/images/locations/zagreb.jpg",
  },
  {
    id: "zapad",
    type: "bookable",
    slug: "zagreb-zapad",
    name: "Skintastic Zapad",
    address: "[ADRESA ZAPAD]",
    hours: "[RADNO VRIJEME]",
    parking: "[PARKIRANJE]",
    openingLabel: "",
    url: "",
    image: "/images/locations/zagreb-2.jpeg",
  },
  {
    id: "jug",
    type: "teaser",
    slug: "",
    name: "Skintastic Jug – Velika Gorica",
    address: "Velika Gorica",
    hours: "",
    parking: "",
    openingLabel: "",
    url: "",
    image: "",
  },
  {
    id: "wien",
    type: "external",
    slug: "",
    name: "Wien",
    address: "",
    hours: "",
    parking: "",
    openingLabel: "",
    url: "[URL WIEN]",
    image: "/images/locations/wien.jpg",
  },
  {
    id: "graz-puntigam",
    type: "external",
    slug: "",
    name: "Graz Puntigam",
    address: "",
    hours: "",
    parking: "",
    openingLabel: "",
    url: "[URL GRAZ PUNTIGAM]",
    image: "/images/locations/graz-puntigam.jpg",
  },
  {
    id: "graz-city",
    type: "external",
    slug: "",
    name: "Graz City",
    address: "",
    hours: "",
    parking: "",
    openingLabel: "",
    url: "[URL GRAZ CITY]",
    image: "/images/locations/graz-city.jpg",
  },
  {
    id: "stuttgart",
    type: "external",
    slug: "",
    name: "Stuttgart",
    address: "",
    hours: "",
    parking: "",
    openingLabel: "",
    url: "[URL STUTTGART]",
    image: "/images/locations/stuttgart.jpg",
  },
];

/** Bookable and external centres. Teasers count only after they open. */
export function brandCentreCount(list: readonly Location[] = locations): number {
  return list.filter((location) => location.type === "bookable" || location.type === "external").length;
}

export function locationsOf(type: LocationType, list: readonly Location[] = locations): Location[] {
  return list.filter((location) => location.type === type);
}

/** "A i B", or "A, B i C" when the last join word is passed in. */
export function joinNames(names: readonly string[], lastJoin: string): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]}${lastJoin}${names[1]}`;
  return `${names.slice(0, -1).join(", ")}${lastJoin}${names[names.length - 1]}`;
}

/** A bracket address is shown as text and is not sent to a map search. */
export function mapsSearchHref(address: string): string | null {
  const trimmed = address.trim();
  if (!trimmed || trimmed.startsWith("[")) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

/** A bracket placeholder is shown as text and is not used as a link. */
export function externalHref(location: Location): string | null {
  if (location.type !== "external") return null;
  const url = location.url.trim();
  if (!url || url.startsWith("[")) return null;
  return url;
}
