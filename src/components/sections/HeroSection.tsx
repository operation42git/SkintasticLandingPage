"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { confirmedCode } from "@/config/booking";
import { visibleHeroOffers, type HeroOffer } from "@/config/hero-offers";
import { joinNames, locationsOf } from "@/config/locations";
import { BookButton } from "@/components/ui/BookButton";

const VIDEOS = ["/images/hero/hero-video-1.mp4", "/images/hero/hero-video-3.mp4"];
const POSTER = "/images/hero/hero-video-1-poster.jpg";

function offerText(offer: HeroOffer, locale: string) {
  return locale === "en" ? offer.texts.en : offer.texts.hr;
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
  const centres = joinNames(
    locationsOf("bookable").map((location) => location.name),
    t("nameJoin"),
  );

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
    <section className="relative flex min-h-[620px] items-end overflow-hidden bg-[#1a1516] xl:min-h-[700px]">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-[35%_center] xl:object-center"
        muted
        playsInline
        autoPlay
        poster={POSTER}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(26,21,22,.15) 0%, rgba(26,21,22,0) 35%, rgba(26,21,22,.78) 100%)",
        }}
      />

      <div
        className="relative mx-auto w-full max-w-[1320px] px-5 pb-9 xl:px-6 xl:pb-[72px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
        }}
      >
        <div className="flex max-w-[680px] flex-col items-start gap-3.5 xl:gap-5">
          {copy ? (
            <span className="rounded-full bg-[#c9a96e] px-3 py-[5px] text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0C0C0C] xl:px-4 xl:py-1.5 xl:text-xs xl:tracking-[0.15em]">
              {copy.badge}
            </span>
          ) : null}

          <h1 className="text-[36px] font-extrabold leading-[1.08] text-white xl:text-[60px] xl:leading-[1.05]">
            {t("h1")}
          </h1>

          {copy ? (
            <p className="text-base leading-normal text-white/90 xl:text-xl">
              {copy.title} {copy.subtitle}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            {offer ? (
              <BookButton
                usluga={confirmedCode(offer.code)}
                className="hidden items-center justify-center rounded-full bg-white px-[34px] py-[18px] text-base font-extrabold uppercase tracking-[0.05em] text-[#0C0C0C] xl:inline-flex"
              >
                {t("book")}
              </BookButton>
            ) : null}
            <a
              href="#ponude"
              className="hidden rounded-full border-[1.5px] border-white/85 px-[30px] py-4 text-base font-bold uppercase tracking-[0.05em] text-white xl:inline-block"
            >
              {t("allOffers")}
            </a>
            <a href="#ponude" className="text-sm font-bold text-white xl:hidden">
              {t("allOffersMobile")}
            </a>
          </div>

          <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold text-white xl:gap-[22px] xl:pt-2 xl:text-sm">
            <span>{t("trust1")}</span>
            <span>{t("trust2")}</span>
            <span>{t("trustCentres", { names: centres })}</span>
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
                    index === offerIndex ? "h-2 w-8 bg-[#c9a96e]" : "h-2 w-2 bg-white/40"
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
