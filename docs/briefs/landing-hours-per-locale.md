# Brief · landing: opening hours per language

> **Draft, not accepted.** Written by the Skintastic spec conversation from Ivan Tomić's answer of 2026-11-03 (A: hours per language, both designs), after the landing-redesign build found that `hours` is one Croatian string shown on /en/ too.

## Touches

- `src/config/locations.ts` (`hours` becomes per locale)
- `src/components/sections/LocationsSection.tsx` and `src/components/sections/ContactSection.tsx` (the current design: read the locale's hours)
- `src/components/v2/Locations.tsx` (the v2 Locations: read the locale's hours)
- `src/app/[locale]/layout.tsx` only if its LocalBusiness JSON-LD reads `hours` (keep it valid; see Values)
- tests, if any cover these sections

Changing any other file: stop and ask. End your report with `git diff --stat origin/main...HEAD`.

**Goal**
A visitor on /en/ reads the opening hours in English, on both designs; /hr/ is unchanged.

**Values**

| Field | Allowed values |
|---|---|
| `hours` | `{ hr: string; en: string }` per location. A bracket placeholder stays a placeholder in both. |
| Zapad | hr "Pon–Sub 8:00–20:00 · Ned zatvoreno"; en "Mon–Sat 8:00–20:00 · Sun closed" |
| Istok | hr "[RADNO VRIJEME]"; en "[OPENING HOURS]" (still needed from Ivan) |
| Jug and the external locations | empty hours stay `{ hr: "", en: "" }`, and nothing shows |
| sections | each reads `hours[locale]` (a missing locale falls back to `hr`) and shows the line only when that text is non-empty |
| JSON-LD | if `layout.tsx` emits `openingHours` from `hours`, it uses a machine form (`"Mo-Sa 08:00-20:00"`) from a separate field `openingHoursSpec` on the location, not the display text; if it doesn't use hours today, leave it |

**Tests**
- `npm run lint` and `npm run build` pass.
- /hr/ shows the Croatian hours and /en/ the English ones, in both designs, at 1440 and 390 px.
- The current design is otherwise unchanged.

**Done when**
1. **Shown:** /hr/ and /en/ hours in both designs.
2. **The diff** lists only the Touches paths.

**Estimate** About an hour.
