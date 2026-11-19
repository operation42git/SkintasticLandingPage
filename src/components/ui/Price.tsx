"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PRICES_FROM_APP, formatAmount, formatBaseDate, loadPrices, type PriceInfo } from "@/config/prices";

type Prices = Map<string, PriceInfo> | null;

/**
 * The app's prices (see config/prices.ts). `undefined` while reading or with the switch off; then null when the
 * read failed, else the map.
 */
export function usePrices(): Prices | undefined {
  const [prices, setPrices] = useState<Prices | undefined>(undefined);
  useEffect(() => {
    if (!PRICES_FROM_APP) return;
    let cancelled = false;
    loadPrices().then((loaded) => {
      if (!cancelled) setPrices(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return prices;
}

/**
 * A price by catalogue code. Switch off: `typed` (today's text). Switch on: the app's lowest price, or nothing
 * while reading and when the app doesn't return the code (never a typed price).
 */
export function usePrice(code: string): { show: boolean; text: string | null; info: PriceInfo | null } {
  const locale = useLocale();
  const prices = usePrices();
  if (!PRICES_FROM_APP) return { show: true, text: null, info: null };
  const info = prices?.get(code) ?? null;
  return { show: info !== null, text: info ? formatAmount(info.cents, locale) : null, info };
}

/** The amount: the app's when the switch is on, else `typed`. Renders nothing when the app has no price. */
export function PriceAmount({ code, typed }: { code: string; typed: ReactNode }) {
  const { show, text } = usePrice(code);
  if (!PRICES_FROM_APP) return <>{typed}</>;
  return show ? <>{text}</> : null;
}

/** "Cijena na 10. 9. 2026.: 99,90 €", only with the switch on and a base set; otherwise nothing. */
export function BaseLine({ code, className }: { code: string; className?: string }) {
  const locale = useLocale();
  const t = useTranslations("prices");
  const { info } = usePrice(code);
  if (!info || info.baseCents === null || info.baseDate === null) return null;
  return (
    <span className={className}>
      {t("base", { date: formatBaseDate(info.baseDate, locale), amount: formatAmount(info.baseCents, locale) })}
    </span>
  );
}
