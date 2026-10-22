# Brief · landing The Zagreb page sells Zagreb and sends every "Rezerviraj" straight into booking

> **Accepted by Ivan Tomić, 2026-10-21.** Written by the landing-page analysis conversation. The
> values still marked "the person gives" follow **Values not given yet** (under the Values table).

**Mockup:** `docs/briefs/landing-zagreb/mockup/` (copied from the canvas
https://claude.ai/artifact/DCgUZ5TcHXTgG1rv8daDpp on 2026-10-22; its `README.md` says how to read
it). **The page is built as `desktop.html` and the mobile boards show it**: the sections, their order,
texts, layout and styles, except where the **Mockup** section below or **Decided** says otherwise.
Values on the boards in brackets (`[TELEFON]`, `[RADNO VRIJEME]`, `[OCJENA]`) are placeholders, not
values.

## Touches

- `src/app/[locale]/page.tsx` (the sections and their order only)
- `src/app/[locale]/layout.tsx` (`metadata` and the locale type only)
- `src/i18n/routing.ts` (`locales` only: `["hr", "en"]`, O1), `src/i18n/request.ts` (the locale type only)
- `src/components/layout/LanguageSwitcher.tsx` (labels only, O1)
- `public/index.html` (`locales` and the fallback links: `hr`, `en`, O1)
- `src/components/layout/Header.tsx`, `OverlayMenu.tsx`, `Footer.tsx`
- `src/components/sections/HeroSection.tsx`, `OffersSection.tsx`, `LocationsSection.tsx`,
  `ServicesSection.tsx`, `TechnologySection.tsx`, `ReviewsSection.tsx`, `FaqSection.tsx`
- new: `src/config/locations.ts`, `src/config/booking.ts`, `src/config/hero-offers.ts`, `src/components/sections/ContactSection.tsx`,
  `src/components/ui/BookButton.tsx`, `src/components/layout/MobileBookBar.tsx`
- removed from the page (files may stay): `QuoteSection`, `VideoLogoSection`, `GoetheQuoteSection`,
  `AboutSection`, `CertificatesSection` (not in the mockup)
- `src/components/legal/CookieConsent.tsx` (storage only: the `skt_consent` cookie replaces
  `localStorage`, ADR-0047; and the footer's "Postavke kolačića" link opens the banner the way its
  existing reopen button does; texts and layout unchanged)
- `messages/hr.json`; new `messages/en.json`; `messages/de.json` removed (O1)
- `public/images/hero/` (remove the unused `hero-video-2.mp4`, the white fabric clip; add compressed
  versions of `hero-video-1.mp4` and `hero-video-3.mp4`, which stay)

Changing any other file: stop and ask. The legal pages (`impressum/`, `datenschutz/`) are **not**
touched by this brief (see Out of scope). End your report with the
output of `git diff --stat origin/main...HEAD`.

**Mockup** (where the build differs from `desktop.html`; the person, 2026-10-21 and 2026-10-22)
- **Page order:** top bar, header, hero, features (4), offers, Naše lokacije with the brand strip,
  services, technology, reviews, FAQ, contact, footer. Nothing else on the page.
- **Centres:** the mockup's "Zagreb Zapad" card (Drage Gervaisa 1) is **Skintastic Istok**; the
  mockup's bookable "Zagreb Istok" variant (the `istokStatus: bookable` tweak) is the layout of
  **Skintastic Zapad**; "Zagreb Jug" is **Skintastic Jug – Velika Gorica**. Both bookable centres get
  the full card; their buttons read "Rezerviraj u {name}". The teaser line reads "Novi centar uskoro
  otvara vrata. Do tada nas posjeti u Skintastic Istok ili Zapad." (built from the `bookable` names).
