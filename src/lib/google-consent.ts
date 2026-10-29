/**
 * Google Consent Mode v2, basic, for Google Analytics 4 and the Google Ads tag (docs/briefs/landing-google-consent-mode.md).
 *
 * Pure on purpose: nothing here imports from `@/` or `next`; the DOM, the script and the `gtag` calls are in
 * `src/components/analytics/GoogleTags.tsx`. `node --test src/lib/google-consent.test.mts` runs it.
 */
/** The shape of a choice (src/lib/consent.ts); spelled out here so this file imports nothing, `.ts` extension or not. */
export type ConsentLike = {
  readonly functional: boolean;
  readonly analytics: boolean;
  readonly performance: boolean;
  readonly ads: boolean;
};

export type Signal = "granted" | "denied";

/** The seven Consent Mode v2 keys. */
export type Signals = {
  readonly analytics_storage: Signal;
  readonly ad_storage: Signal;
  readonly ad_user_data: Signal;
  readonly ad_personalization: Signal;
  readonly functionality_storage: Signal;
  readonly personalization_storage: Signal;
  readonly security_storage: Signal;
};

/** What `gtag("consent", "default", …)` is given: everything denied, before any choice is applied. */
export const DENIED_ALL: Signals = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "denied",
};

const grant = (allowed: boolean): Signal => (allowed ? "granted" : "denied");

/**
 * The signals for a choice. `performance` maps to no signal. Ad personalization stays denied while it is not allowed
 * (a decision of the person after the lawyer's agreement); then it follows `ads`. `security_storage` is always granted.
 * No choice: everything denied except security.
 */
export function signalsFor(consent: ConsentLike | null, personalizationAllowed: boolean): Signals {
  return {
    analytics_storage: grant(consent?.analytics === true),
    ad_storage: grant(consent?.ads === true),
    ad_user_data: grant(consent?.ads === true),
    ad_personalization: grant(consent?.ads === true && personalizationAllowed),
    functionality_storage: grant(consent?.functional === true),
    personalization_storage: "denied",
    security_storage: "granted",
  };
}

// ---- the IDs -----------------------------------------------------------------------------------

const GA4_ID = /^G-[A-Z0-9]{6,12}$/;
const ADS_ID = /^AW-[0-9]{6,12}$/;

export function parseGa4Id(value: string): string | null {
  return GA4_ID.test(value) ? value : null;
}

export function parseAdsId(value: string): string | null {
  return ADS_ID.test(value) ? value : null;
}

export type Ids = { readonly ga4: string | null; readonly ads: string | null };

// ---- what to load and configure -----------------------------------------------------------------

/** Which tags are configured: GA4 needs analytics_storage and its ID; Ads needs ad_storage and its ID. */
export function configsFor(signals: Signals, ids: Ids): { readonly ga4: boolean; readonly ads: boolean } {
  return {
    ga4: signals.analytics_storage === "granted" && ids.ga4 !== null,
    ads: signals.ad_storage === "granted" && ids.ads !== null,
  };
}

/**
 * The ID the Google script is requested with, or null when nothing is requested: only when analytics_storage or
 * ad_storage is granted and its ID is set. Functional alone, performance alone, no choice and Reject request nothing.
 */
export function scriptIdFor(signals: Signals, ids: Ids): string | null {
  const configs = configsFor(signals, ids);
  if (configs.ga4) return ids.ga4;
  if (configs.ads) return ids.ads;
  return null;
}

export function scriptUrl(id: string): string {
  return `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
}

/** True when a signal that was granted is no longer: the withdrawal rule (update, disable, delete cookies, reload). */
export function withdrew(before: Signals | null, after: Signals): { readonly analytics: boolean; readonly ads: boolean } {
  return {
    analytics: before?.analytics_storage === "granted" && after.analytics_storage === "denied",
    ads: before?.ad_storage === "granted" && after.ad_storage === "denied",
  };
}

/**
 * The withdrawals that matter: a part whose tag actually started and whose signal is no longer granted. Turning analytics
 * off when only the Ads tag is live changes the signals but needs no cleanup and no reload.
 */
export function liveWithdrawal(
  before: Signals | null,
  after: Signals,
  live: { readonly analytics: boolean; readonly ads: boolean },
): { readonly analytics: boolean; readonly ads: boolean } {
  const gone = withdrew(before, after);
  return { analytics: gone.analytics && live.analytics, ads: gone.ads && live.ads };
}

// ---- events -------------------------------------------------------------------------------------

export type GtagEvent = readonly ["event", string, Record<string, unknown>];

/** Every event names its destination: none can reach the Ads destination. */
export function eventTo(ga4Id: string, name: string, params: Record<string, unknown>): GtagEvent {
  return ["event", name, { ...params, send_to: ga4Id }];
}

export function pageView(ga4Id: string, page: { readonly path: string; readonly title: string; readonly locale: string }): GtagEvent {
  return eventTo(ga4Id, "page_view", { page_path: page.path, page_title: page.title, locale: page.locale });
}

// ---- cookies ------------------------------------------------------------------------------------

export type CookieNames = { readonly exact: readonly string[]; readonly prefixes: readonly string[] };

/**
 * The Google cookies of each part, as Google's advertising cookies page lists them (2026-10-28 and 2026-10-29):
 * `_ga` and `_ga_<id>` (2 years); `_gcl_au`, `_gcl_aw`, `_gcl_gs`, `_gcl_ag`, `_gcl_gb`, `_gac_<id>` and `_gac_gb_<id>` (90 days).
 * A prefix covers `_ga_*` and `_gac_*`; `_ga_` does not match `_gac_`.
 */
export const GOOGLE_COOKIES: { readonly analytics: CookieNames; readonly ads: CookieNames } = {
  analytics: { exact: ["_ga"], prefixes: ["_ga_"] },
  ads: { exact: ["_gcl_au", "_gcl_aw", "_gcl_gs", "_gcl_ag", "_gcl_gb"], prefixes: ["_gac_"] },
};

/** The name of GA4's session cookie for an ID: `_ga_` and the ID without `G-`. */
export function ga4CookieName(ga4Id: string): string {
  return `_ga_${ga4Id.replace(/^G-/, "")}`;
}

export function cookieMatches(name: string, names: CookieNames): boolean {
  return names.exact.includes(name) || names.prefixes.some((prefix) => name.startsWith(prefix));
}

export function cookieNamesIn(header: string): string[] {
  return header
    .split("; ")
    .filter(Boolean)
    .map((part) => part.slice(0, part.indexOf("=")));
}

/**
 * The domains a cookie may have been set on: the host and every parent suffix that has at least two labels, so the
 * domain Google chose is always covered. `localhost` and an IP address give only themselves; a bare top-level label
 * (`hr`) is never tried.
 */
export function domainsFor(hostname: string): string[] {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) || !hostname.includes(".")) return [hostname];
  const labels = hostname.split(".");
  const domains: string[] = [];
  for (let i = 0; i <= labels.length - 2; i += 1) domains.push(labels.slice(i).join("."));
  return domains;
}

/** Expiring `Set-Cookie` strings for every present cookie of the given parts, on the host alone and on each domain. */
export function deletionStrings(parts: readonly CookieNames[], header: string, hostname: string): string[] {
  const out: string[] = [];
  for (const name of cookieNamesIn(header)) {
    if (!parts.some((names) => cookieMatches(name, names))) continue;
    out.push(`${name}=; Path=/; Max-Age=0; SameSite=Lax`);
    for (const domain of domainsFor(hostname)) out.push(`${name}=; Path=/; Max-Age=0; SameSite=Lax; Domain=${domain}`);
  }
  return out;
}
