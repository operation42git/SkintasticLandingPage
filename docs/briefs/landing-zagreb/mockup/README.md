# Mockup · landing-zagreb

Copied on 2026-10-22 from page **"2 · Condensed page"** of the canvas "Skintastic Zagreb landing mockup"
(https://claude.ai/artifact/DCgUZ5TcHXTgG1rv8daDpp, private). This copy is what the build follows.

| File | Board on the canvas |
|---|---|
| `desktop.html` | V2 · Desktop — condensed page (1440 px, every section in order) |
| `mobile.html` | V2 · Phone — the whole page (390 px, scrolls; header on top, book bar at the bottom) |
| `location-types.html` | Location types — spec (page 1; its example names are older, the brief's names win) |
| `notes.md` | The canvas's notes next to the boards |

The booking-app boards (booking step 1, booking flow) are the Skintastic app's work and are not copied.

How to read them:
- They are design files, not pages of this site: they do not render on their own (they need the
  canvas runtime). Read them as source: the structure, the texts, the inline styles (colours, sizes,
  spacing) and, in `desktop.html`, the offers list in the script at the end.
- `/_blob/…` addresses are the canvas's uploaded files. Use the matching file in `public/images/`:

  | `/_blob/` id starts with | File |
  |---|---|
  | `1fff2173` | `hero/hero-video-1.mp4` (the page plays `hero-video-1` and `hero-video-3` in turn) |
  | `296dc43b` | `logos/logo-icon.svg` |
  | `a52ba64b` | `logos/logo-full-dark.svg` |
  | `675efdee`, `b8bc2f53`, `9a971b0f`, `3da3d4ed`, `30d1962d`, `56ce5041` | `services/axilla.jpg`, `full-body-woman.jpg`, `face-neck.jpg`, `superman-chest.jpg`, `legs.jpg`, `beach-package.jpg` |
  | `b34e9814` | `technology/mediostar.jpg` |
  | `599ee819`, `f10cc428`, `619a8404`, `512747d1` | `icons/skintastic-icon-2.svg`, `-1.svg`, `-3.svg`, `-4.svg` |
  | `818a5ea5` | `about/frau-links.png` |
  | `a17c3202`, `2e7e70dc` | `certs/wifi.webp`, `certs/wko.webp` |
  | `074650e6` | `locations/zagreb.jpg` (Skintastic Istok) |
  | `9b0df8db` | `locations/zagreb-2.jpeg` (stands in for Skintastic Zapad until its photos are given) |
  | `f2417c2d`, `6f8caa4a`, `df7cde8d` | `locations/wien.jpg`, `graz-puntigam.jpg`, `stuttgart.jpg` |
  | `d845fb03` | `src/fonts/Lumios-Marker.woff2` (the script font, already loaded by the site) |

  Never download or link a `/_blob/` address.
- Text in brackets (`[E-MAIL]`, `[RADNO VRIJEME]`, `[OCJENA]`, `[KOD]`) is a placeholder, not a value.
- Where the brief's **Mockup** section or **Decided** says something else, the brief wins.
