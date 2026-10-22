# Brief · landing The Zagreb page sells Zagreb and sends every "Rezerviraj" straight into booking

> **Accepted by Ivan Tomić, 2026-10-21; the condensed structure (v2) accepted 2026-10-22; hero, reviews and
> breakpoint changes after the first build, 2026-10-22 (run 3 of the Cursor prompts).** Written by
> the landing-page analysis conversation. The values still marked "the person gives" follow **Values
> not given yet** (under the Values table).

**Mockup:** `docs/briefs/landing-zagreb/mockup/` (copied from page "2 · Condensed page" of the canvas
https://claude.ai/artifact/DCgUZ5TcHXTgG1rv8daDpp on 2026-10-22; its `README.md` says how to read it).
**The page is built as `desktop.html` (1440 px) and `mobile.html` (390 px, the whole page)**: the
sections, their order, texts, layout and styles, except where the **Mockup** section below or
**Decided** says otherwise. Values in brackets (`[E-MAIL]`, `[RADNO VRIJEME]`, `[OCJENA]`) are
placeholders, not values.

## Touches

- `src/app/[locale]/page.tsx` (the sections and their order only)
- `src/app/[locale]/layout.tsx` (`metadata` and the locale type only)
- `src/i18n/routing.ts` (`locales` only: `["hr", "en"]`, O1), `src/i18n/request.ts` (the locale type only)
- `src/components/layout/LanguageSwitcher.tsx` (labels only, O1)
- `public/index.html` (`locales` and the fallback links: `hr`, `en`, O1)
- `src/components/layout/Header.tsx`, `OverlayMenu.tsx`, `Footer.tsx`
- `src/components/sections/HeroSection.tsx`, `OffersSection.tsx`, `ReviewsSection.tsx`,
  `LocationsSection.tsx`, `FaqSection.tsx`, `GoetheQuoteSection.tsx`
- new: `src/config/locations.ts`, `src/config/booking.ts`, `src/config/hero-offers.ts`,
  `src/config/contact.ts`, `src/components/sections/HowItWorksSection.tsx`,
  `src/components/sections/WhySection.tsx`, `src/components/sections/ContactSection.tsx`,
  `src/components/ui/BookButton.tsx`, `src/components/layout/MobileBookBar.tsx`
- removed from the page (files may stay): `QuoteSection`, `VideoLogoSection`, `ServicesSection`,
  `TechnologySection`, `FeaturesSection`, `AboutSection`, `CertificatesSection`, `BeachBannerSection`
  (their content moves into `HowItWorksSection` and `WhySection`, see Build)
- `src/components/legal/CookieConsent.tsx` (storage only: the `skt_consent` cookie replaces
  `localStorage`, ADR-0047; and the footer's "Postavke kolačića" link opens the banner the way its
  existing reopen button does; texts and layout unchanged)
- `messages/hr.json`; new `messages/en.json`; `messages/de.json` removed (O1)
- `public/images/hero/` (remove the unused `hero-video-2.mp4`, the white fabric clip; add compressed
  versions of `hero-video-1.mp4` and `hero-video-3.mp4`, which stay; `hero-video-1-poster.jpg` is
  already added by this brief's branch)

Changing any other file: stop and ask. The legal pages (`impressum/`, `datenschutz/`) are **not**
touched by this brief (see Out of scope). End your report with the output of
`git diff --stat origin/main...HEAD`.

**Mockup** (where the build differs from `desktop.html` / `mobile.html`; the person, 2026-10-21 and 2026-10-22)
- **Page order (11 blocks):** top bar + header, hero, Najbolje ponude, Kako djeluje, Zašto skintastic,
  Ponosni smo na to (reviews), Naše lokacije with the brand strip, Korisne informacije (FAQ), Kontakt,
  the Goethe quote band, footer. Nothing else on the page; the mobile book bar on phones.
- **Hero:** the mockup loops `hero-video-1` only; the page plays both videos in turn (Build 3). The
  poster while loading is `hero-video-1-poster.jpg`. **`hero-axilla-2026.jpg` and `hero-axilla.jpg`
  are not used**: their offer text is printed into the image.
- **Najbolje ponude:** the six offers in the mockup's script (Pazusi, Cijelo tijelo (žena) small,
  Lice i vrat, Superman paket, Noge kompletne, Beach paket), images from `public/images/services/`;
  today's "Intimno kompletno" card is not shown.
- **Reviews:** always shown, as the mockup (Decided).
- **Images:** the mockup's `/_blob/…` images are replaced by the matching files in `public/images/`
  (see the mockup `README.md`).

**Goal**
A person in Zagreb who searched for laser hair removal sees a Zagreb page, and reaches the booking
calendar from any "Rezerviraj" in one click, in the same tab.

**Decided**
- **The page is about Zagreb only.** Other franchises (Wien, Graz ×2, Stuttgart) appear only as a
  brand strip and in the footer, linking out; never in booking, the menu or the SEO text (the person,
  2026-10-21).
- **A location has one of three types:** `bookable`, `teaser` ("Uskoro", shown, not bookable), `external`
  (another franchise, links to its own site) (the person, 2026-10-21).
- **No location popup on the landing page.** Every "Rezerviraj" opens the booking app's step 1. The
  centre is chosen there when the link does not carry it (the person, 2026-10-21).
- **Links carry what they know:** a general "Rezerviraj" → the franchisee's booking entry
  `https://app.{domain}/book/f/{franchiseeSlug}`; a location card adds `?centar={locationSlug}`; an
  offer card adds `?usluga={catalogue code}` (e.g. `alc_underarms`); `utm_*`, `gclid`, `fbclid` are
  passed on (the person, 2026-10-21; Skintastic scheduling decisions 191, 192, 194).
- **With the centre and the treatment both known,** the app still opens Tretmani with both filled
  (the person, 2026-10-21, L4; scheduling decision 192). Nothing for the landing page to build.
- **"Uskoro" centres exist on the landing page only;** the app does not know them (the person,
  2026-10-21, L3; scheduling decision 190).
- **The cookie choice is one cookie, `skt_consent`, on the main domain,** written by the landing
  page's banner and only read by the app (the person, 2026-10-21, L1; Skintastic ADR-0047, accepted).
  The app loads no tag before the ads brief; the landing page's own tags, when they come, follow the
  same cookie (scheduling decision 193).
- **Same domain, subdomains:** landing on the main domain, the studio app with online booking on
  `app.` (the person, 2026-10-21).
- **Zagreb owns its Google and Meta accounts** (the person, 2026-10-21). Tracking itself is out of scope.
- **O1 · Languages: `hr` + `en`; `de` is dropped** (the person, 2026-10-21). `/de/…` URLs are
  redirected to `/en/…` by the host (domain setup, not this brief). The legal pages keep their texts:
  `/en/impressum` and `/en/datenschutz` show the `hr` text until the legal brief.
- **O2 · Location names are the app's names** (the person, 2026-10-21; org decision 31):
  "Skintastic Istok", "Skintastic Zapad", "Skintastic Jug – Velika Gorica".
- **O3 · The domain is not in the code** (the person, 2026-10-21). It is chosen in the env and domain
  setup; the page reads it only from `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BOOKING_URL`. If the main
  domain changes, `skintastic.hr` stays and redirects page by page (301), set up on the host.
- **The Zagreb centres** (the person, 2026-10-21): "Skintastic Istok" (`bookable`, slug
  `zagreb-istok`, Drage Gervaisa 1, 10090 Zagreb; today's page calls this address "Zagreb Zapad",
  which is wrong), "Skintastic Zapad" (`bookable`, slug `zagreb-zapad`), "Skintastic Jug – Velika
  Gorica" (`teaser`). With two `bookable` centres the general "Rezerviraj termin" opens the
  franchisee entry, where the client picks the centre; the card links carry `?centar=`.
- **O5 · The brand strip links to each franchise's own site** (the person, 2026-10-21): Wien, Graz
  Puntigam, Graz City and Stuttgart are `external` locations, each with its own `url`.
- **The page is condensed to 11 blocks** (the person, 2026-10-22). Each section answers one question
  a client has, in this order: what and how much (hero, offers) → does it work (Kako djeluje) → can I
  trust you (Zašto skintastic) → what do others say (reviews) → where (locations) → questions (FAQ) →
  how to reach you (Kontakt). Repeated brand texts are merged, not dropped:
  - **Kako djeluje** = today's "Naša ponuda / Usluge skintastica" + "High-end uređaji": three steps
    and the Mediostar facts.
  - **Zašto skintastic** = today's four feature icons + "O nama" + "Naši certifikati".
  - **Kept as brand moments:** the script font, the peach/rose colours, the hero videos, the tagline
    "Ljepota koja traje." and the Goethe quote band. **Dropped:** the Sharon Stone quote, the
    video-logo band.
- **Hero: the videos and the text only** (the person, 2026-10-22). No image with printed text.
- **Hero text never sits on the video** (the person, 2026-10-22, after the first build: on the phone the
  text was covered by the book bar, and the video showed only a cropped face). The two videos frame
  their faces on opposite sides, so text over them always covers one face.
  - **Desktop (≥ 1024 px):** two columns, as `desktop.html`: the text on the peach background on the
    left, the video on the right filling its column (at least 600 px high), showing most of the frame.
  - **Phone (< 1024 px):** the video on top at 4:3 (390 × 292 px at 390 px), the text below it on the
    peach background, as `mobile.html`: H1 30 px, offer line 15 px, "Sve ponude ↓" and one trust line.
    No hero text under the fixed book bar at 390 × 664 px.
- **Phone layout below 1024 px, desktop layout from 1024 px** (the person, 2026-10-22). The first build
  switched at 1280 px (`xl:`), so laptops and tablets got the phone layout and its book bar.
- **Ponosni smo na to / Što naša zajednica kaže is always shown** (the person, 2026-10-22, after the
  first build hid it): rating, count, three review cards, "Sve recenzije na Googleu ↗" and "Prati nas
  na Instagramu ↗". Until the reviews are given they show as bracket placeholders (Values not given yet).
- **Najbolje ponude is a compact carousel** (the person, 2026-10-22): desktop shows 4 cards in one
  row with ‹ › arrows and "1–4 / 6 ponuda"; the phone swipes sideways with the next card peeking in.
  No autoplay.
- **No before/after images** (the person, 2026-10-22). Today's before/after pictures are
  AI-generated and are not shown as results. Real client results (with written consent) may come in
  a later brief.
- **Certificates are the brand's** (the person, 2026-10-22): Zagreb has the skintastic brand's
  certificates, today's `public/images/certs/wifi.webp` and `wko.webp`, labelled "Certifikati
  skintastic brenda".
- **Zašto skintastic on desktop: the text box on the left, the photo of the woman on the right**
  (the person, 2026-10-22), as two columns so the box never covers her; the box is white at 72 %
  opacity on the peach background. On the phone the photo sits above the text.
- **Contact channels** (the person, 2026-10-22): phone and WhatsApp are **+385 95 757 5344**; e-mail,
  Instagram and Facebook are placeholders until given. Kontakt is reached from the header (phone icon,
  menu) and the location cards; it stays near the end of the page.
- **Brand strip count:** "{n} centara u 3 zemlje", where n counts `bookable` and `external` locations
  (today 6); `teaser` locations are not counted until they open (the person, 2026-10-22).
- **The footer company line** is "DMT active solutions d.o.o." (the person, 2026-10-22; the company in
  today's impressum).

**Waits for** the values marked "the person gives". Scheduling decisions 190–194 (#506) and
ADR-0047 (accepted by Ivan Tomić, 2026-10-21, #508) are merged into Skintastic `develop` at
`5e82fd8a`. The franchisee entry, `?centar=` and `?usluga=` are built by the Skintastic brief
`scheduling-public-entry-centar`; until it ships, the links open the entry without prefill. Written
against `main` at `9360318`.

**What exists today** (`main` at `9360318`)
- **Hero CTA scrolls instead of booking:** `href="#offers"` (`src/components/sections/HeroSection.tsx:92`);
  the top bar also links to `#offers` (`src/components/layout/Header.tsx:64`). The hero posters
  (`hero-axilla-2026.jpg`, `hero-axilla.jpg`) carry printed offer text.
- **Nav has 8 items, no book button:** `NAV_LINKS` (`Header.tsx:10`); `nav.bookNow` exists in
  `messages/hr.json` and is unused.
- **Booking needs a dropdown of 5 addresses, 4 abroad:** `LOCATIONS` (`OffersSection.tsx:19`), the
  dropdown and the disabled "Cijene & rezervacije" (`:224`, `:260`); `#booking` is an empty
  `sr-only` div (`:96`). The offers carousel auto-rotates every 5 s (`:72`).
- **Locations are listed twice** (`LocationsSection.tsx:12`, `OffersSection.tsx:19`). Zagreb links to
  `/book/zagreb-centar` (`LocationsSection.tsx:16`) although it is named "Zagreb Zapad"; booking opens
  in a new tab (`:103`, `:137`).
- **The same story is told five times:** `FeaturesSection`, `ServicesSection` (with the AI
  before/after `BeforeAfterSlider`), `TechnologySection`, `AboutSection`, `CertificatesSection`;
  plus `QuoteSection`, `VideoLogoSection` and `GoetheQuoteSection` (`src/app/[locale]/page.tsx:30-42`).
- **SEO:** title "skintastic LASER SKIN & BODY" without Zagreb or the treatment; description lists
  Wien, Graz, Stuttgart (`src/app/[locale]/layout.tsx:33-34`). No structured data.
- **Contact:** WhatsApp is `https://wa.me/385`, no number (`Footer.tsx:40`); Facebook and Instagram
  are generic handles (`:52`, `:64`); no address, phone, hours or map on the page.
- **Reviews** are translated reviews from other franchises (`messages/hr.json`, `reviews.items`).
- **Weight:** hero videos 10 MB + 10 MB in use, `hero-video-2.mp4` 19 MB unused; images unoptimised
  (`next.config.ts`, static export).

**Values**

| Field | Type | Limits | Allowed values | Null or empty | Source |
|---|---|---|---|---|---|
| `BOOKING_URL` | env var `NEXT_PUBLIC_BOOKING_URL` | absolute https URL | `https://app.{domain}/book/f/{franchiseeSlug}` (scheduling decision 191) | build fails | env and domain setup (the slug is set on Online rezervacije) |
| `SITE_URL` | env var `NEXT_PUBLIC_SITE_URL` | absolute https URL, no trailing slash | the main domain; canonical, JSON-LD and the `skt_consent` `Domain` are taken from it | build fails | env and domain setup (O3) |
| location `type` | enum | — | `bookable`, `teaser`, `external` | not allowed | decided |
| location `slug` | text | lowercase, digits, dashes | the app's location slug, sent as `?centar=` (scheduling decisions 108, 192) | `teaser`, `external`: empty | decided: `zagreb-istok`, `zagreb-zapad` |
| location `name` | text | — | `bookable`/`teaser`: the app's name (O2); `external`: "Wien", "Graz Puntigam", "Graz City", "Stuttgart" | not allowed | decided |
| location address, hours, parking | text | — | — | `teaser`: area only ("Velika Gorica"), may be empty | Istok address decided; the rest the person gives |
| teaser `openingLabel` | text | e.g. month + year | — | may be empty → "Uskoro" alone | the person gives |
| external `url` | absolute URL | — | the franchise's own site, one per franchise (O5) | not allowed | the person gives |
| phone, WhatsApp | text | E.164 in links (`tel:+385957575344`, `https://wa.me/385957575344`) | "+385 95 757 5344" shown | — | decided (the person, 2026-10-22) |
| e-mail, Instagram URL, Facebook URL | text | — | — | placeholder until given | the person gives |
| offer `code` | text | the app's catalogue code, sent as `?usluga=` | e.g. `alc_underarms` | not allowed | the person gives (from the app's catalogue) |
| campaign params passed on | text | — | `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `gclid`, `fbclid` | missing: not added | scheduling decision 194 |
| `skt_consent` cookie | cookie | `Domain` = main domain, `Path=/`, `SameSite=Lax`, `Secure`, 180 days | `v1.<necessary>.<analytics>.<marketing>.<YYYY-MM-DD>`, each `0`/`1`, necessary always `1`, e.g. `v1.1.1.0.2026-10-21` | missing or unreadable = no for analytics and marketing; on `localhost` written without `Domain` and `Secure` (local testing) | ADR-0047 |
| banner categories | rule | — | `functional`, `analytics`, `performance` → the analytics bit; `ads` → the marketing bit; the banner's texts and layout unchanged | — | decided (the person, 2026-10-21) |
| hero offers | list | 1 or more | today: one, "Pazusi 19,90", `alc_underarms`, valid until 2026-12-31 (texts from `hero.slide2` in `messages/hr.json`) | empty: build fails | decided (the person, 2026-10-21) |
| offer prices and old prices | money | € with comma | — | old price may be empty | the person gives; today's values in `messages/hr.json` until then |
| Kako djeluje texts (hr) | text | — | as `desktop.html`: the three steps, "Mediostar diodni laser – Made in Germany", the four chips (810 i 940 nm, ICE-hlađenje, Svi tipovi kože I–VI, Bez UV-zračenja) | — | mockup; facts from today's `services`, `technology` and `faq` texts |
| Zašto skintastic texts (hr) | text | — | as `desktop.html`: the four features, the O nama paragraph, "Ljepota koja traje.", "Certifikati skintastic brenda · Kvaliteta je na prvom mjestu" | — | mockup |
| Google rating, count, review texts, the two Google profile URLs | text | real Zagreb reviews only, 3 shown (text, first name, centre) | — | bracket placeholders until given; the section is always shown | the person gives |
| H1 (hr) | text | — | "Laserska epilacija u Zagrebu" | — | canvas |
| book button (hr) | text | — | "Rezerviraj termin" (header, hero, contact, mobile bar); "Rezerviraj" (offer cards); "Rezerviraj u {name}" (location cards); "Rezerviraj besplatno savjetovanje" (Kako djeluje) | — | mockup |
| teaser texts (hr) | text | disabled button | "Rezervacije uskoro"; badge "Uskoro"; "Novi centar uskoro otvara vrata. Do tada nas posjeti u {bookable names}." | — | mockup |
| brand strip (hr) | text | — | "Dio skintastic obitelji" / "{n} centara u 3 zemlje — ista tehnologija i standard kvalitete." | — | mockup; n per Decided |
| top bar (hr) | text | — | "Besplatno savjetovanje · Rezerviraj online" | — | canvas |
| nav (hr) | text | 5 items | Ponude, Kako djeluje, Lokacije, Informacije, Kontakt | — | mockup |
| `en` texts | text | — | translations of every `hr` text on the page | — | the agent drafts them, the person reviews (see Values not given yet) |
| page `<title>` / description (hr) | text | ≤ 60 / ≤ 155 chars | mention Zagreb and laser hair removal; no foreign cities | — | the agent drafts them, the person reviews (see Values not given yet) |

The agent picks none of these. A value this brief needs that is not in the table is a stop.

**Values not given yet** (the person, 2026-10-21). So the build does not wait for them:
- **Facts** still marked "the person gives" (opening hours, parking, Zapad's address, e-mail,
  Instagram and Facebook URLs, the franchise website URLs, the franchisee slug, the teaser's
  `openingLabel`) go into `src/config/` as visible placeholders in brackets: `[RADNO VRIJEME]`,
  `[ADRESA ZAPAD]`, `[E-MAIL]`, `[INSTAGRAM]`, `[URL WIEN]`, … Never a real-looking value. A
  placeholder in a link (e.g. `mailto:`, an external URL) leaves the link out and shows the bracket text.
- **An offer without a confirmed `code`** links to booking without `?usluga=`; the report lists it.
  The same for the free consultation (`?usluga=` once its code is confirmed).
- **Offer prices:** today's values in `messages/hr.json`.
- **Reviews:** none given yet, so `[OCJENA]`, `[BROJ]`, `[RECENZIJA]`, `[IME]` and `[URL GOOGLE]`
  placeholders; the section stays on the page.
- **Texts** (`en` texts, page `<title>` and description): the agent drafts them within the limits of
  the row; the report lists every drafted key for the person to review.
- The page is not published while a bracket placeholder is left; every run's report lists them all.

**Build**
1. `src/config/locations.ts`: one list with the three types; every section, the menu and the footer
   read it. `src/config/contact.ts`: phone, WhatsApp, e-mail, Instagram, Facebook. `src/config/booking.ts`
   builds the links (`{BOOKING_URL}`, `?centar=`, `?usluga=`); links open in the same tab and carry
   the page's incoming `utm_*`, `gclid`, `fbclid` parameters on. `CookieConsent.tsx` writes and reads
   `skt_consent` (ADR-0047) instead of `localStorage`.
2. Header: 5 nav items, phone link, language switch, a persistent "Rezerviraj termin". Mobile: the
   header stays on top (phone icon, menu) and a fixed bottom bar holds WhatsApp and "Rezerviraj termin".
3. Hero (the person, 2026-10-21 and 2026-10-22):
   - **Background:** today's two videos of the women's faces (`hero-video-1.mp4`, `hero-video-3.mp4`),
     playing in turn as now, on desktop and mobile; compressed versions; `hero-video-1-poster.jpg`
     while they load. Layout per Decided ("Hero text never sits on the video"): beside the video on
     desktop, below it on the phone; no dark fade needed. No image with printed text.
   - **Fixed:** the H1 "Laserska epilacija u Zagrebu", the trust row, "Sve ponude" (`#ponude`).
   - **Hero offers:** a list in `src/config/hero-offers.ts` (badge, title, subtitle, `code`, optional
     `validUntil`). Each shows its texts and one "Rezerviraj termin" linking to booking with
     `?usluga={code}`. Today the list has **one** offer: "Pazusi 19,90" (`alc_underarms`, valid until
     2026-12-31). The "Dan bez dlačica" (10 %, last Friday) offer is removed from the page and the messages.
   - **With two or more offers** the offer text rotates (with the slide dots), and the button follows
     the offer on screen; rotation pauses on hover and focus and does not run with
     `prefers-reduced-motion` (dots only). With one offer: no rotation, no dots. An offer past
     `validUntil` is not shown.
4. Najbolje ponude: the compact carousel (Decided); each card has its own "Rezerviraj" with
   `?usluga={code}`; arrows are buttons with labels; the phone row scrolls with scroll-snap; no
   autoplay; "Sve cijene i paketi nalaze se u online kalendaru za rezervacije" links to booking.
5. `HowItWorksSection` (Kako djeluje) as the mockup: three numbered steps, the Mediostar image
   (`public/images/technology/mediostar.jpg`), the four chips, "Rezerviraj besplatno savjetovanje".
6. `WhySection` (Zašto skintastic) as the mockup: the four feature icons (`public/images/icons/`),
   then the O nama box (left) and `public/images/about/frau-links.png` (right, cropped around the
   woman) on desktop, photo above text on the phone; tagline; the two certificate logos.
7. Reviews ("Ponosni smo na to / Što naša zajednica kaže"): rating, count, three review cards (a swipe
   row on the phone), "Sve recenzije na Googleu ↗", "Prati nas na Instagramu ↗"; always shown, with
   placeholders until given.
8. Locations: "Skintastic Zagreb / Naše lokacije", the `bookable` cards (photo, address, hours,
   Galerija, Kako do nas, "Rezerviraj u {name}"), the `teaser` card (a compact row on the phone), and
   the brand strip for `external` ones.
9. FAQ: today's questions and answers, styled as the mockup; the longest answers may be shortened
   only by cutting sentences, never by rewording.
10. `ContactSection` as the mockup: the five channel tiles (Nazovi, WhatsApp, E-mail, Instagram,
    Facebook), then one block per `bookable` centre (address, hours, parking, "Rezerviraj termin",
    "Kako do nas ↗" as a Google Maps search link). No map embed (needs consent, Out of scope).
11. The Goethe quote band, then the footer as the mockup: channels, Zagreb centres, "skintastic u
    svijetu" (each `external` location and its site), Pravno + "Postavke kolačića", the company line.
12. Remove from the page `QuoteSection`, `VideoLogoSection`, `ServicesSection`, `TechnologySection`,
    `FeaturesSection`, `AboutSection`, `CertificatesSection`; delete `hero-video-2.mp4`.
13. Metadata: title, description, canonical, `LocalBusiness` JSON-LD per `bookable` location, and
    `FAQPage` JSON-LD from the FAQ.

**Tests**
- While working: `npm run lint`, `npm run build`.
- Once, before the report: the built `out/` served locally, checked with Playwright at 1440 px and
  390 px for the Done-when items.

**Done when**
1. **Every "Rezerviraj"** on the page links to the booking app in the same tab, and none points to
   `#offers`, `#locations` or a `timify.com` URL. Shown.
2. **A location card's link** carries `?centar={slug}`; an offer card's carries `?usluga={code}`. Shown.
3. **With the Zagreb centres configured**, no foreign city appears outside the brand strip and the footer;
   the page `<title>` and description contain "Zagreb". Shown.
4. **Switching a location** from `teaser` to `bookable` in `src/config/locations.ts` is the only edit
   needed to make it bookable everywhere (and it then counts in the brand strip). Shown.
5. **Incoming `utm_source=test`** on the landing URL appears on every booking link. Shown.
6. **Accepting analytics only** in the banner writes `skt_consent=v1.1.1.0.{today}` on the main
   domain; rejecting all writes `v1.1.0.0.{today}`; no consent value is left in `localStorage` (the
   language switcher's `locale` key stays). Shown.
7. **The mobile bar** is visible at 390 px on every scroll position. Shown.
8. **The hero** plays both videos at 390 px and 1440 px with one offer and no dots, and no image with
   printed text appears; adding a second offer to the config (and nothing else) makes the text rotate
   with dots. No hero text overlaps the video at 390 px or 1440 px, and at 390 × 664 px every hero
   line is above the book bar. Shown.
9. **Najbolje ponude** shows 4 cards in one row at 1440 px and moves with the arrows; at 390 px it
   swipes; nothing moves by itself. Shown.
10. **Zašto skintastic** at 1440 px shows the box on the left and the whole face of the woman on the
    right, not covered. Shown.
11. **The reviews section** is on the page at 390 px and 1440 px (with placeholders). Shown.
12. **At 1024 px** the page uses the desktop layout (no book bar, nav visible); at 1023 px the phone
    layout. Shown.
13. **The page matches the mockup** section by section at 1440 px (`desktop.html`) and 390 px
    (`mobile.html`), except what the **Mockup** section lists. Shown (screenshots next to the mockup's
    sections).
14. **The diff** lists only the Touches paths. Listed.

**How a person checks it**
1. Open the page on a phone: the header says Zagreb, "Rezerviraj termin" is always visible.
2. Tap the hero button: the booking app opens in the same tab.
3. Swipe the offers, tap "Rezerviraj" on one, then on the Istok card: the links carry the treatment
   and the centre.
4. Scroll to Lokacije: Istok and Zapad are bookable, Jug – Velika Gorica shows "Uskoro"; Wien, Graz
   and Stuttgart only in the brand strip.
5. In Kontakt, tap Nazovi and WhatsApp: both open +385 95 757 5344.

**Out of scope** (parked; each with its owner and where it is decided)
- **Booking app: the franchisee entry `/book/f/{franchiseeSlug}`, the Centar field in Tretmani, the
  `?centar=` / `?usluga=` prefill, the campaign parameters kept on the booking.** Owner Dražen
  (scheduling). Skintastic brief `scheduling-public-entry-centar` (decisions 190–192, 194).
- **The app reading `skt_consent`.** Built with the ads brief (ADR-0047 point 2).
- **Ads tracking and attribution:** GTM, GA4, Google Ads, Meta Pixel + Conversions API, Consent Mode
  v2, `booking_confirmed` from the app, offline conversions for paid visits through the platform
  capability `ads`. Owner: the person. Its own brief, under ADR-0047 (tags only on `/book/…` and the
  landing page, only with consent; no personal data to Google or Meta); IDs only as env vars.
- **Real client results (before/after)** with written consent. Owner: the person. A later brief.
- **A Google map embed** in Kontakt (needs consent). Owner: the person, with the ads/consent work.
- **Impressum:** OIB, MBS and court register, share capital, bank/IBAN missing; the `de` page names
  skintastic GmbH (Graz) (`src/app/[locale]/impressum/page.tsx:113`); the EU ODR link (`:92`, `:176`)
  points to a platform closed in July 2025 — replace with the Croatian consumer complaint notice.
  Owner: the person (legal texts are given, not written by an agent).
- **Privacy policy:** the `de` page names skintastic GmbH (`datenschutz/page.tsx:135`); analytics on
  "legitimate interest" will not hold once tracking starts; missing booking data, processors,
  retention, US transfers, cookie list; describes a contact form that does not exist; the booking
  "Napomena" may hold health data. Owner: the person. Legal brief.
- **Booking terms and consumer info:** cancellation / no-show rule, payment in the studio, prices incl.
  PDV, offer validity, contraindications. Owner: the person.
- **Campaign landing pages** (e.g. `/ponuda/pazusi`), "Obavijesti me" sign-up for teasers, gift
  vouchers, a full price list page, Zagreb team photos, Google Business Profile. Owner: the person.
  Each its own brief later.
- **European Accessibility Act:** check whether the company is exempt as a microenterprise. Owner:
  the person.

**Estimate** Three to four days, after the values are given.
