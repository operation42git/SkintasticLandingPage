"use client";

import { useEffect, useState } from "react";
import { buildBookingHref, type LinkConsent } from "@/config/booking";
import "@/config/consent";
import { CONSENT_UPDATED_EVENT, getConsent, getHandover } from "@/lib/consent";

/**
 * The cookie choice a booking link carries: ad-click IDs only while ads are allowed, and the handover (consent value and
 * id) once a choice exists. Follows a change of choice without a reload.
 */
export function useLinkConsent(): LinkConsent {
  const [consent, setConsent] = useState<LinkConsent>({ adsAllowed: false });

  useEffect(() => {
    const read = () => {
      const handover = getHandover();
      setConsent({ adsAllowed: getConsent()?.ads === true, ...(handover ? { handover } : {}) });
    };
    read();
    window.addEventListener(CONSENT_UPDATED_EVENT, read);
    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, read);
  }, []);

  return consent;
}

type BookButtonProps = {
  centar?: string;
  usluga?: string;
  className?: string;
  children: React.ReactNode;
};

export function BookButton({ centar, usluga, className, children }: BookButtonProps) {
  const consent = useLinkConsent();
  const [href, setHref] = useState(() => buildBookingHref({ centar, usluga }));

  useEffect(() => {
    setHref(buildBookingHref({ centar, usluga }, window.location.search, consent));
  }, [centar, usluga, consent]);

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
