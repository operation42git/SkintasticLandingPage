"use client";

// Look-only preview of three time-first options for "Povoljniji termini" (no services on the landing page:
// the client sees when it is cheaper, picks a time, then chooses the treatment in booking).
// DAYS is example data in the shape the booking app would expose; nothing here is wired to booking yet.

import { useState } from "react";
import { BookButton } from "@/components/ui/BookButton";

type Tier = "day" | "morning" | "gap" | "regular" | "closed" | "full";
type Slot = { time: string; kind: "morning" | "gap" | "day" | "regular" };
type Day = { weekday: string; date: string; label: string; tier: Tier; slots: Slot[] };

const CENTRE = { name: "Skintastic Zapad", slug: "zagreb-zapad" };

const MORNING: Slot[] = [
  { time: "09:00", kind: "morning" },
  { time: "09:30", kind: "morning" },
  { time: "10:00", kind: "morning" },
  { time: "10:30", kind: "morning" },
];

const DAYS: Day[] = [
  { weekday: "Pon", date: "26.", label: "Ponedjeljak 26.10.", tier: "day", slots: ["09:00", "10:00", "11:00", "13:00", "14:00", "16:00"].map((time) => ({ time, kind: "day" as const })) },
  { weekday: "Uto", date: "27.", label: "Utorak 27.10.", tier: "morning", slots: [...MORNING, { time: "13:15", kind: "gap" }, { time: "14:00", kind: "regular" }, { time: "16:00", kind: "regular" }] },
  { weekday: "Sri", date: "28.", label: "Srijeda 28.10.", tier: "morning", slots: [{ time: "10:00", kind: "morning" }, { time: "14:15", kind: "gap" }, { time: "16:30", kind: "gap" }, { time: "11:00", kind: "regular" }] },
  { weekday: "Čet", date: "29.", label: "Četvrtak 29.10.", tier: "full", slots: [] },
  { weekday: "Pet", date: "30.", label: "Petak 30.10.", tier: "gap", slots: [{ time: "15:15", kind: "gap" }, { time: "13:00", kind: "regular" }, { time: "16:00", kind: "regular" }] },
  { weekday: "Sub", date: "31.", label: "Subota 31.10.", tier: "closed", slots: [] },
  { weekday: "Ned", date: "1.", label: "Nedjelja 1.11.", tier: "closed", slots: [] },
  { weekday: "Pon", date: "2.", label: "Ponedjeljak 2.11.", tier: "morning", slots: [...MORNING, { time: "15:00", kind: "regular" }] },
  { weekday: "Uto", date: "3.", label: "Utorak 3.11.", tier: "day", slots: ["09:00", "11:00", "12:00", "14:00", "15:00"].map((time) => ({ time, kind: "day" as const })) },
  { weekday: "Sri", date: "4.", label: "Srijeda 4.11.", tier: "regular", slots: [{ time: "12:00", kind: "regular" }, { time: "15:00", kind: "regular" }] },
  { weekday: "Čet", date: "5.", label: "Četvrtak 5.11.", tier: "morning", slots: [{ time: "09:00", kind: "morning" }, { time: "10:30", kind: "morning" }, { time: "13:00", kind: "regular" }] },
  { weekday: "Pet", date: "6.", label: "Petak 6.11.", tier: "gap", slots: [{ time: "11:15", kind: "gap" }, { time: "14:00", kind: "regular" }] },
  { weekday: "Sub", date: "7.", label: "Subota 7.11.", tier: "closed", slots: [] },
  { weekday: "Ned", date: "8.", label: "Nedjelja 8.11.", tier: "closed", slots: [] },
];

const TIER: Record<Tier, { cell: string; text: string }> = {
  day: { cell: "bg-[#c9a96e]", text: "−10 % cijeli dan" },
  morning: { cell: "bg-[#e2c48f]", text: "−10 % ujutro" },
  gap: { cell: "bg-[#cfe0d3]", text: "−10 % u rupama" },
  regular: { cell: "bg-white", text: "Redovna cijena" },
  full: { cell: "bg-[#ece5de] text-[#8a7d78]", text: "Popunjeno" },
  closed: { cell: "bg-[#ddd5cd] text-[#8a7d78]", text: "Zatvoreno" },
};

const SLOT: Record<Slot["kind"], string> = {
  day: "bg-[#c9a96e]",
  morning: "bg-[#e2c48f]",
  gap: "bg-[#8fb39a]",
  regular: "border border-[#d9cfc7] bg-white",
};

const TERMS = "−10 % na cijenu iz cjenika · najviše 3 povoljna termina dnevno · samo online · ne zbraja se s drugim popustima";
const BUTTON =
  "inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0C0C0C] px-8 text-[13px] font-extrabold uppercase tracking-[0.05em] text-white lg:w-auto lg:text-[15px]";

function OptionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-auto mb-6 w-fit rounded-full border border-dashed border-[#0C0C0C] px-4 py-1.5 text-center text-xs font-bold uppercase tracking-[0.1em]">
      {children}
    </p>
  );
}

function Heading({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="mb-6 px-4 text-center lg:mb-10 lg:px-0">
      <p className="mb-1 text-[11px] uppercase tracking-[3px] lg:mb-2 lg:text-[15px] lg:tracking-[5px]">{CENTRE.name}</p>
      <h2 className="font-script text-[44px] font-normal leading-none lg:text-[60px]">{title}</h2>
      <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-relaxed text-[#3d3434] lg:text-base">{lead}</p>
    </div>
  );
}

function SlotChip({ slot }: { slot: Slot }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3.5 py-2 text-[13px] font-bold ${SLOT[slot.kind]}`}>
      {slot.time}
      {slot.kind === "regular" ? "" : " −10 %"}
    </span>
  );
}

function Legend() {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs lg:text-[13px]">
      {(["day", "morning", "gap", "regular"] as Tier[]).map((tier) => (
        <span key={tier} className="inline-flex items-center gap-2">
          <span className={`inline-block h-3.5 w-3.5 rounded-[4px] border border-[#d9cfc7] ${TIER[tier].cell}`} />
          {TIER[tier].text}
        </span>
      ))}
    </div>
  );
}

