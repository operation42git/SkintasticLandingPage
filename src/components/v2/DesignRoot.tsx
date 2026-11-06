"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { DESIGN_EVENT, designFromPage, type Design } from "@/config/design";

// Loaded only when this browser asks for the new design: ordinary visitors download none of its code,
// styles or fonts.
const V2Page = dynamic(() => import("./V2Page").then((module) => module.V2Page), { ssr: false });

/**
 * Renders the current page (server-rendered, passed in as children) unless this browser asked for the
 * new design. The choice is read after load, so switch users see the current design for a moment first.
 */
export function DesignRoot({ children }: { children: React.ReactNode }) {
  const [design, setDesign] = useState<Design>("sada");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(window.location.search);
    setDesign(designFromPage(window.location.search));
    // The design button in either header (DesignToggle) sends the new choice.
    const onChoose = (event: Event) => setDesign((event as CustomEvent<Design>).detail);
    window.addEventListener(DESIGN_EVENT, onChoose);
    return () => window.removeEventListener(DESIGN_EVENT, onChoose);
  }, []);

  if (design !== "novo") return <>{children}</>;
  return <V2Page search={search} />;
}
