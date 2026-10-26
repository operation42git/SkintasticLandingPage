"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { buildBookingHref } from "@/config/booking";
import { locationsOf } from "@/config/locations";
import { fetchOffpeakDays, isDiscounted, setOffpeakStudios, type OffpeakDay } from "@/config/offpeak";

type Tier = OffpeakDay["tier"] | "full" | "closed";

const CELL: Record<Tier, string> = {
  day: "bg-[#c9a96e]",
  morning: "bg-[#e2c48f]",
  gap: "bg-[#cfe0d3]",
  regular: "bg-white",
  full: "bg-[#ece5de] text-[#8a7d78]",
  closed: "bg-[#ddd5cd] text-[#8a7d78]",
};

const CHIP: Record<OffpeakDay["tier"], string> = {
  day: "bg-[#c9a96e]",
  morning: "bg-[#e2c48f]",
  gap: "bg-[#8fb39a]",
  regular: "bg-white",
};

function tierOf(day: OffpeakDay): Tier {
  return day.status === "open" ? day.tier : day.status;
}

/** Monday 0 … Sunday 6, from a YYYY-MM-DD date. */
function weekdayOf(date: string): number {
  return (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7;
}

function shortDate(date: string): string {
  return `${Number(date.slice(8, 10))}.${Number(date.slice(5, 7))}.`;
}

/**
 * Povoljniji termini: the off-peak calendar per bookable studio, read from the booking app (decision 236).
 * Informative only: it carries the studio, the day and an optional preferred time into booking, which
 * decides the real time once it knows the treatment (decisions 233–235). Hidden while no studio has data.
 */
export function OffPeakSection() {
  const t = useTranslations("offPeak");
  const studios = locationsOf("bookable");
  const [calendars, setCalendars] = useState<Record<string, OffpeakDay[]>>({});
  const [studio, setStudio] = useState("");
  const [selected, setSelected] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const [pageSearch, setPageSearch] = useState("");

  const shown = studios.filter((item) => calendars[item.slug]);
  const days = calendars[studio] ?? [];
  const day = days[selected];

  function chooseStudio(slug: string, from: Record<string, OffpeakDay[]> = calendars) {
    const next = from[slug];
    if (!next) return;
    setStudio(slug);
    setTime(null);
    setSelected(Math.max(0, next.findIndex(isDiscounted)));
  }

  useEffect(() => {
    setPageSearch(window.location.search);
    let cancelled = false;
    Promise.all(studios.map(async (item) => [item.slug, await fetchOffpeakDays(item.slug)] as const)).then(
      (results) => {
        if (cancelled) return;
        const loaded: Record<string, OffpeakDay[]> = {};
        for (const [slug, result] of results) if (result) loaded[slug] = result;
        setCalendars(loaded);
        const slugs = Object.keys(loaded);
        setOffpeakStudios(slugs);
        const fromHash = window.location.hash.slice("#povoljni-".length);
        if (slugs.length) chooseStudio(slugs.includes(fromHash) ? fromHash : slugs[0], loaded);
      },
    );
    return () => {
      cancelled = true;
    };
    // The studios come from the static config: read once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A studio card links to #povoljni-{slug}: open the calendar on that studio and scroll to it.
  useEffect(() => {
    function fromHash() {
      if (!window.location.hash.startsWith("#povoljni-")) return;
      const slug = window.location.hash.slice("#povoljni-".length);
      if (!calendars[slug]) return;
      chooseStudio(slug);
      document.getElementById("povoljniji-termini")?.scrollIntoView({ behavior: "smooth" });
    }
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendars]);

  if (!shown.length || !day) return null;

  const href = (() => {
    const url = new URL(buildBookingHref({ centar: studio }, pageSearch));
    url.searchParams.set("datum", day.date);
    if (time) url.searchParams.set("vrijeme", time);
    return url.toString();
  })();
  const studioName = studios.find((item) => item.slug === studio)?.name ?? "";
  const lead = weekdayOf(days[0].date);

  return (
    <section
      id="povoljniji-termini"
      className="scroll-mt-[68px] bg-[#f5e6de] py-9 text-[#0C0C0C] lg:scroll-mt-[84px] lg:py-20"
    >
      <div className="mx-auto max-w-[1320px] lg:px-6">
        <div className="mb-6 px-4 text-center lg:mb-10 lg:px-0">
          <p className="mb-1 text-[11px] uppercase tracking-[3px] lg:mb-2 lg:text-[15px] lg:tracking-[5px]">
            {t("eyebrow")}
          </p>
          <h2 className="font-script text-[44px] font-normal leading-none lg:text-[60px]">{t("title")}</h2>
          <p className="mx-auto mt-3 max-w-[600px] text-[15px] leading-relaxed text-[#3d3434] lg:text-base">
            {t.rich("lead", { strong: (chunks) => <strong className="text-[#0C0C0C]">{chunks}</strong> })}
          </p>
        </div>

        {shown.length > 1 ? (
          <div className="mb-6 flex justify-center px-4 lg:mb-8">
            <div
              role="tablist"
              aria-label={t("studio")}
              className="inline-flex rounded-full border-[1.5px] border-[#0C0C0C] bg-white p-1"
            >
              {shown.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  role="tab"
                  aria-selected={item.slug === studio}
                  onClick={() => chooseStudio(item.slug)}
                  className={`rounded-full px-5 py-2 text-[13px] font-extrabold lg:px-7 lg:text-sm ${
                    item.slug === studio ? "bg-[#0C0C0C] text-white" : ""
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-6 px-4 lg:flex-row lg:items-start lg:gap-10 lg:px-0">
          <div className="bg-white p-3 lg:flex-[1.3] lg:p-6">
            <p className="mb-3 text-center text-sm font-extrabold uppercase">
              {shortDate(days[0].date)} – {shortDate(days[days.length - 1].date)}
            </p>
            <div className="grid grid-cols-7 gap-1 lg:gap-1.5">
              {t.raw("weekdaysShort").map((name: string) => (
                <span key={name} className="pb-1 text-center text-[11px] font-bold text-[#3d3434] lg:text-xs">
                  {name}
                </span>
              ))}
              {Array.from({ length: lead }, (_, i) => (
                <span key={`lead-${i}`} />
              ))}
              {days.map((item, index) => {
                const tier = tierOf(item);
                const disabled = item.status !== "open";
                return (
                  <button
                    key={item.date}
                    type="button"
                    disabled={disabled}
                    aria-pressed={index === selected}
                    onClick={() => {
                      setSelected(index);
                      setTime(null);
                    }}
                    className={`flex h-14 flex-col items-center justify-center rounded-md text-sm font-extrabold lg:h-[74px] lg:text-base ${CELL[tier]} ${
                      index === selected ? "ring-2 ring-[#0C0C0C] ring-offset-1" : ""
                    }`}
                  >
                    {Number(item.date.slice(8, 10))}.
                    <span className="hidden text-[11px] font-semibold lg:block">{t(`cell.${tier}`)}</span>
                    {isDiscounted(item) ? <span className="text-[10px] font-bold lg:hidden">−10 %</span> : null}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs lg:text-[13px]">
              {(["day", "morning", "gap", "regular"] as const).map((tier) => (
                <span key={tier} className="inline-flex items-center gap-2">
                  <span className={`inline-block h-3.5 w-3.5 rounded-[4px] border border-[#d9cfc7] ${CELL[tier]}`} />
                  {t(`legend.${tier}`)}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-1">
            <p className="text-lg font-extrabold">
              {t("dayTitle", {
                weekday: t.raw("weekdays")[weekdayOf(day.date)],
                date: shortDate(day.date),
                studio: studioName,
              })}
            </p>

            {isDiscounted(day) ? (
              <>
                <p className="text-[15px] font-bold">
                  {day.tier === "morning" && day.morningUntil
                    ? t("dayKind.morning", { until: day.morningUntil })
                    : t(`dayKind.${day.tier}`)}
                </p>
                {day.examples.length ? (
                  <>
                    <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#3d3434]">{t("examples")}</p>
                    <div className="flex flex-wrap gap-2">
                      {day.examples.map((example) => (
                        <button
                          key={example}
                          type="button"
                          aria-pressed={time === example}
                          onClick={() => setTime(time === example ? null : example)}
                          className={`inline-flex items-center rounded-full px-3.5 py-2 text-[13px] font-bold ${CHIP[day.tier]} ${
                            time === example ? "ring-2 ring-[#0C0C0C] ring-offset-1" : ""
                          }`}
                        >
                          {example} −10 %
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}
                <p className="text-xs leading-relaxed text-[#3d3434]">
                  {day.shortOnly ? `${t("shortOnly")} ` : ""}
                  {t("exactNote")}
                </p>
              </>
            ) : (
              <p className="text-[15px] text-[#3d3434]">{t("regularDay")}</p>
            )}

            <a
              href={href}
              className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0C0C0C] px-8 text-[13px] font-extrabold uppercase tracking-[0.05em] text-white lg:w-auto lg:self-start lg:text-[15px]"
            >
              {time ? t("continueAt", { date: shortDate(day.date), time }) : t("continue")}
            </a>
            <p className="text-xs text-[#3d3434]">{t("terms")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
