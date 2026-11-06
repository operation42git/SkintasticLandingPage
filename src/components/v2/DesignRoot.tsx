"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { DESIGN_EVENT, designFromPage, type Design } from "@/config/design";
import { V2Page } from "./V2Page";

// The previous design is loaded only when a tester asks for it: ordinary visitors download none of it.
const OldPage = dynamic(() => import("@/components/OldPage").then((module) => module.OldPage), { ssr: false });

/**
 * Renders the new design (server-rendered, so search engines and first paint see it) unless this browser asked
 * for the previous one. The choice is read after load, so a tester on "Sada" sees the new design for a moment.
 */
export function DesignRoot() {
  const [design, setDesign] = useState<Design>("novo");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(window.location.search);
    setDesign(designFromPage(window.location.search));
    // The design button in either header (DesignToggle) sends the new choice.
    const onChoose = (event: Event) => setDesign((event as CustomEvent<Design>).detail);
    window.addEventListener(DESIGN_EVENT, onChoose);
    return () => window.removeEventListener(DESIGN_EVENT, onChoose);
  }, []);

  if (design === "sada") return <OldPage />;
  return <V2Page search={search} />;
}
