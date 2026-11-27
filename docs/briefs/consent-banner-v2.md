# Brief · scheduling, landing: the cookie banner as a simple first card, accept in the brand colour, three categories

> **Accepted by Ivan Tomić, 2026-11-27.** Written by the spec conversation, 2026-11-27, from the marketing expert's
> concern (too many visitors decline) and the person's review of the landing's current window (reject first and filled
> in teal; five categories), the research `docs/modules/scheduling/boards/cookie-banner/research.md` and the prototype
> he shaped (version 2): https://claude.ai/artifact/6o8yMRZu9pdym6mbGwx6ap, copy `…/cookie-banner/prototype-v2.html`.
> Scheduling decision 336. Stays inside EDPB/AZOP rules: reject on the first layer, the same size, readable.

> **Shared and people:**
> - **Dražen Jokić's modules:** scheduling (`booking-consent.tsx`, messages). Ivan, 2026-11-27: Dražen is told.
> - **Landing repository** (`skintasticlandingpage`): the same banner, by the landing session.
> - **Shared:** none in this repository.

**Touches**
- This repository: `features/scheduling/ui/booking-consent.tsx`, its styles and messages hr/en/de, tests.
- Landing repository: its consent banner and settings window (the landing session's own PR).

## What the person decided (2026-11-27)

| Topic | Decision |
|---|---|
| First layer | A **card at the bottom right** (computer) / **bottom sheet** (phone). Does not block the page; stays until a choice; never covers the main booking button. |
| Text | Heading **"Kolačići"**; one sentence: **"Koristimo kolačiće da vidimo koje usluge vas zanimaju i da vam prikazujemo ponude koje su vam korisne."**; small line "Izbor možete promijeniti bilo kada." (en/de translated in the same plain tone). |
| Buttons | **"Prihvati sve"**: filled, brand teal, white text (contrast ≥ 4.5:1), **first** — left on a computer, top on a phone (stacked, full width). **"Odbij neobavezne"**: outlined, dark text, **the same size**. **"Postavke"**: a small text link below. |
| Settings window | **Three categories:** Nužni ("Potrebni za rad stranice.", always on), Analitika ("Pokazuju nam koje stranice i usluge posjetitelji gledaju (Google Analytics)."), Oglasi ("Prikazujemo vam ponude koje vas zanimaju na Googleu, Facebooku i Instagramu."). Nothing pre-ticked. Buttons: "Prihvati sve" (filled, first), "Spremi odabir", "Odbij" (outlined, same size). The landing's "Functional" and "Performance" go (not used). |
| Not done (prohibited) | A larger accept button; a faint, borderless or link-style reject; reject only behind Postavke; pre-ticked boxes; tags before a choice. |
| Remembered | 180 days (ADR-0047); a wording change does **not** ask visitors again; the consent log (ADR-0068) unchanged. |
| Later (not in this brief) | Testing button order and wording on real visitors (variant in the consent log); counting bookings per campaign without cookies; Google consent mode (basic). |

## If built now

Visitors see a clearer card with the same two choices on the first screen and the accept button in the brand colour;
choices already made stay valid. The landing page and the booking page look the same.

## Tests

- First layer: both buttons the same size; "Prihvati sve" first (left / top); "Odbij neobavezne" outlined and readable;
  "Postavke" opens the window with three categories, none ticked.
- A visitor with a stored choice sees no banner after the wording change.
- Phone: bottom sheet, stacked full-width buttons, the booking button stays reachable.

## Done when

1. **Checks:** `pnpm precheck` passes (and the landing's own checks), and the diff lists only the Touches paths.
2. **Staging:** Ivan sees the same banner on the landing page and the booking page, on a phone and a computer.

---

**Landing notes (2026-11-27):**
- The brief's text is copied from the Skintastic repo (spec branch).
- On the landing, "Prihvati sve" uses the darker brand teal `#2f7f86` (the prototype's `--cta`). With white text, today's `#88c9cd` reaches only 1.86:1; `#2f7f86` reaches 4.67:1.
- On the phone the sheet sits directly above the page's sticky "Rezerviraj termin" bar, which stays tappable.
- The cookie format and the 180 days are unchanged: Analitika is the analytics bit, Oglasi the marketing bit.
- The landing writes no consent log.

**Addition (Ivan, 2026-11-27: decision A):**
- **Consent log (ADR-0068):** `src/lib/consent.ts`, ported from the unmerged branch `claude/cookie-consent-fixes` with its unit tests (`node --test src/lib/consent.test.mts`).
  - Each choice that allows or withdraws something is queued and sent: `POST {app}/api/public/consent-log` with `consentId`, `categories` (functional and performance always false), `bannerVersion` `2026-11-27.1`, `locale` and `action`.
  - A failed send is tried once more after 2 s; what's left is resent on the next visit.
  - A first-time reject sends nothing.
  - The consent id lives in `skt_consent_id`.
- **Cookie format:** `skt_consent` is now written as `v2.<f>.<a>.<p>.<ads>.<generation>.<date>`, the format the app reads. An earlier landing choice `v1.1.<analytics>.<marketing>.<date>` stays that choice, so nobody is asked again.
- **Handover (ADR-0075 point 3):** every booking link adds `consent` (the `skt_consent` value) and `cid` (the consent id) once a `v2` choice with an id exists.
- **Ad-click IDs:** `gclid` and `fbclid` are forwarded only while ads are allowed; the `utm_*` parameters always.
- **German:** the banner uses "du", like the rest of the site.
