"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { contact } from "@/config/contact";
import { BookButton } from "@/components/ui/BookButton";
import { MAIN_NAV, OverlayMenu } from "./OverlayMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileBookBar } from "./MobileBookBar";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

const bookClass =
  "hidden items-center justify-center rounded-full bg-[#0C0C0C] px-[26px] py-[13px] text-[14px] font-extrabold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90 xl:inline-flex";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-[#88c9cd] px-3 py-[5px] text-center text-[11px] font-extrabold uppercase leading-tight tracking-[0.05em] text-[#0C0C0C] xl:px-4 xl:py-1.5 xl:text-[13px] xl:font-bold xl:tracking-[0.06em]">
        {t("topBar")}
      </div>

      <header className="sticky top-0 z-50 h-[60px] border-b border-[#eee3dc] bg-[rgba(255,255,255,0.97)] xl:h-[76px]">
        <div className="mx-auto flex h-full max-w-[1320px] items-center gap-4 px-4 xl:gap-6 xl:px-6">
          <Link href={`/${locale}`} className="shrink-0">
            <Image
              src="/images/logos/logo-icon.svg"
              alt="skintastic"
              width={131}
              height={32}
              className="h-[26px] w-auto xl:h-8"
              priority
            />
          </Link>

          <nav
            aria-label={t("main")}
            className="hidden min-w-0 flex-1 items-center justify-center gap-[26px] xl:flex"
          >
            {MAIN_NAV.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="whitespace-nowrap text-[14px] font-semibold uppercase tracking-[0.08em] text-[#0C0C0C] transition-colors hover:text-[#5a5050]"
              >
                {t(link.key)}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 xl:gap-4">
            <span className="px-1.5 text-[12px] font-bold uppercase xl:hidden">{locale.toUpperCase()}</span>

            <a
              href={contact.phoneHref}
              className="hidden items-center gap-1.5 text-[14px] font-semibold text-[#0C0C0C] xl:flex"
            >
              <PhoneIcon className="h-[18px] w-[18px]" />
              {contact.phoneDisplay}
            </a>

            <div className="hidden xl:block">
              <LanguageSwitcher />
            </div>

            <a
              href={contact.phoneHref}
              aria-label={`${t("call")} ${contact.phoneDisplay}`}
              className="flex h-11 w-11 items-center justify-center text-[#0C0C0C] xl:hidden"
            >
              <PhoneIcon className="h-[22px] w-[22px]" />
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={t("menu")}
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center text-[#0C0C0C] xl:hidden"
            >
              <MenuIcon />
            </button>

            <BookButton className={bookClass}>{t("bookNow")}</BookButton>
          </div>
        </div>
      </header>

      <MobileBookBar />
      <OverlayMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
