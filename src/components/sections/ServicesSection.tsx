import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";

export function ServicesSection() {
  const t = useTranslations("services");

  const em = {
    em: (chunks: ReactNode) => <em>{chunks}</em>,
  };

  return (
    <section
      id="services"
      className="flex min-h-svh flex-col justify-start bg-[#E4BDB0] pt-16 pb-16 md:pt-20 md:pb-20"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col px-5 md:px-[50px]">
        <div className="shrink-0 text-center">
          <p className="mb-2 text-[18px] uppercase tracking-[5px] text-[#0C0C0C]">
            {t("badge")}
          </p>
          <h2 className="font-script text-[3.6rem] font-normal leading-none text-[#0C0C0C] md:text-[4.25rem]">
            {t("title")}
          </h2>
        </div>

        <div className="grid flex-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex justify-center lg:justify-start">
            <BeforeAfterSlider
              beforeSrc="/images/services/body-before.jpg"
              afterSrc="/images/services/body-after.jpg"
              beforeAlt="Before"
              afterAlt="After"
            />
          </div>

          <div className="max-w-2xl text-[#0C0C0C]">
            <h3 className="mb-6 text-[2rem] font-black uppercase leading-tight md:text-[2.4rem]">
              {t("subtitle")}
            </h3>
            <p className="mb-6 text-[20px] font-bold leading-relaxed">
              {t.rich("lead", em)}
            </p>
            <p className="mb-5 text-[19px] leading-relaxed">
              {t("body1")}
            </p>
            <p className="mb-10 text-[19px] leading-relaxed">
              {t.rich("body2", em)}
            </p>
            <a
              href="#locations"
              className="inline-block rounded-full bg-white px-10 py-4 text-[18px] font-bold uppercase text-[#0C0C0C]"
            >
              {t("ctaPrices")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
