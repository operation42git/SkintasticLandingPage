"use client";

import "./v2.css";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { loadOffers, setOffersShown, type OfferWindowV2 } from "@/config/offers-v2";
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
  const locale = useLocale();
  // The partner's offers from the app (or the ?ponude=demo set), read once the page is in the browser.
  const [offers, setOffers] = useState<OfferWindowV2[]>([]);
  useEffect(() => {
    let cancelled = false;
    loadOffers(search, locale).then((loaded) => {
      if (cancelled) return;
      setOffers(loaded);
      setOffersShown(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [search, locale]);
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
