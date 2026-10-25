// Look-only preview of the off-peak ("Povoljniji termini") section, with fixed example data.
// Not a feature: nothing here reads the booking app, and the pills, cells and chips do nothing.

type Cell = "Q" | "M" | "G" | "F" | "B" | "X" | "C";

const DAYS = ["Pon 26.", "Uto 27.", "Sri 28.", "Čet 29.", "Pet 30.", "Sub 31.", "Ned 1."];

const DAY_NOTES: Record<number, string> = {
  0: "Cijeli dan",
  3: "Popunjeno",
  5: "Zatvoreno",
  6: "Zatvoreno",
};

const ROWS: { time: string; cells: Cell[] }[] = [
  { time: "09:00", cells: ["Q", "M", "B", "C", "M", "X", "X"] },
  { time: "10:00", cells: ["Q", "M", "M", "C", "M", "X", "X"] },
  { time: "11:00", cells: ["Q", "B", "F", "F", "B", "X", "X"] },
  { time: "12:00", cells: ["B", "F", "B", "C", "B", "X", "X"] },
  { time: "13:00", cells: ["Q", "G", "F", "F", "F", "X", "X"] },
  { time: "14:00", cells: ["Q", "F", "G", "B", "F", "X", "X"] },
  { time: "15:00", cells: ["B", "B", "F", "B", "G", "X", "X"] },
  { time: "16:00", cells: ["Q", "F", "G", "F", "F", "X", "X"] },
];

const CELL_CLASS: Record<Cell, string> = {
  Q: "bg-[#c9a96e]",
  M: "bg-[#e2c48f]",
  G: "bg-[#8fb39a]",
  F: "bg-white",
  B: "bg-[#ece5de]",
  X: "bg-[#ddd5cd]",
  C: "border border-dashed border-[#b9aea4] bg-white",
};

const DISCOUNTED: Cell[] = ["Q", "M", "G"];

const LEGEND = [
  { label: "Mirni dan (cijeli dan)", swatch: "bg-[#c9a96e]" },
  { label: "Jutro do 11:00", swatch: "bg-[#e2c48f]" },
  { label: "Rupa u rasporedu", swatch: "bg-[#8fb39a]" },
  { label: "Slobodno, redovna cijena", swatch: "border border-[#b9aea4] bg-white" },
  { label: "Zauzeto", swatch: "bg-[#ece5de]" },
];

const DESKTOP_PILLS = ["Pazusi · 15 min", "Nadusnica", "Lice", "Cijele noge · 60 min", "Ostalo ▾"];
const PHONE_PILLS = ["Pazusi", "Lice", "Noge", "▾"];
const DOT_DAYS = [0, 1, 2, 4];

const TIMES = [
  { time: "09:00", kind: "M" },
  { time: "09:15", kind: "M" },
  { time: "09:30", kind: "M" },
  { time: "10:00", kind: "M" },
  { time: "10:30", kind: "M" },
  { time: "13:15", kind: "G" },
  { time: "14:00", kind: "F" },
  { time: "16:00", kind: "F" },
] as const;

