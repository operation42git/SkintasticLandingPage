const CAMPAIGN_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

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
): string {
  const url = new URL(BOOKING_URL);
  if (options.centar) url.searchParams.set("centar", options.centar);
  if (options.usluga) url.searchParams.set("usluga", options.usluga);

  const incoming = new URLSearchParams(
    pageSearch.startsWith("?") ? pageSearch.slice(1) : pageSearch,
  );
  for (const key of CAMPAIGN_PARAMS) {
    const value = incoming.get(key);
    if (value) url.searchParams.set(key, value);
  }

  return url.toString();
}
