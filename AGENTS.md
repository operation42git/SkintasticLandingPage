# Agents working on the Skintastic landing page

This repository is the public landing page (Next.js 15, static export to `out/`, `next-intl`,
Tailwind 4). The booking itself lives in the separate Skintastic app (`app.{domain}`); this page only
links to it.

## Work comes from a brief

- Every change is described by a brief in `docs/briefs/`. Build only what the brief you were given
  says. Do not start a brief whose header still says **Draft** or **Not accepted**; report that.
- **Touches** is a hard limit. Changing a file that is not listed there: stop and ask.
- **Values** come from the brief's Values table. You pick none of them: no invented prices, phone
  numbers, addresses, slugs, catalogue codes, reviews, ratings, URLs or texts. A value the brief needs
  that is missing or still marked "the person gives": stop and ask, listing every missing value at
  once rather than one per message.
- **Decided** is settled. Do not reopen it or offer alternatives in the code.
- **Out of scope** stays out, even when it looks like a quick fix (the legal pages, tracking tags,
  the booking app).
- When the brief and this file disagree, the brief wins; when the brief and the code disagree, stop
  and ask.

## How the code is organised

- Page sections: `src/components/sections/`; header, menu, footer: `src/components/layout/`.
- Settings the person edits (locations, hero offers, booking links) live in `src/config/`. Sections
  read them; they never copy them. One edit in `src/config/` must be enough to change the page.
- Every visible text is in `messages/{locale}.json` (`hr` first). No text in components.
- Environment: `NEXT_PUBLIC_BOOKING_URL` and `NEXT_PUBLIC_SITE_URL`. No domain name is written in
  the code. For local work, put them in `.env.local` (ignored by git):
  `NEXT_PUBLIC_SITE_URL=http://localhost:3000` and
  `NEXT_PUBLIC_BOOKING_URL=http://localhost:5173/book/f/test` (the Skintastic app's dev server, if it
  runs; otherwise any URL: the links are checked by their address, not by opening them).
- On `localhost` the `skt_consent` cookie is written without `Domain` and without `Secure`, so the
  banner can be tested locally; on any other host it uses the `Domain` from `NEXT_PUBLIC_SITE_URL`.
- The cookie choice is the `skt_consent` cookie (Skintastic ADR-0047), described in the brief. No
  third-party script or embed loads before consent.
- Match the existing style: function components, Tailwind classes, the existing `btn-gold` and
  colour tokens in `src/app/globals.css`. No new dependency in `package.json` unless the brief lists it.

## Checks

- While working: `npm run lint` and `npm run build` (both must pass).
- Before the report: serve `out/` locally (e.g. `npx serve out`) and check the brief's **Done when**
  items in a browser at 1440 px and 390 px, using Playwright through `npx` or the editor's browser
  tool, without adding it to `package.json`.

## Git

- Work on your own branch from `main`. Small commits with clear messages in English.
- Never push to `main`, never rewrite shared history.

## The report

End every run with:
1. each **Done when** item: done / not done, and how it was shown;
2. every value you still need, and every place you stopped;
3. the output of `git diff --stat origin/main...HEAD`.
