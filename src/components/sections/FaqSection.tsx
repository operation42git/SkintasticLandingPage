"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type FaqEntry = {
  q: string;
  a: string | string[];
};

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center"
      aria-hidden
    >
      <span
        className={`absolute h-[2px] w-[10px] bg-[#0C0C0C] transition-transform duration-200 ${
          open ? "rotate-0" : "-translate-x-[3px] -rotate-45"
        }`}
      />
      <span
        className={`absolute h-[2px] w-[10px] bg-[#0C0C0C] transition-transform duration-200 ${
          open ? "rotate-0" : "translate-x-[3px] rotate-45"
        }`}
      />
    </span>
  );
}

function sanitizeFaqHtml(html: string) {
  return html.replace(/<(?!\/?(?:strong|em|br)\b)[^>]*>/gi, "");
}

function FaqHtml({ html }: { html: string }) {
  return (
    <span dangerouslySetInnerHTML={{ __html: sanitizeFaqHtml(html) }} />
  );
}

function FaqItem({ q, a, index }: FaqEntry & { index: number }) {
  const [open, setOpen] = useState(false);
  const paragraphs = Array.isArray(a) ? a : [a];

  return (
    <div className="mb-8">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="grid w-full grid-cols-[1fr_50px] items-center gap-4 rounded-[50px] bg-[#EFD5CA] py-[10px] pl-8 pr-1 text-left text-[17px] font-bold leading-[1.3] text-[#0C0C0C] transition-colors duration-300 hover:bg-[#E4BDB0]"
      >
        <span>
          {index + 1}. {q}
        </span>
        <Chevron open={open} />
      </button>
      {open && (
        <div className="space-y-8 py-6 pl-8 pr-2">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="text-[16px] leading-[1.65] text-[#0C0C0C]"
            >
              <FaqHtml html={paragraph} />
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function FaqSection() {
  const t = useTranslations("faq");
  const offer = useTranslations("beachBanner");
  const items = t.raw("items") as FaqEntry[];

  return (
    <section id="faq" className="bg-white">
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        <div className="relative z-10 bg-white px-8 py-[3.38rem] md:px-12 lg:w-1/2 lg:px-16 xl:px-20">
          <div className="mx-auto w-full max-w-[650px]">
            <p className="mb-2 text-[14px] uppercase tracking-[5px] text-[#0C0C0C]">
              {t("badge")}
            </p>
            <h2 className="font-script mb-[3.38rem] text-[clamp(2rem,1rem+2.5vw,3rem)] font-normal leading-none text-[#0C0C0C]">
              {t("title")}
            </h2>
            <p className="mb-10 text-[18px] leading-relaxed text-[#0C0C0C]">
              {t.rich("subtitle", {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </p>
            <div>
              {items.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} index={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col bg-[#88C9CD] lg:w-1/2">
          <div className="relative h-[70vh] shrink-0 overflow-hidden lg:h-[1175px]">
            <Image
              src="/images/faq-beach.webp"
              alt=""
              fill
              className="object-cover object-[0%_25%]"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="bg-[#88C9CD] px-8 py-12 md:px-12 md:py-14 lg:px-14">
            <h3 className="mb-6 text-[clamp(1.8rem,3.2vw,2.6rem)] font-black uppercase leading-[1.2] text-[#0C0C0C]">
              {offer("title")} {offer("price")}
              <br />
              {offer("instead")} {offer("oldPrice")}
            </h3>
            <p className="mb-8 max-w-lg text-[18px] leading-relaxed text-[#0C0C0C]">
              {offer.rich("desc", {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </p>
            <a
              href="#locations"
              className="inline-block rounded-full bg-white px-8 py-3.5 text-[16px] font-bold uppercase text-[#0C0C0C]"
            >
              {offer("cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
