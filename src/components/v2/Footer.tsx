"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { facebookHref, instagramHref } from "@/config/contact";
import { externalHref, locationsOf } from "@/config/locations";
import { OPEN_CONSENT_EVENT } from "@/components/legal/CookieConsent";
import { withBrand } from "@/components/ui/Brand";

/** The only dark area; the existing footer texts and legal links. */
export function Footer() {
  const t = useTranslations("footer");
  const v2 = useTranslations("v2");
  const cookies = useTranslations("cookieConsent");
  const locale = useLocale();
  const year = new Date().getFullYear();
  const zagreb = [...locationsOf("bookable"), ...locationsOf("teaser")];
  // Instagram and Facebook only once their real addresses are in contact.ts.
  const socials = [
    { label: v2("contact.instagram"), href: instagramHref() },
    { label: v2("contact.facebook"), href: facebookHref() },
  ].filter((social): social is { label: string; href: string } => Boolean(social.href));

  return (
    <footer className="ft">
      <div className="wrap">
        <div className="fgr">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logos/logo-full-dark.svg" alt={v2("logoAlt")} />
            <p>{t("tagline")}</p>
          </div>
          <div>
            <b>{t("zagreb")}</b>
            {zagreb.map((location) => (
              <a key={location.id} href="#v2-lokacije">
                {location.name}
                {location.type === "teaser" ? ` · ${t("soon")}` : ""}
              </a>
            ))}
          </div>
          <div>
            <b>{withBrand(t("world"))}</b>
            {locationsOf("external").map((location) => {
              const href = externalHref(location);
              return href ? (
                <a key={location.id} href={href} target="_blank" rel="noopener noreferrer">
                  {location.name} ↗
                </a>
              ) : (
                <span key={location.id} className="row">
                  {location.name}
                </span>
              );
            })}
          </div>
          <div>
            <b>{t("legal")}</b>
            <Link href={`/${locale}/datenschutz`}>{t("privacyPolicy")}</Link>
            <Link href={`/${locale}/impressum`}>{t("imprint")}</Link>
            <button
              type="button"
              className="row"
              style={{ background: "none", border: 0, padding: 0, color: "inherit", font: "inherit", cursor: "pointer" }}
              onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
            >
              {cookies("reopenLabel")}
            </button>
          </div>
        </div>
        {socials.length ? (
          <p className="soc">
            {socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                {social.label} ↗
              </a>
            ))}
          </p>
        ) : null}
        <p className="cp">{t("copyright", { year, company: t("company") })}</p>
      </div>
    </footer>
  );
}
