"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { consentCookieDomain } from "@/config/booking";
import { BANNER_VERSION, CONSENT_GENERATION, CONSENT_LOG_URL } from "@/config/consent";
import { routing } from "@/i18n/routing";
import {
  CONSENT_UPDATED_EVENT,
  flushQueue,
  getConsent,
  noConsent,
  readConsent,
  readConsentId,
  saveConsent,
  type Consent,
  type ConsentEnv,
  type SendEnv,
  type Store,
  type Via,
} from "@/lib/consent";

export const OPEN_CONSENT_EVENT = "skt:open-consent";
// What a later script asks and listens for: see src/lib/consent.ts and docs/cookie-consent.md.
export { CONSENT_UPDATED_EVENT, getConsent };

/** The dialog shows two choices; functional and performance stay in the cookie as reserved zeros. */
const SHOWN: readonly ("analytics" | "ads")[] = ["analytics", "ads"];

/** The privacy page and the imprint stay readable without a choice: the dialog does not open there by itself. */
const SETTINGS_PAGES = new RegExp(`^/(${routing.locales.join("|")})/(datenschutz|impressum)/?$`);

const BUTTON =
  "flex-1 rounded-full border border-[#1a1516] bg-[#1a1516] py-3 text-sm font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-80";

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

/** Functional and performance are never offered, so they are always off. */
function shown(consent: Consent): Consent {
  return { functional: false, analytics: consent.analytics, performance: false, ads: consent.ads };
}

function CookieIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="11.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ChevronRight({ rotated }: { rotated: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`shrink-0 transition-transform duration-200 ${rotated ? "rotate-90" : ""}`}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

type CategoryRowProps = {
  catKey: string;
  title: string;
  desc: string;
  alwaysActive?: boolean;
  checked?: boolean;
  onToggle?: () => void;
  expanded: boolean;
  onExpand: () => void;
};

