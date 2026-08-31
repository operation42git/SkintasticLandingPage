"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

type SubItem = { label: string; href: string };

const MENU_ITEMS: { key: string; href: string; hasSub?: boolean }[] = [
  { key: "offers", href: "#offers", hasSub: true },
  { key: "locations", href: "#locations", hasSub: true },
  { key: "booking", href: "#booking", hasSub: true },
  { key: "services", href: "#services" },
  { key: "technology", href: "#technology" },
  { key: "info", href: "#faq" },
  { key: "about", href: "#about", hasSub: true },
  { key: "contact", href: "#contact", hasSub: true },
];

export function OverlayMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [openKey, setOpenKey] = useState<string | null>(null);

  const resolveHref = (href: string) =>
    href.startsWith("#") ? href : `/${locale}/${href}`;

  useEffect(() => {
    if (!open) {
      setOpenKey(null);
      return;
    }
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
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="absolute inset-0 bg-[#1a1516]/45"
      />

      <aside className="absolute top-0 right-0 h-full w-[min(420px,86vw)] lg:w-[22vw] lg:min-w-[340px] bg-white shadow-2xl overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute top-5 right-6 text-[#1a1516] hover:opacity-50 transition-opacity"
        >
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <nav className="px-8 pt-24 pb-16">
          {MENU_ITEMS.map((item) => {
            const children = item.hasSub
              ? (t.raw(`submenu.${item.key}`) as SubItem[])
              : [];
            const isOpen = openKey === item.key;

            return (
              <div key={item.key} className="border-b border-[#e8e4de]">
                {item.hasSub ? (
                  <button
                    type="button"
                    onClick={() => setOpenKey(isOpen ? null : item.key)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-[15px] font-bold uppercase tracking-wide text-[#1a1516]">
                      {t(item.key)}
                    </span>
                    <span
                      className={`text-[#b8b0a8] text-xl font-light leading-none transition-transform ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                ) : (
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between py-4"
                  >
                    <span className="text-[15px] font-bold uppercase tracking-wide text-[#1a1516]">
                      {t(item.key)}
                    </span>
                  </a>
                )}

                {item.hasSub && isOpen && (
                  <ul className="pb-4 space-y-2.5">
                    {children.map((child) => (
                      <li key={child.label}>
                        <a
                          href={resolveHref(child.href)}
                          onClick={onClose}
                          className="block text-sm text-[#5a5050] hover:text-[#1a1516] transition-colors"
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
