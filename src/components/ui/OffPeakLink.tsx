"use client";

import { useOffersShown } from "@/config/offers-v2";

type OffPeakLinkProps = {
  /** A studio's slug: shown only when an offer includes that studio. Without it: when there is any offer. */
  studio?: string;
  className?: string;
  children: React.ReactNode;
};

/** A link to the offers section, drawn only while the section shows offers (landing-offers-live). */
export function OffPeakLink({ studio, className, children }: OffPeakLinkProps) {
  const offers = useOffersShown();
  const shown = studio ? offers.some((offer) => offer.locations.some((l) => l.slug === studio)) : offers.length > 0;
  if (!shown) return null;
  return (
    <a href="#povoljniji-termini" className={className}>
      {children}
    </a>
  );
}
