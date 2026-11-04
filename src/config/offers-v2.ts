import { useSyncExternalStore } from "react";
import { BOOKING_URL } from "@/config/booking";
import { locationsOf } from "@/config/locations";

/**
 * The partner's time offers ("Povoljniji termini"), read from the Skintastic app when the page loads
 * (landing-offers-live; the app's route is ADR-0071 point 4). Both designs show them.
 * `?ponude=demo` shows a fixed preview set instead.
 */
export type OfferRange = {
  /** ISO weekdays, 1 = Monday … 7 = Sunday. */
  weekdays: number[];
  /** "HH:MM" */
  starts: string;
  ends: string;
};

export type OfferLocation = { slug: string; name: string };

export type OfferWindowV2 = {
  /** The service's public name, or "Svi tretmani" / "All treatments". */
  name: string;
  /** The catalogue code, or null for all treatments. */
  serviceCode: string | null;
  percent: number;
  ranges: OfferRange[];
  locations: OfferLocation[];
  /** YYYY-MM-DD, the last day the offer runs, or null. */
  validUntil: string | null;
};

export const OFFERS_DEMO_PARAM = "ponude";

const DEMO: readonly OfferWindowV2[] = [
  {
    name: "Noge kompletne",
    serviceCode: "alc_legs_full",
    percent: 30,
    ranges: [{ weekdays: [2, 4], starts: "13:00", ends: "16:00" }],
    locations: [{ slug: "zagreb-zapad", name: "Skintastic Zapad" }],
    validUntil: null,
  },
  {
    name: "Lice i vrat",
    serviceCode: "pkg_face_neck",
    percent: 20,
    ranges: [{ weekdays: [1, 2, 3, 4, 5], starts: "08:00", ends: "11:00" }],
    locations: [
      { slug: "zagreb-zapad", name: "Skintastic Zapad" },
      { slug: "zagreb-istok", name: "Skintastic Istok" },
    ],
    validUntil: "2026-11-30",
  },
  {
    name: "Svi tretmani",
    serviceCode: null,
    percent: 10,
    ranges: [
      { weekdays: [1, 2, 3, 4, 5], starts: "08:00", ends: "11:00" },
      { weekdays: [6], starts: "18:00", ends: "20:00" },
    ],
    locations: [
      { slug: "zagreb-zapad", name: "Skintastic Zapad" },
      { slug: "zagreb-istok", name: "Skintastic Istok" },
    ],
    validUntil: null,
  },
];

