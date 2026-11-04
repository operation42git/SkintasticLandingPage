"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { buildBookingHref, confirmedCode } from "@/config/booking";
import {
  daysInWords,
  hoursInWords,
  loadOffers,
  setOffersShown,
  shortDate,
  studiosInWords,
  type OfferWindowV2,
} from "@/config/offers-v2";

function Clock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

/**
 * Povoljniji termini: the partner's time offers from the app (landing-offers-live), at most three, one row each,
 * every row linking to booking. Hidden while there is no offer or the read fails.
 */
export function OffPeakSection() {
  const t = useTranslations("offPeak");
  const locale = useLocale();
  const [offers, setOffers] = useState<OfferWindowV2[]>([]);
  const [pageSearch, setPageSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    setPageSearch(window.location.search);
    loadOffers(window.location.search, locale).then((loaded) => {
      if (cancelled) return;
      setOffers(loaded);
      setOffersShown(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (!offers.length) return null;
  const one = offers.length === 1;
  const short = t.raw("weekdaysShort") as string[];
  const and = t("and");

  return (
    <section
      id="povoljniji-termini"
      className="scroll-mt-[68px] bg-[#f5e6de] py-9 text-[#0C0C0C] lg:scroll-mt-[84px] lg:py-20"
    >
      <div className="mx-auto max-w-[1320px] px-4 lg:px-6">
        <div className="mb-6 text-center lg:mb-10">
          <p className="mb-1 text-[11px] uppercase tracking-[3px] lg:mb-2 lg:text-[15px] lg:tracking-[5px]">
            {t("eyebrow")}
          </p>
          <h2 className="font-script text-[44px] font-normal leading-none lg:text-[60px]">{t("title")}</h2>
          <p className="mx-auto mt-3 max-w-[600px] text-[15px] leading-relaxed text-[#3d3434] lg:text-base">
            {t.rich("lead", { strong: (chunks) => <strong className="text-[#0C0C0C]">{chunks}</strong> })}
          </p>
        </div>

        <div className="mx-auto flex max-w-[900px] flex-col gap-3">
          {offers.map((offer) => {
            const href = buildBookingHref(
              {
                usluga: confirmedCode(offer.serviceCode ?? undefined),
                centar: offer.locations.length === 1 ? offer.locations[0].slug : undefined,
              },
              pageSearch,
            );
            return (
              <a
                key={`${offer.name}-${offer.percent}`}
                href={href}
                className="flex flex-col gap-3 rounded-lg bg-white p-4 no-underline lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:p-6"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="text-lg font-extrabold lg:text-xl">{offer.name}</span>
                  {offer.ranges.map((range, index) => (
                    <span key={index} className="flex items-center gap-2 text-[15px] font-bold">
                      <Clock />
                      {daysInWords(range.weekdays, short, and)} · {hoursInWords(range)}
                    </span>
                  ))}
                  <span className="text-[13px] text-[#3d3434] lg:text-sm">
                    {studiosInWords(offer.locations, t("bothStudios"), and)}
                    {offer.validUntil ? ` · ${t("until", { date: shortDate(offer.validUntil) })}` : ""}
                  </span>
                </div>
                <span className="inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-[#0C0C0C] px-5 py-2.5 text-base font-extrabold text-white lg:self-center lg:text-lg">
                  {t(one ? "upToOne" : "upTo", { n: offer.percent })}
                  <span aria-hidden="true">→</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
