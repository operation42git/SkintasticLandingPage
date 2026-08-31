"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const OFFER_ITEMS = [
  { key: "axilla", image: "/images/services/axilla.jpg" },
  { key: "fullBody", image: "/images/services/full-body-woman.jpg" },
  { key: "faceNeck", image: "/images/services/face-neck.jpg" },
  { key: "superman", image: "/images/services/superman-chest.jpg" },
  { key: "legs", image: "/images/services/legs.jpg" },
  { key: "intimate", image: "/images/services/intimate.jpg" },
  { key: "beach", image: "/images/services/beach-package.jpg" },
];

const LOCATIONS = [
  {
    key: "zagreb",
    address: "Drage Gervaisa 1, 10090 Zagreb",
    url: "https://www.timify.com/hr-HR/profile/skintastic-zagreb",
  },
  {
    key: "wien",
    address: "Wien 1050, Kliebergasse 7",
    url: "https://www.timify.com/de/profile/skintastic-wien",
  },
  {
    key: "grazPuntigam",
    address: "Graz 8055, Triester Straße 369",
    url: "https://www.timify.com/de/profile/skintastic-graz-puntigam",
  },
  {
    key: "grazCity",
    address: "Graz 8010, Jakominiplatz 12",
    url: "https://www.timify.com/de/profile/skintastic-graz-city",
  },
  {
    key: "stuttgart",
    address: "Marktstraße 6, 70173 Stuttgart",
    url: "https://www.timify.com/de/profile/skintastic-stuttgart",
  },
] as const;

export function OffersSection() {
  const t = useTranslations("offers");
  const count = OFFER_ITEMS.length;

  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<(typeof LOCATIONS)[number] | null>(
    null,
  );
  const [paused, setPaused] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

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
    const id = window.setInterval(next, 5000);
    return () => window.clearInterval(id);
  }, [next, paused]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const radius = 2;

  return (
    <section
      id="offers"
      className="flex min-h-svh flex-col justify-center bg-[#EFD5CA] py-16 md:py-20"
    >
      <div id="booking" className="sr-only" />

      <div className="mx-auto max-w-[1600px] px-5 md:px-[50px]">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-2 text-[16px] uppercase tracking-[5px] text-[#0C0C0C]">
            {t("subtitle")}
          </p>
          <h2 className="font-script mb-4 text-[3.2rem] font-normal leading-none text-[#0C0C0C] md:text-[3.75rem]">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-[18px] leading-relaxed text-[#0C0C0C]">
            {t.rich("description", {
              bold: (chunks) => <strong className="font-bold">{chunks}</strong>,
            })}
          </p>
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (dx > 40) prev();
          if (dx < -40) next();
        }}
      >
        <div className="flex items-start justify-center gap-4 px-4 py-6 md:gap-6 lg:gap-8">
          {Array.from({ length: radius * 2 + 1 }, (_, slot) => {
            const offset = slot - radius;
            const index = (active + offset + count) % count;
            const item = OFFER_ITEMS[index];
            const isActive = offset === 0;
            const price = t(`items.${item.key}.price`);
            const oldPrice = t(`items.${item.key}.oldPrice`);

            return (
              <article
                key={`${item.key}-${offset}`}
                className={`w-[42vw] max-w-[240px] shrink-0 cursor-pointer text-center uppercase transition-all duration-300 ease-in sm:w-[28vw] sm:max-w-[260px] lg:w-[18vw] lg:max-w-[280px] ${
                  Math.abs(offset) > 1 ? "hidden lg:block" : ""
                } ${offset !== 0 && Math.abs(offset) === 1 ? "max-sm:hidden" : ""}`}
                style={{
                  opacity: isActive ? 1 : 0.3,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
                onClick={() => setActive(index)}
              >
                <div className="relative mb-5 aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={t(`items.${item.key}.title`)}
                    fill
                    className="object-cover"
                    sizes="280px"
                    priority={isActive}
                  />
                </div>

                <div className="px-1 text-[15px] leading-[1.55] text-[#0C0C0C]">
                  <p>
                    <strong className="font-bold">
                      {t(`items.${item.key}.title`)}
                    </strong>
                    <br />
                    {t(`items.${item.key}.desc`)}
                    <br />
                    <strong className="font-bold">
                      {t("now")} € {price}
                    </strong>
                    {oldPrice ? (
                      <>
                        <br />
                        <em className="font-normal not-italic">
                          {t("instead")} € {oldPrice}
                        </em>
                      </>
                    ) : null}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-8 text-[#0C0C0C]">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="flex h-10 w-10 items-center justify-center text-2xl leading-none"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="flex h-10 w-10 items-center justify-center text-2xl leading-none"
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

      <div className="mx-auto mt-4 flex max-w-[350px] flex-col items-stretch gap-4 px-5">
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            id="dropdownToggle"
            onClick={() => setOpen((v) => !v)}
            className="relative w-full rounded-full border border-[#E4BDB0] bg-[#f5e6de] px-8 py-3.5 text-center text-[16px] font-bold uppercase text-[#0C0C0C]"
          >
            {t("selectLocation")}
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs">
              ▼
            </span>
          </button>

          {open && (
            <ul className="absolute left-0 top-[52px] z-10 max-h-[200px] w-full overflow-y-auto rounded-md border border-[#ccc] bg-white">
              {LOCATIONS.map((loc) => (
                <li key={loc.key}>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-[14px] uppercase transition-colors hover:bg-[#eee]"
                    onClick={() => {
                      setSelected(loc);
                      setOpen(false);
                    }}
                  >
                    {loc.address}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <a
          href={selected?.url ?? "#"}
          target={selected ? "_blank" : undefined}
          rel={selected ? "noopener noreferrer" : undefined}
          onClick={(e) => {
            if (!selected) e.preventDefault();
          }}
          className="mx-auto inline-block rounded-full bg-white px-8 py-3.5 text-center text-[16px] font-bold uppercase text-[#0C0C0C] transition-opacity"
          style={{ opacity: selected ? 1 : 0.5 }}
        >
          {t("allCentres")}
        </a>
      </div>
    </section>
  );
}
