import { BOOKING_URL } from "@/config/booking";
import { configureConsent } from "@/lib/consent";

/**
 * Raised by hand, and only for a material change: a new category, tool, purpose or recipient (ADR-0068 point 1). A
 * visitor who allowed something under an older generation is asked again; one who rejected everything is not. It is the
 * same number as the booking app's CONSENT_GENERATION.
 */
export const CONSENT_GENERATION = 1;

/** `YYYY-MM-DD.N`: the banner text's date and a counter, sent with every logged choice (ADR-0068 point 3). */
export const BANNER_VERSION = "2026-11-27.1";

/** The booking app serves its API on its own origin, under /api (as the offers and prices reads). */
export const CONSENT_LOG_URL = `${new URL(BOOKING_URL).origin}/api/public/consent-log`;

// getConsent() needs the generation without an argument; the banner is mounted on every page, so this runs first.
configureConsent({ generation: CONSENT_GENERATION });
