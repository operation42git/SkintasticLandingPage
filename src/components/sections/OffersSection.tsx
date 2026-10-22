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
      <div className="flex flex-1 flex-col gap-1 p-3.5 xl:p-4">
        <h3 className="text-sm font-extrabold uppercase xl:text-[15px]">
          {t(`items.${itemKey}.title`)}
        </h3>
        <p className="flex-1 text-[13px] leading-snug text-[#3d3434] xl:text-sm xl:leading-[1.4]">
          {t(`items.${itemKey}.desc`)}
        </p>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-xl font-extrabold xl:text-[22px]">
            {t("amount", { amount: t(`items.${itemKey}.price`) })}
          </span>
          {oldPrice ? (
            <span className="text-[13px] text-[#5a5050] line-through xl:text-sm">
              {t("amount", { amount: oldPrice })}
            </span>
          ) : null}
        </div>
        <BookButton
          usluga={confirmedCode(t(`items.${itemKey}.code`))}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-[#0C0C0C] px-4 text-xs font-extrabold uppercase tracking-[0.05em] text-white xl:h-auto xl:py-3 xl:text-[13px]"
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
    <section id="ponude" className="scroll-mt-[68px] bg-[#EFD5CA] xl:scroll-mt-[84px]">
      <div className="mx-auto max-w-[1320px] px-0 py-9 xl:px-6 xl:py-20">
        <div className="mb-[18px] px-4 text-center xl:mb-11 xl:px-0">
          <p className="mb-1 text-[11px] uppercase tracking-[3px] xl:mb-2 xl:text-[15px] xl:tracking-[5px]">
            {t("subtitle")}
          </p>
          <h2 className="font-script text-[44px] font-normal leading-none xl:text-[60px]">
            {t("title")}
          </h2>
        </div>

        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1.5 [scrollbar-width:none] xl:hidden [&::-webkit-scrollbar]:hidden">
          {OFFER_ITEMS.map((item) => (
            <div key={item.key} className="w-[250px] shrink-0 snap-start">
              <OfferCard itemKey={item.key} image={item.image} compact />
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-bold tracking-[0.08em] xl:hidden">
          {t("swipeHint", { count })}
        </p>

        <div className="hidden items-center gap-4 xl:flex">
          <button
            type="button"
            aria-label={t("prev")}
            onClick={() => setStart((index) => (index - 1 + count) % count)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#0C0C0C] bg-white text-[22px]"
          >
            ‹
          </button>
          <div className="grid min-w-0 flex-1 grid-cols-4 gap-5">
            {visible.map((item) => (
              <OfferCard key={`${item.key}-${start}`} itemKey={item.key} image={item.image} />
            ))}
          </div>
          <button
            type="button"
            aria-label={t("next")}
            onClick={() => setStart((index) => (index + 1) % count)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#0C0C0C] bg-white text-[22px]"
          >
            ›
          </button>
        </div>
        <p className="mt-3.5 hidden text-center text-[13px] font-bold tracking-[0.1em] xl:block">
          {t("range", { from, to, count })}
        </p>

        <p className="mx-auto mt-4 max-w-[1320px] px-4 text-center text-base xl:mt-[18px] xl:px-0">
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
