"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { ADS_ID, AD_PERSONALIZATION_ALLOWED, GA4_ID } from "@/config/google";
import "@/config/consent";
import { CONSENT_UPDATED_EVENT, getConsent } from "@/lib/consent";
import {
  DENIED_ALL,
  GOOGLE_COOKIES,
  configsFor,
  deletionStrings,
  pageView,
  scriptIdFor,
  scriptUrl,
  signalsFor,
  withdrew,
  type Signals,
} from "@/lib/google-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const IDS = { ga4: GA4_ID, ads: ADS_ID };

type State = {
  started: boolean;
  signals: Signals | null;
  configured: { ga4: boolean; ads: boolean };
  lastPath: string | null;
};

/**
 * Google Analytics 4 and the Google Ads tag, in basic Consent Mode: nothing is requested, defined or stored until the
 * visitor has allowed the matching category (docs/briefs/landing-google-consent-mode.md). With both IDs unset it does
 * nothing at all. The rules are in `src/lib/google-consent.ts`; this file does the DOM, the script and the `gtag` calls.
 */
export function GoogleTags() {
  const pathname = usePathname();
  const locale = useLocale();
  const state = useRef<State>({ started: false, signals: null, configured: { ga4: false, ads: false }, lastPath: null });
  const pageRef = useRef({ pathname, locale });
  pageRef.current = { pathname, locale };

  useEffect(() => {
    if (GA4_ID === null && ADS_ID === null) return;

    function send(...args: unknown[]) {
      window.gtag?.(...args);
    }

    function sendPageView() {
      if (GA4_ID === null) return;
      const current = pageRef.current;
      state.current.lastPath = current.pathname;
      const [, name, params] = pageView(GA4_ID, { path: current.pathname, title: document.title, locale: current.locale });
      send("event", name, params);
    }

    function start() {
      window.dataLayer = window.dataLayer ?? [];
      // gtag.js reads the `arguments` object, not an array.
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };
      send("consent", "default", DENIED_ALL);
      state.current.started = true;
    }

    function loadScript(id: string) {
      const script = document.createElement("script");
      script.async = true;
      script.src = scriptUrl(id);
      document.head.appendChild(script);
      send("js", new Date());
    }

    function withdraw(signals: Signals, gone: { analytics: boolean; ads: boolean }) {
      send("consent", "update", signals);
      const parts = [];
      if (gone.analytics) {
        if (GA4_ID !== null) (window as unknown as Record<string, unknown>)[`ga-disable-${GA4_ID}`] = true;
        parts.push(GOOGLE_COOKIES.analytics);
      }
      if (gone.ads) parts.push(GOOGLE_COOKIES.ads);
      for (const cookie of deletionStrings(parts, document.cookie, window.location.hostname)) document.cookie = cookie;
      // The script is gone after a reload and cannot send anything; the load rule then decides what starts again.
      window.location.reload();
    }

    function apply() {
      const signals = signalsFor(getConsent(), AD_PERSONALIZATION_ALLOWED);
      const now = state.current;
      const gone = withdrew(now.signals, signals);
      if (gone.analytics || gone.ads) {
        withdraw(signals, gone);
        return;
      }
      const configs = configsFor(signals, IDS);
      const id = scriptIdFor(signals, IDS);
      if (!now.started) {
        if (id === null) return;
        start();
        send("consent", "update", signals);
        loadScript(id);
      } else {
        send("consent", "update", signals);
      }
      now.signals = signals;

      if (configs.ga4 && !now.configured.ga4 && GA4_ID !== null) {
        now.configured.ga4 = true;
        send("config", GA4_ID, { send_page_view: false });
        sendPageView();
      }
      if (configs.ads && !now.configured.ads && ADS_ID !== null) {
        now.configured.ads = true;
        // Personalization is off for everyone until the lawyer agrees (AD_PERSONALIZATION_ALLOWED).
        send("config", ADS_ID, AD_PERSONALIZATION_ALLOWED ? {} : { allow_ad_personalization_signals: false });
      }
    }

    apply();
    window.addEventListener(CONSENT_UPDATED_EVENT, apply);
    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, apply);
  }, []);

  // One more page_view when the path changes after the first load, only while analytics is configured.
  useEffect(() => {
    const now = state.current;
    if (!now.configured.ga4 || now.signals?.analytics_storage !== "granted" || GA4_ID === null) return;
    if (now.lastPath === null || now.lastPath === pathname) return;
    now.lastPath = pathname;
    const [, name, params] = pageView(GA4_ID, { path: pathname, title: document.title, locale });
    window.gtag?.("event", name, params);
  }, [pathname, locale]);

  return null;
}
