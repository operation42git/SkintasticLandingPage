# Brief · landing: the cookie choice stored per category, readable by future tags, and logged in the booking app

> **Draft, not accepted.** Written 2026-10-28 by the landing-page cookie audit conversation from the
> person's choices of the same day. Do not start it until a person writes "Accepted by …" here. It also
> waits for **ADR-0068** (booking app repository, status *Proposed*) to be accepted, and for the app briefs
> `platform-consent-log` and `api-consent-log-route` to be merged to staging before Done when 7 can be
> shown. This brief cites ADR-0068 as a proposal only; nothing under **Decided** rests on it.

## Touches

- `src/components/legal/CookieConsent.tsx` (the dialog, the reopen button, the calls below)
- `src/lib/consent.ts` (new: the cookie reader and writer, `getConsent()`, the event, the pending queue, the
  log call; imports nothing from `@/`) and `src/lib/consent.test.mts` (new: run with `node --test`, no dependency;
  the `.mts` name keeps it out of `tsconfig.json`'s `**/*.ts`, so `next build` does not see it)
- `src/config/consent.ts` (new: `BANNER_VERSION` and the log URL, derived from `BOOKING_URL`)
- `src/components/ui/ScrollToTop.tsx` (the same overlap as the cookie button; position only)
- `src/config/booking.ts` (`buildBookingHref` only), `src/components/ui/BookButton.tsx` and
  `src/components/sections/OffPeakSection.tsx` (the link building only): the ad-click IDs rule below
- `messages/hr.json`, `messages/en.json` (the `cookieConsent` keys below only)
- `docs/cookie-consent.md` (new: the rules for any future tag) and `docs/cookie-banner-versions.md` (new)

Changing any other file: stop and ask. End your report with `git diff --stat origin/main...HEAD`.

**Goal**
A visitor's choice is stored and read back exactly as given, per category. Any script added later can ask
what was allowed and wake up when it changes. Each change of choice is sent to the booking app so the studio
can show it. The dialog says only what is true, links to the privacy page, and the cookie button can always be
tapped on a phone.

**Decided** the person, 2026-10-28: four optional categories (functional, analytics, performance, ads) stored
separately; a second cookie `skt_consent_id` that stays after a reject; `bannerVersion` as a date and a
counter; Croatian wording fixes as listed under Messages; the ad-click IDs `gclid` and `fbclid` travel to the booking app only with ads consent (the person, 2026-10-28; it narrows ADR-0047 point 6 for click IDs, the `utm_*` parameters are unchanged). Skintastic ADR-0047 (accepted): one `skt_consent`
cookie on the main domain, written by this page; its cookie attributes. **Amended by this brief:** the cookie
value is `v2…` below, not `v1.<necessary>.<analytics>.<marketing>.<date>` of ADR-0047 and
`landing-zagreb.md`. No tracking script is added.

**Values**

| Field | Allowed values |
|---|---|
| `skt_consent` | `v2.<functional>.<analytics>.<performance>.<ads>.<YYYY-MM-DD>`, each category `0` or `1`, the date is the day of the choice; e.g. `v2.0.1.0.0.2026-11-01`. Necessary is not stored. Attributes unchanged: `Path=/`, `Max-Age=15552000`, `SameSite=Lax`, plus `Domain` (from `NEXT_PUBLIC_SITE_URL`) and `Secure` off `localhost`. |
| reading | only an exact match of the pattern is a choice. A `v1.*` value, a malformed value or no cookie is **no choice**: the dialog opens, nothing optional is allowed. |
| `skt_consent_id` | a random UUID v4 from `crypto.randomUUID()` (where that is missing, for example on a plain-http address on the local network,
  built from `crypto.getRandomValues` with the version and variant bits set), made at the first save, same attributes and lifetime as `skt_consent`. Read only if it matches the UUID v4 pattern, else made again. It stays after Reject and after any later save. Never made before the first choice. |
| categories | order `functional`, `analytics`, `performance`, `ads`; all `false` by default. |
| `getConsent()` | exported from `src/lib/consent.ts`; returns `{ functional, analytics, performance, ads }` (booleans) or `null` when there is no valid choice; returns `null` on the server. |
| event | after the cookies are written, on every save (Save, Accept all, Reject): `window.dispatchEvent(new CustomEvent("skt:consent-updated", { detail }))`, `detail` = the same object `getConsent()` returns. The constant is exported beside `OPEN_CONSENT_EVENT`. |
| `action` | `accept_all` (the "Accept all" button); `reject` (the "Reject" button, nothing granted before); `save` (the "Save" button, and nothing previously granted is turned off); `withdraw` (a Reject or Save that turns off at least one category that was granted before). "Before" is the choice read just before this save. |
| log record | `{ "consentId": <skt_consent_id>, "categories": { functional, analytics, performance, ads }, "bannerVersion": <BANNER_VERSION>, "locale": <the page locale, hr or en>, "action": <as above> }` and no other field. |
| log call | `POST` to `${new URL(BOOKING_URL).origin}/api/public/consent-log` (as `offpeak.ts` builds its URL; no new variable), `Content-Type: application/json`, `keepalive: true` (dropped only if the browser check in Done when 7 fails), `credentials: "omit"`. Success is any `2xx`. It runs after the cookies are written and never delays or blocks the dialog. |
| failure | the record is put in the queue below **before** it is sent and removed on a `2xx`, so closing the tab mid-send loses nothing. A thrown fetch, a `5xx` or a `429`: retry once after 2 seconds (proposed), from the queue; if that fails too the record stays there. A `4xx` other than `429`: remove that record (it can never succeed) and write one `console.warn`. |
| queue | `localStorage` key `skt_consent_pending`, a JSON list of log records with `queuedAt`, which is local only and is removed before sending (the sent body has exactly the log record's fields); at most 5, the oldest dropped first (proposed). On every page load, send them oldest first, remove each on success, stop at the first failure. It holds nothing else. Two open tabs may send the same record twice; the log is append-only and that is harmless. The old-key cleanup of `sk_consent` and `skt_consent` in `localStorage` stays and never touches this key. |
| `consent.ts` | pure: it imports nothing from `@/` or `next`, and takes the cookie domain, the hostname, the storage, `fetch`, the clock and the random source as arguments, so `node --test` runs it without the environment variables `@/config/booking` needs; `CookieConsent.tsx` passes `consentCookieDomain()`, `window.location.hostname`, `localStorage`, `fetch`, `Date` and `crypto`. |
| `BANNER_VERSION` | `YYYY-MM-DD.N`: the date this brief is accepted (from its first line) and `.1`. Bumped by hand whenever the dialog text, the categories or the data use change; each version is a row in `docs/cookie-banner-versions.md` (version, date, what changed, commit). |
| privacy link | in the dialog, under the intro, `footer.privacyPolicy` as the text, the same `href` as the footer (`/{locale}/datenschutz`), opening in a new tab (`target="_blank"`, `rel="noopener"`) so the page behind a blocking dialog stays readable (proposed). |
| reopen button | below `lg` (1024 px): `bottom` = the booking bar's height (84 px, the value `MobileBookBar.tsx` gives the body) + 12 px, so it clears the bar; from `lg`: as today (`bottom-5 left-5`). `z-index` stays below the dialog's. `ScrollToTop` gets the same rule on its own side (`right-3.5`). |
| click IDs | `utm_source`, `utm_medium`, `utm_campaign` and `utm_content` are forwarded as today. `gclid` and `fbclid` are forwarded **only while `getConsent()` says `ads` is `true`**; otherwise the link has neither, even when the page's own address carries them. `buildBookingHref` takes one more argument (`adsAllowed: boolean`) and its callers pass it; the links update when `skt:consent-updated` fires (`BookButton` already sets its `href` in an effect). This page keeps the click IDs nowhere else. |
| footer | "Postavke kolačića" in the footer is unchanged and still opens the dialog with the saved state. |

**Values not given yet** The three marked *(proposed)* above (the retry delay, the queue size, the new-tab
privacy link) are used as written and **named in the report for the person to confirm**; they are not
invented silently. The texts below are drafts for review; use them word for word and list them in the report.
Any other value this brief needs that is not in a table: stop and ask, listing everything missing at once.

**Messages** (set exactly; keep every other `cookieConsent` key)

| Key | hr | en |
|---|---|---|
| `categories.functional.title` | Funkcionalni | Functional |
| `categories.performance.title` | Izvedba | Performance |
| `categories.necessary.title` | Neophodni | Necessary |
| `btnReject` | Odbij | Reject |
| `btnAcceptAll` | Prihvati sve | Accept all |
| `showMore` | Prikaži više | Show more |
| `showLess` | Prikaži manje | Show less |
| `alwaysActive` | Uvijek aktivni | Always active |
| `categories.necessary.desc` | Neophodni kolačići presudni su za osnovne funkcije web stranice i web stranica bez njih neće raditi na predviđeni način. Ovi kolačići ne pohranjuju nikakve osobne podatke. | (unchanged) |
| `introLong` (draft) | Neophodni kolačići pohranjuju se u vašem pregledniku jer su potrebni za osnovne funkcije stranice. Među njima je i zapis vašeg odabira: kolačić skt_consent čuva vaš izbor, a skt_consent_id nasumični identifikator kojim možemo dokazati da ste odabir dali.\n\nFunkcionalni, analitički, izvedbeni i oglasni kolačići koristit će se samo ako ih uključite, i to tek nakon vaše suglasnosti. Svoj odabir možete u svakom trenutku promijeniti putem poveznice „Postavke kolačića” u podnožju stranice. | Necessary cookies are stored in your browser because the site needs them for its basic functions. They include a record of your choice: the skt_consent cookie holds your choice and skt_consent_id holds a random identifier we can use to show that you made it.\n\nFunctional, analytics, performance and advertising cookies are used only if you switch them on, and only after you consent. You can change your choice at any time with “Cookie settings” in the footer. |

`btnSave` ("Spremi moje postavke") and the category descriptions stay. The English values above restate the
current wording where it is not changing. A TODO comment above `introLong` in the component says: list the
real cookies of each tag here when a tag is added. Use one term for the always-on category everywhere: "Neophodni"
(`grep -i potrebn messages/hr.json` shows no use of "Potrebno" or "Potrebni" inside `cookieConsent`). Only the first word of
`categories.necessary.desc` changes; its claim about personal data is left for the lawyer's review.

**Tests**
- `node --test src/lib/consent.test.mts` (Node 22.18 or later): the reader and writer for each single
  category and for none and all (round trip); `v1.1.1.0.2026-10-21`, a malformed value and an empty string read
  as no choice; the four `action` values from "before" and "after"; the queue keeps 5 and drops the oldest;
  a `4xx` drops a record, a `5xx` keeps it; a record is in the queue before the send starts; `queuedAt` is not in the sent body; the UUID fallback gives a valid v4.
- `npm run build` and `npm run lint` pass.
- In a browser on the `out/` build (Playwright through `npx`, nothing added to `package.json`): the checks in
  Done when, at 1440 px and 390 px, against a throwaway stub of the log endpoint kept outside the repository
  (or staging once the app briefs are merged and `PUBLIC_EMBED_ORIGINS` lists the origin).

**Done when**
1. **Per category:** for each of Funkcionalni, Analitika, Izvedba, Oglasi alone, then Accept all, then Reject:
   save, reload, reopen from the footer: exactly the saved toggles are on. The cookie value is shown each
   time.
2. **Old and bad cookies:** a `v1.1.1.0.2026-10-21` cookie opens the dialog again with all toggles off.
3. **Fresh visit:** the dialog opens, the network log shows only same-origin requests, and no cookie is set
   before a choice (`skt_consent_id` included).
4. **ID cookie:** it is created at the first save, kept after Reject and after a later Save, and has the same
   attributes as `skt_consent`. Shown.
5. **Consent API:** a listener on `skt:consent-updated` receives the right object after each save; `getConsent()`
   returns the same object, and `null` before any choice. Shown in the console.
6. **Mobile button:** at 375, 640, 1023 and 1440 px `document.elementFromPoint` at the cookie button's centre
   returns the button (not the booking bar); `ScrollToTop` is not covered either. Shown.
7. **Log:** each of the four actions sends one `POST` with exactly the record in Values (`consentId`
   unchanged between saves in one browser); a stub answering `500` leaves the record in `skt_consent_pending`
   and the next page load sends it; a stub answering `400` drops it with one warning; with the endpoint
   unreachable the dialog still closes at once. In Chrome and in WebKit (Playwright) the `POST` with its preflight
   succeeds with `keepalive`; if it fails in either, `keepalive` is removed and the report says so. Shown.
8. **Texts:** the Messages table is in both files word for word; the dialog links to the privacy page;
   no cookie text says the site currently uses third-party analytics or advertising cookies. Listed.
9. **Footer:** "Postavke kolačića" still reopens the dialog with the saved state. Shown.
10. **Notes:** `docs/cookie-consent.md` says any analytics or ads script loads only when its category is
    `true` in `getConsent()` or after `skt:consent-updated`, and that Google tags later map the categories to
    Consent Mode v2 (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`), default
    `denied`; `docs/cookie-banner-versions.md` has the first row. Listed.
11. **Click IDs:** with a page address carrying `?utm_source=z&gclid=x&fbclid=y`, before a choice and after Reject the
    booking links (header, hero, offers, the mobile bar, the off-peak calendar link) carry `utm_source` but neither click ID;
    after Accept all, or ads alone, they carry all three; turning ads off removes the click IDs from the links without
    a reload; analytics alone does not add them. Shown.
12. **The diff** lists only the Touches paths. Listed.

**Out of scope**
- Any tracking tag, Consent Mode wiring or Google/Meta script (the ads brief).
- The legal pages (the privacy text itself, the cookie table of real cookies, the lawyer's review).
- The booking app: the table, the route and its CORS (`platform-consent-log`, `api-consent-log-route`).
- The footer, the header and every section other than the files in Touches.

**Estimate** Two days.
