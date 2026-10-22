"use client";

import { useEffect, useState } from "react";
import { buildBookingHref } from "@/config/booking";

type BookButtonProps = {
  centar?: string;
  usluga?: string;
  className?: string;
  children: React.ReactNode;
};

export function BookButton({ centar, usluga, className, children }: BookButtonProps) {
  const [href, setHref] = useState(() => buildBookingHref({ centar, usluga }));

  useEffect(() => {
    setHref(buildBookingHref({ centar, usluga }, window.location.search));
  }, [centar, usluga]);

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
