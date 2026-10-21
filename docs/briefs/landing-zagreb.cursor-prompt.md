# Cursor prompts · landing-zagreb

Two runs, one branch each, one PR each. Start run 2 after run 1 is merged into `main`.
Before either: the brief's header says **Accepted**, the values for that run are in the brief's
Values table, and `.env.local` has `NEXT_PUBLIC_SITE_URL=http://localhost:3000` and
`NEXT_PUBLIC_BOOKING_URL` (see AGENTS.md).

The canvas (claude.ai artifact) is private, so the agent cannot open it. Attach screenshots of the
boards `Desktop — new landing page` and the three mobile boards to the chat with each prompt.

## Run 1 · foundations

```
Read AGENTS.md, then docs/briefs/landing-zagreb.md in full. Build only these parts of it on a new
branch `cursor/landing-zagreb-1` from main:

- Build step 1: src/config/locations.ts, src/config/booking.ts, src/config/hero-offers.ts,
  src/components/ui/BookButton.tsx; CookieConsent.tsx writes and reads the skt_consent cookie.
- Build step 2: the header (5 items, phone, language switch, "Rezerviraj termin"), the overlay menu,
  and src/components/layout/MobileBookBar.tsx.
- Languages (Decided, O1): locales hr + en, messages/en.json, messages/de.json removed,
  request.ts, layout.tsx (locale type only), LanguageSwitcher.tsx, public/index.html.

Before writing code, list every value from the Values table that these parts need and is still
missing; if any is missing, stop and report the list. The attached screenshots show the canvas.

Run npm run lint and npm run build while working. Check Done when items 1 (header and mobile bar
buttons only), 5, 6 and 7 in a browser at 1440 px and 390 px. End with the report from AGENTS.md.
```

## Run 2 · sections and SEO

```
Read AGENTS.md, then docs/briefs/landing-zagreb.md in full. Run 1 (config, booking links, header,
mobile bar, cookie, hr + en) is merged; build on it, on a new branch `cursor/landing-zagreb-2` from
main. Build the rest of the brief:

- Build steps 3 to 10: hero (both videos always play; one hero offer from src/config/hero-offers.ts;
  rotation only with two or more), offers grid, locations and brand strip, services and technology
  shortened, reviews (real Zagreb reviews or hidden), the new ContactSection, footer, the removed
  sections and hero-video-2.mp4, compressed hero videos, metadata and JSON-LD.

Before writing code, list every value from the Values table these steps need and is still missing;
if any is missing, stop and report the list. Read every value from src/config/ and messages/;
never copy one into a component. The attached screenshots show the canvas.

Run npm run lint and npm run build while working. Check every Done when item (1 to 9) in a browser
at 1440 px and 390 px on the built out/ folder. End with the report from AGENTS.md.
```
