# Brief · landing: Google Analytics and the Google Ads tag, loaded only after consent (Consent Mode v2, basic)

> **Draft, not accepted.** Written 2026-10-28 by the landing-page cookie audit conversation from the
> person's choices of the same day. Do not start it until a person writes "Accepted by …" here. It waits
> for the brief `landing-cookie-consent` to be built and merged (it uses that brief's `getConsent()`, the
> `skt:consent-updated` event, `BANNER_VERSION` and the two notes in `docs/`). Before the **real** IDs are set
> in production the lawyer must have reviewed the privacy page and the cookie texts; this brief does not set
> them.

## Touches

- `src/components/analytics/GoogleTags.tsx` (new: the loader, mounted once)
- `src/app/[locale]/layout.tsx` (the mount line only)
- `src/lib/google-consent.ts` (new: the pure rules below, imports nothing from `@/`) and
  `src/lib/google-consent.test.mts` (new: run with `node --test`, no dependency)
- `src/config/google.ts` (new: the two IDs from the environment and the personalization switch)
- `src/config/consent.ts` (`BANNER_VERSION` only)
- `messages/hr.json`, `messages/en.json` (`cookieConsent.categories.analytics.desc` and
  `cookieConsent.categories.ads.desc` only)
- `docs/cookie-consent.md` and `docs/cookie-banner-versions.md` (add to the notes the previous brief created)

Changing any other file: stop and ask. End your report with `git diff --stat origin/main...HEAD`.

**Goal**
The page can measure visits with Google Analytics 4 and prepare Google Ads, and does so only for a visitor
who allowed it. Before a choice, after Reject, and after a withdrawal, no Google script, request or cookie
exists. Nothing is configured with an ID that the person has not given.

**Decided** the person, 2026-10-28:
- **Basic Consent Mode:** the Google script is not loaded until a matching category is allowed.
- **`gtag.js` loaded directly** from this page's code. No Google Tag Manager.
- **Strict mapping** of the categories (below).
- **Ad personalization is always denied** until the lawyer approves; one constant controls it.
- The Google Ads tag is included, with personalization denied.

Skintastic ADR-0047 (accepted): the page writes the choice, nothing third-party loads before consent, no personal
data goes to Google. Booking-confirmed conversions are sent by the booking app (its own brief), not by this page.

**Values**

| Field | Allowed values |
|---|---|
| IDs | `NEXT_PUBLIC_GA4_MEASUREMENT_ID` (`G-` and 6 to 12 capital letters or digits) and `NEXT_PUBLIC_GOOGLE_ADS_ID` (`AW-` and 6 to 12 digits). **The person gives both.** Environment variables only, never written in code or committed. Unset: that tag never loads. Set but malformed: the build fails with a message naming the variable. For tests use dummy IDs of the right shape in `.env.local` only. |
| signals | the seven Consent Mode v2 keys, each `"granted"` or `"denied"`: `analytics_storage` ← `analytics`; `ad_storage` and `ad_user_data` ← `ads`; `ad_personalization` ← **always `"denied"`** while `AD_PERSONALIZATION_ALLOWED` is `false` (then it follows `ads`); `functionality_storage` ← `functional`; `personalization_storage` always `"denied"`; `security_storage` always `"granted"`. `performance` maps to **no** signal. |
| `AD_PERSONALIZATION_ALLOWED` | a constant in `src/config/google.ts`, `false`. Changing it is a decision of the person after the lawyer's agreement, and bumps `BANNER_VERSION` with the text of `categories.ads.desc`. |
| load rule | the Google script (`https://www.googletagmanager.com/gtag/js?id=<one set ID>`) is requested only when `analytics_storage` or `ad_storage` is `"granted"` and its ID is set; once, never twice. Functional alone, performance alone, no choice, Reject: nothing is requested. |
| start | in the browser, once the consent API says there is a choice: define `window.dataLayer` and `gtag`, `gtag("consent","default", every signal "denied")`, then `gtag("consent","update", the signals)`, then load the script, then `gtag("js", new Date())`, then the configs below. All of this before any `config`. |
| GA4 config | only when `analytics_storage` is `"granted"` and the GA4 ID is set: `gtag("config", GA4_ID, { send_page_view: false })`, then one `page_view` event with the page's path, title and locale. |
| Ads config | only when `ad_storage` is `"granted"` and the Ads ID is set: `gtag("config", ADS_ID, { allow_ad_personalization_signals: false })` while `AD_PERSONALIZATION_ALLOWED` is `false`. No conversion event is sent by this page. |
| page changes | one more `page_view` when the pathname changes (a locale switch, a client navigation), only while `analytics_storage` is `"granted"`; none for the same path. |
| changes of choice | on `skt:consent-updated`: recompute the signals and send `gtag("consent","update", …)`; load the script and the configs that newly qualify. |
| withdrawal | when a signal that was `"granted"` becomes `"denied"`: send the update, set `window["ga-disable-" + GA4_ID] = true` for analytics, stop sending events, and delete the Google cookies of the withdrawn part (below) from the page's host and its parent domain, `Path=/`. Allowing again clears the disable flag. A page reload is not required. |
| cookies the code may delete | `_ga`, `_ga_<GA4 ID without "G-">` for analytics; `_gcl_au`, `_gcl_aw`, `_gac_*` for ads. These names and lifetimes are **expected, not given**: check them against Google's current cookie documentation and list the source URL of each in the report. |
| pure module | `google-consent.ts` holds the signal mapping, the load rule, the ID patterns and the cookie names as functions of their inputs; `GoogleTags.tsx` does the DOM, the script and the `gtag` calls. |
| `BANNER_VERSION` | bumped (a new counter or date) because the text and the data use change; a new row in `docs/cookie-banner-versions.md`. |

