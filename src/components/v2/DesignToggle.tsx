"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { chooseDesign, isDesignTester, type Design } from "@/config/design";

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
 * The header button that flips between the current and the new design, in both headers. It shows only in a
 * browser that opened a ?dizajn=novo link (a tester), never to ordinary visitors; ?dizajn=sada ends testing.
 * Rendered after mount, because the tester flag is in localStorage.
 */
export function DesignToggle({ to, className }: { to: Design; className?: string }) {
  const t = useTranslations("v2.switch");
  const [tester, setTester] = useState(false);
  useEffect(() => setTester(isDesignTester()), []);
  if (!tester) return null;
  const label = t(to === "novo" ? "toNew" : "toCurrent");
  return (
    <button type="button" className={className} aria-label={label} title={label} onClick={() => chooseDesign(to)}>
      <LayoutIcon />
    </button>
  );
}
