import { BOOKING_URL } from "@/config/booking";
import { partnerSlug } from "@/config/offers-v2";

/**
 * Prices and their bazna cijena (Croatian rules from 17 Nov 2026), read live from the app (Ivan, 2026-11-19,
 * option A; app route ADR-0076): GET {app}/api/public/v1/franchisees/{partner}/prices.
 *
 * The switch: NEXT_PUBLIC_PRICES_FROM_APP=1 reads the prices from the app; anything else keeps the typed prices of
 * the messages (no bazna cijena line). Turn it on per environment once the route is live there.
 * With the switch on, a code the app doesn't return shows no price: never a typed one.
 */
export const PRICES_FROM_APP = process.env.NEXT_PUBLIC_PRICES_FROM_APP === "1";

export type PriceInfo = {
  /** The lowest price across the partner's studios, in cents. */
  cents: number;
  /** That same studio's bazna cijena; both null when not set. */
  baseCents: number | null;
  baseDate: string | null;
};

type ApiService = { code: string; priceCents: number; baseAmountCents: number | null; baseDate: string | null };
type ApiLocation = { slug: string; services: ApiService[] };

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function isService(value: unknown): value is ApiService {
  const s = value as ApiService;
  return (
    typeof s === "object" &&
    s !== null &&
    typeof s.code === "string" &&
    Number.isInteger(s.priceCents) &&
    (s.baseAmountCents === null || Number.isInteger(s.baseAmountCents)) &&
    (s.baseDate === null || (typeof s.baseDate === "string" && DATE.test(s.baseDate)))
  );
}

function isLocation(value: unknown): value is ApiLocation {
  const l = value as ApiLocation;
  return typeof l === "object" && l !== null && Array.isArray(l.services) && l.services.every(isService);
}

/** Per code: the lowest price across studios and that studio's base (on a tie, the studio that has a base). */
export function lowestPrices(locations: ApiLocation[]): Map<string, PriceInfo> {
  const prices = new Map<string, PriceInfo>();
  for (const location of locations) {
    for (const service of location.services) {
      const base = service.baseAmountCents !== null && service.baseDate !== null;
      const next: PriceInfo = {
        cents: service.priceCents,
        baseCents: base ? service.baseAmountCents : null,
        baseDate: base ? service.baseDate : null,
      };
      const current = prices.get(service.code);
      if (!current || next.cents < current.cents || (next.cents === current.cents && current.baseCents === null && base)) {
        prices.set(service.code, next);
      }
    }
  }
  return prices;
}

/** The prices by catalogue code, or null when the read is skipped or fails (one console warning). */
export async function fetchPrices(): Promise<Map<string, PriceInfo> | null> {
  const slug = partnerSlug();
  if (!slug) {
    console.warn("Cijene: NEXT_PUBLIC_BOOKING_URL is not a partner entry (/book/f/{slug}), prices not read");
    return null;
  }
  const url = `${new URL(BOOKING_URL).origin}/api/public/v1/franchisees/${encodeURIComponent(slug)}/prices`;
  try {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      console.warn(`Cijene: ${url} failed (status ${response.status})`);
      return null;
    }
    const locations = ((await response.json()) as { locations?: unknown })?.locations;
    if (!Array.isArray(locations) || !locations.every(isLocation)) {
      console.warn(`Cijene: ${url} failed (malformed)`);
      return null;
    }
    return lowestPrices(locations);
  } catch {
    console.warn(`Cijene: ${url} failed (network)`);
    return null;
  }
}

let read: Promise<Map<string, PriceInfo> | null> | null = null;

/** One read per page load, shared by both designs. */
export function loadPrices(): Promise<Map<string, PriceInfo> | null> {
  if (!read) read = fetchPrices();
  return read;
}

const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "19,90 €" (hr, de) or "€19.90" (en). */
export function formatAmount(cents: number, locale: string): string {
  const value = (cents / 100).toFixed(2);
  return locale === "en" ? `€${value}` : `${value.replace(".", ",")} €`;
}

/** "10. 9. 2026." (hr), "10 Sep 2026" (en), "10.09.2026" (de), from YYYY-MM-DD. */
export function formatBaseDate(date: string, locale: string): string {
  const [y, m, d] = date.split("-");
  if (locale === "en") return `${Number(d)} ${MONTHS_EN[Number(m) - 1]} ${y}`;
  if (locale === "de") return `${d}.${m}.${y}`;
  return `${Number(d)}. ${Number(m)}. ${y}.`;
}