function Pill({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border-[1.5px] border-[#0C0C0C] px-4 py-2 text-[13px] font-bold lg:text-sm ${
        selected ? "bg-[#0C0C0C] text-white" : "bg-white text-[#0C0C0C]"
      }`}
    >
      {label}
    </span>
  );
}

export function OffPeakPreviewSection() {
  return (
    <section id="povoljniji-termini" className="bg-[#f5f0e8] text-[#0C0C0C]">
      <div className="mx-auto max-w-[1320px] px-4 py-9 lg:px-6 lg:py-20">
        <div className="mb-[18px] text-center lg:mb-8">
          <p className="mb-1 text-[11px] uppercase tracking-[3px] lg:mb-2 lg:text-[15px] lg:tracking-[5px]">
            Skintastic Zapad
          </p>
          <h2 className="font-script text-[44px] font-normal leading-none lg:text-[60px]">
            <span className="lg:hidden">Povoljniji termini</span>
            <span className="hidden lg:inline">Povoljniji termini ovaj tjedan</span>
          </h2>
          <p className="mx-auto mt-4 hidden max-w-[640px] text-base leading-relaxed text-[#3d3434] lg:block">
            Termini se mijenjaju kako se kalendar puni. Odaberi tretman, jer kraći tretmani stanu i u kratke
            rupe.
          </p>
        </div>

        {/* Desktop: week grid */}
        <div className="hidden lg:block">
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {DESKTOP_PILLS.map((label, i) => (
              <Pill key={label} label={label} selected={i === 0} />
            ))}
          </div>

          <div className="mx-auto max-w-[920px] bg-white/60 p-5">
            <div className="grid grid-cols-[56px_repeat(7,minmax(0,1fr))] gap-[3px]">
              <span />
              {DAYS.map((day) => (
                <span key={day} className="pb-1 text-center text-[13px] font-extrabold">
                  {day}
                </span>
              ))}
              {ROWS.map((row) => (
                <div key={row.time} className="contents">
                  <span className="flex h-7 items-center text-xs font-semibold text-[#3d3434]">{row.time}</span>
                  {row.cells.map((cell, i) => (
                    <span
                      key={`${row.time}-${i}`}
                      className={`flex h-7 items-center justify-center rounded-md text-xs font-extrabold ${CELL_CLASS[cell]}`}
                    >
                      {DISCOUNTED.includes(cell) ? "−10 %" : ""}
                    </span>
                  ))}
                </div>
              ))}
              <span />
              {DAYS.map((day, i) => (
                <span key={`${day}-note`} className="pt-1 text-center text-[11px] text-[#8a7d78]">
                  {DAY_NOTES[i] ?? ""}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px]">
            {LEGEND.map((item) => (
              <span key={item.label} className="inline-flex items-center gap-2">
                <span className={`inline-block h-3.5 w-3.5 rounded-[4px] ${item.swatch}`} />
                {item.label}
              </span>
            ))}
          </div>

          <p className="mx-auto mt-5 max-w-[760px] text-center text-[13px] leading-relaxed text-[#3d3434]">
            Dodir na termin otvara rezervaciju s tim tretmanom i vremenom. −10 % na cijenu iz cjenika, najviše 3
            povoljna termina dnevno, samo online, ne zbraja se s drugim popustima.{" "}
            <span className="font-bold text-[#0C0C0C] underline">Uvjeti</span>
          </p>
        </div>

        {/* Phone: one day at a time */}
        <div className="lg:hidden">
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {PHONE_PILLS.map((label, i) => (
              <Pill key={label} label={label} selected={i === 0} />
            ))}
          </div>

          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {DAYS.map((day, i) => (
              <span
                key={day}
                className={`relative flex h-14 w-[52px] shrink-0 flex-col items-center justify-center rounded-xl text-[12px] font-bold leading-tight ${
                  i === 1 ? "bg-[#0C0C0C] text-white" : "bg-white text-[#0C0C0C]"
                }`}
              >
                {day.split(" ").map((part) => (
                  <span key={part}>{part}</span>
                ))}
                {DOT_DAYS.includes(i) ? (
                  <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-[#c9a96e]" />
                ) : null}
              </span>
            ))}
          </div>

          <p className="mt-5 mb-2.5 text-[15px] font-extrabold">Utorak 27.10.</p>
          <div className="flex flex-wrap gap-2">
            {TIMES.map(({ time, kind }) => (
              <span
                key={time}
                className={`inline-flex items-center rounded-full px-3.5 py-2 text-[13px] font-bold ${CELL_CLASS[kind]}`}
              >
                {time}
                {kind === "F" ? "" : " −10 %"}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#3d3434]">Zlatno: jutro do 11:00 · zeleno: rupa u rasporedu</p>

          <span className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-[#0C0C0C] text-[13px] font-extrabold uppercase tracking-[0.05em] text-white">
            Rezerviraj 09:00 · −10 %
          </span>
          <p className="mt-3 text-center text-xs text-[#3d3434]">
            Najviše 3 povoljna termina dnevno · samo online ·{" "}
            <span className="font-bold text-[#0C0C0C] underline">Uvjeti</span>
          </p>
        </div>
      </div>
    </section>
  );
}
