"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { contact } from "@/config/contact";
import { BookButton } from "@/components/ui/BookButton";
import { ChatIcon, PhoneIcon } from "./icons";
import { LanguageSwitch } from "./LanguageSwitch";

/** The anchored sections in page order: the laptop links and the phone strip show the same three. */
const SECTIONS = [
  { id: "v2-tretmani", key: "treatments" },
  { id: "v2-lokacije", key: "locations" },
  { id: "v2-pitanja", key: "faq" },
] as const;

/** A section is active while it spans this line, in px from the viewport top (just under the sticky header). */
const ACTIVE_LINE = 140;

/** The id of the section in view, or "" between them. At the page end the last section that shows wins. */
function useActiveSection(): string {
  const [active, setActive] = useState("");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const els = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
      let next = "";
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top <= ACTIVE_LINE && r.bottom > ACTIVE_LINE) next = el.id;
      }
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atEnd) {
        const shown = els.filter((el) => el.getBoundingClientRect().top < window.innerHeight);
        if (shown.length) next = shown[shown.length - 1].id;
      }
      setActive(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return active;
}

/**
 * Sticky on every width. Laptop and tablet: three links in the middle (the one in view underlined), HR / EN,
 * WhatsApp and phone icons and "Rezerviraj termin". Phone: the logo, HR / EN and the two icons, and under them
 * the same three links as pills; booking is in the bottom bar.
 */
export function Header() {
  const t = useTranslations("v2");
  const call = t("contact.callCta", { phone: contact.phoneDisplay });
  const active = useActiveSection();
  const strip = useRef<HTMLElement>(null);

  // Keep the active pill in view inside the strip, without moving the page.
  useEffect(() => {
    const nav = strip.current;
    const pill = nav?.querySelector<HTMLElement>('a[aria-current="true"]');
    if (!nav || !pill || nav.scrollWidth <= nav.clientWidth) return;
    const left = pill.offsetLeft - nav.offsetLeft;
    if (left < nav.scrollLeft || left + pill.offsetWidth > nav.scrollLeft + nav.clientWidth) {
      nav.scrollTo({ left: left - 12, behavior: "smooth" });
    }
  }, [active]);

  const current = (id: string) => (active === id ? ({ "aria-current": "true" } as const) : {});

  return (
    <div className="hdw">
      <header className="wrap hd">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logos/logo-full-dark.svg" alt={t("logoAlt")} />
        <nav aria-label={t("nav.menu")}>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} {...current(s.id)}>
              {t(`nav.${s.key}`)}
            </a>
          ))}
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
      <nav className="sc" aria-label={t("nav.menu")} ref={strip}>
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} {...current(s.id)}>
            {t(`nav.${s.key}`)}
          </a>
        ))}
      </nav>
    </div>
  );
}
