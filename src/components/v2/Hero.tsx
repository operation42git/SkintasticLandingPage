"use client";

import { useTranslations } from "next-intl";
import { confirmedCode } from "@/config/booking";
import { visibleHeroOffers } from "@/config/hero-offers";
import { BookButton } from "@/components/ui/BookButton";

export function Hero() {
  const t = useTranslations("v2");
  // The first offer still running, and only if the new design has a line for it.
  const offer = visibleHeroOffers()[0];
  const offerKey = offer ? `heroOffer.${offer.id}` : "";
  const hasLine = offer ? t.has(offerKey) : false;
  const facts = t.raw("hero.facts") as string[];

  return (
    <div className="wrap">
      <section className="hero">
        <div className="tx">
          <h1>
            {t("hero.title")}
            <br />
            <em>{t("hero.titleItalic")}</em>
          </h1>
          <p className="sv">{t("hero.service")}</p>
          <div className="cta">
            <BookButton className="btn">{t("book")}</BookButton>
            <a className="lnk" href="#v2-tretmani">
              {t("hero.treatmentsLink")}
            </a>
          </div>
          {offer && hasLine ? (
            <BookButton usluga={confirmedCode(offer.code)} className="offr">
              {t.rich(offerKey, { strong: (chunks) => <strong>{chunks}</strong> })}
            </BookButton>
          ) : null}
          <ul className="trust">
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>
        <div className="ph ph-block" role="img" aria-label={t("hero.imageAlt")} />
      </section>
    </div>
  );
}
