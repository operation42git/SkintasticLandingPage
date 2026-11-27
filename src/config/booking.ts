const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
/** Ad-click IDs travel only while the visitor allows ads (brief consent-banner-v2, Ivan 2026-11-27). */
const CLICK_ID_PARAMS = ["gclid", "fbclid"] as const;

/**
 * The visitor's cookie choice as a booking link carries it. `handover`: the `skt_consent` value and its consent id,
 * passed as `consent` and `cid` once a choice exists (ADR-0075 point 3); the booking page checks them against the
 * consent log, writes its own cookie and removes them from the address.
 */
export type LinkConsent = {
  readonly adsAllowed: boolean;
  readonly handover?: { readonly consent: string; readonly cid: string };
};

function requireAbsoluteUrl(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} is required`);
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be an absolute URL`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${name} must be an absolute URL`);
  }
  return value;
}

export const BOOKING_URL = requireAbsoluteUrl(
  "NEXT_PUBLIC_BOOKING_URL",
  process.env.NEXT_PUBLIC_BOOKING_URL,
);

export const SITE_URL = requireAbsoluteUrl(
  "NEXT_PUBLIC_SITE_URL",
  process.env.NEXT_PUBLIC_SITE_URL,
);

export function consentCookieDomain(): string {
  return new URL(SITE_URL).hostname;
}

/** The catalogue code of the free consultation ("Rezerviraj besplatno savjetovanje"). */
export const CONSULTATION_CODE = "consult";

/** A bracket placeholder is not a catalogue code, so the link omits ?usluga=. */
export function confirmedCode(code: string | undefined): string | undefined {
  const trimmed = code?.trim() ?? "";
  if (!trimmed || trimmed.startsWith("[")) return undefined;
  return trimmed;
}

export function buildBookingHref(
  options: { centar?: string; usluga?: string } = {},
  pageSearch = "",
  consent: LinkConsent = { adsAllowed: false },
): string {
  const url = new URL(BOOKING_URL);
  if (options.centar) url.searchParams.set("centar", options.centar);
  if (options.usluga) url.searchParams.set("usluga", options.usluga);

  const incoming = new URLSearchParams(
    pageSearch.startsWith("?") ? pageSearch.slice(1) : pageSearch,
  );
  for (const key of consent.adsAllowed ? [...UTM_PARAMS, ...CLICK_ID_PARAMS] : UTM_PARAMS) {
    const value = incoming.get(key);
    if (value) url.searchParams.set(key, value);
  }
  if (consent.handover && consent.handover.consent.length <= 40) {
    url.searchParams.set("consent", consent.handover.consent);
    url.searchParams.set("cid", consent.handover.cid);
  }

  return url.toString();
}
