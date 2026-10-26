import { useSyncExternalStore } from "react";
import { BOOKING_URL } from "@/config/booking";

/** One day of a studio's off-peak calendar, as the booking app answers it (Skintastic decision 236, ADR-0065). */
export type OffpeakDay = {
  date: string;
  status: "open" | "full" | "closed";
  tier: "day" | "morning" | "gap" | "regular";
  morningUntil: string | null;
  examples: string[];
  shortOnly: boolean;
};

const STATUSES = ["open", "full", "closed"];
const TIERS = ["day", "morning", "gap", "regular"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{2}:\d{2}$/;

/** The booking app serves its API on its own origin, under /api. */
function offpeakUrl(slug: string): string {
  return `${new URL(BOOKING_URL).origin}/api/public/locations/${encodeURIComponent(slug)}/offpeak-days`;
}

function isDay(value: unknown): value is OffpeakDay {
  const day = value as OffpeakDay;
  return (
    typeof day === "object" &&
    day !== null &&
    typeof day.date === "string" &&
    DATE.test(day.date) &&
    STATUSES.includes(day.status) &&
    TIERS.includes(day.tier) &&
    (day.morningUntil === null || (typeof day.morningUntil === "string" && TIME.test(day.morningUntil))) &&
    Array.isArray(day.examples) &&
    day.examples.every((time) => typeof time === "string" && TIME.test(time)) &&
    typeof day.shortOnly === "boolean"
  );
}

export function isDiscounted(day: OffpeakDay): boolean {
  return day.status === "open" && day.tier !== "regular";
}

/** A studio's 14 days, or null when the read fails, is malformed or has no discounted day. */
export async function fetchOffpeakDays(slug: string): Promise<OffpeakDay[] | null> {
  try {
    const response = await fetch(offpeakUrl(slug), { headers: { Accept: "application/json" } });
    if (!response.ok) return null;
    const body: unknown = await response.json();
    const days = (body as { days?: unknown })?.days;
    if (!Array.isArray(days) || !days.every(isDay)) return null;
    return days.some(isDiscounted) ? days : null;
  } catch {
    return null;
  }
}

// Which studios have a calendar to show. The section fills it; the hero line and the
// studio-card links read it, so nothing points at a section that is hidden.
let available: readonly string[] = [];
const listeners = new Set<() => void>();

export function setOffpeakStudios(slugs: readonly string[]): void {
  available = slugs;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const NONE: readonly string[] = [];

export function useOffpeakStudios(): readonly string[] {
  return useSyncExternalStore(subscribe, () => available, () => NONE);
}
