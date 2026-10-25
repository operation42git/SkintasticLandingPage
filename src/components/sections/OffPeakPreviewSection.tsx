"use client";

// Look-only preview of "Povoljniji termini", option A (airline-style calendar), v4.
// The landing page is informative: it shows where it is cheaper per studio and carries the studio, the day
// and an optional preferred time into booking. Booking decides the real time once it knows the treatment.
// EXAMPLE is example data in the shape the booking app would expose per bookable studio.

import { useEffect, useState } from "react";
import { buildBookingHref } from "@/config/booking";
import { locationsOf } from "@/config/locations";

type Tier = "day" | "morning" | "gap" | "regular" | "closed" | "full";
type Day = {
  /** ISO date, carried to booking as ?datum=. */
  date: string;
  weekday: string;
  label: string;
  tier: Tier;
  /** A few discounted start times, shown as examples only. */
  examples: string[];
  /** The discounted times are gaps that fit only shorter treatments. */
  shortOnly: boolean;
};

const WEEKDAYS = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];
const NAMES = ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"];

function twoWeeks(pattern: [Tier, string[], boolean?][]): Day[] {
  return pattern.map(([tier, examples, shortOnly], i) => {
    const date = new Date(Date.UTC(2026, 9, 26 + i));
    const dd = date.getUTCDate();
    const mm = date.getUTCMonth() + 1;
    return {
      date: date.toISOString().slice(0, 10),
      weekday: WEEKDAYS[i % 7],
      label: `${NAMES[i % 7]} ${dd}.${mm}.`,
      tier,
      examples,
      shortOnly: Boolean(shortOnly),
    };
  });
}

const EXAMPLE: Record<string, Day[]> = {
  "zagreb-zapad": twoWeeks([
    ["day", ["09:00", "11:00", "13:00", "14:00"]],
    ["morning", ["09:00", "09:30", "10:00", "10:30"]],
    ["morning", ["09:30", "10:00"]],
    ["full", []],
    ["gap", ["13:15", "15:15"], true],
    ["closed", []],
    ["closed", []],
    ["morning", ["09:00", "10:00", "10:30"]],
    ["day", ["09:00", "11:00", "12:00", "15:00"]],
    ["regular", []],
    ["morning", ["09:00", "10:30"]],
    ["gap", ["11:15"], true],
    ["closed", []],
    ["closed", []],
  ]),
  "zagreb-istok": twoWeeks([
    ["regular", []],
    ["gap", ["12:45"], true],
    ["day", ["09:00", "10:00", "12:00", "15:00"]],
    ["morning", ["09:00", "09:30"]],
    ["full", []],
    ["closed", []],
    ["closed", []],
    ["gap", ["14:15", "16:15"], true],
    ["morning", ["09:30", "10:00", "10:30"]],
    ["day", ["10:00", "11:00", "13:00", "14:00"]],
    ["regular", []],
    ["morning", ["09:00"]],
    ["closed", []],
    ["closed", []],
  ]),
};

const TIER: Record<Tier, { cell: string; short: string; legend: string }> = {
  day: { cell: "bg-[#c9a96e]", short: "cijeli dan", legend: "−10 % cijeli dan" },
  morning: { cell: "bg-[#e2c48f]", short: "ujutro", legend: "−10 % ujutro (do 11:00)" },
  gap: { cell: "bg-[#cfe0d3]", short: "kraći tretmani", legend: "−10 % u rupama, za kraće tretmane" },
  regular: { cell: "bg-white", short: "", legend: "Redovna cijena" },
  full: { cell: "bg-[#ece5de] text-[#8a7d78]", short: "popunjeno", legend: "" },
  closed: { cell: "bg-[#ddd5cd] text-[#8a7d78]", short: "zatvoreno", legend: "" },
};

const CHIP: Record<Tier, string> = {
  day: "bg-[#c9a96e]",
  morning: "bg-[#e2c48f]",
  gap: "bg-[#8fb39a]",
  regular: "",
  full: "",
  closed: "",
};

const DISCOUNTED: Tier[] = ["day", "morning", "gap"];

