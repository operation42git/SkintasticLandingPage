"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { BookButton } from "@/components/ui/BookButton";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const MAIN_NAV = [
  { key: "offers", href: "#ponude" },
  { key: "how", href: "#kako" },
  { key: "locations", href: "#lokacije" },
  { key: "info", href: "#faq" },
  { key: "contact", href: "#kontakt" },
] as const;

export function OverlayMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("nav");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[260]">
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="absolute inset-0 bg-[#1a1516]/45"
      />

      <aside className="absolute top-0 right-0 h-full w-[min(420px,86vw)] overflow-y-auto bg-white shadow-2xl lg:w-[22vw] lg:min-w-[340px]">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute top-5 right-6 text-[#1a1516] transition-opacity hover:opacity-50"
        >
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <nav aria-label={t("main")} className="px-8 pt-24 pb-16">
          {MAIN_NAV.map((item) => (
            <div key={item.key} className="border-b border-[#e8e4de]">
              <a
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between py-4"
              >
                <span className="text-[15px] font-bold uppercase tracking-wide text-[#1a1516]">
                  {t(item.key)}
                </span>
              </a>
            </div>
          ))}

          <LanguageSwitcher className="pt-6" onNavigate={onClose} />

          <BookButton className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#0C0C0C] px-6 py-[13px] text-[14px] font-extrabold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90">
            {t("bookNow")}
          </BookButton>
        </nav>
      </aside>
    </div>
  );
}
