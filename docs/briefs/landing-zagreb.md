# Brief · landing The Zagreb page sells Zagreb and sends every "Rezerviraj" straight into booking

> **Draft, 2026-10-21. Not accepted.** Written by the landing-page analysis conversation. The person
> accepts it; the open choices under **Decided** are asked one at a time before the build starts.

**Canvas:** https://claude.ai/artifact/DCgUZ5TcHXTgG1rv8daDpp ("Skintastic Zagreb landing mockup").
Boards: `Desktop — new landing page`, the three mobile boards, `Location types — spec`, `Booking flow —
before vs after`, `Clickable booking flow`. Values on the boards in brackets (`[TELEFON]`,
`[RADNO VRIJEME]`, `[OCJENA]`) are placeholders, not values.

## Touches

- `src/app/[locale]/page.tsx` (section order only)
- `src/app/[locale]/layout.tsx` (`metadata` only)
- `src/i18n/routing.ts` (`locales` only, after open choice O1)
- `src/components/layout/Header.tsx`, `OverlayMenu.tsx`, `Footer.tsx`
- `src/components/sections/HeroSection.tsx`, `OffersSection.tsx`, `LocationsSection.tsx`,
  `ServicesSection.tsx`, `TechnologySection.tsx`, `ReviewsSection.tsx`, `FaqSection.tsx`
- new: `src/config/locations.ts`, `src/config/booking.ts`, `src/components/sections/ContactSection.tsx`,
  `src/components/ui/BookButton.tsx`, `src/components/layout/MobileBookBar.tsx`
- removed from the page (files may stay): `QuoteSection`, `VideoLogoSection`, `GoetheQuoteSection`
- `src/components/legal/CookieConsent.tsx` (storage only: the `skt_consent` cookie replaces
  `localStorage`, ADR-0047; texts and layout unchanged)
- `messages/hr.json` and the second locale's file (after O1)
- `public/images/hero/` (remove the unused `hero-video-2.mp4`; add compressed versions)

Changing any other file: stop and ask. The legal pages (`impressum/`, `datenschutz/`) are **not**
touched by this brief (see Out of scope). End your report with the
output of `git diff --stat origin/main...HEAD`.

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
  page's banner and only read by the app (the person, 2026-10-21, L1; Skintastic ADR-0047, proposed).
  The app loads no tag before the ads brief; the landing page's own tags, when they come, follow the
  same cookie (scheduling decision 193).
- **Same domain, subdomains:** landing on the main domain, the studio app with online booking on
  `app.` (the person, 2026-10-21; the domain name itself is O3).
- **Zagreb owns its Google and Meta accounts** (the person, 2026-10-21). Tracking itself is out of scope.

**Open — asked one at a time, each with a recommendation**
- **O1 · Languages.** Recommendation: `hr` + `en`, drop `de` (the booking app has hr/en/de; Zagreb
  clients and tourists read English; the current `de` pages show the Austrian company).
- **O2 · Location names.** Recommendation: the app's own names (org decision 31), e.g. "Skintastic
  Zapad", so the page, the booking app and the e-mails match.
- **O3 · Domain.** Final name (`skintasticlaserstudio.hr` was an example) and whether `skintastic.hr`
  stays and redirects page by page (301).
- **O5 · Brand strip target.** Recommendation: the franchisor's main site rather than each franchise.

