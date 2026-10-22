"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { OPEN_CONSENT_EVENT } from "@/components/legal/CookieConsent";
import { contact, facebookHref, instagramHref } from "@/config/contact";
import { externalHref, locationsOf } from "@/config/locations";

export function Footer() {
  const t = useTranslations("footer");
  const cookies = useTranslations("cookieConsent");
  const locale = useLocale();
  const year = new Date().getFullYear();

  const social = [
    { label: t("instagram"), href: instagramHref(), value: contact.instagram },
    { label: t("facebook"), href: facebookHref(), value: contact.facebook },
    { label: t("whatsapp"), href: contact.whatsappHref, value: "" },
  ];

  return (
    <footer className="bg-[#1a1516] text-[#f5f0e8]">
      <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-x-[18px] gap-y-6 px-4 py-8 xl:grid-cols-4 xl:gap-10 xl:px-6 xl:py-14">
        <div className="col-span-2 flex flex-col gap-3.5 xl:col-span-1">
          <Image
            src="/images/logos/logo-full-dark.svg"
            alt="skintastic LASER SKIN & BODY"
            width={180}
            height={30}
            className="h-6 w-auto self-start brightness-0 invert xl:h-[30px]"
          />
          <p className="hidden text-sm text-[#d8cfc2] xl:block">{t("tagline")}</p>
          <p className="hidden text-sm text-[#d8cfc2] xl:block">
            {contact.phoneDisplay} · {contact.email}
          </p>
          <div className="flex gap-4 text-[13px] font-bold xl:text-sm">
            {social.map((item) =>
              item.href ? (
                <a key={item.label} href={item.href} className="text-[#f5f0e8]">
                  {item.label}
                </a>
              ) : (
                <span key={item.label} className="text-[#f5f0e8]">
                  {item.value}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-[13px] xl:gap-2 xl:text-sm">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#c9a96e] xl:text-[13px] xl:tracking-[0.14em]">
            {t("zagreb")}
          </span>
          {locationsOf("bookable").map((location) => (
            <a key={location.id} href="#lokacije" className="text-[#f5f0e8] no-underline">
              {location.name}
            </a>
          ))}
          {locationsOf("teaser").map((location) => (
            <span key={location.id} className="text-[#b9ae9f]">
              <span className="xl:hidden">{location.name.replace(/^Skintastic\s/, "")}</span>
              <span className="hidden xl:inline">{location.name}</span>
              {" · "}
              {t("soon")}
            </span>
          ))}
        </div>

        <div className="hidden flex-col gap-2 text-sm xl:flex">
          <span className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#c9a96e]">
            {t("world")}
          </span>
          {locationsOf("external").map((location) => {
            const href = externalHref(location);
            const label = href ? `${location.name} ↗` : `${location.name} · ${location.url}`;
            return href ? (
              <a key={location.id} href={href} className="text-[#f5f0e8] no-underline" target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ) : (
              <span key={location.id}>{label}</span>
            );
          })}
        </div>

        <div className="flex flex-col gap-1.5 text-[13px] xl:gap-2 xl:text-sm">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#c9a96e] xl:text-[13px] xl:tracking-[0.14em]">
            {t("legal")}
          </span>
          <Link href={`/${locale}/datenschutz`} className="text-[#f5f0e8] no-underline">
            {t("privacyPolicy")}
          </Link>
          <Link href={`/${locale}/impressum`} className="text-[#f5f0e8] no-underline">
            {t("imprint")}
          </Link>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
            className="w-fit text-left text-[#f5f0e8]"
          >
            {cookies("reopenLabel")}
          </button>
        </div>
      </div>

      <div className="border-t border-[rgba(255,255,255,0.12)] px-4 py-4 text-center text-[11px] text-[#b9ae9f] xl:px-6 xl:py-[18px] xl:text-xs">
        {t("copyright", { year, company: t("company") })}
      </div>
    </footer>
  );
}
