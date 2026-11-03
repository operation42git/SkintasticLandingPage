"use client";

import "./v2.css";
import { useState } from "react";
import { activeOffersV2 } from "@/config/offers-v2";
import { hanken, newsreader } from "./fonts";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Treatments } from "./Treatments";
import { Offers } from "./Offers";
import { Steps } from "./Steps";
import { Review } from "./Review";
import { Why } from "./Why";
import { Technology } from "./Technology";
import { About } from "./About";
import { Locations } from "./Locations";
import { Faq } from "./Faq";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { StickyBar } from "./StickyBar";

/** The new design, in the mockup's "Novo" order. */
export function V2Page({ search }: { search: string }) {
  const [offers] = useState(() => activeOffersV2(search));
  return (
    <div className={`v2 ${newsreader.variable} ${hanken.variable}`}>
      <Header />
      <main>
        <Hero />
        <Treatments />
        <Offers offers={offers} />
        <Steps />
        <Review />
        <Why />
        <Technology />
        <About />
        <Locations />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <StickyBar />
    </div>
  );
}
