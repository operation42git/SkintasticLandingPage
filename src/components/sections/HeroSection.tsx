"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const SLIDES = [
  {
    key: "slide1",
    video: "/images/hero/hero-video-1.mp4",
    poster: "/images/hero/hero-axilla-2026.jpg",
  },
  {
    key: "slide2",
    video: "/images/hero/hero-video-3.mp4",
    poster: "/images/hero/hero-axilla.jpg",
  },
];

const TEXT_SLIDES = ["slide1", "slide2"];

export function HeroSection() {
  const t = useTranslations("hero");
  const tRoot = useTranslations();
  const [current, setCurrent] = useState(0);
  const [textIdx, setTextIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
    setTextIdx((i) => (i + 1) % SLIDES.length);
  }, []);

  // Advance slide when video ends, or fall back to 8s timer
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = SLIDES[current].video;
    video.poster = SLIDES[current].poster;
    video.load();
    video.play().catch(() => {
      // Autoplay blocked — fallback timer
      const id = setTimeout(next, 8000);
      return () => clearTimeout(id);
    });

    const onEnded = () => next();
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [current, next]);

  const slideKey = TEXT_SLIDES[textIdx];

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-[#1a1516]">
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        autoPlay
        poster={SLIDES[0].poster}
      />

      {/* Light wash at the top so the dark header matches the original; dark fade at the bottom for copy */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0e8]/70 via-transparent to-[#1a1516]/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1516]/40 via-transparent to-transparent" />

      {/* Text content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-[140px]">
        <div className="max-w-2xl">
          <span
            key={slideKey + "-badge"}
            className="inline-block bg-[#c9a96e] text-white text-xs font-bold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full mb-4 animate-fade-in"
          >
            {t(`${slideKey}.badge`)}
          </span>
          <h1
            key={slideKey + "-title"}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 text-balance animate-fade-in"
          >
            {t(`${slideKey}.title`)}
          </h1>
          <p
            key={slideKey + "-sub"}
            className="text-base sm:text-lg text-white/80 mb-8 max-w-lg animate-fade-in"
          >
            {t(`${slideKey}.subtitle`)}
          </p>
          <a href="#offers" className="btn-gold text-sm px-6 py-3">
            {t(`${slideKey}.cta`)}
          </a>
        </div>

        {/* Slide dots */}
        <div className="flex items-center gap-2 mt-12">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i);
                setTextIdx(i);
              }}
              className={`rounded-full transition-all ${
                i === current
                  ? "w-8 h-2 bg-[#c9a96e]"
                  : "w-2 h-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-10 lg:flex flex-col items-center gap-2 text-white/50 hidden">
        <span className="text-xs tracking-widest uppercase">{tRoot("scroll")}</span>
        <div className="w-px h-12 bg-white/30 mt-1" />
      </div>
    </section>
  );
}
