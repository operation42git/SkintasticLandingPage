# Brief · landing: the studio's text corrections, and no empty space above the laser image on phones

> **Accepted by Ivan Tomić, 2026-10-25.** Written by the Skintastic spec conversation from the studio's
> corrections (Savka, sent to the person on 2026-10-24) and the person's phone screenshot.

## Touches

- `messages/hr.json`, `messages/en.json`: the keys named below only
- `src/components/sections/HowItWorksSection.tsx`: the two `basis-[…]` classes only

Changing any other file: stop and ask. End your report with the output of
`git diff --stat origin/main...HEAD`.

**Goal**
The page says what the studio actually does: how many treatments, the gaps between them, the yearly
refresh and the aftercare. On a phone, the laser image follows the three steps without a large empty
pink area.

**Decided** (the studio, through the person, 2026-10-24)
- **Number of treatments:** **8 to 10** treatments, not 6 to 8.
- **Gaps:** **4 weeks**, then **6 weeks**, then **8 weeks**. No "about" and no "sometimes": the studio
  always works to 4 weeks first and always reaches 8 weeks.
- **Refresh:** **once a year, one treatment**.
- **Aftercare:** added to the FAQ answer (text below).

**Values** (exact texts; HTML tags as in the current strings; the agent changes no other word)

| Key | hr | en |
|---|---|---|
| `how.steps.2.title` | 8 do 10 tretmana | 8 to 10 treatments |
| `how.steps.2.body` | U razmaku od 4, zatim 6, pa 8 tjedana, jer laser djeluje na dlačice u fazi rasta. Plaćaš samo pojedinačni tretman. | 4 weeks apart, then 6, then 8 weeks, because the laser acts on hairs in the growth phase. You pay only for each treatment. |
| `how.steps.3.body` | Bez brijanja i depilacije. Jednom godišnje jedan tretman osvježavanja. | No shaving and no waxing. One refresh treatment once a year. |
| `services.body1` | replace only "6 do 8 tretmana" with "8 do 10 tretmana" | replace only "6 to 8 treatments" with "8 to 10 treatments" |
| `faq.items[4].a[0]` | replace only `<strong>6 do 8 tretmana</strong>` with `<strong>8 do 10 tretmana</strong>` | replace only `<strong>6 to 8 treatments</strong>` with `<strong>8 to 10 treatments</strong>` |
| `faq.items[4].a[1]` | `<strong>Koliki je idealan razmak između laserskih tretmana?</strong><br>Prvi tretmani provode se u razmaku od <strong>4 tjedna</strong>. U ovoj fazi laser posebno učinkovito djeluje na dlačice u njihovoj aktivnoj fazi rasta. Zatim se razmak produljuje na <strong>6 tjedana</strong>, a potom na <strong>8 tjedana</strong>.<br>Cilj skintastica je postići trajno glatku kožu uz što manje tretmana – učinkovito, nježno za kožu i prilagođeno baš tebi.` | `<strong>What is the ideal gap between laser treatments?</strong><br>The first treatments are <strong>4 weeks</strong> apart. In this phase the laser is especially effective on hairs in their active growth phase. The gap then grows to <strong>6 weeks</strong>, and after that to <strong>8 weeks</strong>.<br>skintastic's aim is lastingly smooth skin with as few treatments as possible – effective, gentle on the skin and matched to you.` |
| `faq.items[4].a[3]` | keep the first two sentences; replace the last sentence ("Kako bi rezultat ostao … osvježavanja.") with: Kako bi rezultat ostao dugotrajno glatka koža, preporučujemo <strong>jednom godišnje jedan tretman osvježavanja</strong>. | keep the first two sentences; replace the last ("So that the result stays … needs.") with: So that the result stays lastingly smooth skin, we recommend <strong>one refresh treatment once a year</strong>. |
| `faq.items[2].a` | keep the current text, then append `<br>` and: Prvih 24–48 sati izbjegavaj saunu, vruće kupke i intenzivno vježbanje. Izbjegavaj pilinge, retinol i agresivne kozmetičke proizvode dok se koža potpuno ne smiri. Kožu njeguj blagim, hidratantnim proizvodima. Ne čupaj dlačice pincetom ili voskom između tretmana. Brijanje je dopušteno kada se koža smiri. | keep the current text, then append `<br>` and: For the first 24–48 hours avoid saunas, hot baths and intense exercise. Avoid peels, retinol and harsh cosmetic products until the skin has fully calmed down. Care for the skin with mild, moisturising products. Do not pluck or wax hairs between treatments. Shaving is fine once the skin has calmed down. |

Notes on the texts:
- **Addressing the reader:** the studio wrote the aftercare as instructions ("izbjegavati"). It is put in
  the page's "ti" form, as everywhere else.
- **The aftercare's last sentence** arrived cut off ("Brijanje je dopušteno kada se koža smiri…"). It
  ends with a full stop here. Accepted with that ending (the person, 2026-10-25).

**The phone gap** (`HowItWorksSection.tsx`)
- **Cause:** the steps column has `basis-[520px]` and the laser column `basis-[480px]`. On phones the
  row is a column (`flex-col`), so a basis sets a **height**: the steps take at least 520 px and the
  image block at least 480 px, which leaves the empty pink area.
- **Fix:** make both bases desktop-only: `lg:basis-[520px]` and `lg:basis-[480px]`. On phones the
  blocks then take their own height, with the existing `gap-6`. Desktop is unchanged.

**Tests**
- `npm run build`, which must pass (`next-intl` parses both message files), and `npm run lint`.
- Screenshots of "Kako djeluje" at 390 px and 1440 px, before and after. At 390 px the image starts
  24 px under the third step; at 1440 px nothing moves.
- `grep -n "6 do 8\|6 to 8\|4–6\|4–5\|7–8\|ponekad\|otprilike" messages/*.json` returns nothing.

**Done when**
1. **Texts:** every row of the Values table is in both files, word for word. Listed.
2. **Phones:** no empty area above the laser image at 390 px. Shown.
3. **Desktop:** unchanged at 1440 px. Shown.
4. **The diff:** lists only the Touches paths. Listed.

**Out of scope**
- The other sections' texts, the legal pages, prices and offers.
- The discount terms on the landing page: the person and the spec conversation analyse those next.

**Estimate** One hour.
