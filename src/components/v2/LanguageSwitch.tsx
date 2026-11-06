"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

/** Each language in its own spelling; a new locale in routing needs a name here (e.g. de: "Deutsch"). */
const LANGUAGE_NAMES: Record<string, string> = { hr: "Hrvatski", en: "English", de: "Deutsch" };

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.6 3.5 5.4 3.5 8.5s-1.1 5.9-3.5 8.5c-2.4-2.6-3.5-5.4-3.5-8.5s1.1-5.9 3.5-8.5z" />
    </svg>
  );
}

/**
 * The language menu of the new design (Ivan, 2026-11-06): a globe and the current code ("HR ▾"); the menu
 * lists every locale in routing by its own name, so a third language only needs its locale and name. The same
 * routing as the current LanguageSwitcher (swap the locale segment, remember the choice); the design choice is
 * in storage, so it survives the switch. Closes on Escape, on a click outside and after a choice.
 */
export function LanguageSwitch() {
  const t = useTranslations("v2.nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pathFor = (target: string) => {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/");
  };

  return (
    <div className="lng" ref={root}>
      <button
        ref={button}
        type="button"
        className="lb"
        aria-expanded={open}
        aria-controls="v2-languages"
        aria-label={`${t("language")}: ${LANGUAGE_NAMES[locale] ?? locale}`}
        onClick={() => setOpen((value) => !value)}
      >
        <GlobeIcon />
        <span aria-hidden="true">{locale.toUpperCase()}</span>
        <span className="cv" aria-hidden="true" />
      </button>
      <ul id="v2-languages" className="lmenu" hidden={!open} aria-label={t("language")}>
        {routing.locales.map((target) => (
          <li key={target}>
            <Link
              href={pathFor(target)}
              hrefLang={target}
              lang={target}
              aria-current={target === locale ? "true" : undefined}
              onClick={() => {
                setOpen(false);
                try {
                  localStorage.setItem("locale", target);
                } catch {
                  // Storage blocked: the link still works.
                }
              }}
            >
              {LANGUAGE_NAMES[target] ?? target.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
