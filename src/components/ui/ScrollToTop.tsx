"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function ScrollToTop() {
  const t = useTranslations();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t("scrollTop")}
      className={`fixed bottom-9 right-3.5 z-[200] rounded-[50px] bg-white px-5 py-2 text-[13.5px] font-medium text-[#0C0C0C] shadow-sm transition-opacity duration-300 hover:bg-[#f5f0e8] ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {t("scrollTop")}
    </button>
  );
}