export function OffPeakPreviewSection() {
  const studios = locationsOf("bookable");
  const [studio, setStudio] = useState(studios[0]?.slug ?? "");
  const days = EXAMPLE[studio] ?? [];
  const [selected, setSelected] = useState(1);
  const [time, setTime] = useState<string | null>(null);
  const [pageSearch, setPageSearch] = useState("");
  const day = days[selected];

  useEffect(() => setPageSearch(window.location.search), []);

  // A location card links to #povoljni-{slug}: open the calendar on that studio and scroll to it.
  useEffect(() => {
    function fromHash() {
      const slug = window.location.hash.startsWith("#povoljni-") ? window.location.hash.slice("#povoljni-".length) : "";
      if (!studios.some((item) => item.slug === slug)) return;
      chooseStudio(slug);
      document.getElementById("povoljniji-termini")?.scrollIntoView({ behavior: "smooth" });
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const href = (() => {
    const url = new URL(buildBookingHref({ centar: studio }, pageSearch));
    if (day) url.searchParams.set("datum", day.date);
    if (time) url.searchParams.set("vrijeme", time);
    return url.toString();
  })();

  function chooseStudio(slug: string) {
    setStudio(slug);
    setTime(null);
    const next = EXAMPLE[slug] ?? [];
    const firstCheap = next.findIndex((d) => DISCOUNTED.includes(d.tier));
    setSelected(firstCheap < 0 ? 0 : firstCheap);
  }

  return (
    <section id="povoljniji-termini" className="scroll-mt-[68px] bg-[#f5e6de] py-9 lg:scroll-mt-[84px] text-[#0C0C0C] lg:py-20">
      <div className="mx-auto max-w-[1320px] lg:px-6">
        <div className="mb-6 px-4 text-center lg:mb-10 lg:px-0">
          <p className="mb-1 text-[11px] uppercase tracking-[3px] lg:mb-2 lg:text-[15px] lg:tracking-[5px]">
            Skintastic Zagreb
          </p>
          <h2 className="font-script text-[44px] font-normal leading-none lg:text-[60px]">Povoljniji termini</h2>
          <p className="mx-auto mt-3 max-w-[600px] text-[15px] leading-relaxed text-[#3d3434] lg:text-base">
            <strong className="text-[#0C0C0C]">−10 % na sve tretmane</strong> u mirnijim terminima. Odaberi studio i
            dan – točno vrijeme potvrđuješ u rezervaciji, prema trajanju tretmana.
          </p>
        </div>

        {/* Studio switch: the calendar is per studio */}
        <div className="mb-6 flex justify-center px-4 lg:mb-8">
          <div role="tablist" aria-label="Studio" className="inline-flex rounded-full border-[1.5px] border-[#0C0C0C] bg-white p-1">
            {studios.map((item) => (
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

        <div className="flex flex-col gap-6 px-4 lg:flex-row lg:items-start lg:gap-10 lg:px-0">
          <div className="bg-white p-3 lg:flex-[1.3] lg:p-6">
            <div className="mb-3 flex items-center justify-between text-sm font-extrabold uppercase">
              <span aria-hidden="true">‹</span>
              <span>26.10. – 8.11.</span>
              <span aria-hidden="true">›</span>
            </div>
            <div className="grid grid-cols-7 gap-1 lg:gap-1.5">
              {WEEKDAYS.map((name) => (
                <span key={name} className="pb-1 text-center text-[11px] font-bold text-[#3d3434] lg:text-xs">
                  {name}
                </span>
              ))}
              {days.map((item, index) => {
                const disabled = item.tier === "closed" || item.tier === "full";
                const cheap = DISCOUNTED.includes(item.tier);
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
                    className={`flex h-14 flex-col items-center justify-center rounded-md text-sm font-extrabold lg:h-[74px] lg:text-base ${
                      TIER[item.tier].cell
                    } ${index === selected ? "ring-2 ring-[#0C0C0C] ring-offset-1" : ""}`}
                  >
                    {Number(item.date.slice(8))}.
                    <span className="hidden text-[11px] font-semibold lg:block">{TIER[item.tier].short}</span>
                    {cheap ? <span className="text-[10px] font-bold lg:hidden">−10 %</span> : null}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs lg:text-[13px]">
              {(["day", "morning", "gap", "regular"] as Tier[]).map((tier) => (
                <span key={tier} className="inline-flex items-center gap-2">
                  <span className={`inline-block h-3.5 w-3.5 rounded-[4px] border border-[#d9cfc7] ${TIER[tier].cell}`} />
                  {TIER[tier].legend}
                </span>
              ))}
            </div>
          </div>

          {day ? (
            <div className="flex flex-col gap-3 lg:flex-1">
              <p className="text-lg font-extrabold">
                {day.label} · {studios.find((item) => item.slug === studio)?.name}
              </p>

              {DISCOUNTED.includes(day.tier) ? (
                <>
                  <p className="text-[15px] font-bold">
                    {day.tier === "day"
                      ? "Cijeli dan −10 %"
                      : day.tier === "morning"
                        ? "−10 % ujutro, do 11:00"
                        : "−10 % u kraćim rupama u rasporedu"}
                  </p>
                  <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#3d3434]">
                    Primjeri slobodnih termina
                  </p>
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
                  <p className="text-xs leading-relaxed text-[#3d3434]">
                    {day.shortOnly ? "Ove rupe stanu samo za kraće tretmane (npr. pazusi, nadusnica). " : ""}
                    Točni termini ovise o trajanju tretmana. Ako odabrano vrijeme ne odgovara tvom tretmanu, u
                    rezervaciji ti pokazujemo najbliže termine s −10 %.
                  </p>
                </>
              ) : (
                <p className="text-[15px] text-[#3d3434]">Ovaj dan termini su po redovnoj cijeni.</p>
              )}

              <a
                href={href}
                className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0C0C0C] px-8 text-[13px] font-extrabold uppercase tracking-[0.05em] text-white lg:w-auto lg:self-start lg:text-[15px]"
              >
                {time ? `Nastavi · ${day.date.slice(8)}.${Number(day.date.slice(5, 7))}. oko ${time}` : "Nastavi s ovim danom"}
              </a>
              <p className="text-xs text-[#3d3434]">
                Sljedeći korak: odaberi tretman, pa potvrdi vrijeme. −10 % na cijenu iz cjenika · najviše 3 povoljna
                termina dnevno · samo online · ne zbraja se s drugim popustima ·{" "}
                <span className="font-bold text-[#0C0C0C] underline">Uvjeti</span>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
