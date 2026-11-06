"use client";

import { useTranslations } from "next-intl";
import { chooseDesign, type Design } from "@/config/design";

/** Two panels side by side: "another layout". */
export function LayoutIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M11 4.5v15" />
    </svg>
  );
}

/**
 * The header button that flips between the new and the previous design, in both headers, for every visitor
 * (Ivan, 2026-11-06: the landing is on staging, so the switch is always visible).
 */
export function DesignToggle({ to, className }: { to: Design; className?: string }) {
  const t = useTranslations("v2.switch");
  const label = t(to === "novo" ? "toNew" : "toCurrent");
  return (
    <button type="button" className={className} aria-label={label} title={label} onClick={() => chooseDesign(to)}>
      <LayoutIcon />
    </button>
  );
}
