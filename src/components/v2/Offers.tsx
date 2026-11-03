"use client";

import { useTranslations } from "next-intl";
import { confirmedCode } from "@/config/booking";
import type { OfferWindowV2 } from "@/config/offers-v2";
import { BookButton } from "@/components/ui/BookButton";

function shortDate(date: string): string {
  return `${Number(date.slice(8, 10))}. ${Number(date.slice(5, 7))}.`;
}

function Clock() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

/** Povoljniji termini: hidden while there is no offer. */
export function Offers({ offers }: { offers: OfferWindowV2[] }) {
  const t = useTranslations("v2.offers");
  if (!offers.length) return null;
  const one = offers.length === 1;

  return (
    <section className={`offer${one ? " one" : ""}`} id="v2-povoljniji">
      <div className="ph ph-block" role="img" aria-label={t("imageAlt")} />
      <div className="tx">
        <span className="k">{t("label")}</span>
        <h2>
          {t("title")} <em>{t("titleItalic")}</em>
        </h2>
        <p className="lead">{t("text")}</p>
        {offers.map((offer) => (
          <BookButton key={offer.name} usluga={confirmedCode(offer.code)} className="of">
            <div>
              <h3>{offer.name}</h3>
              <div className="when">
                <Clock />
                <b>
                  {offer.days} · {offer.hours}
                </b>
                <span className="wl">
                  {offer.studio}
                  {offer.validUntil ? ` · ${t("until", { date: shortDate(offer.validUntil) })}` : ""}
                </span>
              </div>
            </div>
            <span className="pc">{t(one ? "upToOne" : "upTo", { percent: offer.percent })}</span>
          </BookButton>
        ))}
        <BookButton className="lnk">{t("check")}</BookButton>
      </div>
    </section>
  );
}