- **Hero:** both videos on desktop and mobile (not the poster the mobile board's note mentions), see
  Build 3. Badge, offer line and price come from `src/config/hero-offers.ts`; today: badge "Posebna
  ponuda do 31.12.2026.", text "Pazusi za žene i muškarce sada 19,90 € umjesto 49,99 €. Mediostar
  diodni laser, besplatno savjetovanje." Trust row as the mockup, except: the Google rating item is
  left out until the rating is given; the address item lists the `bookable` centres' names.
- **Offers:** the six offers in `desktop.html` (its script: Pazusi, Cijelo tijelo (žena) small, Lice i
  vrat, Superman paket, Noge kompletne, Beach paket), images from `public/images/services/`; today's
  "Intimno kompletno" card is not shown. Button "Rezerviraj ovaj tretman".
- **Services:** the button "Rezerviraj besplatno savjetovanje" is a booking link (`?usluga=consult`
  once that code is confirmed; until then without `?usluga=`).
- **Reviews:** hidden until real Zagreb reviews are given (Values).
- **Contact:** one block per `bookable` centre (the mockup draws one); e-mail and parking lines are
  placeholders until given.
- **Footer:** as the mockup, except "skintastic u svijetu" lists each `external` franchise by name and
  its own site (O5), not "Austrija" / "Njemačka". The company line keeps the placeholder
  `[NAZIV FRANŠIZE d.o.o.]` until given.
- **Images:** the mockup's `/_blob/…` images are replaced by the matching files in `public/images/`.

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
  centre is chosen there when the link does not carry it (the person, 2026-10-21; the app side is
  in the handover, see Out of scope).
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
  `app.` (the person, 2026-10-21; the domain name itself is O3).
- **Zagreb owns its Google and Meta accounts** (the person, 2026-10-21). Tracking itself is out of scope.
- **O1 · Languages: `hr` + `en`; `de` is dropped** (the person, 2026-10-21). `/de/…` URLs are
  redirected to `/en/…` by the host (domain setup, not this brief). The legal pages keep their texts:
  `/en/impressum` and `/en/datenschutz` show the `hr` text until the legal brief.
- **O2 · Location names are the app's names** (the person, 2026-10-21; org decision 31):
  "Skintastic Zapad", "Skintastic Istok", "Skintastic Jug".
- **O3 · The domain is not in the code** (the person, 2026-10-21). It is chosen in the env and domain
  setup; the page reads it only from `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BOOKING_URL`. If the main
  domain changes, `skintastic.hr` stays and redirects page by page (301), set up on the host.
- **The Zagreb centres** (the person, 2026-10-21): "Skintastic Istok" (`bookable`, slug
  `zagreb-istok`, Drage Gervaisa 1, 10090 Zagreb; today's page calls this address "Zagreb Zapad",
  which is wrong), "Skintastic Zapad" (`bookable`, slug `zagreb-zapad`), "Skintastic Jug – Velika
  Gorica" (`teaser`). With two `bookable` centres the general "Rezerviraj termin" opens the
  franchisee entry, where the client picks the centre; the card links carry `?centar=`.
- **O5 · The brand strip links to each franchise's own site** (the person, 2026-10-21): Wien, Graz
  (×2) and Stuttgart are `external` locations, each with its own `url`.

**Waits for** the values marked "the person gives" (O1–O3 and O5 are decided above). Scheduling decisions 190–194
(#506) and ADR-0047 (accepted by Ivan Tomić, 2026-10-21, #508) are merged into Skintastic `develop`
at `5e82fd8a`. The franchisee entry, `?centar=` and `?usluga=` are built
by the Skintastic brief `scheduling-public-entry-centar`; until it ships, the links open the entry
without prefill. Written against `main` at `9360318`.

**What exists today** (`main` at `9360318`)
- **Hero CTA scrolls instead of booking:** `href="#offers"` (`src/components/sections/HeroSection.tsx:92`);
  the top bar also links to `#offers` (`src/components/layout/Header.tsx:64`).
- **Nav has 8 items, no book button:** `NAV_LINKS` (`Header.tsx:10`); `nav.bookNow` exists in
  `messages/hr.json` and is unused.
- **Booking needs a dropdown of 5 addresses, 4 abroad:** `LOCATIONS` (`OffersSection.tsx:19`), the
  dropdown and the disabled "Cijene & rezervacije" (`:224`, `:260`); `#booking` is an empty
  `sr-only` div (`:96`). The offers carousel auto-rotates every 5 s (`:72`).
- **Locations are listed twice** (`LocationsSection.tsx:12`, `OffersSection.tsx:19`). Zagreb links to
  `/book/zagreb-centar` (`LocationsSection.tsx:16`) although it is named "Zagreb Zapad"; booking opens
  in a new tab (`:103`, `:137`).
- **Services CTA goes to `#locations`** (`ServicesSection.tsx:51`).
- **Section order** (`src/app/[locale]/page.tsx:30-42`) includes `QuoteSection`, `VideoLogoSection`,
  `GoetheQuoteSection`.
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
| location `name` | text | — | `bookable`/`teaser`: the app's name, e.g. "Skintastic Zapad" (O2); `external`: the franchise's name | not allowed | decided (O2); the person gives the list |
| location address, phone, hours | text | — | — | `teaser`: area only ("Velika Gorica"), may be empty | Istok address decided; the rest the person gives |
| teaser `openingLabel` | text | e.g. month + year | — | may be empty → "Uskoro" alone | the person gives |
| external `url` | absolute URL | — | the franchise's own site, one per franchise (O5) | not allowed | the person gives |
| offer `code` | text | the app's catalogue code, sent as `?usluga=` | e.g. `alc_underarms` | not allowed | the person gives (from the app's catalogue) |
| campaign params passed on | text | — | `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `gclid`, `fbclid` | missing: not added | scheduling decision 194 |
| `skt_consent` cookie | cookie | `Domain` = main domain, `Path=/`, `SameSite=Lax`, `Secure`, 180 days | `v1.<necessary>.<analytics>.<marketing>.<YYYY-MM-DD>`, each `0`/`1`, necessary always `1`, e.g. `v1.1.1.0.2026-10-21` | missing or unreadable = no for analytics and marketing; on `localhost` written without `Domain` and `Secure` (local testing) | ADR-0047 |
| banner categories | rule | — | the banner's categories map to analytics and marketing; necessary is always on | — | decided (the person, 2026-10-21): `functional`, `analytics`, `performance` → the analytics bit; `ads` → the marketing bit; the banner's texts and layout unchanged |
| hero offers | list | 1 or more | today: one, "Pazusi 19,90", `alc_underarms`, valid until 2026-12-31 (texts from `hero.slide2` in `messages/hr.json`) | empty: build fails | decided (the person, 2026-10-21) |
| offer prices and old prices | money | € with comma | — | old price may be empty | the person gives; today's values in `messages/hr.json` until then |
| Google rating, count, review texts | text | real Zagreb reviews only | — | section hidden if empty | the person gives |
| H1 (hr) | text | — | "Laserska epilacija u Zagrebu" | — | canvas |
| book button (hr) | text | — | "Rezerviraj termin" (header, hero, contact, mobile bar); "Rezerviraj" (cards) | — | canvas |
| teaser button (hr) | text | disabled | "Rezervacije uskoro"; badge "Uskoro" | — | canvas |
| brand strip (hr) | text | — | "Dio skintastic obitelji" / "5 centara u 3 zemlje" (count from config) | — | canvas |
| top bar (hr) | text | — | "Besplatno savjetovanje · Rezerviraj online" | — | canvas |
| `en` texts | text | — | translations of every `hr` text on the page | — | the agent drafts them, the person reviews (see Values not given yet) |
| page `<title>` / description (hr) | text | ≤ 60 / ≤ 155 chars | mention Zagreb and laser hair removal; no foreign cities | — | the agent drafts them, the person reviews (see Values not given yet) |

The agent picks none of these. A value this brief needs that is not in the table is a stop.

**Values not given yet** (the person, 2026-10-21). So the build does not wait for them:
- **Facts** still marked "the person gives" (phone, opening hours, Zapad's address, the franchise
  website URLs, the franchisee slug, the teaser's `openingLabel`) go into `src/config/` as visible
  placeholders in brackets: `[TELEFON]`, `[RADNO VRIJEME]`, `[ADRESA ZAPAD]`, `[URL WIEN]`, … Never a
  real-looking value. A placeholder in a link (e.g. `tel:`, an external URL) leaves the link out and
  shows the bracket text.
- **An offer without a confirmed `code`** links to booking without `?usluga=`; the report lists it.
- **Offer prices:** today's values in `messages/hr.json`.
- **Reviews:** none given, so the section is hidden.
- **Texts** (`en` texts, page `<title>` and description): the agent drafts them within the limits of
  the row; the report lists every drafted key for the person to review.
- The page is not published while a bracket placeholder is left; every run's report lists them all.

**Build**
1. `src/config/locations.ts`: one list with the three types; every section, the menu and the footer
   read it. `src/config/booking.ts` builds the links (`{BOOKING_URL}`, `?centar=`, `?usluga=`); links
   open in the same tab and carry the page's incoming `utm_*`, `gclid`, `fbclid` parameters on.
   `CookieConsent.tsx` writes and reads `skt_consent` (ADR-0047) instead of `localStorage`.
2. Header: 5 nav items (Ponude, Lokacije, Usluge, Informacije, Kontakt), phone link, language switch,
   a persistent "Rezerviraj termin". Mobile: a fixed bottom bar with WhatsApp and "Rezerviraj termin".
3. Hero (the person, 2026-10-21):
   - **Background:** always today's two videos of the women's faces (`hero-video-1.mp4`,
     `hero-video-3.mp4`), playing in turn as now, on desktop and mobile; compressed versions, the
     posters while they load. The videos do not depend on the offers. Mobile loading speed is
     measured after launch.
   - **Fixed:** the H1 "Laserska epilacija u Zagrebu", the trust row, "Sve ponude" (`#ponude`).
   - **Hero offers:** a list in `src/config/hero-offers.ts` (badge, title, subtitle, `code`, optional `validUntil`).
     Each shows its texts and one "Rezerviraj termin" linking to booking with `?usluga={code}`.
     Today the list has **one** offer: "Pazusi 19,90" (`alc_underarms`, valid until 2026-12-31). The
     "Dan bez dlačica" (10 %, last Friday) offer is removed from the page and from the messages.
   - **With two or more offers** the offer text rotates (with the slide dots), and the button follows
     the offer on screen; rotation pauses on hover and focus and does not run with
     `prefers-reduced-motion` (dots only). With one offer: no rotation, no dots. An offer past
     `validUntil` is not shown.
4. Features: the four items with the mockup's shorter texts (`messages/` only).
5. Offers: a static grid as the mockup (no autoplay, no dropdown); each card has its own "Rezerviraj
   ovaj tretman" link with `?usluga={code}`.
6. Locations: "Skintastic Zagreb / Naše lokacije", the `bookable` and `teaser` cards, and the brand
   strip for `external` ones, as the mockup and the **Mockup** section.
7. Services and Technology shortened as the mockup; Reviews from real Zagreb reviews or hidden; FAQ
   as today, styled as the mockup.
8. New Contact section as the mockup: address, hours, phone, e-mail, parking, WhatsApp, a map
   placeholder (no third-party map embed until consent exists — Out of scope), "Rezerviraj termin".
9. Footer as the mockup and the **Mockup** section; legal links unchanged, plus "Postavke kolačića".
10. Remove `QuoteSection`, `VideoLogoSection`, `GoetheQuoteSection`, `AboutSection`,
    `CertificatesSection` from the page; delete `hero-video-2.mp4`.
11. Metadata: title, description, canonical, `LocalBusiness` JSON-LD per `bookable` location, and
    `FAQPage` JSON-LD from the existing FAQ.

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
   needed to make it bookable everywhere. Shown.
5. **Incoming `utm_source=test`** on the landing URL appears on every booking link. Shown.
6. **Accepting analytics only** in the banner writes `skt_consent=v1.1.1.0.{today}` on the main
   domain; rejecting all writes `v1.1.0.0.{today}`; no consent value is left in `localStorage` (the language
   switcher's `locale` key stays). Shown.
7. **The mobile bar** is visible at 390 px on every scroll position. Shown.
8. **The hero** plays both videos at 390 px and 1440 px with one offer and no dots; adding a second
   offer to the config (and nothing else) makes the text rotate with dots. Shown.
9. **The page matches the mockup** section by section at 1440 px and 390 px, except what the
   **Mockup** section lists. Shown (screenshots next to the mockup's sections).
10. **The diff** lists only the Touches paths. Listed.

**How a person checks it**
1. Open the page on a phone: the header says Zagreb, "Rezerviraj termin" is always visible.
2. Tap the hero button: the booking app opens in the same tab.
3. Tap "Rezerviraj" on the Istok card, then on an offer card: the links carry the centre and the treatment.
4. Scroll to Lokacije: Istok and Zapad are bookable, Jug – Velika Gorica shows "Uskoro"; Wien, Graz and Stuttgart only in the brand strip.

**Out of scope** (parked; each with its owner and where it is decided)
- **Booking app: the franchisee entry `/book/f/{franchiseeSlug}`, the Centar field in Tretmani, the
  `?centar=` / `?usluga=` prefill, the campaign parameters kept on the booking.** Owner Dražen
  (scheduling). Skintastic brief `scheduling-public-entry-centar` (decisions 190–192, 194).
- **The app reading `skt_consent`.** Built with the ads brief (ADR-0047 point 2).
- **Ads tracking and attribution:** GTM, GA4, Google Ads, Meta Pixel + Conversions API, Consent Mode
  v2, `booking_confirmed` from the app, offline conversions for paid visits through the platform
  capability `ads`. Owner: the person. Its own brief, under ADR-0047 (tags only on `/book/…` and the
  landing page, only with consent; no personal data to Google or Meta); IDs only as env vars.
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
