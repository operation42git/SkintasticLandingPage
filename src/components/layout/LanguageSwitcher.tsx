"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = { hr: "HR", de: "DE" };

export function LanguageSwitcher({
  className = "",
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const locale = useLocale();
  const pathname = usePathname();

  // Swap the locale segment so the visitor stays on the page they are reading.
  const pathFor = (target: string) => {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/");
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {routing.locales.map((target) => {
        const isActive = target === locale;

        return (
          <Link
            key={target}
            href={pathFor(target)}
            hrefLang={target}
            aria-current={isActive ? "true" : undefined}
            onClick={() => {
              // Remembered by the root page so repeat visits skip detection.
              localStorage.setItem("locale", target);
              onNavigate?.();
            }}
            className={`text-[13px] font-bold uppercase tracking-[1.2px] transition-colors ${
              isActive
                ? "text-[#1a1516]"
                : "text-[#b8b0a8] hover:text-[#c9a96e]"
            }`}
          >
            {LABELS[target]}
          </Link>
        );
      })}
    </div>
  );
}
