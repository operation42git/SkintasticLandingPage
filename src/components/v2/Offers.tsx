"use client";

import { useTranslations } from "next-intl";
import { confirmedCode } from "@/config/booking";
import { OFFERS_IMAGE_V2 } from "@/config/design";
import { daysInWords, hoursInWords, shortDate, studiosInWords, type OfferWindowV2 } from "@/config/offers-v2";
import { BookButton } from "@/components/ui/BookButton";

function Clock() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

/** Povoljniji termini: one linen band (text, image, rows); hidden while there is no offer. */
export function Offers({ offers }: { offers: OfferWindowV2[] }) {
  const t = useTranslations("v2.offers");
  // Day names, "Oba studija" and " i " are shared with the current design's offers (offPeak.*).
  const words = useTranslations("offPeak");
  if (!offers.length) return null;
  const one = offers.length === 1;
  const short = words.raw("weekdaysShort") as string[];
  const and = words("and");

  return (
    <section
      className={`ob${OFFERS_IMAGE_V2 ? "" : " noimg"}`}
      id="v2-povoljniji"
      style={OFFERS_IMAGE_V2 ? ({ "--ob-img": `url(${OFFERS_IMAGE_V2})` } as React.CSSProperties) : undefined}
    >
      <div className="obw">
        <div className="otx">
          <span className="k">{t("label")}</span>
          <h2>
            {t("title")} <em>{t("titleItalic")}</em>
          </h2>
          <p>{t("text")}</p>
        </div>
        <div className="oimg" role="img" aria-label={t("imageAlt")} />
        <div className="orows">
          {offers.map((offer) => (
            <BookButton
              key={`${offer.name}-${offer.percent}`}
              usluga={confirmedCode(offer.serviceCode ?? undefined)}
              centar={offer.locations.length === 1 ? offer.locations[0].slug : undefined}
              className="of"
            >
              <div>
                <h3>{offer.name}</h3>
                {offer.ranges.map((range, index) => (
                  <div className="when" key={index}>
                    <Clock />
                    <b>
                      {daysInWords(range.weekdays, short, and)} · {hoursInWords(range)}
                    </b>
                  </div>
                ))}
                <div className="wl">
                  {studiosInWords(offer.locations, words("bothStudios"), and)}
                  {offer.validUntil ? ` · ${t("until", { date: shortDate(offer.validUntil) })}` : ""}
                </div>
              </div>
              <span className="opc">
                <span className="pc">{t(one ? "upToOne" : "upTo", { percent: offer.percent })}</span>
                <span className="ar" aria-hidden="true">
                  →
                </span>
              </span>
            </BookButton>
          ))}
        </div>
      </div>
    </section>
  );
}
