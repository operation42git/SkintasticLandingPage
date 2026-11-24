"use client";

import "./v2.css";
import type { ReactNode } from "react";
import { hanken, newsreader } from "./fonts";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * The landing's header and footer around another page (Impressum, Datenschutz). The page's own content stays
 * outside `.v2`, so the landing's heading styles don't apply to the legal text.
 */
export function V2Shell({ children }: { children: ReactNode }) {
  const fonts = `${newsreader.variable} ${hanken.variable}`;
  return (
    <>
      <div className={`v2 ${fonts}`}>
        <Header />
      </div>
      {children}
      <div className={`v2 ${fonts}`}>
        <Footer />
      </div>
    </>
  );
}
