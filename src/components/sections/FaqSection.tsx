"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type FaqEntry = {
  q: string;
  a: string | string[];
};

function sanitizeFaqHtml(html: string) {
  return html.replace(/<(?!\/?(?:strong|em|br)\b)[^>]*>/gi, "");
}

function FaqHtml({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: sanitizeFaqHtml(html) }} />;
}

function FaqItem({ q, a, open, onToggle }: FaqEntry & { open: boolean; onToggle: () => void }) {
  const paragraphs = Array.isArray(a) ? a : [a];

  return (
    <div className="border-b border-[#e0d2ca] py-3.5 xl:py-5">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 text-left text-[15px] font-extrabold xl:text-[17px]"
      >
        <span>{q}</span>
        <span aria-hidden>{open ? "−" : "+"}</span>
      </button>
      {open ? (
        <div className="mt-2 space-y-3 xl:mt-3">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed text-[#3d3434] xl:text-base xl:leading-relaxed">
              <FaqHtml html={paragraph} />
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function FaqSection() {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqEntry[];
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="scroll-mt-[68px] bg-white xl:scroll-mt-[84px]">
      <div className="mx-auto max-w-[900px] px-4 py-9 xl:px-6 xl:py-20">
        <div className="mb-4 text-center xl:mb-9">
          <p className="mb-1 text-[11px] uppercase tracking-[3px] xl:mb-2 xl:text-[15px] xl:tracking-[5px]">
            {t("badge")}
          </p>
          <h2 className="font-script text-[40px] font-normal leading-none xl:text-[56px]">{t("title")}</h2>
        </div>
        <div className="border-t border-[#0C0C0C]">
          {items.map((item, index) => (
            <FaqItem
              key={item.q}
              q={item.q}
              a={item.a}
              open={openIndex === index}
              onToggle={() => setOpenIndex((current) => (current === index ? -1 : index))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
