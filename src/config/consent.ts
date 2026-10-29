import { BOOKING_URL } from "@/config/booking";
import { configureConsent } from "@/lib/consent";

/**
 * Raised by hand, and only for a material change: a new category, tool, purpose or recipient. A visitor who allowed
 * something under an older generation is asked again; one who rejected everything is not. It is written into every new
 * `skt_consent`. A text-only edit raises BANNER_VERSION, not this. Each raise is a row in docs/cookie-banner-versions.md.
 */
export const CONSENT_GENERATION = 1;

/**
 * `YYYY-MM-DD.N`: the date of the banner text and a counter. Bumped by hand whenever the dialog text, the categories or
 * the data use change; it is sent with every logged choice, and each version is a row in docs/cookie-banner-versions.md.
 */
export const BANNER_VERSION = "2026-10-29.1";

/** The booking app serves its API on its own origin, under /api (as `offpeak.ts` reads it). */
export const CONSENT_LOG_URL = `${new URL(BOOKING_URL).origin}/api/public/consent-log`;

// getConsent() needs the generation without an argument; the dialog is mounted on every page, so this runs first.
configureConsent({ generation: CONSENT_GENERATION });
