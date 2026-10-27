# Brief · landing: "Povoljniji termini" as a rolling week with the discount in words

> **Not accepted yet** (the person accepts it before it is built). Written by the Skintastic spec conversation from the
> person's choices of 2026-10-26: option A on the mockup "words instead of colours, a rolling week from today", wording
> option A, and the console warning (option c of the staging review).

## Touches

- `src/components/sections/OffPeakSection.tsx` (the layout)
- `src/config/offpeak.ts` (the console warning only; the fetch and the checks stay)
- `messages/hr.json`, `messages/en.json` (the `offPeak` keys below and `hero.offPeak` only)
- the section's tests, if any

Changing any other file: stop and ask. End your report with `git diff --stat origin/main...HEAD`.

**Goal**
A visitor sees at a glance which of the next 7 days are cheaper and how, in words, starting today whatever the
weekday. The visitor knows they can also book any other time in the normal booking calendar. The page never
suggests the discount serves the studio ("mirniji termini").

**Decided** the person, 2026-10-26. The data is unchanged: the booking app's
`GET /api/public/locations/{slug}/offpeak-days` (Skintastic scheduling decision 236, ADR-0065), as `src/config/offpeak.ts`
reads it today.

**Values**

| Field | Allowed values |
|---|---|
| days shown | the **first 7** lines of the answer: today and the next 6 days, which is the off-peak horizon. Days 8–14 are not shown. There is no Mon–Sun grid, colour tiers or legend. |
| day card | the weekday short (the first card `offPeak.today` + weekday, e.g. "Danas · pet") and the date ("30.10."). Then: |
| · discounted (`status` open, `tier` ≠ regular) | a black pill "−10 %" (the percent the answer implies; today always 10) and the kind in words: `day` → `offPeak.kind.day`; `morning` → `offPeak.kind.morning` with `{until}` = `morningUntil`; `gap` → `offPeak.kind.gap` |
| · open, regular | no pill, no words |
| · `full` | `offPeak.cell.full` in grey, muted card |
| · `closed` | a light dashed outline, `offPeak.cell.closed` in grey |
| selection | the first discounted day is selected on load (else today); the selected card has a black 2 px border; a tap selects another card |
| detail under the cards | as today: the day's title, the kind, up to 3 example times, `exactNote`, and "Nastavi s ovim danom" (`continue` / `continueAt`) with the same link as today |
| phone (below `lg`) | the 7 cards in one row scrolling sideways, starting at the page's 16 px margin, the next card peeking in; desktop shows all 7 in one row |
| "other times" line | under the detail, above the terms: `offPeak.otherDays` with a link `offPeak.openCalendar` to `BOOKING_URL` with `?centar={selected studio slug}` and the campaign parameters, **no** `datum` |
| console warning | in `fetchOffpeakDays`, when the read fails (thrown fetch, non-OK status, malformed body): one `console.warn` per studio per page load, naming the URL and the reason (`network`, `status 403`, `malformed`). "No discounted day" is not a failure and logs nothing. The section stays hidden as today. |

**Messages** (set exactly; remove the keys that are no longer used: `offPeak.legend.*`, `offPeak.cell.day/morning/gap/regular`, `offPeak.weekdays` if unused)

| Key | hr | en |
|---|---|---|
| `hero.offPeak` | Odabrani termini −10 % → | Selected times −10 % → |
| `offPeak.lead` | <strong>Isti tretman, 10 % povoljnije</strong> – u označenim terminima u sljedećih 7 dana. | <strong>The same treatment, 10 % less</strong> – at the marked times in the next 7 days. |
| `offPeak.today` | Danas | Today |
| `offPeak.kind.day` | cijeli dan | all day |
| `offPeak.kind.morning` | do {until} | until {until} |
| `offPeak.kind.gap` | u rupama | in gaps |
| `offPeak.otherDays` | <strong>Ne odgovara ti nijedan od ovih dana?</strong> U kalendaru za rezervacije biraš bilo koji termin do 60 dana unaprijed – povoljniji termini su i ondje označeni s −10 %. | <strong>None of these days suit you?</strong> In the booking calendar you can choose any time up to 60 days ahead – the cheaper times are marked with −10 % there too. |
| `offPeak.openCalendar` | Otvori kalendar → | Open the calendar → |

`offPeak.cell.full` ("popunjeno"), `offPeak.cell.closed` ("zatvoreno") and the other existing keys stay. No visible text says
"mirni" or "mirniji" anywhere on the page (`grep -i mirn messages/*.json` returns nothing).

**Tests**
- `npm run build` and `npm run lint` pass.
- Screenshots of the section at 390 px and 1440 px with a fixture answer for a Friday: today discounted in the morning,
  Sat and Sun closed, Mon all day, Tue morning, Wed full, Thu morning. Also the same with the read failing (section hidden,
  one console warning per studio).

**Done when**
1. **Layout:** 7 cards from today, the discount in words, no legend. Shown at 390 and 1440 px.
2. **Wording:** the Messages table is in both files word for word, and the grep for "mirn" is empty. Listed.
3. **Other times:** the line and its link open booking for the selected studio without a day. Shown.
4. **Console:** a failed read logs one warning per studio; a studio with no discounted day logs nothing. Shown.
5. **The diff** lists only the Touches paths. Listed.

**Out of scope**
- The booking app (its read and its booking flow are built).
- Custom discount time windows (a backlog card, not decided).

**Estimate** Half a day.
