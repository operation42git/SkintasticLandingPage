# Brief · landing: the new design, behind a discreet switch

> **Accepted by Ivan Tomić, 2026-11-03.** Written by the Skintastic spec conversation from Ivan Tomić's choices of 2026-11-02 and
> 2026-11-03 on the mockup https://claude.ai/artifact/EVDgTV8fpg2MgHZoDtgbea (version 14, the "Novo" view).

## Touches

- `src/components/v2/` (new: one file per section of the new design, plus the switch)
- `src/app/[locale]/page.tsx` (renders the current page or the new one, see **Switch**)
- `src/app/[locale]/layout.tsx` (only to load the two new fonts)
- `src/app/globals.css` (only the new `v2` colour and font tokens; existing tokens stay)
- `src/config/design.ts` (new: the switch), `src/config/offers-v2.ts` (new: see **Povoljniji termini**),
  `src/config/treatments-v2.ts` (new: the three treatments of **Tretmani i cijene**)
- `messages/hr.json`, `messages/en.json` (new keys under `v2.*` only)
- `public/images/v2/` (new: the images listed under **Images**)
- tests for the new components

The current sections, their messages and their configs stay untouched; the current page must look exactly as
today when the switch is off. Changing any other file: stop and ask. End your report with
`git diff --stat origin/main...HEAD`.

**Goal**
Ivan can open the live page, switch discreetly to the new design and back, and compare them on a laptop and a
phone. Visitors who don't use the switch see only the current page.

**Decided** (Ivan, 2026-11-02/03)
- Direction "B" of the mockup: one warm light ground in two shades, a light serif for headings and prices, a
  plain sans serif for text, thin rules instead of cards, the footer the only dark area.
- The order of sections and their texts are those of the mockup's "Novo" view (listed below).
- Hero option B: "Glatka koža. *Trajno.*" with the service in the line under it.
- No duplicated title and subtitle with the same words; no decorative slogans.
- Both designs stay available behind the switch until Ivan decides; a later brief removes one.

## Switch

| Field | Allowed values |
|---|---|
| default | the **current** design, for everyone |
| turning it on | the page opened with `?dizajn=novo` shows the new design and stores `skt_design=novo` in `localStorage` (set only by this explicit action, so no consent is needed; reading or writing it is wrapped in try/catch and a failure means "current") |
| turning it off | `?dizajn=sada`, or the switch below; both remove `skt_design` |
| the switch | shown **only** while `skt_design` is set (so ordinary visitors never see it): a small pill fixed bottom-left, 12 px text, `v2.switch.label` "Dizajn:" with two buttons "Sada" / "Novo"; on the phone it sits above the sticky booking bar. It does not cover content on 390 px. |
| SEO | the server-rendered HTML is the current design; the new one is chosen in the browser. No new route, no change to metadata or the sitemap. |
| analytics/tracking | none added |

For switch users the current design shows briefly before the new one replaces it in the browser; accepted, so ordinary visitors never wait.

## Colours and type (new tokens, prefixed `v2`)

| Token | Value | Use |
|---|---|---|
| `--v2-sand` | `#f4eee7` | page ground |
| `--v2-linen` | `#ebe2d8` | the alternate band (offers, review, about, FAQ) |
| `--v2-stone` | `#d9cbbd` | rules and borders |
| `--v2-ink` | `#241e1b` | text, buttons |
| `--v2-taupe` | `#7b6c60` | small labels, secondary text |
| `--v2-dusk` | `#4a3f38` | body text on linen |
| `--v2-rust` | `#9a5b3e` | the special-offer label and the clock icon only |
| `--v2-night` | `#14100e` | the footer only |
| display font | Newsreader (Google), weights 300 and 400, italic 300; `subsets: ["latin","latin-ext"]` | headings, treatment names, prices, percentages |
| text font | Hanken Grotesk (Google), 400/500/600; `subsets: ["latin","latin-ext"]` | everything else |
| font loading | both new fonts with `preload: false`, and their CSS variables applied only inside the new design's wrapper, so a visitor to the current design downloads neither font | |

Italic is used only where marked *like this* below. Small labels: 11.5 px, letter-spacing .24em, uppercase, taupe.

## Sections, in this order (hr texts; the en texts are drafted by you and listed for review)

