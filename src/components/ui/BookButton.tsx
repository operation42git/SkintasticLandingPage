"use client";

import { useEffect, useState } from "react";
import { buildBookingHref } from "@/config/booking";
import "@/config/consent";
import { CONSENT_UPDATED_EVENT, getConsent } from "@/lib/consent";

/** True while the visitor has allowed ads; follows a change of choice without a reload. Ad-click IDs travel only then. */
export function useAdsAllowed(): boolean {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const read = () => setAllowed(getConsent()?.ads === true);
    read();
    window.addEventListener(CONSENT_UPDATED_EVENT, read);
    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, read);
  }, []);

  return allowed;
}

type BookButtonProps = {
  centar?: string;
  usluga?: string;
  className?: string;
  children: React.ReactNode;
};

export function BookButton({ centar, usluga, className, children }: BookButtonProps) {
  const adsAllowed = useAdsAllowed();
  const [href, setHref] = useState(() => buildBookingHref({ centar, usluga }));

  useEffect(() => {
    setHref(buildBookingHref({ centar, usluga }, window.location.search, adsAllowed));
  }, [centar, usluga, adsAllowed]);

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
