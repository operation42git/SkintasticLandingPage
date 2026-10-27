"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { confirmedCode } from "@/config/booking";
import { BookButton } from "@/components/ui/BookButton";

const OFFER_ITEMS = [
  { key: "axilla", image: "/images/services/axilla.jpg" },
  { key: "fullBody", image: "/images/services/full-body-woman.jpg" },
  { key: "faceNeck", image: "/images/services/face-neck.jpg" },
  { key: "superman", image: "/images/services/superman-chest.jpg" },
  { key: "legs", image: "/images/services/legs.jpg" },
  { key: "beach", image: "/images/services/beach-package.jpg" },
];

function OfferCard({
  itemKey,
  image,
  compact,
}: {
  itemKey: string;
  image: string;
  compact?: boolean;
}) {
  const t = useTranslations("offers");
  const oldPrice = t(`items.${itemKey}.oldPrice`);

  return (
    <article className="flex flex-col bg-white">
      <div className={`relative w-full overflow-hidden ${compact ? "h-[150px]" : "aspect-[3/2]"}`}>
        <Image
          src={image}
          alt={t(`items.${itemKey}.title`)}
          fill
          className="object-cover"
          sizes={compact ? "250px" : "280px"}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5 lg:p-4">
        <h3 className="text-sm font-extrabold uppercase lg:text-[15px]">
          {t(`items.${itemKey}.title`)}
        </h3>
        <p className="flex-1 text-[13px] leading-snug text-[#3d3434] lg:text-sm lg:leading-[1.4]">
          {t(`items.${itemKey}.desc`)}
        </p>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-xl font-extrabold lg:text-[22px]">
            {t("amount", { amount: t(`items.${itemKey}.price`) })}
          </span>
          {oldPrice ? (
            <span className="text-[13px] text-[#5a5050] line-through lg:text-sm">
              {t("amount", { amount: oldPrice })}
            </span>
          ) : null}
        </div>
        <BookButton
          usluga={confirmedCode(t(`items.${itemKey}.code`))}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-[#0C0C0C] px-4 text-xs font-extrabold uppercase tracking-[0.05em] text-white lg:h-auto lg:py-3 lg:text-[13px]"
        >
          {t("book")}
        </BookButton>
      </div>
    </article>
  );
}

export function OffersSection() {
  const t = useTranslations("offers");
  const count = OFFER_ITEMS.length;
  const [start, setStart] = useState(0);
  const visible = [0, 1, 2, 3].map((offset) => OFFER_ITEMS[(start + offset) % count]);
  const from = start + 1;
  const to = ((start + 3) % count) + 1;

  return (
    <section id="ponude" className="scroll-mt-[68px] bg-[#EFD5CA] lg:scroll-mt-[84px]">
      <div className="mx-auto max-w-[1320px] px-0 py-9 lg:px-6 lg:py-20">
        <div className="mb-[18px] px-4 text-center lg:mb-11 lg:px-0">
          <p className="mb-1 text-[11px] uppercase tracking-[3px] lg:mb-2 lg:text-[15px] lg:tracking-[5px]">
            {t("subtitle")}
          </p>
          <h2 className="font-script text-[44px] font-normal leading-none lg:text-[60px]">
            {t("title")}
          </h2>
        </div>

        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1.5 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {OFFER_ITEMS.map((item) => (
            <div key={item.key} className="w-[250px] shrink-0 snap-start">
              <OfferCard itemKey={item.key} image={item.image} compact />
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-bold tracking-[0.08em] lg:hidden">
          {t("swipeHint", { count })}
        </p>

        <div className="hidden grid-cols-4 gap-5 lg:grid">
          {visible.map((item) => (
            <OfferCard key={`${item.key}-${start}`} itemKey={item.key} image={item.image} />
          ))}
        </div>
        <div className="mt-6 hidden items-center justify-center gap-5 lg:flex">
          <button
            type="button"
            aria-label={t("prev")}
            onClick={() => setStart((index) => (index - 1 + count) % count)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#0C0C0C] bg-white text-[22px]"
          >
            ‹
          </button>
          <p className="min-w-[130px] text-center text-[13px] font-bold tracking-[0.1em]">
            {t("range", { from, to, count })}
          </p>
          <button
            type="button"
            aria-label={t("next")}
            onClick={() => setStart((index) => (index + 1) % count)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#0C0C0C] bg-white text-[22px]"
          >
            ›
          </button>
        </div>

        <p className="mx-auto mt-4 max-w-[1320px] px-4 text-center text-base lg:mt-8 lg:px-0">
          {t.rich("calendar", {
            link: (chunks) => (
              <BookButton className="font-extrabold underline">{chunks}</BookButton>
            ),
          })}
        </p>
      </div>
    </section>
  );
}
