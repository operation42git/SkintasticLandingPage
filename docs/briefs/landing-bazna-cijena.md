# Landing: prices and bazna cijena from the app (option A)

Croatian rules from 17 Nov 2026: every retail price shown to consumers needs its bazna cijena (the price on 10 Sept 2026,
or the date the service was introduced) next to it. Ivan, 2026-11-19: option A, read prices live from the app.
Struck-through "before" prices were removed in an earlier commit (78b7689).

## What reads from the app

`GET {BOOKING_URL origin}/api/public/v1/franchisees/{partner}/prices` (app #1093, ADR-0076), one read per page load,
in `src/config/prices.ts`; shown by `src/components/ui/Price.tsx`.

| Place | Code |
|---|---|
| v2 hero offer (Pazusi) | `alc_underarms` |
| v2 Izdvojeni tretmani: Trbuh, Prsa, Cijela leđa | `alc_abdomen`, `alc_chest`, `alc_back_full` |

Rules:
- **Across studios:** the lowest `priceCents` across studios (shown with "od" where the design has it), and that same
  studio's base (on a tie, the studio that has a base).
- **The line:** "Cijena na {d. m. yyyy.}: {amount}" / "Price on {d MMM yyyy}: {amount}" /
  "Preis am {dd.mm.yyyy}: {amount}" (`prices.base`).
- **Missing values:**
  - Base null: no line.
  - A code the app doesn't return, or a failed read: no price at all; never a typed one.

## The switch and the switch-over

`NEXT_PUBLIC_PRICES_FROM_APP=1` turns the app read on. Without it, every price is the typed text of the messages
(as today) and no line shows, so this code can be merged before the route is in production.

1. **Staging:** once the app route answers on staging, set `NEXT_PUBLIC_PRICES_FROM_APP=1` on the staging landing
   (DigitalOcean, build-time variable) and redeploy. Check:
   - the network tab shows one `/api/public/v1/franchisees/{partner}/prices` call with a 200;
   - the prices match the app;
   - lines show where a base is set.
2. **Production:** only when Ivan confirms the route is in production, set the same variable there and redeploy.
3. **Afterwards:** the typed prices in the messages can be removed in a later cleanup.

## The previous design

Retired on 2026-11-24 (Ivan): its six offer photos had prices printed in the image with no bazna cijena. Its sections,
offer cards, photos and messages are removed; the landing has one design.
