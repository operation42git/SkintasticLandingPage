"use client";

import "./v2.css";
import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * The landing's header and footer around another page (Impressum, Datenschutz). The page's own content stays
 * outside `.v2`, so the landing's heading styles don't apply to the legal text.
 */
export function V2Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="v2">
        <Header />
      </div>
      {children}
      <div className="v2">
        <Footer />
      </div>
    </>
  );
}