/** A · airline-style fare calendar: two weeks coloured by how cheap the day is, the chosen day's times beside it. */
function OptionCalendar() {
  const [selected, setSelected] = useState(1);
  const day = DAYS[selected];
  const discounted = day.slots.filter((slot) => slot.kind !== "regular");
  const regular = day.slots.filter((slot) => slot.kind === "regular");

  return (
    <div className="bg-[#f5e6de] py-9 lg:py-20">
      <div className="mx-auto max-w-[1320px] lg:px-6">
        <OptionLabel>Opcija A · kalendar kao kod zrakoplovnih kompanija</OptionLabel>
        <Heading title="Povoljniji termini" lead="Odaberi dan u kalendaru. Što je dan tamniji, to je više termina s −10 %." />

        <div className="flex flex-col gap-6 px-4 lg:flex-row lg:items-start lg:gap-10 lg:px-0">
          <div className="bg-white p-3 lg:flex-[1.3] lg:p-6">
            <div className="mb-3 flex items-center justify-between text-sm font-extrabold uppercase">
              <span>‹</span>
              <span>26.10. – 8.11.</span>
              <span>›</span>
            </div>
            <div className="grid grid-cols-7 gap-1 lg:gap-1.5">
              {["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"].map((name) => (
                <span key={name} className="pb-1 text-center text-[11px] font-bold text-[#3d3434] lg:text-xs">
                  {name}
                </span>
              ))}
              {DAYS.map((item, index) => {
                const disabled = item.tier === "closed" || item.tier === "full";
                return (
                  <button
                    key={item.label}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSelected(index)}
                    className={`flex h-14 flex-col items-center justify-center rounded-md text-sm font-extrabold lg:h-[74px] lg:text-base ${TIER[item.tier].cell} ${
                      index === selected ? "ring-2 ring-[#0C0C0C] ring-offset-1" : ""
                    }`}
                  >
                    {item.date}
                    <span className="hidden text-[11px] font-semibold lg:block">
                      {item.tier === "regular" ? "" : TIER[item.tier].text.replace("−10 % ", "")}
                    </span>
                    {item.tier === "day" || item.tier === "morning" || item.tier === "gap" ? (
                      <span className="text-[10px] font-bold lg:hidden">−10 %</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <Legend />
          </div>

          <div className="flex flex-col gap-3 lg:flex-1">
            <p className="text-lg font-extrabold">{day.label}</p>
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#3d3434]">Termini s −10 %</p>
            <div className="flex flex-wrap gap-2">
              {discounted.map((slot) => (
                <SlotChip key={slot.time} slot={slot} />
              ))}
            </div>
            {regular.length ? (
              <>
                <p className="mt-1 text-[13px] font-bold uppercase tracking-[0.08em] text-[#3d3434]">Ostali termini</p>
                <div className="flex flex-wrap gap-2">
                  {regular.map((slot) => (
                    <SlotChip key={slot.time} slot={slot} />
                  ))}
                </div>
              </>
            ) : null}
            <p className="text-xs text-[#3d3434]">Zeleni termini su kraće rupe u rasporedu – za kraće tretmane.</p>
            <BookButton centar={CENTRE.slug} className={`${BUTTON} mt-2 lg:self-start`}>
              {`Rezerviraj ${discounted[0]?.time ?? ""} · odaberi tretman`}
            </BookButton>
            <p className="text-xs text-[#3d3434]">{TERMS}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** B · last-minute list: the next concrete discounted times, each one tappable. */
function OptionNext() {
  const next = DAYS.flatMap((day) =>
    day.slots
      .filter((slot) => slot.kind !== "regular")
      .slice(0, 2)
      .map((slot) => ({ ...slot, day })),
  ).slice(0, 8);
  const KIND_TEXT: Record<Slot["kind"], string> = {
    day: "Mirni dan",
    morning: "Jutro",
    gap: "Rupa · kraći tretmani",
    regular: "",
  };

  return (
    <div className="bg-[#EFD5CA] py-9 lg:py-20">
      <div className="mx-auto max-w-[1320px] lg:px-6">
        <OptionLabel>Opcija B · prvi slobodni povoljni termini</OptionLabel>
        <Heading title="Prvi povoljni termini" lead="Uzmi jedan od sljedećih termina uz −10 %. Tretman biraš u sljedećem koraku." />

        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1.5 [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          {next.map((slot) => (
            <article key={`${slot.day.label}-${slot.time}`} className="flex w-[170px] shrink-0 snap-start flex-col gap-2 bg-white p-4 lg:w-auto">
              <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-[#3d3434]">
                {slot.day.weekday} {slot.day.date}
              </p>
              <p className="text-[32px] font-extrabold leading-none">{slot.time}</p>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${SLOT[slot.kind]}`}>−10 %</span>
                <span className="text-xs text-[#3d3434]">{KIND_TEXT[slot.kind]}</span>
              </div>
              <BookButton
                centar={CENTRE.slug}
                className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-[#0C0C0C] text-xs font-extrabold uppercase tracking-[0.05em] text-white"
              >
                Rezerviraj
              </BookButton>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center gap-3 px-4">
          <BookButton centar={CENTRE.slug} className="text-[15px] font-extrabold underline">
            Svi povoljni termini →
          </BookButton>
          <p className="max-w-[640px] text-center text-xs text-[#3d3434]">{TERMS}</p>
        </div>
      </div>
    </div>
  );
}

/** C · the booking calendar step brought forward: pick a day, then a time. */
function OptionPicker() {
  const open = DAYS.slice(0, 7);
  const [selected, setSelected] = useState(0);
  const day = open[selected];

  return (
    <div className="bg-[#f5f0e8] py-9 lg:py-20">
      <div className="mx-auto max-w-[900px] lg:px-6">
        <OptionLabel>Opcija C · odaberi dan, pa vrijeme</OptionLabel>
        <Heading title="Kada ti odgovara?" lead="Odaberi dan i vrijeme. Termini s −10 % su označeni, tretman biraš nakon toga." />

        <div className="px-4 lg:px-0">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-7 lg:px-0 [&::-webkit-scrollbar]:hidden">
            {open.map((item, index) => {
              const disabled = item.tier === "closed" || item.tier === "full";
              const cheap = item.tier === "day" || item.tier === "morning" || item.tier === "gap";
              return (
                <button
                  key={item.label}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelected(index)}
                  className={`relative flex h-16 w-[56px] shrink-0 flex-col items-center justify-center rounded-xl text-[13px] font-bold lg:w-auto ${
                    index === selected ? "bg-[#0C0C0C] text-white" : disabled ? "bg-[#ece5de] text-[#8a7d78]" : "bg-white"
                  }`}
                >
                  <span>{item.weekday}</span>
                  <span>{item.date}</span>
                  {cheap ? <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-[#c9a96e]" /> : null}
                </button>
              );
            })}
          </div>

          <p className="mt-6 mb-3 text-lg font-extrabold">{day.label}</p>
          <div className="flex flex-wrap gap-2">
            {day.slots.map((slot) => (
              <SlotChip key={slot.time} slot={slot} />
            ))}
          </div>
          <p className="mt-3 text-xs text-[#3d3434]">Zlatno: mirni dan i jutro · zeleno: kraće rupe u rasporedu · točka: dan s −10 %</p>
          <div className="mt-5 flex flex-col items-center gap-3">
            <BookButton centar={CENTRE.slug} className={BUTTON}>
              {`Rezerviraj ${day.slots[0]?.time ?? ""} · odaberi tretman`}
            </BookButton>
            <p className="text-center text-xs text-[#3d3434]">{TERMS}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OffPeakPreviewSection() {
  return (
    <section id="povoljniji-termini" className="text-[#0C0C0C]">
      <OptionCalendar />
      <OptionNext />
      <OptionPicker />
    </section>
  );
}
