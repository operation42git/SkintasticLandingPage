"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { contact } from "@/config/contact";
import { BookButton } from "@/components/ui/BookButton";

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
    </svg>
  );
}

export function MobileBookBar() {
  const t = useTranslations("nav");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => {
      document.body.style.paddingBottom = mq.matches ? "84px" : "";
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.body.style.paddingBottom = "";
    };
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[210] flex gap-2.5 bg-white px-4 pb-5 pt-3 shadow-[0_-6px_20px_rgba(0,0,0,0.12)] lg:hidden">
      <a
        href={contact.whatsappHref}
        aria-label={t("whatsapp")}
        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#0C0C0C] text-[#0C0C0C]"
      >
        <WhatsAppIcon />
      </a>
      <BookButton className="inline-flex h-[52px] flex-1 items-center justify-center rounded-full bg-[#0C0C0C] text-[15px] font-extrabold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90">
        {t("bookNow")}
      </BookButton>
    </div>
  );
}
