"use client";

import { useTranslations } from "next-intl";
import { BookButton } from "@/components/ui/BookButton";

/** Sticky on laptop and tablet so "Rezerviraj termin" stays in view; the phone has the bottom bar instead. */
export function Header({ showOffers }: { showOffers: boolean }) {
  const t = useTranslations("v2");
  return (
    <div className="hdw">
      <header className="wrap hd">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logos/logo-full-dark.svg" alt={t("logoAlt")} />
        <nav aria-label={t("nav.menu")}>
          <a href="#v2-tretmani">{t("nav.treatments")}</a>
          {showOffers ? <a href="#v2-povoljniji">{t("nav.offers")}</a> : null}
          <a href="#v2-lokacije">{t("nav.locations")}</a>
          <a href="#v2-pitanja">{t("nav.faq")}</a>
          <a href="#v2-kontakt">{t("nav.contact")}</a>
        </nav>
        <BookButton className="btn">{t("book")}</BookButton>
      </header>
    </div>
  );
}