function CategoryRow({
  catKey,
  title,
  desc,
  alwaysActive,
  checked,
  onToggle,
  expanded,
  onExpand,
}: CategoryRowProps) {
  return (
    <div className="border-b border-[#e8e4de] last:border-b-0">
      <div className="flex items-center justify-between py-4">
        <button
          type="button"
          onClick={onExpand}
          className="flex min-w-0 items-center gap-2 text-left"
          aria-expanded={expanded}
          aria-controls={`cc-cat-${catKey}`}
        >
          <ChevronRight rotated={expanded} />
          <span className="font-bold text-[#1a1516]">{title}</span>
        </button>

        {alwaysActive ? (
          <span className="ml-4 shrink-0 text-xs font-bold uppercase tracking-wider text-[#88c9cd]">
            {/* Always active label passed as child from parent */}
            <AlwaysActiveLabel />
          </span>
        ) : (
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={onToggle}
            className={`relative ml-4 h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#88c9cd] focus-visible:ring-offset-2 ${
              checked ? "bg-[#88c9cd]" : "bg-[#ccc7c0]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                checked ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        )}
      </div>

      {expanded && (
        <div id={`cc-cat-${catKey}`} className="pb-4 pr-2">
          <p className="text-sm leading-relaxed text-[#5a5050]">{desc}</p>
        </div>
      )}
    </div>
  );
}

function AlwaysActiveLabel() {
  const t = useTranslations("cookieConsent");
  return <>{t("alwaysActive")}</>;
}

export function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const footer = useTranslations("footer");
  const locale = useLocale();
  const pathname = usePathname();
  const onSettingsPage = SETTINGS_PAGES.test(pathname ?? "");

  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showLong, setShowLong] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [pending, setPending] = useState<Consent>(noConsent());
  const [consentId, setConsentId] = useState<string | null>(null);

  useEffect(() => {
    clearStoredConsent();
    const env = browserEnv(locale);
    const saved = readConsent(env);
    if (saved) {
      setPending(shown(saved));
      setConsentGiven(true);
    }
    setConsentId(readConsentId(env));
    setReady(true);
    // Records the page could not send before (a closed tab, a stub that was down) go now, oldest first.
    void flushQueue(sendEnv());
    // Read once on arrival; the dialog keeps its own state after that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The dialog opens by itself while there is no choice, except on the pages that must stay readable.
  useEffect(() => {
    if (ready && !consentGiven && !onSettingsPage) setOpen(true);
  }, [ready, consentGiven, onSettingsPage]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const commit = useCallback(
    (after: Consent, via: Via) => {
      const env = browserEnv(locale);
      // The cookies, the event and the queue are done before the answer comes; the dialog never waits for the send.
      void saveConsent(env, after, via);
      setPending(shown(after));
      setConsentGiven(true);
      setConsentId(readConsentId(env));
      setOpen(false);
    },
    [locale],
  );

  const handleAcceptAll = useCallback(() => {
    commit({ functional: false, analytics: true, performance: false, ads: true }, "accept_all");
  }, [commit]);

  const handleReject = useCallback(() => {
    commit(noConsent(), "reject");
  }, [commit]);

  const handleSave = useCallback(() => {
    commit(shown(pending), "save");
  }, [commit, pending]);

  const handleReopen = useCallback(() => {
    const env = browserEnv(locale);
    const saved = readConsent(env);
    if (saved) setPending(shown(saved));
    setConsentId(readConsentId(env));
    setOpen(true);
  }, [locale]);

  useEffect(() => {
    const openBanner = () => handleReopen();
    window.addEventListener(OPEN_CONSENT_EVENT, openBanner);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, openBanner);
  }, [handleReopen]);

  const toggleCat = useCallback((key: "analytics" | "ads") => {
    setPending((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleExpand = useCallback((key: string) => {
    setExpandedCat((prev) => (prev === key ? null : key));
  }, []);

  return (
    <>
      {/* ── Modal ── */}
      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cc-title"
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50" aria-hidden />

          {/* panel */}
          <div className="relative z-10 w-full max-w-[900px] max-h-[90dvh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="p-7 md:p-10">
              <h2
                id="cc-title"
                className="mb-4 text-xl font-bold text-[#1a1516]"
              >
                {t("title")}
              </h2>

              {/* Intro */}
              <p className="mb-1 text-sm leading-relaxed text-[#5a5050]">
                {t("introShort")}
              </p>
              {showLong && (
                // TODO: list the real cookies of each tag here (name, purpose, duration, provider) when a tag is added.
                <p className="mb-1 whitespace-pre-line text-sm leading-relaxed text-[#5a5050]">
                  {t("introLong")}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowLong((v) => !v)}
                className="mb-2 text-sm text-[#88c9cd] underline-offset-2 hover:underline"
              >
                {showLong ? t("showLess") : t("showMore")}
              </button>
              <p className="mb-6 text-sm">
                {/* A new tab: the page behind a blocking dialog stays, and the policy stays readable. */}
                <a
                  href={`/${locale}/datenschutz`}
                  target="_blank"
                  rel="noopener"
                  className="text-[#88c9cd] underline-offset-2 hover:underline"
                >
                  {footer("privacyPolicy")}
                </a>
              </p>

              {/* Categories */}
              <div className="divide-y-0 border-t border-[#e8e4de]">
                {/* Necessary — always on */}
                <CategoryRow
                  catKey="necessary"
                  title={t("categories.necessary.title")}
                  desc={t("categories.necessary.desc")}
                  alwaysActive
                  expanded={expandedCat === "necessary"}
                  onExpand={() => toggleExpand("necessary")}
                />

                {/* The optional categories the page uses */}
                {SHOWN.map((cat) => (
                  <CategoryRow
                    key={cat}
                    catKey={cat}
                    title={t(`categories.${cat}.title`)}
                    desc={t(`categories.${cat}.desc`)}
                    checked={pending[cat]}
                    onToggle={() => toggleCat(cat)}
                    expanded={expandedCat === cat}
                    onExpand={() => toggleExpand(cat)}
                  />
                ))}
              </div>

              {consentId && (
                <p className="mt-4 break-all text-xs text-[#5a5050]">
                  {t("idLabel")}: <code>{consentId}</code>
                </p>
              )}

              {/* Action buttons: the same look, differing only in their words */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={handleReject} className={BUTTON}>
                  {t("btnReject")}
                </button>
                <button type="button" onClick={handleSave} className={BUTTON}>
                  {t("btnSave")}
                </button>
                <button type="button" onClick={handleAcceptAll} className={BUTTON}>
                  {t("btnAcceptAll")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reopen button: above the booking bar below lg ── */}
      {(consentGiven || onSettingsPage) && !open && (
        <button
          type="button"
          onClick={handleReopen}
          aria-label={t("reopenLabel")}
          title={t("reopenLabel")}
          className="fixed bottom-[96px] left-5 z-[200] flex h-11 w-11 items-center justify-center rounded-full border border-[#e8e4de] bg-white text-[#1a1516] shadow-md transition-colors hover:bg-[#f5f0e8] lg:bottom-5"
        >
          <CookieIcon />
        </button>
      )}
    </>
  );
}
