# Mockup notes (from the canvas, 2026-10-21)

1 · Header

Persistent black “Rezerviraj termin” button + phone number, visible on every scroll position. Nav trimmed from 8 to 5 items. Language switch HR / EN (matches the booking funnel, which ships hr + en).

2 · Hero

H1 now says what + where: “Laserska epilacija u Zagrebu”. Primary CTA goes straight to the booking funnel (1 click) instead of scrolling to #offers. Trust row under the CTA. Mobile shows the poster image instead of the 10 MB video.

3 · Offers

Static grid instead of an auto-rotating carousel. Every card has its own “Rezerviraj” that opens the funnel with that treatment preselected (needs a small ?usluga= param in the funnel). Location dropdown removed.

4 · Locations — Zagreb only

Each location has one of three states: BOOKABLE, TEASER (“Uskoro”, not bookable) or EXTERNAL (links to its own site). Every Rezerviraj opens booking step 1 directly — no popup on the landing page. A location card's button prefills the centre.

5 · Brand strip

Wien, Graz and Stuttgart stay visible as “skintastic obitelj — 5 centara u 3 zemlje” for brand strength, linking out to their own sites. They leave the booking dropdown, the menu and the SEO description.

6 · Reviews

Real Google reviews of the Zagreb centre, with rating and count. Shown as placeholders here — the current reviews are translated Austrian ones.

7 · Contact (new)

Address, map, opening hours, phone and a working WhatsApp link. Today “Kontakt” scrolls to a footer with none of these, and the WhatsApp link has no number.

8 · Removed

Sharon Stone quote, video-logo section, Goethe quote, carousel autoplay, the unused 19 MB hero video. Shorter page — price and trust come sooner.

9 · Booking flow prototype

Press Play. Toggle 1 vs 2 bookable centres at the top.

Step 1 gains one new field, Centar, above the treatments:
• header/hero → /book: centre empty if 2+ centres (auto-filled with 1)
• location card → /book?centar=…: centre prefilled
• offer card → /book?usluga=…: treatment prefilled
Steps 2–4 are the existing funnel, unchanged.

