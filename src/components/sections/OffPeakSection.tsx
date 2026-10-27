"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { buildBookingHref } from "@/config/booking";
import { locationsOf } from "@/config/locations";
import { fetchOffpeakDays, isDiscounted, setOffpeakStudios, type OffpeakDay } from "@/config/offpeak";

/** The cards show the first 7 days of the answer: today and the next 6, the off-peak horizon. */
const DAYS_SHOWN = 7;

/** Monday 0 … Sunday 6, from a YYYY-MM-DD date. */
function weekdayOf(date: string): number {
  return (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7;
}

function shortDate(date: string): string {
  return `${Number(date.slice(8, 10))}.${Number(date.slice(5, 7))}.`;
}

/**
 * Povoljniji termini: the next 7 days per bookable studio, read from the booking app (decision 236), with the
 * discount in words. Informative only: it carries the studio, the day and an optional preferred time into
 * booking, which decides the real time once it knows the treatment (decisions 233–235). Hidden while no
 * studio has a discounted day in the week.
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
        for (const [slug, result] of results) {
          const week = result?.slice(0, DAYS_SHOWN);
          if (week?.some(isDiscounted)) loaded[slug] = week;
        }
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

  // A studio card links to #povoljni-{slug}: open the week on that studio and scroll to it.
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

  const dayHref = (() => {
    const url = new URL(buildBookingHref({ centar: studio }, pageSearch));
    url.searchParams.set("datum", day.date);
    if (time) url.searchParams.set("vrijeme", time);
    return url.toString();
  })();
  const calendarHref = buildBookingHref({ centar: studio }, pageSearch);
  const studioName = studios.find((item) => item.slug === studio)?.name ?? "";
  const weekdaysShort: string[] = t.raw("weekdaysShort");

  function kindOf(item: OffpeakDay): string {
    if (item.tier === "morning" && item.morningUntil) return t("kind.morning", { until: item.morningUntil });
    if (item.tier === "day") return t("kind.day");
    return t("kind.gap");
  }

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

        {/* The week: one row, sideways scroll on the phone with the next card peeking in */}
        <div className="flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto px-4 py-1 [scrollbar-width:none] lg:grid lg:grid-cols-7 lg:gap-3 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          {days.map((item, index) => {
            const weekday = weekdaysShort[weekdayOf(item.date)];
            const discounted = isDiscounted(item);
            const isSelected = index === selected;
            const look =
              item.status === "closed"
                ? "border border-dashed border-[#c9b8ae] bg-transparent text-[#8a7d78]"
                : item.status === "full"
                  ? "bg-[#f3ece7] text-[#8a7d78]"
                  : "bg-white";
            return (
              <button
                key={item.date}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setSelected(index);
                  setTime(null);
                }}
                className={`flex w-[104px] shrink-0 snap-start flex-col items-start gap-1.5 rounded-lg px-2.5 py-3 text-left lg:w-auto lg:p-4 ${look} ${
                  isSelected ? "outline outline-2 -outline-offset-2 outline-[#0C0C0C]" : ""
                }`}
              >
                <span className="whitespace-nowrap text-xs font-extrabold uppercase lg:text-[13px] lg:tracking-[0.04em]">
                  {index === 0 ? `${t("today")} · ${weekday.toLowerCase()}` : weekday}
                </span>
                <span className="text-[13px] text-[#3d3434]">{shortDate(item.date)}</span>
                {discounted ? (
                  <>
                    <span className="mt-1 rounded-full bg-[#0C0C0C] px-2.5 py-1 text-xs font-extrabold text-white">
                      −10 %
                    </span>
                    <span className="text-[13px] font-bold leading-snug">{kindOf(item)}</span>
                  </>
                ) : item.status === "full" ? (
                  <span className="mt-1 text-[13px]">{t("cell.full")}</span>
                ) : item.status === "closed" ? (
                  <span className="mt-1 text-[13px]">{t("cell.closed")}</span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 px-4 lg:mt-8 lg:px-0">
          <p className="text-lg font-extrabold">
            {selected === 0 ? `${t("today")}, ` : ""}
            {t("dayTitle", {
              weekday: selected === 0
                ? t.raw("weekdays")[weekdayOf(day.date)].toLowerCase()
                : t.raw("weekdays")[weekdayOf(day.date)],
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
                        className={`inline-flex items-center rounded-full border-[1.5px] border-[#0C0C0C] px-3.5 py-2 text-[13px] font-bold ${
                          time === example ? "bg-[#0C0C0C] text-white" : "bg-white"
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
            href={dayHref}
            className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0C0C0C] px-8 text-[13px] font-extrabold uppercase tracking-[0.05em] text-white lg:w-auto lg:self-start lg:text-[15px]"
          >
            {time ? t("continueAt", { date: shortDate(day.date), time }) : t("continue")}
          </a>

          <p className="mt-2 text-sm leading-relaxed text-[#3d3434]">
            {t.rich("otherDays", { strong: (chunks) => <strong className="text-[#0C0C0C]">{chunks}</strong> })}{" "}
            <a href={calendarHref} className="font-extrabold text-[#0C0C0C] underline underline-offset-2">
              {t("openCalendar")}
            </a>
          </p>
          <p className="text-xs text-[#3d3434]">{t("terms")}</p>
        </div>
      </div>
    </section>
  );
}
