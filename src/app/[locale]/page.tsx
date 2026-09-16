import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { OffersSection } from "@/components/sections/OffersSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { VideoLogoSection } from "@/components/sections/VideoLogoSection";
import { TechnologySection } from "@/components/sections/TechnologySection";
import { FaqSection } from "@/components/sections/FaqSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { CertificatesSection } from "@/components/sections/CertificatesSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
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
        <FeaturesSection />
        <OffersSection />
        <LocationsSection />
        <ServicesSection />
        <QuoteSection />
        <VideoLogoSection />
        <TechnologySection />
        <FaqSection />
        <AboutSection />
        <CertificatesSection />
        <ReviewsSection />
        <GoetheQuoteSection />
      </main>
      <Footer />
    </>
  );
}
