# Cursor prompts · landing-zagreb

Two runs, one branch each, one PR each. Start run 2 after run 1 is merged into `main`.
Before either: you are on the run's branch from `main` (see the commands below), and `.env.local` has `NEXT_PUBLIC_SITE_URL=http://localhost:3000` and
`NEXT_PUBLIC_BOOKING_URL` (see AGENTS.md).

The mockup is in the repo: `docs/briefs/landing-zagreb/mockup/`. No screenshots needed.

## Run 1 · foundations

```
Read AGENTS.md, then docs/briefs/landing-zagreb.md in full. You are on the branch
`cursor/landing-zagreb-1` (from main, .env.local set). Build only these parts of it:

- Build step 1: src/config/locations.ts, src/config/booking.ts, src/config/hero-offers.ts,
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
mobile bar, cookie, hr + en) is merged; you are on the branch
`cursor/landing-zagreb-2` (from main, .env.local set). Build the rest of the brief:

- Build steps 3 to 11 and the brief's Mockup section: hero (both videos always play; one hero offer from src/config/hero-offers.ts;
  rotation only with two or more), offers grid, locations and brand strip, services and technology
  shortened, reviews (real Zagreb reviews or hidden), the new ContactSection, footer, the removed
  sections (Quote, VideoLogo, Goethe, About, Certificates) and hero-video-2.mp4, compressed hero videos, metadata and JSON-LD.

A value still marked "the person gives" follows the brief's "Values not given yet" rule
(bracket placeholders, drafted texts listed for review). Read every value from src/config/ and messages/;
never copy one into a component. The mockup is docs/briefs/landing-zagreb/mockup/ (read its
README.md); the page must match desktop.html and the mobile boards, except the brief's Mockup section.

Run npm run lint and npm run build while working. Check every Done when item (1 to 10) in a browser
at 1440 px and 390 px on the built out/ folder. Commit on this branch; do not push. End with the
report from AGENTS.md, plus every placeholder left.
```

## Commands before each run (Cursor terminal)

```bash
git checkout main && git pull origin main
git checkout -b cursor/landing-zagreb-1      # run 2: cursor/landing-zagreb-2
npm install
# once: .env.local with
#   NEXT_PUBLIC_SITE_URL=http://localhost:3000
#   NEXT_PUBLIC_BOOKING_URL=http://localhost:5173/book/f/test
npm run build
```

After the run: `npm run dev`, check http://localhost:3000/hr/, then
`git push -u origin <branch>` and open a PR.
