"use client";

import { useTranslations } from "next-intl";
import { contact } from "@/config/contact";
import { BookButton } from "@/components/ui/BookButton";
import { ChatIcon, PhoneIcon } from "./icons";
import { LanguageSwitch } from "./LanguageSwitch";

/**
 * Sticky on every width. Laptop and tablet: three links in the middle, HR / EN, WhatsApp and phone icons and
 * "Rezerviraj termin". Phone: the logo, HR / EN and the two icons; booking is in the bottom bar.
 */
export function Header() {
  const t = useTranslations("v2");
  const call = t("contact.callCta", { phone: contact.phoneDisplay });
  return (
    <div className="hdw">
      <header className="wrap hd">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logos/logo-full-dark.svg" alt={t("logoAlt")} />
        <nav aria-label={t("nav.menu")}>
          <a href="#v2-tretmani">{t("nav.treatments")}</a>
          <a href="#v2-lokacije">{t("nav.locations")}</a>
          <a href="#v2-pitanja">{t("nav.faq")}</a>
        </nav>
        <div className="hq">
          <LanguageSwitch />
          <a
            className="qi"
            href={contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("nav.whatsapp")}
            title={t("nav.whatsappTitle", { phone: contact.phoneDisplay })}
          >
            <ChatIcon />
          </a>
          <a className="qi" href={contact.phoneHref} aria-label={call} title={call}>
            <PhoneIcon />
          </a>
          <BookButton className="btn">{t("book")}</BookButton>
        </div>
      </header>
    </div>
  );
}