| # | Section | Content |
|---|---|---|
| 1 | Header | the existing logo; links Tretmani · Povoljniji termini · Lokacije · Pitanja · Kontakt (anchors to sections 3, 4, 9, 10, 11); button "Rezerviraj termin →" (`BOOKING_URL` with the campaign parameters, as today). Phone: logo only; the booking button becomes a sticky bar at the bottom. |
| 2 | Hero | Heading "Glatka koža." / "*Trajno.*"; line under it, 19 px, ink: "Laserska epilacija za žene i muškarce u Zagrebu, Mediostar diodnim laserom."; button "Rezerviraj termin →" and the text link "Tretmani i cijene →" (to section 3); one line "**Posebna ponuda:** pazusi 19,90 € umjesto 49,99 € do 31. 12.": its text is the `v2.*` message keyed by the offer's `id` (`v2.heroOffer.pazusi`), its booking `code` and its validity (hidden after `validUntil`) come from `heroOffers` (the first offer whose `validUntil` hasn't passed; the label in rust; hidden when there is none; an offer without a `v2.heroOffer.{id}` message shows no line; `hero-offers.ts` stays untouched); three ticked facts: "Mediostar · Made in Germany", "Za sve tipove kože", "Plaćanje karticom ili gotovinom". Image on the right, fading into the ground; on the phone above the text. No small label above the heading. |
| 3 | Tretmani i cijene | label "Tretmani i cijene", heading "Pronađi svoj tretman", text "Istraži ponudu, provjeri cijene i rezerviraj termin.", link "Svi tretmani i cijene →" (booking); on the right three columns with thin rules: name and "od" price — Lice i vrat od 49,90 € (`pkg_face_neck`), Intimna zona od 79,90 € (`alc_intimate_full_f`; Ivan, 2026-11-03), Noge kompletne od 99,90 € (`alc_legs_full`). Each column links to booking with its code. Phone: a list. Pazusi is **not** in this list (it is the hero offer). |
| 4 | Povoljniji termini | linen band; photo on the left (see Images), text on the right: label "Povoljniji termini", heading "Uhvati *bolju cijenu*", text "Termin ti je fleksibilan? Iskoristi posebnu ponudu na odabrani tretman." (neutral for women and men; Ivan, 2026-11-03); then one row per offer: name (Newsreader 26 px), under it a clock icon (rust) and **"Uto i Čet · 13:00–16:00"** (600, 17 px) and the studio in taupe; on the right the percentage in italic Newsreader ("do −30 %"; with one offer "Do −30 %" at 56 px). The whole row is one link (no arrow). Under the rows one link "Provjeri dostupne termine →". See **Povoljniji termini data**. |
| 5 | Kako izgleda tretman | italic heading "*Kako izgleda tretman?*" on the left; three columns with rules: 01 Savjetovanje — "Procjena stanja kože i preporuka tretmana. Besplatno." · 02 Tretman — "Brz, siguran i prilagođen tebi." · 03 Rezultati — "Postupno smanjenje dlačica i glatka koža na duže vrijeme." |
| 6 | Review | linen band with thin rules above and below; one italic quote and its author line, from the existing `reviews.items[0]` (bracket placeholders stay as today); on the right a round outlined arrow and "Iskustva naših klijentica" linking to `reviews.googleUrl` (a bracket value is not a link). |
| 7 | Zašto Skintastic? | heading on the left; four points in two columns: Dugotrajni rezultati — "Manje dlačica već nakon nekoliko tretmana." · Stručan tim — "Individualni pristup i savjetovanje." · Provjerena tehnologija — "Sigurna i učinkovita laserska epilacija." · Jednostavna rezervacija — "Odaberi termin online, bez poziva." |
| 8 | Tehnologija | sand ground with a thin rule above (not dark); label "Tehnologija", heading "Mediostar diodni laser", text "Laser njemačkog proizvođača Asclepion, za sve tipove kože i dlačica. ICE-hlađenje čini tretman ugodnim."; four facts: Valne duljine 810 \| 940 nm · Hlađenje 360° ICE · Tipovi kože I–VI · Snaga 5.000 W; on the right `technology/monolith_v1.png` (transparent; resized copy in `public/images/v2/`), no caption. |
| 9 | O nama | linen band; photo on the left (narrower column, anchored at the top so nothing is cut), text on the right: heading "O nama" (no label above it), "Specijalizirani smo za lasersko uklanjanje dlačica diodnim laserima. Dva studija u Zagrebu, isti standard u svim Skintastic centrima." and "Naš cilj su vrhunski rezultati po poštenoj cijeni. Zato radimo s high-end tehnologijom i stručnim osobljem koje izvrsno poznaje svoj posao."; then a rule, the label "Certifikati Skintastic brenda · Kvaliteta je na prvom mjestu" and the WIFI and WKO logos as ink-coloured images on a transparent background (see Images). |
| 10 | Naše lokacije | heading "Naše lokacije" (no label above it); the three Zagreb locations from `locations.ts` in three columns (photo or a plain linen tile with the area name in italic, name, address, hours, "Rezerviraj ovdje →", "Kako do nas ↗"; the teaser muted with "Otvaranje uskoro. Do tada nas posjeti na Zapadu ili Istoku."); under them "Dio Skintastic obitelji" and the external locations' names in one line. |
| 11 | Česta pitanja | linen band; heading "Česta pitanja" (no label above it) and the existing `faq.subtitle` beside it; **all** items of the existing `faq.items`, in their order, with their texts unchanged (reuse the keys, don't copy them), the first one open; questions in Newsreader 24 px. |
| 12 | Kontakt | label "Kontakt"; five equal columns with a small label and a value (Newsreader 21 px): Nazovi, WhatsApp, E-mail, Instagram, Facebook, from `contact.ts` (bracket placeholders are text, not links, as today). Phone: a list. No oversized phone number. |
| 13 | Footer | the only dark area: logo (inverted), "Laserska epilacija u Zagrebu.", columns Zagreb (the three locations), Skintastic u svijetu (the external ones), Pravno (the existing legal links); the existing copyright line. |

The cookie banner, the legal pages and the scroll-to-top behave as today in both designs.

## Povoljniji termini data

The new offers (days, hours, discount, studio, end date, set in Administracija) are **not built yet**; they come
from a separate Skintastic brief. Until then:

| Field | Allowed values |
|---|---|
| shape | `src/config/offers-v2.ts` exports a type `OfferWindowV2 = { name, percent, days, hours, studio, validUntil? , code }` and a function that returns the active offers, sorted by percent descending, at most 3 |
| production source | the function returns an empty list, so section 4 is **hidden** |
| preview | with `?dizajn=novo&ponude=demo` it returns this fixture: Noge kompletne −30 %, "Uto i Čet", "13:00–16:00", Zapad; Lice i vrat −20 %, "Pon–Pet", "8:00–11:00", "Zapad i Istok", until 30. 11.; Svi tretmani −10 %, "Pon–Pet", "do 11:00", "Oba studija" |
| the existing week section | not shown in the new design (it stays in the current one) |

## Images

| Place | File |
|---|---|
| hero | **the person gives** (a studio or treatment photo in warm daylight, no model in swimwear). Until then a linen block with the alt text, no stock image. |
| Povoljniji termini | **the person gives** (legs in daylight on a light wall). Until then a linen block. |
| O nama | **the person gives**. Until then a linen block. |
| Tehnologija | `technology/monolith_v1.png`, resized to 1200 px wide, transparent |
| certificates | `certs/wifi.webp` and `certs/wko.webp` converted to PNGs with a transparent background and ink-coloured marks (luminance to alpha), saved as `public/images/v2/wifi-ink.png` and `wko-ink.png` |
| Zapad | the existing `locations/zagreb.jpg` |

The mockup's photos were generated for the concept and must **not** be copied into the repo.

**Values not given yet:** the hero, offer and about photos; the Istok address,
hours, e-mail, Instagram, Facebook and the reviews stay as bracket placeholders exactly as on the current page.
Drafted en texts are listed in the report for review.

**Tests**
- `npm run lint` and `npm run build` pass.
- With the switch off, screenshots at 390 and 1440 px are identical to `main`, and the page's text and sections are unchanged.
- With the switch off, the network tab shows no Newsreader or Hanken Grotesk font file.
- `?dizajn=novo` shows the new design and the switch; reloading without the parameter keeps it; "Sada" or
  `?dizajn=sada` returns to the current design and hides the switch.
- Storage blocked (private mode): the current design shows and nothing throws.
- Croatian characters (č, ć, đ, š, ž) render in both new fonts (no fallback glyphs).
- `grep -i mirn messages/*.json` stays empty.

**Done when**
1. **Switch:** the four switch cases above. Shown.
2. **New design:** screenshots of the whole page at 1440 and 390 px, with and without `ponude=demo`, next to the
   mockup. Shown.
3. **Current design unchanged:** with the switch off, screenshots at 390 and 1440 px are identical to `main`, and the page's text and sections are unchanged. Shown.
4. **Content:** every text in the sections table is in `messages/hr.json` under `v2.*` (or reuses an existing key
   where the table says so); no visible text in components. Listed.
5. **The diff** lists only the Touches paths. Listed.

**Out of scope**
- The new off-peak offers in the Skintastic app and their public route (a separate Skintastic brief).
- Removing the current design (a later brief, once Ivan decides).
- New photos (the person provides them).

**Estimate** About 3 days.
