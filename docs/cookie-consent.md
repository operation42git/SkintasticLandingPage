# Cookie consent: what the page stores, and the rule for any script added later

Built by `docs/briefs/landing-cookie-consent.md`. The code is `src/lib/consent.ts` (the logic, no dependencies),
`src/components/legal/CookieConsent.tsx` (the dialog) and `src/config/consent.ts` (the two numbers below).

## The rule

**Any analytics or ads script (and any other optional tool: a map, a chat, a video) loads only when its category is
`true` in `getConsent()`, and again after the `skt:consent-updated` event.** Nothing optional loads before a choice, and
nothing stays loaded for a category that was switched off (it stops, and its cookies are removed).

```ts
import { CONSENT_UPDATED_EVENT, getConsent } from "@/lib/consent";

function start() {
  if (getConsent()?.analytics) loadAnalytics(); // null (no valid choice) or false: load nothing
}
start();
window.addEventListener(CONSENT_UPDATED_EVENT, start); // detail = the same object getConsent() returns
```

`getConsent()` returns `{ functional, analytics, performance, ads }` or `null` (no valid choice, and always on the server).
The dialog shows only **analytics** and **ads**; `functional` and `performance` are stored as `false` and reserved.

## Google Analytics 4 and the Google Ads tag

Built by `docs/briefs/landing-google-consent-mode.md`: `src/components/analytics/GoogleTags.tsx` (the DOM, the script and the
`gtag` calls), `src/lib/google-consent.ts` (the rules, with unit tests) and `src/config/google.ts` (the IDs and the switch).
Consent Mode v2 in its **basic** form: no Google script is requested, no `gtag` is defined and no cookie is set until the
matching category is allowed.

**The IDs** come from the environment only, never from code, and are read when the site is built (a changed ID needs a new
build): `NEXT_PUBLIC_GA4_MEASUREMENT_ID` (`G-…`) and `NEXT_PUBLIC_GOOGLE_ADS_ID` (`AW-…`). Unset: that tag never loads. Set but
malformed: the build fails and names the variable.

**The switch.** `AD_PERSONALIZATION_ALLOWED` in `src/config/google.ts` is `false`: ad personalization (remarketing) stays denied for
everyone until the lawyer agrees. Changing it is a decision of the person, and it changes `cookieConsent.categories.ads.desc`
and `BANNER_VERSION` in the same commit.

| Google signal | Category |
|---|---|
| `analytics_storage` | `analytics` |
| `ad_storage` | `ads` |
| `ad_user_data` | `ads` |
| `ad_personalization` | `ads`, but always `denied` while the switch is `false` |
| `functionality_storage` | `functional` |
| `personalization_storage` | always `denied` |
| `security_storage` | always `granted` |

`performance` maps to no signal.

**What happens, in order.** A visitor with a choice that allows `analytics` or `ads` (and the matching ID set): `window.dataLayer` and
`gtag` are defined, `consent default` is sent with everything `denied`, then `consent update` with the signals, then the script
`https://www.googletagmanager.com/gtag/js?id=<one ID>` is requested once, then `js`, then the configs: GA4 with
`send_page_view: false` and one `page_view` (path, title, locale), and Ads with `allow_ad_personalization_signals: false`. A change of
choice sends `consent update` and starts what newly qualifies. Every event carries `send_to: <GA4 ID>`, so none can reach the Ads
destination. One more `page_view` is sent when the path changes after the first load.

**Withdrawal.** When a granted signal turns `denied`: `consent update`, the `ga-disable-<GA4 ID>` flag, deletion of that part's Google
cookies on the host and every parent domain, then a **page reload**, so the script is gone and cannot send anything.

| Part | Cookies the page deletes |
|---|---|
| analytics | `_ga`, `_ga_*` |
| ads | `_gcl_au`, `_gcl_aw`, `_gcl_gs`, `_gcl_ag`, `_gcl_gb`, `_gac_*` |

Google's own domains (`google.com`, `doubleclick.net`) may set cookies such as `NID` or `IDE` when ad requests are made; this page cannot
delete them.

**To add another tag:** read `getConsent()` and `skt:consent-updated` as in the rule above, and add its cookies and its category to this
note and to the dialog text; a new tool, purpose or recipient also raises `CONSENT_GENERATION`.

## What is stored

| Where | Name | Value | Set when |
|---|---|---|---|
| cookie | `skt_consent` | `v2.<functional>.<analytics>.<performance>.<ads>.<generation>.<YYYY-MM-DD>` | every save |
| cookie | `skt_consent_id` | a random UUID v4 | the first save that allows something; deleted after a withdrawal |
| `localStorage` | `skt_consent_pending` | records not yet sent to the booking app (at most 5) | a save that is logged; removed once sent |

Both cookies: `Path=/`, 180 days, `SameSite=Lax`, and `Domain` (from `NEXT_PUBLIC_SITE_URL`) and `Secure` except on `localhost`.

- A first-time **Reject** sets only `skt_consent`: no ID, nothing sent to the booking app.
- Allowing something and later rejecting everything logs a `withdraw` under the ID, then deletes `skt_consent_id`.
- A `v2` cookie of an older **generation** that allowed something is no choice (the dialog asks again); one with everything off
  stays valid. `v1.1.0.0.<date>` (nothing allowed) is read as everything off; any other `v1` value is no choice.

## The two numbers

- `CONSENT_GENERATION` (`src/config/consent.ts`): raise it **only for a material change** (a new category, tool, purpose
  or recipient). Visitors who allowed something are asked again; visitors who rejected are not.
- `BANNER_VERSION` (same file): raise it for **any** change of the dialog text, the categories or the data use. It is sent
  with every logged choice. Each change is a row in `docs/cookie-banner-versions.md`.

## The log and the links

- Each logged choice is sent to `{booking origin}/api/public/consent-log` (ADR-0068), with the consent ID as `X-Client-Id`.
  The page never waits for the answer; a failed send is retried once, then kept for the next page load.
- `utm_*` parameters travel to the booking links always; `gclid` and `fbclid` only while `ads` is `true`.
- `/hr/datenschutz`, `/hr/impressum` (and the English pages) do not open the dialog by themselves, so they stay readable.
