"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { confirmedCode } from "@/config/booking";
import { visibleHeroOffers, type HeroOffer } from "@/config/hero-offers";
import { locationsOf } from "@/config/locations";
import { BookButton } from "@/components/ui/BookButton";

const VIDEOS = ["/images/hero/hero-video-1.mp4", "/images/hero/hero-video-3.mp4"];
const POSTER = "/images/hero/hero-video-1-poster.jpg";

function offerText(offer: HeroOffer, locale: string) {
  return locale === "en" ? offer.texts.en : offer.texts.hr;
}

function shortCentreNames(locale: string, joinWord: string) {
  return locationsOf("bookable")
    .map((location) => location.name.replace(/^Skintastic\s/, ""))
    .join(joinWord);
}

export function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const offers = visibleHeroOffers();
  const [videoIndex, setVideoIndex] = useState(0);
  const [offerIndex, setOfferIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const offer = offers[Math.min(offerIndex, Math.max(offers.length - 1, 0))];
  const copy = offer ? offerText(offer, locale) : null;
  const mobileCentres = shortCentreNames(locale, t("nameJoin"));

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = VIDEOS[videoIndex];
    video.load();
    video.play().catch(() => {});
    const onEnded = () => setVideoIndex((index) => (index + 1) % VIDEOS.length);
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [videoIndex]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (offers.length < 2 || paused || reduceMotion) return;
    const id = window.setInterval(() => {
      setOfferIndex((index) => (index + 1) % offers.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [offers.length, paused, reduceMotion]);

  return (
    <section className="bg-[#EFD5CA]">
      <div className="mx-auto flex max-w-[1440px] flex-col lg:min-h-[600px] lg:flex-row lg:items-stretch">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1a1516] lg:order-2 lg:aspect-auto lg:min-h-[600px] lg:flex-[1.3] lg:basis-[560px]">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            autoPlay
            poster={POSTER}
            aria-hidden
          />
        </div>

        <div
          className="flex flex-col items-start gap-1 px-5 py-3 pb-4 lg:order-1 lg:flex-1 lg:basis-[520px] lg:justify-center lg:gap-5 lg:px-12 lg:py-16 lg:pl-[max(24px,calc((min(100vw,1440px)-1320px)/2))] lg:pr-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
          }}
        >
          {copy ? (
            <span className="rounded-full bg-[#c9a96e] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#0C0C0C] lg:px-4 lg:py-1.5 lg:text-xs lg:tracking-[0.15em]">
              {copy.badge}
            </span>
          ) : null}

          <h1 className="text-[30px] font-extrabold leading-[1.1] text-[#0C0C0C] lg:text-[54px] lg:leading-[1.05]">
            {t("h1")}
          </h1>

          {copy ? (
            <p className="text-[15px] leading-[1.45] text-[#3d3434] lg:text-[19px] lg:leading-normal">
              {copy.title} {copy.subtitle}
            </p>
          ) : null}

          <div className="hidden flex-wrap items-center gap-3 lg:flex">
            {offer ? (
              <BookButton
                usluga={confirmedCode(offer.code)}
                className="inline-flex items-center justify-center rounded-full bg-[#0C0C0C] px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.05em] text-white"
              >
                {t("book")}
              </BookButton>
            ) : null}
            <a
              href="#ponude"
              className="rounded-full border-[1.5px] border-[#0C0C0C] px-7 py-[15px] text-[15px] font-bold uppercase tracking-[0.05em] text-[#0C0C0C]"
            >
              {t("allOffers")}
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 text-xs font-semibold text-[#0C0C0C] lg:hidden">
            <a href="#ponude" className="text-sm font-extrabold">
              {t("allOffersMobile")}
            </a>
            <span>{t("trustMobile", { centres: mobileCentres })}</span>
          </div>

          <div className="hidden flex-wrap gap-5 pt-1 text-sm font-semibold text-[#0C0C0C] lg:flex">
            <span>{t("trust1")}</span>
            <span>{t("trust2")}</span>
            <span>
              {locationsOf("bookable")
                .map((location) => location.name)
                .join(t("nameJoin"))}
              , Zagreb
            </span>
          </div>

          {offers.length > 1 ? (
            <div className="flex items-center gap-2" data-hero-dots>
              {offers.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={t("dot", { n: index + 1 })}
                  onClick={() => setOfferIndex(index)}
                  className={`rounded-full ${
                    index === offerIndex ? "h-2 w-8 bg-[#c9a96e]" : "h-2 w-2 bg-[#0C0C0C]/25"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