const TIME = /^\d{2}:\d{2}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** The partner slug of a `/book/f/{slug}` entry, or null for any other path. */
export function partnerSlug(bookingUrl: string = BOOKING_URL): string | null {
  const match = new URL(bookingUrl).pathname.match(/^\/book\/f\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function isRange(value: unknown): value is OfferRange {
  const r = value as OfferRange;
  return (
    typeof r === "object" &&
    r !== null &&
    Array.isArray(r.weekdays) &&
    r.weekdays.every((d) => Number.isInteger(d) && d >= 1 && d <= 7) &&
    typeof r.starts === "string" &&
    TIME.test(r.starts) &&
    typeof r.ends === "string" &&
    TIME.test(r.ends)
  );
}

function isLocation(value: unknown): value is OfferLocation {
  const l = value as OfferLocation;
  return typeof l === "object" && l !== null && typeof l.slug === "string" && typeof l.name === "string";
}

function isOffer(value: unknown): value is OfferWindowV2 {
  const o = value as OfferWindowV2;
  return (
    typeof o === "object" &&
    o !== null &&
    typeof o.name === "string" &&
    (o.serviceCode === null || typeof o.serviceCode === "string") &&
    typeof o.percent === "number" &&
    Array.isArray(o.ranges) &&
    o.ranges.every(isRange) &&
    Array.isArray(o.locations) &&
    o.locations.every(isLocation) &&
    (o.validUntil === null || (typeof o.validUntil === "string" && DATE.test(o.validUntil)))
  );
}

/**
 * The partner's offers in the app's order (largest first, at most 3), or null when the read is skipped or
 * fails. A skipped or failed read writes one console warning naming the URL and the reason; no offers is not a
 * failure. Offers with no ranges or no locations are left out.
 */
export async function fetchOffers(locale: string): Promise<OfferWindowV2[] | null> {
  const slug = partnerSlug();
  if (!slug) {
    console.warn(`Povoljniji termini: NEXT_PUBLIC_BOOKING_URL is not a partner entry (/book/f/{slug}), offers not read`);
    return null;
  }
  const url = `${new URL(BOOKING_URL).origin}/api/public/franchisees/${encodeURIComponent(slug)}/offers?lang=${encodeURIComponent(locale)}`;
  let response: Response;
  try {
    response = await fetch(url, { headers: { Accept: "application/json" } });
  } catch {
    console.warn(`Povoljniji termini: ${url} failed (network)`);
    return null;
  }
  if (!response.ok) {
    console.warn(`Povoljniji termini: ${url} failed (status ${response.status})`);
    return null;
  }
  let offers: unknown;
  try {
    offers = ((await response.json()) as { offers?: unknown })?.offers;
  } catch {
    offers = undefined;
  }
  if (!Array.isArray(offers) || !offers.every(isOffer)) {
    console.warn(`Povoljniji termini: ${url} failed (malformed)`);
    return null;
  }
  return offers.filter((o) => o.ranges.length > 0 && o.locations.length > 0).slice(0, 3);
}

// One read per page load and language: both designs (and the current page shown briefly before the switch)
// share it, so a failure warns once.
const reads = new Map<string, Promise<OfferWindowV2[] | null>>();

/** The demo set with `?ponude=demo`, otherwise the app's offers (empty when the read fails). */
export async function loadOffers(search: string, locale: string): Promise<OfferWindowV2[]> {
  if (new URLSearchParams(search).get(OFFERS_DEMO_PARAM) === "demo") return [...DEMO];
  let read = reads.get(locale);
  if (!read) {
    read = fetchOffers(locale);
    reads.set(locale, read);
  }
  return (await read) ?? [];
}

// ---- in words

/** "Pon–Pet" for a run of three or more, "Uto i Čet" for two, "Pon, Sri, Pet" otherwise. */
export function daysInWords(weekdays: number[], short: string[], and: string): string {
  const days = [...new Set(weekdays)].sort((a, b) => a - b);
  const parts: string[] = [];
  for (let i = 0; i < days.length; ) {
    let j = i;
    while (j + 1 < days.length && days[j + 1] === days[j] + 1) j++;
    if (j - i >= 2) {
      parts.push(`${short[days[i] - 1]}–${short[days[j] - 1]}`);
    } else {
      for (let k = i; k <= j; k++) parts.push(short[days[k] - 1]);
    }
    i = j + 1;
  }
  return parts.length === 2 ? parts.join(and) : parts.join(", ");
}

export function hoursInWords(range: OfferRange): string {
  return `${range.starts}–${range.ends}`;
}

/** "Oba studija" when the offer covers both of the partner's bookable studios, else the names. */
export function studiosInWords(locations: OfferLocation[], both: string, and: string): string {
  const bookable = locationsOf("bookable").map((l) => l.slug);
  const slugs = new Set(locations.map((l) => l.slug));
  if (bookable.length === 2 && bookable.every((s) => slugs.has(s)) && slugs.size === 2) return both;
  const names = locations.map((l) => l.name);
  return names.length <= 2 ? names.join(and) : `${names.slice(0, -1).join(", ")}${and}${names[names.length - 1]}`;
}

/** "30. 11." from YYYY-MM-DD. */
export function shortDate(date: string): string {
  return `${Number(date.slice(8, 10))}. ${Number(date.slice(5, 7))}.`;
}

// ---- which offers are on the page (the hero and studio-card links read it)

let shown: readonly OfferWindowV2[] = [];
const listeners = new Set<() => void>();
const NONE: readonly OfferWindowV2[] = [];

export function setOffersShown(offers: readonly OfferWindowV2[]): void {
  shown = offers;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOffersShown(): readonly OfferWindowV2[] {
  return useSyncExternalStore(subscribe, () => shown, () => NONE);
}
