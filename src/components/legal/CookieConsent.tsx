"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type CategoryKey = "functional" | "analytics" | "performance" | "ads";

type ConsentRecord = {
  v: number;
  ts: number;
  cats: Record<CategoryKey, boolean>;
};

const STORAGE_KEY = "sk_consent";
const CONSENT_VERSION = 1;
const NON_ESSENTIAL: CategoryKey[] = ["functional", "analytics", "performance", "ads"];

const DEFAULT_CATS: Record<CategoryKey, boolean> = {
  functional: false,
  analytics: false,
  performance: false,
  ads: false,
};

function readConsent(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const rec = JSON.parse(raw) as ConsentRecord;
    return rec.v === CONSENT_VERSION ? rec : null;
  } catch {
    return null;
  }
}

function writeConsent(cats: Record<CategoryKey, boolean>): void {
  const rec: ConsentRecord = { v: CONSENT_VERSION, ts: Date.now(), cats };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rec));
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

  const [open, setOpen] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showLong, setShowLong] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<CategoryKey, boolean>>(DEFAULT_CATS);

  useEffect(() => {
    const rec = readConsent();
    if (!rec) {
      setOpen(true);
    } else {
      setPending(rec.cats);
      setConsentGiven(true);
    }
  }, []);

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
    (cats: Record<CategoryKey, boolean>) => {
      writeConsent(cats);
      setPending(cats);
      setConsentGiven(true);
      setOpen(false);
    },
    [],
  );

  const handleAcceptAll = useCallback(() => {
    commit(Object.fromEntries(NON_ESSENTIAL.map((k) => [k, true])) as Record<CategoryKey, boolean>);
  }, [commit]);

  const handleReject = useCallback(() => {
    commit({ ...DEFAULT_CATS });
  }, [commit]);

  const handleSave = useCallback(() => {
    commit({ ...pending });
  }, [commit, pending]);

  const handleReopen = useCallback(() => {
    const rec = readConsent();
    if (rec) setPending(rec.cats);
    setOpen(true);
  }, []);

  const toggleCat = useCallback((key: CategoryKey) => {
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
                <p className="mb-1 whitespace-pre-line text-sm leading-relaxed text-[#5a5050]">
                  {t("introLong")}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowLong((v) => !v)}
                className="mb-6 text-sm text-[#88c9cd] underline-offset-2 hover:underline"
              >
                {showLong ? t("showLess") : t("showMore")}
              </button>

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

                {/* Non-essential */}
                {NON_ESSENTIAL.map((cat) => (
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

              {/* Action buttons */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleReject}
                  className="flex-1 rounded-full border border-[#88c9cd] bg-[#88c9cd] py-3 text-sm font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-80"
                >
                  {t("btnReject")}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 rounded-full border border-[#88c9cd] py-3 text-sm font-bold uppercase tracking-wide text-[#88c9cd] transition-colors hover:bg-[#88c9cd] hover:text-white"
                >
                  {t("btnSave")}
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 rounded-full bg-[#1a1516] py-3 text-sm font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-80"
                >
                  {t("btnAcceptAll")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reopen button ── */}
      {consentGiven && !open && (
        <button
          type="button"
          onClick={handleReopen}
          aria-label={t("reopenLabel")}
          title={t("reopenLabel")}
          className="fixed bottom-5 left-5 z-[200] flex h-11 w-11 items-center justify-center rounded-full border border-[#e8e4de] bg-white text-[#1a1516] shadow-md transition-colors hover:bg-[#f5f0e8]"
        >
          <CookieIcon />
        </button>
      )}
    </>
  );
}
