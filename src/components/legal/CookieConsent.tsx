"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { consentCookieDomain } from "@/config/booking";

/**
 * The cookie banner (brief consent-banner-v2, Ivan 2026-11-27; Skintastic scheduling decision 336).
 * First layer: a card at the bottom right (computer) or a bottom sheet (phone) that does not block the page and stays
 * until a choice: "Prihvati sve" (filled, first) and "Odbij neobavezne" (outlined, the same size), "Postavke" a link.
 * The settings window: Nužni (always on), Analitika, Oglasi, nothing pre-ticked.
 * The choice is the shared `skt_consent` cookie (Skintastic ADR-0047), unchanged: `v1.1.{analytics}.{marketing}.{date}`,
 * 180 days, so a choice made with the earlier wording stays valid and nobody is asked again.
 */

type Choice = { analytics: boolean; ads: boolean };

const COOKIE_NAME = "skt_consent";
export const OPEN_CONSENT_EVENT = "skt:open-consent";
const COOKIE_MAX_AGE = 180 * 24 * 60 * 60;
const NONE: Choice = { analytics: false, ads: false };
const ALL: Choice = { analytics: true, ads: true };

/** The brand teal for "Prihvati sve": white text on it is 4.67:1 (the lighter #88c9cd would be 1.9:1). */
const ACCEPT = "border-[#2f7f86] bg-[#2f7f86] text-white hover:bg-[#286c72] hover:border-[#286c72]";
const OUTLINE = "border-[#1a1516] bg-white text-[#1a1516] hover:bg-[#f5f0e8]";
const BUTTON =
  "inline-flex min-h-11 flex-1 basis-0 items-center justify-center rounded-full border-[1.5px] px-4 py-2.5 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f7f86]";

function clearStoredConsent(): void {
  try {
    localStorage.removeItem("sk_consent");
    localStorage.removeItem("skt_consent");
  } catch {
    /* private mode */
  }
}

function todayStamp(date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  for (const part of document.cookie.split("; ")) {
    if (part.startsWith(prefix)) return decodeURIComponent(part.slice(prefix.length));
  }
  return null;
}

function readConsent(): Choice | null {
  const match = /^v1\.1\.([01])\.([01])\.(\d{4}-\d{2}-\d{2})$/.exec(readCookie(COOKIE_NAME) ?? "");
  if (!match) return null;
  return { analytics: match[1] === "1", ads: match[2] === "1" };
}

function writeConsent(choice: Choice): void {
  const parts = [`Path=/`, `Max-Age=${COOKIE_MAX_AGE}`, `SameSite=Lax`];
  if (!isLocalHost(window.location.hostname)) {
    parts.push(`Domain=${consentCookieDomain()}`, `Secure`);
  }
  const value = `v1.1.${choice.analytics ? 1 : 0}.${choice.ads ? 1 : 0}.${todayStamp()}`;
  document.cookie = `${COOKIE_NAME}=${value}; ${parts.join("; ")}`;
  clearStoredConsent();
}

/** On the phone the sheet sits above the page's sticky "Rezerviraj termin" bar, so it never covers it. */
function useBookingBarHeight(active: boolean): number {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!active) return;
    const measure = () => {
      const bar = document.querySelector<HTMLElement>(".v2 .sticky");
      const visible = bar && getComputedStyle(bar).display !== "none";
      setHeight(visible ? bar.getBoundingClientRect().height : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);
  return height;
}

function Switch({ checked, label, onToggle }: { checked: boolean; label: string; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={`relative h-[26px] w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f7f86] ${
        checked ? "bg-[#2f7f86]" : "bg-[#ccc7c0]"
      }`}
    >
      <span
        className={`absolute left-[3px] top-[3px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[18px]" : ""
        }`}
      />
    </button>
  );
}

