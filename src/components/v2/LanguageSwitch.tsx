"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

/**
 * HR / EN for the new design: the same routing as the current LanguageSwitcher (swap the locale segment,
 * remember the choice), restyled. The design choice (skt_design) is in storage, so it survives the switch.
 */
export function LanguageSwitch() {
  const t = useTranslations("v2.nav");
  const locale = useLocale();
  const pathname = usePathname();

  const pathFor = (target: string) => {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/");
  };

  return (
    <div className="lng" role="group" aria-label={t("language")}>
      {routing.locales.map((target) => (
        <Link
          key={target}
          href={pathFor(target)}
          hrefLang={target}
          aria-current={target === locale ? "true" : undefined}
          onClick={() => {
            try {
              localStorage.setItem("locale", target);
            } catch {
              // Storage blocked: the link still works.
            }
          }}
        >
          {target.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
