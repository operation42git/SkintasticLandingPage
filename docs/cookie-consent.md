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

## When Google tags are added (a later brief)

Map the categories to Google Consent Mode v2, with every signal **`denied`** by default:

| Google signal | Category |
|---|---|
| `analytics_storage` | `analytics` |
| `ad_storage` | `ads` |
| `ad_user_data` | `ads` |
| `ad_personalization` | `ads` |

Send `gtag("consent", "default", …)` as `denied` before any tag, and `gtag("consent", "update", …)` on
`skt:consent-updated`. This page adds no tag.

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
