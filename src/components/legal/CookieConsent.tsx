"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { consentCookieDomain } from "@/config/booking";
import { BANNER_VERSION, CONSENT_GENERATION, CONSENT_LOG_URL } from "@/config/consent";
import {
  CONSENT_UPDATED_EVENT,
  flushQueue,
  noConsent,
  readConsent,
  saveConsent,
  type Consent,
  type ConsentEnv,
  type SendEnv,
  type Store,
  type Via,
} from "@/lib/consent";

/**
 * The cookie banner (brief consent-banner-v2, Ivan 2026-11-27; Skintastic scheduling decision 336).
 * First layer: a card at the bottom right (computer) or a bottom sheet (phone) that does not block the page and stays
 * until a choice: "Prihvati sve" (filled, first) and "Odbij neobavezne" (outlined, the same size), "Postavke" a link.
 * The settings window: Nužni (always on), Analitika, Oglasi, nothing pre-ticked.
 * The choice is the shared `skt_consent` cookie (ADR-0047, ADR-0068 point 1, `v2` with its generation, 180 days) and
 * `skt_consent_id`; each choice that allows something or withdraws it is logged in the app (ADR-0068) through
 * src/lib/consent.ts, ported from the unmerged branch claude/cookie-consent-fixes. A choice made with the earlier wording
 * (`v1.1…`) stays valid, so nobody is asked again.
 */

type Choice = { analytics: boolean; ads: boolean };

export const OPEN_CONSENT_EVENT = "skt:open-consent";
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

function storage(): Store | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function sendEnv(): SendEnv {
  return {
    store: storage(),
    fetch: window.fetch.bind(window),
    logUrl: CONSENT_LOG_URL,
    keepalive: true,
    wait: (ms) => new Promise((resolve) => window.setTimeout(resolve, ms)),
    warn: (message) => console.warn(message),
  };
}

function browserEnv(locale: string): ConsentEnv {
  return {
    hostname: window.location.hostname,
    cookieDomain: consentCookieDomain(),
    readCookies: () => document.cookie,
    writeCookie: (cookie) => {
      document.cookie = cookie;
    },
    now: () => new Date(),
    random: window.crypto,
    generation: CONSENT_GENERATION,
    bannerVersion: BANNER_VERSION,
    locale,
    dispatch: (detail) => window.dispatchEvent(new CustomEvent(CONSENT_UPDATED_EVENT, { detail })),
    send: sendEnv(),
  };
}

/** The banner's two choices; functional and performance stay in the cookie and the log as reserved zeros. */
function toConsent(choice: Choice): Consent {
  return { ...noConsent(), analytics: choice.analytics, ads: choice.ads };
}

function stored(locale: string): Choice | null {
  const consent = readConsent(browserEnv(locale));
  return consent ? { analytics: consent.analytics, ads: consent.ads } : null;
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
  const locale = useLocale();
  // "card": the first layer; "settings": the window; null: closed.
  const [view, setView] = useState<"card" | "settings" | null>(null);
  const [hasChoice, setHasChoice] = useState(false);
  const [pending, setPending] = useState<Choice>(NONE);
  const firstButton = useRef<HTMLButtonElement>(null);
  const barHeight = useBookingBarHeight(view === "card");

  useEffect(() => {
    clearStoredConsent();
    const choice = stored(locale);
    if (choice) {
      setPending(choice);
      setHasChoice(true);
    } else {
      setView("card");
    }
    // Records the page could not send before (a closed tab, the app down) go now, oldest first.
    void flushQueue(sendEnv());
    // Read once on arrival; the banner keeps its own state after that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const commit = useCallback(
    (choice: Choice, via: Via) => {
      // The cookies, the event and the queue are done at once; the banner never waits for the send.
      void saveConsent(browserEnv(locale), toConsent(choice), via);
      setPending(choice);
      setHasChoice(true);
      setView(null);
    },
    [locale],
  );

  const openSettings = useCallback(() => {
    setPending(stored(locale) ?? NONE);
    setView("settings");
  }, [locale]);

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
          <button type="button" onClick={() => commit(ALL, "accept_all")} className={`${BUTTON} ${ACCEPT}`}>
            {t("btnAcceptAll")}
          </button>
          <button type="button" onClick={() => commit(NONE, "reject")} className={`${BUTTON} ${OUTLINE}`}>
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
            <button ref={firstButton} type="button" onClick={() => commit(ALL, "accept_all")} className={`${BUTTON} ${ACCEPT}`}>
              {t("btnAcceptAll")}
            </button>
            <button type="button" onClick={() => commit({ ...pending }, "save")} className={`${BUTTON} ${OUTLINE}`}>
              {t("btnSave")}
            </button>
            <button type="button" onClick={() => commit(NONE, "reject")} className={`${BUTTON} ${OUTLINE}`}>
              {t("btnReject")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
