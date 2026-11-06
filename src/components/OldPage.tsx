"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { OffersSection } from "@/components/sections/OffersSection";
import { OffPeakSection } from "@/components/sections/OffPeakSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { WhySection } from "@/components/sections/WhySection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { GoetheQuoteSection } from "@/components/sections/GoetheQuoteSection";

/**
 * The previous design ("Sada"). Since Ivan's decision of 2026-11-06 the new design is the default, so this page
 * is loaded in the browser only for a tester who chose it (?dizajn=sada or the header's design button).
 */
export function OldPage() {
  return (
    <>
      <Header />
      <main className="max-w-full overflow-x-clip">
        <HeroSection />
        <OffersSection />
        <OffPeakSection />
        <HowItWorksSection />
        <WhySection />
        <ReviewsSection />
        <LocationsSection />
        <FaqSection />
        <ContactSection />
        <GoetheQuoteSection />
      </main>
      <Footer />
    </>
  );
}
