# Brief · landing: both designs show the app's time offers; the current design drops the old week

> **Draft, not accepted.** Written by the Skintastic spec conversation from Ivan Tomić's answer of 2026-11-04 (the current design shows the new offers like the new design; the hero button reads "Povoljniji termini →"). The app's route is Skintastic ADR-0071 point 4 and brief `scheduling-offers-public-route`.

## Touches

- `src/config/offers-v2.ts` (read the app's route instead of the empty list; the `ponude=demo` fixture stays)
- `src/components/sections/OffPeakSection.tsx` (the current design: the offer list replaces the week cards)
- `src/components/sections/HeroSection.tsx` (the current design's hero off-peak button only)
- `src/config/offpeak.ts` (removed, with its imports, once nothing reads it)
- `messages/hr.json`, `messages/en.json` (`offPeak.*` and `hero.offPeak` only)
- tests, if any

Changing any other file: stop and ask. End your report with `git diff --stat origin/main...HEAD`.

**Goal**
Both designs show the partner's real time offers from the app (name, percentage, days and hours, studio), so the current design never claims "−10 %" or "cijeli dan" for an offer that is −30 % on one treatment on Wednesday 13–15.

**Decided** Ivan Tomić, 2026-11-04. Skintastic scheduling decisions 284–294 and 298, ADR-0071.

**Values**

| Field | Allowed values |
|---|---|
| the read | `GET {BOOKING_URL origin}/api/public/franchisees/{slug}/offers?lang={locale}`, the slug being the partner entry slug in `BOOKING_URL` (`/book/f/{slug}`); if `BOOKING_URL` is a studio entry, stop and ask. Failure handling as `offpeak.ts` today: one console warning per page load naming the URL and the reason; a failed read hides the section. |
| answer | `{ offers: [{ name, serviceCode, percent, ranges: [{ weekdays, starts, ends }], locations: [{ slug, name }], validUntil }] }`, at most 3, largest first (the app orders them; don't reorder). An offer with no `ranges` or no `locations` is skipped. |
| ranges in words | weekdays as short day names in the locale; a run of three or more as a span ("Pon–Pet"); two, or with a gap, as a list ("Uto i Čet"; "Pon, Sri, Pet"); time "13:00–16:00". One line per range. |
| studios in words | the locations' names; all of the partner's bookable studios read "Oba studija" / "Both studios" when there are two, else the names joined with " i " / " and " |
| new design | `offers-v2.ts` returns the read's offers; section 4 shows them as built. `?ponude=demo` still shows the fixture. |
| current design, section | `OffPeakSection` becomes the list of offers in the current design's look (its colours, font, spacing). Per offer, a row with: the name; the percentage as "do −{n} %" (one offer: "Do −{n} %"); each range line with a clock icon; the studios; and "do {date}" when `validUntil` is set. The whole row links to booking (`buildBookingHref` with `usluga` = `serviceCode` when there is one, and `centar` = the location slug when the offer has exactly one location). The heading, eyebrow and lead are the existing keys, with the lead's "10 %" removed (below). The 7-day cards, the selection, the detail, "Nastavi s ovim danom", the "other days" line and the legend go. |
| current design, hero | the off-peak button reads **"Povoljniji termini →"** (en "Better-priced times →"), links to the section, and shows only when there is at least one offer |
| no offers | the section and the hero button are hidden in both designs (as today when the read fails) |
| messages | `offPeak.lead`: "<strong>Isti tretman, povoljnije</strong> – u odabranim terminima." / "<strong>The same treatment, for less</strong> – at selected times."; `hero.offPeak` as above. Remove the keys only the week used (`offPeak.kind.*`, `dayKind.*`, `examples`, `shortOnly`, `otherDays`, `openCalendar`, `today`, `cell.*`, `weekdays*`, `dayTitle`, `continue*`, `exactNote`, if unused). No visible text contains a fixed percentage. |

**Tests**
- `npm run lint` and `npm run build` pass.
- With a fixture answer of one offer (Noge kompletne, 30 %, Wednesday 13:00–15:00, Zapad) and of three offers: both designs at 1440 and 390 px, hr and en; the rows link to booking as above.
- With an empty answer and a failed read: no section and no hero button in either design; one console warning on the failure.
- `grep -n "10 %\|−10" messages/*.json` finds nothing in `offPeak` or `hero.offPeak`.

**Done when**
1. **Shown:** the screenshots above.
2. **The diff** lists only the Touches paths.
3. **Order:** merged no later than the app's time offers reach the environment the landing page reads (staging first).

**Out of scope**
- The app's route (built in Skintastic).
- The rest of the current design.

**Estimate** Half a day to a day.