export function CookieConsent() {
  const t = useTranslations("cookieConsent");
  // "card": the first layer; "settings": the window; null: closed.
  const [view, setView] = useState<"card" | "settings" | null>(null);
  const [hasChoice, setHasChoice] = useState(false);
  const [pending, setPending] = useState<Choice>(NONE);
  const firstButton = useRef<HTMLButtonElement>(null);
  const barHeight = useBookingBarHeight(view === "card");

  useEffect(() => {
    clearStoredConsent();
    const stored = readConsent();
    if (stored) {
      setPending(stored);
      setHasChoice(true);
    } else {
      setView("card");
    }
  }, []);

  const commit = useCallback((choice: Choice) => {
    writeConsent(choice);
    setPending(choice);
    setHasChoice(true);
    setView(null);
  }, []);

  const openSettings = useCallback(() => {
    setPending(readConsent() ?? NONE);
    setView("settings");
  }, []);

  // The footer's "Postavke kolačića" opens the window with the current choice.
  useEffect(() => {
    window.addEventListener(OPEN_CONSENT_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, openSettings);
  }, [openSettings]);

  // The window: page scroll locked, focus on its first button, Escape goes back (to the card until a choice).
  useEffect(() => {
    if (view !== "settings") return;
    document.body.style.overflow = "hidden";
    firstButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setView(hasChoice ? null : "card");
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [view, hasChoice]);

  if (view === "card") {
    return (
      <section
        aria-labelledby="cc-title"
        className="fixed inset-x-0 bottom-0 z-[300] rounded-t-[18px] border border-b-0 border-[#e8e4de] bg-white p-5 text-[#1a1516] shadow-[0_-8px_30px_rgba(0,0,0,0.16)] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[440px] sm:rounded-2xl sm:border-b sm:shadow-[0_14px_40px_rgba(0,0,0,0.18)]"
        style={{ bottom: barHeight ? `${barHeight}px` : undefined }}
      >
        <h2 id="cc-title" className="mb-1.5 text-base font-bold">
          {t("title")}
        </h2>
        <p className="mb-4 text-[14.5px] leading-relaxed text-[#5a5050]">{t("text")}</p>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button type="button" onClick={() => commit(ALL)} className={`${BUTTON} ${ACCEPT}`}>
            {t("btnAcceptAll")}
          </button>
          <button type="button" onClick={() => commit(NONE)} className={`${BUTTON} ${OUTLINE}`}>
            {t("btnRejectOptional")}
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3">
          <button
            type="button"
            onClick={openSettings}
            className="py-1.5 text-sm text-[#1a1516] underline underline-offset-2"
          >
            {t("btnSettings")}
          </button>
          <span className="text-xs text-[#5a5050]">{t("note")}</span>
        </div>
      </section>
    );
  }

  if (view === "settings") {
    const categories = [
      { key: "analytics" as const, title: t("categories.analytics.title"), desc: t("categories.analytics.desc") },
      { key: "ads" as const, title: t("categories.ads.title"), desc: t("categories.ads.desc") },
    ];
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[rgba(20,18,16,0.45)] p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cc-settings-title"
          className="max-h-[90dvh] w-full max-w-[560px] overflow-y-auto rounded-[18px] bg-white p-6 text-[#1a1516] shadow-2xl"
        >
          <h2 id="cc-settings-title" className="mb-1.5 text-lg font-bold">
            {t("settingsTitle")}
          </h2>
          <p className="mb-3 text-[14.5px] text-[#5a5050]">{t("settingsIntro")}</p>

          <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-t border-[#e8e4de] py-3">
            <b className="text-[15px]">{t("categories.necessary.title")}</b>
            <span className="self-center text-xs font-semibold uppercase tracking-wider text-[#5a5050]">
              {t("alwaysActive")}
            </span>
            <small className="text-[13.5px] leading-snug text-[#5a5050]">{t("categories.necessary.desc")}</small>
          </div>
          {categories.map((cat) => (
            <div key={cat.key} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-t border-[#e8e4de] py-3">
              <b className="text-[15px]">{cat.title}</b>
              <span className="row-span-2 self-center">
                <Switch
                  checked={pending[cat.key]}
                  label={cat.title}
                  onToggle={() => setPending((prev) => ({ ...prev, [cat.key]: !prev[cat.key] }))}
                />
              </span>
              <small className="text-[13.5px] leading-snug text-[#5a5050]">{cat.desc}</small>
            </div>
          ))}

          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <button ref={firstButton} type="button" onClick={() => commit(ALL)} className={`${BUTTON} ${ACCEPT}`}>
              {t("btnAcceptAll")}
            </button>
            <button type="button" onClick={() => commit({ ...pending })} className={`${BUTTON} ${OUTLINE}`}>
              {t("btnSave")}
            </button>
            <button type="button" onClick={() => commit(NONE)} className={`${BUTTON} ${OUTLINE}`}>
              {t("btnReject")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
