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
| type scale (Ivan, 2026-11-03; mockup version 21) | section headings (h2) one size, `clamp(36px, 3.7vw, 52px)`; item titles (featured treatments, why points, steps, location names) 26 px; FAQ questions 24 px | the whole new page |
| font loading | both new fonts with `preload: false`, and their CSS variables applied only inside the new design's wrapper, so a visitor to the current design downloads neither font | |

Italic is used only where marked *like this* below. Small labels: 11.5 px, letter-spacing .24em, uppercase, taupe.

## Sections, in this order (hr texts; the en texts are drafted by you and listed for review)

| # | Section | Content |
|---|---|---|
| 1 | Header | the existing logo; links Tretmani · Povoljniji termini · Lokacije · Pitanja · Kontakt (anchors to sections 3, 4, 9, 10, 11); button "Rezerviraj termin →" (`BOOKING_URL` with the campaign parameters, as today). Laptop and tablet: **sticky** (Ivan, 2026-11-03), so "Rezerviraj termin" is always in view: ground `--v2-sand` at 94 % with a light blur, `top: env(safe-area-inset-top)`; anchored sections stop below it. Phone: logo only; the booking button becomes a sticky bar at the bottom. |
| 2 | Hero | (Ivan, 2026-11-03; mockup version 16.) Label "Laserska epilacija · Zagreb"; heading "Glatka koža." / "*Dugotrajno.*"; line under it, 19 px, ink: "Profesionalna laserska epilacija za žene i muškarce uz Mediostar diodni laser."; a thin rule, then the **offer block** from the first `heroOffers` entry whose `validUntil` hasn't passed (`hero-offers.ts` stays untouched): label in rust "Posebna ponuda · Pazusi"; price "19,90 €" in Newsreader light, about 68 px, with "49,99 €" struck through in taupe beside it; line "Započni tretmane po posebnoj cijeni koju zadržavaš do završetka ciklusa."; **one** button "Iskoristi ponudu →" (booking with the offer's `code`) and beside it "Ponuda do 31. 12." in taupe. Its texts are `v2.heroOffer.{id}.*` (label, price, oldPrice, note, cta, until); with no valid offer, or no `v2.heroOffer.{id}` texts, the whole block is hidden. **No other button in the hero**: the sticky header carries booking. A thin rule, then three ticks: "Mediostar diodni laser", "Stručan pristup", "Za žene i muškarce". Right side: a **video** instead of the image (`<video autoplay muted loop playsinline>` with a poster), filling the column and fading into the ground on the left; on the phone above the text, fading at the bottom. With `prefers-reduced-motion` only the poster shows. No play icon on top. The video file and poster are **the person gives**; until then a linen block, as for the other photos. |
| 3 | Tretmani i cijene | (Ivan, 2026-11-03; mockup version 17.) Left: label "Tretmani i cijene", heading "Pronađi svoj tretman" (one line on the laptop), text "Od pojedinačnih zona do kombinacija tretmana. Istraži sve opcije, cijene i rezerviraj termin online.", a **black button** "Svi tretmani i cijene →" (booking). Right, after a vertical rule: label **"Izdvojeni tretmani"** (a selection, not the catalogue), then three columns with thin rules: name (Newsreader 25 px), under it one small line (14 px, taupe) saying what it covers (Ivan, 2026-11-03): Lice i vrat "Za svilenkasto glatku kožu" (reuses `offers.items.faceNeck.desc`), Intimna zona and Cijela leđa "[OPIS]" (en "[DESCRIPTION]"; values still needed); then "od" (small, taupe) and the price (Newsreader light, about 34 px) — Lice i vrat (`pkg_face_neck`), Intimna zona (`alc_intimate_full_f`; Ivan, 2026-11-03), Cijela leđa (`alc_back_full`; Ivan, 2026-11-03: replaces Noge kompletne, which is now the app's first time offer). The "od" prices come from the **live** catalogue; until they can be read, a bracket placeholder, listed as a value still needed (the development catalogue differs). Each column links to booking with its code. Phone: stacked; the list as rows, the line under the name and the price on the right. The list shows individual body areas a client can compare with other studios. Pazusi is **not** in this list (it is the hero offer). |
| 4 | Povoljniji termini | (Ivan, 2026-11-03; mockup versions 17 and 19.) **One linen band with one image for the whole card**, in three parts on the laptop: text — label "Povoljniji termini", heading "Uhvati *bolju cijenu*" (one line), text "Posebne cijene za odabrane tretmane u slobodnijim terminima."; in the middle a space; after a vertical rule, the offer rows. **The image is the band's background across the whole width** (mockup version 19): at the band's full height (`background-size: auto 100%`), at about 46 % horizontally, under a horizontal gradient that is solid linen up to about 33 %, clear from 43 % to 52 % and solid linen again from about 66 %, so the text and the rows sit on plain linen. No separate image column. The image is **the person gives** (the concept: a calendar with "15 %" circled and leaf shadows); until then a linen block. Each row: name (Newsreader 26 px); under it a clock icon (rust), **days · hours** (600) and the studio in taupe; on the right one pill (sand at 85 %) holding the percentage in italic Newsreader ("do −30 %"; with one offer "Do −30 %") and a round outlined arrow button. The whole row is one link. No "Provjeri dostupne termine" link under the rows. Phone: the image on top, then the text, then each row with the pill under the name. See **Povoljniji termini data**. |
| 5 | Kako izgleda tretman | (Ivan, 2026-11-03; mockup version 17.) Label "Kako izgleda tretman?" (small spaced caps, ink) on the left, no italic heading; three steps, each with its number in a soft round badge (`#efd9c6`, 48 px), a short line between the steps on the laptop, then the title (Newsreader 28 px) and the text (ink). The titles and texts are the current page's, word for word, from the existing keys `how.steps.1–3` (title, body; hr and en), not copied (Ivan, 2026-11-03): 01 Besplatno savjetovanje — "Pregledamo kožu i dlačice, odgovorimo na pitanja i dogovorimo plan – individualno i bez naknade." · 02 8 do 10 tretmana — "U razmaku od 4, zatim 6, pa 8 tjedana, jer laser djeluje na dlačice u fazi rasta. Plaćaš samo pojedinačni tretman." · 03 Dugotrajno glatka koža — "Bez brijanja i depilacije. Jednom godišnje jedan tretman osvježavanja." |
| 6 | Review | linen band with thin rules above and below; one italic quote and its author line, from the existing `reviews.items[0]` (bracket placeholders stay as today); on the right a round outlined arrow and "Iskustva naših klijentica" linking to `reviews.googleUrl` (a bracket value is not a link). |
| 7 | Zašto Skintastic? | (Ivan, 2026-11-03; mockup version 19.) The current page's content: on the left the label "Skintastic laser | skin | body" (reuses `why.eyebrow`) above the heading "Zašto Skintastic?"; four points in two columns, reusing `why.features.*` (title, body; hr and en): Stručnjaci za njegu kože — "Iskustvo i pažljiv pristup – za rezultate koji se vide." · Tehnologija — "Provjerena high-end tehnologija." · Higijena — "Strogi standardi u svim područjima." · Besplatno savjetovanje — "Individualno i bez naknade." |
| 8 | Tehnologija | sand ground with a thin rule above (not dark); label "Tehnologija", heading "Mediostar diodni laser", text "Laser njemačkog proizvođača Asclepion, za sve tipove kože i dlačica. ICE-hlađenje čini tretman ugodnim."; four facts: Valne duljine 810 \| 940 nm · Hlađenje 360° ICE · Tipovi kože I–VI · Snaga 5.000 W; on the right `technology/monolith_v1.png` (transparent; resized copy in `public/images/v2/`), no caption. |
| 9 | O nama | linen band; photo on the left (narrower column, anchored at the top so nothing is cut), text on the right: heading "O nama" (no label above it), the current page's `why.about` text (reuses the key; Ivan, 2026-11-03): "**U Skintasticu sve se vrti oko tvoje kože.** Specijalizirani smo za lasersko uklanjanje dlačica visokoučinkovitim diodnim laserima – vrhunski rezultati po poštenoj cijeni, u elegantnom ambijentu u Zagrebu." and "Naš cilj su vrhunski rezultati po poštenoj cijeni. Zato radimo s high-end tehnologijom i stručnim osobljem koje izvrsno poznaje svoj posao."; then a rule, the label "Certifikati Skintastic brenda · Kvaliteta je na prvom mjestu" and the WIFI and WKO logos as ink-coloured images on a transparent background (see Images). |
| 10 | Naše lokacije | (Ivan, 2026-11-03; mockup version 21.) Heading "Naše lokacije" (no label above it); the three Zagreb locations from `locations.ts` in three columns, each tile **3:2 with a 10 px radius**: Zapad keeps its existing image `locations/zagreb.jpg` (unchanged), positioned at `center 20%` so the storefront shows, not the dark bottom; Istok and Jug without a photo show a quiet tile with a small spaced-caps label ("Fotografija studija Istok" / "Otvaranje uskoro"); then name, address, hours, "Rezerviraj ovdje →", "Kako do nas ↗"; the teaser muted with "Otvaranje uskoro. Do tada nas posjeti na Zapadu ili Istoku."; under them "Dio Skintastic obitelji" and the external locations, **each a link with "↗"** (`locations.ts` `url`, a new tab, `rel="noopener"`); a bracket placeholder URL shows the name as plain text. The four URLs are values still needed. |
| 11 | Česta pitanja | linen band; heading "Česta pitanja" (no label above it) and the existing `faq.subtitle` beside it; **all** items of the existing `faq.items`, in their order, with their texts unchanged (reuse the keys, don't copy them), the first one open; questions in Newsreader 24 px.; answers 16 px, line height 1.6, max width 62ch, a `<br>` inside an answer gets about 10 px of space so long answers read as paragraphs; section padding 64 px (Ivan, 2026-11-03; mockup version 21). |
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