**Waits for** O1–O3, O5 and the values marked "the person gives"; Skintastic PR #506 (scheduling
decisions 190–194 and ADR-0047) accepted. The franchisee entry, `?centar=` and `?usluga=` are built
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
| `BOOKING_URL` | env var `NEXT_PUBLIC_BOOKING_URL` | absolute https URL | `https://app.{domain}/book/f/{franchiseeSlug}` (scheduling decision 191; domain O3) | build fails | the person gives (the slug is set on Online rezervacije) |
| location `type` | enum | — | `bookable`, `teaser`, `external` | not allowed | decided |
| location `slug` | text | lowercase, digits, dashes | the app's location slug, sent as `?centar=` (scheduling decisions 108, 192) | `teaser`, `external`: empty | the person gives |
| location `name` | text | — | per O2 | not allowed | O2 |
| location address, phone, hours | text | — | — | `teaser`: area only, may be empty | the person gives |
| teaser `openingLabel` | text | e.g. month + year | — | may be empty → "Uskoro" alone | the person gives |
| external `url` | absolute URL | — | the franchise's or franchisor's site (O5) | not allowed | the person gives |
| offer `code` | text | the app's catalogue code, sent as `?usluga=` | e.g. `alc_underarms` | not allowed | the person gives (from the app's catalogue) |
| campaign params passed on | text | — | `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `gclid`, `fbclid` | missing: not added | scheduling decision 194 |
| `skt_consent` cookie | cookie | `Domain` = main domain, `Path=/`, `SameSite=Lax`, `Secure`, 180 days | `v1.<necessary>.<analytics>.<marketing>.<YYYY-MM-DD>`, each `0`/`1`, necessary always `1`, e.g. `v1.1.1.0.2026-10-21` | missing or unreadable = no for analytics and marketing | ADR-0047 |
| banner categories | rule | — | the banner's categories map to analytics and marketing; necessary is always on | — | ADR-0047 (how today's four categories map is asked before the build) |
| offer prices and old prices | money | € with comma | — | old price may be empty | the person gives; today's values in `messages/hr.json` until then |
| Google rating, count, review texts | text | real Zagreb reviews only | — | section hidden if empty | the person gives |
| H1 (hr) | text | — | "Laserska epilacija u Zagrebu" | — | canvas |
| book button (hr) | text | — | "Rezerviraj termin" (header, hero, contact, mobile bar); "Rezerviraj" (cards) | — | canvas |
| teaser button (hr) | text | disabled | "Rezervacije uskoro"; badge "Uskoro" | — | canvas |
| brand strip (hr) | text | — | "Dio skintastic obitelji" / "5 centara u 3 zemlje" (count from config) | — | canvas |
| top bar (hr) | text | — | "Besplatno savjetovanje · Rezerviraj online" | — | canvas |
| `en` texts | text | — | translations of the hr row | — | the person gives (after O1) |
| page `<title>` / description (hr) | text | ≤ 60 / ≤ 155 chars | mention Zagreb and laser hair removal; no foreign cities | — | the person gives |

The agent picks none of these. A value this brief needs that is not in the table is a stop.

**Build**
1. `src/config/locations.ts`: one list with the three types; every section, the menu and the footer
   read it. `src/config/booking.ts` builds the links (`{BOOKING_URL}`, `?centar=`, `?usluga=`); links
   open in the same tab and carry the page's incoming `utm_*`, `gclid`, `fbclid` parameters on.
   `CookieConsent.tsx` writes and reads `skt_consent` (ADR-0047) instead of `localStorage`.
2. Header: 5 nav items (Ponude, Lokacije, Usluge, Informacije, Kontakt), phone link, language switch,
   a persistent "Rezerviraj termin". Mobile: a fixed bottom bar with WhatsApp and "Rezerviraj termin".
3. Hero: one static slide with the H1, the offer, "Rezerviraj termin" (booking link) and "Sve ponude"
   (`#ponude`); a trust row under it. Mobile shows the poster image, not the video.
4. Offers: a static grid (no autoplay, no dropdown); each card has its own "Rezerviraj" link.
5. Locations: Zagreb `bookable` and `teaser` cards; the brand strip for `external` ones.
6. Services and Technology shortened as on the canvas; Reviews from real Zagreb reviews or hidden.
7. New Contact section: address, hours, phone, WhatsApp, map placeholder (no third-party map embed
   until consent exists — Out of scope), "Rezerviraj termin".
8. Footer: Zagreb locations, "skintastic u svijetu" links, legal links unchanged.
9. Remove `QuoteSection`, `VideoLogoSection`, `GoetheQuoteSection` from the page; delete
   `hero-video-2.mp4`.
10. Metadata: title, description, canonical, `LocalBusiness` JSON-LD per `bookable` location, and
    `FAQPage` JSON-LD from the existing FAQ.

**Tests**
- While working: `npm run lint`, `npm run build`.
- Once, before the report: the built `out/` served locally, checked with Playwright at 1440 px and
  390 px for the Done-when items.

**Done when**
1. **Every "Rezerviraj"** on the page links to the booking app in the same tab, and none points to
   `#offers`, `#locations` or a `timify.com` URL. Shown.
2. **A location card's link** carries `?centar={slug}`; an offer card's carries `?usluga={code}`. Shown.
3. **With one `bookable` location**, no foreign city appears outside the brand strip and the footer;
   the page `<title>` and description contain "Zagreb". Shown.
4. **Switching a location** from `teaser` to `bookable` in `src/config/locations.ts` is the only edit
   needed to make it bookable everywhere. Shown.
5. **Incoming `utm_source=test`** on the landing URL appears on every booking link. Shown.
6. **Accepting analytics only** in the banner writes `skt_consent=v1.1.1.0.{today}` on the main
   domain; rejecting all writes `v1.1.0.0.{today}`; nothing is left in `localStorage`. Shown.
7. **The mobile bar** is visible at 390 px on every scroll position. Shown.
8. **The diff** lists only the Touches paths. Listed.

**How a person checks it**
1. Open the page on a phone: the header says Zagreb, "Rezerviraj termin" is always visible.
2. Tap the hero button: the booking app opens in the same tab.
3. Tap "Rezerviraj" on the Zapad card, then on an offer card: the links carry the centre and the treatment.
4. Scroll to Lokacije: Istok and Jug show "Uskoro"; Wien, Graz and Stuttgart only in the brand strip.

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

**Estimate** Three to four days, after O1–O3 and the values are given.
