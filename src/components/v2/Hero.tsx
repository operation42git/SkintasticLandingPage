"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { confirmedCode } from "@/config/booking";
import { HERO_VIDEO_V2 } from "@/config/design";
import { visibleHeroOffers } from "@/config/hero-offers";
import { BookButton } from "@/components/ui/BookButton";
import { BaseLine, PriceAmount, usePrice } from "@/components/ui/Price";

/** The hero's right side: the video, the poster alone for reduced motion, or a linen block until the file is given. */
function HeroMedia({ label }: { label: string }) {
  const { src, poster } = HERO_VIDEO_V2;
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!src) return <div className="ph ph-block" role="img" aria-label={label} />;
  return (
    <div className="ph" role="img" aria-label={label}>
      {motion ? (
        <video autoPlay muted loop playsInline poster={poster || undefined} aria-hidden="true">
          <source src={src} type="video/mp4" />
        </video>
      ) : poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" />
      ) : null}
    </div>
  );
}

/** The offer price (the app's when the switch is on) and its bazna cijena line; nothing without a price. */
function HeroPrice({ code, typed }: { code: string; typed: string }) {
  const { show } = usePrice(code);
  if (!show) return null;
  return (
    <div className="hpw">
      <div className="hp">
        <PriceAmount code={code} typed={typed} />
      </div>
      <BaseLine code={code} className="bz" />
    </div>
  );
}

export function Hero() {
  const t = useTranslations("v2");
  // The first offer still running, and only if the new design has texts for it.
  const offer = visibleHeroOffers()[0];
  const offerKey = offer ? `heroOffer.${offer.id}` : "";
  const hasOffer = offer ? t.has(`${offerKey}.price`) : false;
  const facts = t.raw("hero.facts") as string[];

  return (
    <div className="wrap">
      <section className="hero">
        <div className="tx">
          <span className="k">{t("hero.label")}</span>
          <h1>
            {t("hero.title")}
            <br />
            <em>{t("hero.titleItalic")}</em>
          </h1>
          <p className="sv">{t("hero.service")}</p>
          {offer && hasOffer ? (
            <div className="hof">
              <span className="k ko">{t(`${offerKey}.label`)}</span>
              <HeroPrice code={offer.code} typed={t(`${offerKey}.price`)} />
              <p className="hn">{t(`${offerKey}.note`)}</p>
              <div className="cta">
                <BookButton usluga={confirmedCode(offer.code)} className="btn">
                  {t(`${offerKey}.cta`)}
                </BookButton>
                <span className="until">{t(`${offerKey}.until`)}</span>
              </div>
            </div>
          ) : null}
          <ul className="trust">
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>
        <HeroMedia label={t("hero.videoAlt")} />
      </section>
    </div>
  );
}
