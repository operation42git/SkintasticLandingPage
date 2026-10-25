// Look-only preview of the off-peak ("Povoljniji termini") section, v2: times only, no service picker.
// WEEK is example data in the shape the booking app would expose for the landing page; the service,
// the exact slots and the final off-peak nudge stay in the booking app.

import { BookButton } from "@/components/ui/BookButton";

type OffPeakDay = {
  weekday: string;
  date: string;
  status: "open" | "full" | "closed";
  /** The whole day is discounted ("mirni dan"). */
  wholeDay: boolean;
  /** Discounted mornings end at this time; null when the morning is not discounted. */
  morningUntil: string | null;
  /** Short gaps in the schedule are discounted; which ones fit depends on the treatment. */
  gaps: boolean;
};

const CENTRE = { name: "Skintastic Zapad", slug: "zagreb-zapad" };

const WEEK: OffPeakDay[] = [
  { weekday: "Pon", date: "26.10.", status: "open", wholeDay: true, morningUntil: null, gaps: false },
  { weekday: "Uto", date: "27.10.", status: "open", wholeDay: false, morningUntil: "11:00", gaps: true },
  { weekday: "Sri", date: "28.10.", status: "open", wholeDay: false, morningUntil: "11:00", gaps: true },
  { weekday: "Čet", date: "29.10.", status: "full", wholeDay: false, morningUntil: null, gaps: false },
  { weekday: "Pet", date: "30.10.", status: "open", wholeDay: false, morningUntil: "11:00", gaps: true },
  { weekday: "Sub", date: "31.10.", status: "closed", wholeDay: false, morningUntil: null, gaps: false },
  { weekday: "Ned", date: "1.11.", status: "closed", wholeDay: false, morningUntil: null, gaps: false },
];

function DayCard({ day }: { day: OffPeakDay }) {
  const muted = day.status !== "open" || (!day.wholeDay && !day.morningUntil && !day.gaps);

  return (
    <article className={`flex h-full flex-col gap-2 p-3.5 lg:p-4 ${muted ? "bg-[#f5f0e8]" : "bg-white"}`}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-extrabold uppercase lg:text-[15px]">{day.weekday}</h3>
        <span className="text-[13px] text-[#3d3434]">{day.date}</span>
      </div>

      {day.status === "closed" ? (
        <p className="text-[13px] text-[#8a7d78]">Zatvoreno</p>
      ) : day.status === "full" ? (
        <p className="text-[13px] text-[#8a7d78]">Popunjeno</p>
      ) : (
        <div className="flex flex-col items-start gap-1.5">
          {day.wholeDay ? (
            <span className="rounded-full bg-[#c9a96e] px-2.5 py-1 text-xs font-extrabold">Cijeli dan −10 %</span>
          ) : null}
          {day.morningUntil ? (
            <span className="rounded-full bg-[#e2c48f] px-2.5 py-1 text-xs font-extrabold">
              Do {day.morningUntil} −10 %
            </span>
          ) : null}
          {day.gaps ? <span className="text-xs text-[#3d3434]">+ kraće rupe u rasporedu</span> : null}
        </div>
      )}
    </article>
  );
}

export function OffPeakPreviewSection() {
  return (
    <section id="povoljniji-termini" className="bg-[#f5e6de] text-[#0C0C0C]">
      <div className="mx-auto max-w-[1320px] px-0 py-9 lg:px-6 lg:py-20">
        <div className="mb-[18px] px-4 text-center lg:mb-11 lg:px-0">
          <p className="mb-1 text-[11px] uppercase tracking-[3px] lg:mb-2 lg:text-[15px] lg:tracking-[5px]">
            {CENTRE.name} · ovaj tjedan
          </p>
          <h2 className="font-script text-[44px] font-normal leading-none lg:text-[60px]">Povoljniji termini</h2>
          <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-relaxed text-[#3d3434] lg:mt-4 lg:text-base">
            <strong className="text-[#0C0C0C]">−10 % na sve tretmane</strong> u mirnijim terminima, dok ima
            mjesta. Tretman i točno vrijeme biraš u rezervaciji.
          </p>
        </div>

        {/* Phone: swipe row, like Najbolje ponude */}
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1.5 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {WEEK.map((day) => (
            <div key={day.date} className="w-[150px] shrink-0 snap-start">
              <DayCard day={day} />
            </div>
          ))}
        </div>

        {/* Desktop: the whole week in one row */}
        <div className="hidden grid-cols-7 gap-4 lg:grid">
          {WEEK.map((day) => (
            <DayCard key={day.date} day={day} />
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 px-4 lg:mt-9 lg:px-0">
          <BookButton
            centar={CENTRE.slug}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0C0C0C] px-8 text-[13px] font-extrabold uppercase tracking-[0.05em] text-white lg:h-auto lg:w-auto lg:py-4 lg:text-[15px]"
          >
            Pogledaj povoljne termine
          </BookButton>
          <p className="max-w-[640px] text-center text-xs leading-relaxed text-[#3d3434] lg:text-[13px]">
            −10 % na cijenu iz cjenika · najviše 3 povoljna termina dnevno · samo online · ne zbraja se s drugim
            popustima · <span className="font-bold text-[#0C0C0C] underline">Uvjeti</span>
          </p>
        </div>
      </div>
    </section>
  );
}
