# Cursor prompts · landing-zagreb

Two runs on **one local branch**, `cursor/landing-zagreb`, started from this brief's branch
(`claude/admiring-cray-d2w5jh`). Nothing goes to `main` until the person has checked the whole
page locally: `main` deploys the live site. Run 2 continues on the same branch after run 1.
`.env.local` has `NEXT_PUBLIC_SITE_URL=http://localhost:3000` and `NEXT_PUBLIC_BOOKING_URL`
(see AGENTS.md).

The mockup is in the repo: `docs/briefs/landing-zagreb/mockup/`. No screenshots needed.

## Run 1 · foundations

```
Read AGENTS.md, then docs/briefs/landing-zagreb.md in full. You are on the local branch
`cursor/landing-zagreb` (.env.local set). Do not merge into or push to main. Build only these parts of it:

- Build step 1: src/config/locations.ts, src/config/booking.ts, src/config/hero-offers.ts, src/config/contact.ts,
  src/components/ui/BookButton.tsx; CookieConsent.tsx writes and reads the skt_consent cookie.
- Build step 2: the header (5 items, phone, language switch, "Rezerviraj termin"), the overlay menu,
  and src/components/layout/MobileBookBar.tsx.
- Languages (Decided, O1): locales hr + en, messages/en.json, messages/de.json removed,
  request.ts, layout.tsx (locale type only), LanguageSwitcher.tsx, public/index.html.

A value still marked "the person gives" follows the brief's "Values not given yet" rule
(bracket placeholders, drafted texts listed for review). The mockup is docs/briefs/landing-zagreb/mockup/
(read its README.md); build what it shows for these parts.

Run npm run lint and npm run build while working. Check Done when items 1 (header and mobile bar
buttons only), 5, 6 and 7 in a browser at 1440 px and 390 px. Commit on this branch; do not push. End with the report from
AGENTS.md, plus every placeholder left.
```

## Run 2 · sections and SEO

```
Read AGENTS.md, then docs/briefs/landing-zagreb.md in full. Run 1 (config, booking links, header,
mobile bar, cookie, hr + en) is committed on this branch; you are on the local branch
`cursor/landing-zagreb` (.env.local set). Do not merge into or push to main. Build the rest of the brief:

- Build steps 3 to 13 and the brief's Mockup section, in the page order of the brief (11 blocks): hero
  (both videos play in turn, hero-video-1-poster.jpg while loading, no image with printed text; one hero
  offer from src/config/hero-offers.ts, rotation only with two or more), the compact offers carousel
  (4 cards + arrows on desktop, swipe on the phone, no autoplay), the new HowItWorksSection and
  WhySection (box left, woman right on desktop), reviews (real Zagreb reviews or hidden), locations
  and brand strip, FAQ, the new ContactSection, the Goethe quote band, footer; the sections removed
  from the page (Quote, VideoLogo, Services, Technology, Features, About, Certificates),
  hero-video-2.mp4 deleted, compressed hero videos, metadata and JSON-LD.

A value still marked "the person gives" follows the brief's "Values not given yet" rule
(bracket placeholders, drafted texts listed for review). Read every value from src/config/ and messages/;
never copy one into a component. The mockup is docs/briefs/landing-zagreb/mockup/ (read its
README.md); the page must match desktop.html (1440 px) and mobile.html (390 px), except the brief's Mockup section.

Run npm run lint and npm run build while working. Check every Done when item (1 to 12) in a browser
at 1440 px and 390 px on the built out/ folder. Commit on this branch; do not push. End with the
report from AGENTS.md, plus every placeholder left.
```

## Commands (Cursor terminal)

Once, before run 1:
```bash
git fetch origin
git checkout -B cursor/landing-zagreb origin/claude/admiring-cray-d2w5jh
npm install
git checkout -- package-lock.json
npm run build
```

After each run: `npm run lint`, `npm run build`, `npm run dev`, check http://localhost:3000/hr/.
Run 2 needs no new branch. Only when the whole page is right: push the branch and merge it into
`main` (that publishes it).
