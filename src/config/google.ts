import { parseAdsId, parseGa4Id } from "@/lib/google-consent";

/**
 * The two Google IDs come from the environment only, and are given by the person (never written in code, never committed):
 * `NEXT_PUBLIC_GA4_MEASUREMENT_ID` (`G-…`) and `NEXT_PUBLIC_GOOGLE_ADS_ID` (`AW-…`). They are read when the site is built, so
 * a changed ID needs a new build. Unset: that tag never loads. Set but malformed: the build fails, naming the variable.
 */
function optionalId(name: string, raw: string | undefined, parse: (value: string) => string | null): string | null {
  const value = raw?.trim() ?? "";
  if (value === "") return null;
  const id = parse(value);
  if (id === null) throw new Error(`${name} is set but is not a valid ID`);
  return id;
}

export const GA4_ID = optionalId("NEXT_PUBLIC_GA4_MEASUREMENT_ID", process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID, parseGa4Id);
export const ADS_ID = optionalId("NEXT_PUBLIC_GOOGLE_ADS_ID", process.env.NEXT_PUBLIC_GOOGLE_ADS_ID, parseAdsId);

/**
 * Ad personalization (remarketing) stays off until the lawyer agrees. Changing this is a decision of the person: it also
 * changes the text of `cookieConsent.categories.ads.desc` and raises BANNER_VERSION, in the same commit.
 */
export const AD_PERSONALIZATION_ALLOWED = false;
