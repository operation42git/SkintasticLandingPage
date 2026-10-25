import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { OffersSection } from "@/components/sections/OffersSection";
import { OffPeakPreviewSection } from "@/components/sections/OffPeakPreviewSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { WhySection } from "@/components/sections/WhySection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { GoetheQuoteSection } from "@/components/sections/GoetheQuoteSection";
import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="max-w-full overflow-x-clip">
        <HeroSection />
        <OffersSection />
        <OffPeakPreviewSection />
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
