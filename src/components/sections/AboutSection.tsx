import type { ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function AboutSection() {
  const t = useTranslations("about");

  const rich = {
    strong: (chunks: ReactNode) => <strong>{chunks}</strong>,
  };

  return (
    <section
      id="about"
      className="relative min-h-[930px] overflow-hidden bg-[#e7c3b2]"
    >
      <Image
        src="/images/about/frau-links.png"
        alt=""
        fill
        className="object-cover object-[100%_50%]"
        sizes="100vw"
      />

      <div className="relative z-10 mx-auto flex min-h-[930px] w-full max-w-[1500px] items-center px-6 py-16 md:px-[50px] md:py-20">
        <div className="ml-auto w-full lg:w-1/2">
          <p className="mb-2 text-center text-[14px] uppercase tracking-[5px] text-[#0C0C0C]">
            {t("badge")}
          </p>
          <h2 className="font-script mb-8 text-center text-[clamp(2rem,1rem+2.5vw,3rem)] font-normal leading-none text-[#0C0C0C] md:mb-10">
            {t("title")}
          </h2>
          <p className="mb-6 text-[18px] leading-relaxed text-[#0C0C0C]">
            {t.rich("p1", rich)}
          </p>
          <p className={`text-[18px] leading-relaxed text-[#0C0C0C] ${t("p3") ? "mb-6" : "mb-10"}`}>
            {t.rich("p2", rich)}
          </p>
          {t("p3") ? (
            <p className="mb-10 text-[18px] leading-relaxed text-[#0C0C0C]">
              {t("p3")}
            </p>
          ) : null}
          <p className="font-script text-[clamp(2rem,1rem+2.5vw,3rem)] font-normal leading-none text-[#0C0C0C]">
            {t("tagline")}
          </p>
        </div>
      </div>
    </section>
  );
}
