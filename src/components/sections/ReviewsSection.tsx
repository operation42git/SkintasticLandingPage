"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

function Stars() {
  return (
    <p className="mt-3 text-center text-[18px] leading-none tracking-[0.35em] text-[#0C0C0C]">
      ★★★★★
    </p>
  );
}

export function ReviewsSection() {
  const t = useTranslations("reviews");
  const items = t.raw("items") as { headline: string; text: string; author: string }[];
  const count = items.length;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(
    () => setActive((i) => (i - 1 + count) % count),
    [count],
  );
  const next = useCallback(
    () => setActive((i) => (i + 1) % count),
    [count],
  );

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(next, 6000);
    return () => window.clearInterval(id);
  }, [next, paused]);

  const review = items[active];

  return (
    <section id="reviews" className="bg-[#E4BDB0] py-16 md:py-20">
      <div className="mx-auto max-w-[1500px] px-6 md:px-[50px]">
        <p className="mb-2 text-center text-[14px] uppercase tracking-[5px] text-[#0C0C0C]">
          {t("badge")}
        </p>
        <h2 className="font-script mb-8 text-center text-[clamp(2rem,1rem+2.5vw,3rem)] font-normal leading-none text-[#0C0C0C] md:mb-10">
          {t("title")}
        </h2>

        <div
          className="mx-auto w-full max-w-[720px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="border-y border-[#0C0C0C] px-6 py-8 md:px-8 md:py-10">
            <p className="mb-5 text-center text-[16px] font-bold uppercase tracking-wide text-[#0C0C0C] md:text-[18px]">
              {review.headline}
            </p>
            <p className="mx-auto mb-5 max-w-[36rem] text-center text-[17px] leading-relaxed text-[#0C0C0C]">
              „{review.text}“
            </p>
            <p className="text-center text-[15px] font-bold uppercase tracking-wide text-[#0C0C0C]">
              {review.author}
            </p>
            <Stars />
          </div>

          <div className="mt-8 flex flex-col items-center gap-5">
            <div className="flex items-center gap-10 text-[#0C0C0C]">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous"
                className="flex h-10 w-10 items-center justify-center text-3xl leading-none"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="flex h-10 w-10 items-center justify-center text-3xl leading-none"
              >
                ›
              </button>
            </div>
            <div className="h-[3px] w-48 overflow-hidden bg-white md:w-64">
              <div
                className="h-full bg-[#88C9CD] transition-all duration-300"
                style={{ width: `${((active + 1) / count) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
