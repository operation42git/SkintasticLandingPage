export type HeroOfferText = {
  badge: string;
  title: string;
  subtitle: string;
  /** Joins the title and the price ("sada 19,90 €"). */
  priceLead: string;
  /** The hero button: says what booking opens with; " · {price}" is added after it. */
  cta: string;
};

export type HeroOffer = {
  id: string;
  code: string;
  validUntil?: string;
  /** Today's typed price, shown while prices are not read from the app (config/prices.ts). */
  typedPriceCents: number;
  texts: {
    hr: HeroOfferText;
    en: HeroOfferText;
    de?: HeroOfferText;
  };
};

export const heroOffers: HeroOffer[] = [
  {
    id: "pazusi",
    code: "alc_underarms",
    validUntil: "2026-12-31",
    typedPriceCents: 1990,
    texts: {
      hr: {
        badge: "Posebna ponuda",
        title: "Lasersko uklanjanje dlačica ispod pazuha",
        priceLead: "sada",
        subtitle: "za žene i muškarce · Ponuda vrijedi do 31.12.2026.",
        cta: "Rezerviraj pazuhe",
      },
      en: {
        badge: "Special offer",
        title: "Underarm laser hair removal",
        priceLead: "now",
        subtitle: "for women and men · Offer valid until 31.12.2026.",
        cta: "Book underarms",
      },
      de: {
        badge: "Sonderangebot",
        title: "Laser-Haarentfernung an den Achseln",
        priceLead: "jetzt",
        subtitle: "für Frauen und Männer · Angebot gültig bis 31.12.2026.",
        cta: "Achseln buchen",
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
