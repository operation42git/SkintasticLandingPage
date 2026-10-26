"use client";

import { useOffpeakStudios } from "@/config/offpeak";

type OffPeakLinkProps = {
  /** A studio's slug: shown only when that studio has a calendar. Without it: when any studio has one. */
  studio?: string;
  className?: string;
  children: React.ReactNode;
};

/** A link to the off-peak calendar, drawn only while the calendar is on the page. */
export function OffPeakLink({ studio, className, children }: OffPeakLinkProps) {
  const studios = useOffpeakStudios();
  if (studio ? !studios.includes(studio) : studios.length === 0) return null;
  return (
    <a href={studio ? `#povoljni-${studio}` : "#povoljniji-termini"} className={className}>
      {children}
    </a>
  );
}