**Values not given yet** The two IDs: the person gives them; until then no code path contains one. Cookie
names and lifetimes: verified by the builder as above. The texts below are drafts for review, used word for
word and listed in the report; the cookie lifetimes in them are corrected to what the check finds. Any other
value this brief needs that is not in a table: stop and ask, listing everything missing at once.

**Messages** (set exactly; every other key stays)

| Key | hr | en |
|---|---|---|
| `categories.analytics.desc` (draft) | Analitički kolačići koriste se za razumijevanje načina na koji posjetitelji koriste stranicu. Koristimo Google Analytics (Google Ireland Limited); postavlja kolačiće _ga i _ga_*, koji vrijede do 2 godine. Uključuju se samo uz vaš pristanak. | Analytics cookies are used to understand how visitors use the site. We use Google Analytics (Google Ireland Limited); it sets the cookies _ga and _ga_*, which last up to 2 years. They are switched on only with your consent. |
| `categories.ads.desc` (draft) | Oglasni kolačići koriste se za mjerenje uspješnosti oglasa. Koristimo Google Ads (Google Ireland Limited); postavlja kolačiće _gcl_au, _gcl_aw i _gac_*, koji vrijede do 90 dana. Prilagođeni oglasi (remarketing) trenutačno su isključeni. Uključuju se samo uz vaš pristanak. | Advertising cookies are used to measure how well our ads perform. We use Google Ads (Google Ireland Limited); it sets the cookies _gcl_au, _gcl_aw and _gac_*, which last up to 90 days. Personalised ads (remarketing) are currently switched off. They are switched on only with your consent. |

The sentence about personalised ads is true only while `AD_PERSONALIZATION_ALLOWED` is `false`: if the constant
changes, the text changes in the same commit.

**Tests**
- `node --test src/lib/google-consent.test.mts` (Node 22.18 or later): the mapping for each category alone, for
  none and for all; `ad_personalization` stays `"denied"` with the constant `false` and follows `ads` with it
  `true`; the load rule for every combination; a well-formed and a malformed ID of each kind; the cookie names
  for a given GA4 ID.
- `npm run build` and `npm run lint` pass; an unset ID builds, a malformed one fails the build.
- In a browser on the `out/` build with dummy IDs in `.env.local`, at 1440 px and 390 px (Playwright through
  `npx`, nothing added to `package.json`): the checks in Done when, reading the network log, `document.cookie`
  and `window.dataLayer`.

**Done when**
1. **Before any choice and after Reject:** the network log has no request to a Google host, `document.cookie`
   has no `_ga*`, `_gcl*` or `_gac*`, and `window.dataLayer` is undefined or holds only the default-denied
   command. Shown.
2. **Analytics only:** one request to the script for the GA4 ID, an update with `analytics_storage` granted and
   the other signals denied, a `page_view`, `_ga` set, and no Ads config. Shown.
3. **Ads only:** the script is requested for the Ads ID, the update has `ad_storage` and `ad_user_data` granted and
   `ad_personalization` denied, the Ads config carries `allow_ad_personalization_signals: false`, and no `_ga`
   appears. Shown.
4. **All:** both configs, the three signals as in 2 and 3, `ad_personalization` still denied. Shown.
5. **Functional alone and performance alone:** no Google request. Shown.
6. **Withdrawal:** accept all, then Reject without reloading: an update with every signal denied, no further
   `collect` request on a later navigation, and the Google cookies are gone. Shown.
7. **Reload with a saved choice:** the tags start by the same rules with no banner interaction. Shown.
8. **Page changes:** switching the locale sends one more `page_view`; clicking the same path sends none. Shown.
9. **Environment:** with both IDs unset the build passes and nothing loads in any case above; a malformed ID
   fails the build. Shown.
10. **Cookie list:** the cookie names seen in the browser in 2 to 4 match the names in the two descriptions, each
    with its source URL in the report; the Messages table is in both files. Listed.
11. **Notes:** `docs/cookie-consent.md` shows the signal mapping, the switch and how to add a tag; the new row of
    `docs/cookie-banner-versions.md` is present. Listed.
12. **The diff** lists only the Touches paths. Listed.

**Out of scope**
- Google Tag Manager, Advanced Consent Mode, Meta or any other tag.
- Remarketing audiences: `AD_PERSONALIZATION_ALLOWED` stays `false`.
- Conversion events (booking confirmed, paid visit): the booking app, ADR-0047 points 3 and 5, its own ads brief.
- Forwarding `gclid` and `fbclid` only with ads consent: an open question for the person, not changed here.
- The privacy page text and the lawyer's review (the legal pages).
- Creating the Google accounts, the GA4 property or the Ads account, and checking DebugView: the person.

**Estimate** One and a half days.
