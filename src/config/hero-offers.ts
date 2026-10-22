export type HeroOfferText = {
  badge: string;
  title: string;
  subtitle: string;
};

export type HeroOffer = {
  id: string;
  code: string;
  validUntil?: string;
  texts: {
    hr: HeroOfferText;
    en: HeroOfferText;
  };
};

export const heroOffers: HeroOffer[] = [
  {
    id: "pazusi",
    code: "alc_underarms",
    validUntil: "2026-12-31",
    texts: {
      hr: {
        badge: "Posebna ponuda",
        title: "Lasersko uklanjanje dlačica ispod pazuha sada 19,90",
        subtitle: "za žene i muškarce · Ponuda vrijedi do 31.12.2026.",
      },
      en: {
        badge: "Special offer",
        title: "Underarm laser hair removal now 19,90",
        subtitle: "for women and men · Offer valid until 31.12.2026.",
      },
    },
  },
];

if (heroOffers.length < 1) {
  throw new Error("hero offers must not be empty");
}

/** Offers past validUntil are not shown. An offer without a date stays. */
export function visibleHeroOffers(now = new Date()): HeroOffer[] {
  return heroOffers.filter((offer) => {
    if (!offer.validUntil) return true;
    const end = new Date(`${offer.validUntil}T23:59:59`);
    return now.getTime() <= end.getTime();
  });
}
