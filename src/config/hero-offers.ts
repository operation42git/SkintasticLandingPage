/**
 * The hero offer (landing-redesign row 2). Its texts are in messages under `v2.heroOffer.{id}`; `code` is the
 * booking app's catalogue code (?usluga= and the price read in config/prices.ts).
 */
export type HeroOffer = {
  id: string;
  code: string;
  validUntil?: string;
};

export const heroOffers: HeroOffer[] = [{ id: "pazusi", code: "alc_underarms", validUntil: "2026-12-31" }];

/** Offers past validUntil are not shown. An offer without a date stays. */
export function visibleHeroOffers(now = new Date()): HeroOffer[] {
  return heroOffers.filter((offer) => {
    if (!offer.validUntil) return true;
    const end = new Date(`${offer.validUntil}T23:59:59`);
    return now.getTime() <= end.getTime();
  });
}
