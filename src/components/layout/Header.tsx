"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { OverlayMenu } from "./OverlayMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";

const NAV_LINKS = [
  { key: "offers", href: "#offers" },
  { key: "locations", href: "#locations" },
  { key: "booking", href: "#booking" },
  { key: "services", href: "#services" },
  { key: "technology", href: "#technology" },
  { key: "info", href: "#faq" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
];

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M3 12.2 12 16.7 21 12.2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M3 16.4 12 20.9 21 16.4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoPhase, setLogoPhase] = useState<0 | 1>(0);
  const [logoVisible, setLogoVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setLogoVisible(false);
      setTimeout(() => {
        setLogoPhase((p) => (p === 0 ? 1 : 0));
        setLogoVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 overflow-x-clip transition-colors duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <a
        href="#offers"
        className="flex min-h-[26px] flex-wrap items-center justify-center gap-x-1.5 bg-[#88c9cd] px-3 py-[3px] text-center"
      >
        <span className="text-[10px] font-black uppercase leading-tight text-white sm:text-[13px]">
          {t("topBarOffer")}
        </span>
        <span className="text-[10px] font-normal uppercase leading-tight text-white sm:text-[13px]">
          {t("topBarSite")}
        </span>
      </a>

      <div className="grid min-w-0 grid-cols-[1fr_auto_1fr] items-center h-[76px] px-6 lg:px-20">
        <Link href={`/${locale}`} className="flex items-center w-[150px] h-10 justify-self-start">
          <div
            className="transition-opacity duration-300"
            style={{ opacity: logoVisible ? 1 : 0 }}
          >
            {logoPhase === 0 ? (
              <Image
                src="/images/logos/logo-icon.svg"
                alt="skintastic"
                width={140}
                height={36}
                className="h-8 w-auto"
                priority
              />
            ) : (
              <Image
                src="/images/logos/laser-skin-body.png"
                alt="LASER SKIN BODY"
                width={96}
                height={22}
                className="h-[18px] w-auto"
                priority
              />
            )}
          </div>
        </Link>

        <nav className="hidden min-w-0 items-center justify-center gap-5 xl:flex 2xl:gap-[30px]">
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="whitespace-nowrap text-[15px] font-medium uppercase tracking-[1.2px] text-[#0C0C0C] transition-colors hover:text-[#c9a96e]"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 justify-self-end">
          <LanguageSwitcher />

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            className="text-[#1a1516] p-1 hover:text-[#c9a96e] transition-colors"
          >
            <LayersIcon className="w-8 h-8" />
          </button>
        </div>
      </div>

      <OverlayMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
    </>
  );
}
