import type { ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function TechnologySection() {
  const t = useTranslations("technology");

  const em = {
    em: (chunks: ReactNode) => <em>{chunks}</em>,
  };

  return (
    <section
      id="technology"
      className="flex min-h-svh flex-col justify-start bg-[#E4BDB0] pt-16 pb-16 md:pt-20 md:pb-20"
    >
      <div className="mx-auto flex w-full max-w-[900px] flex-1 flex-col px-5 md:px-8">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-2 text-[16px] uppercase tracking-[5px] text-[#0C0C0C]">
            {t("badge")}
          </p>
          <h2 className="font-script text-[3.2rem] font-normal capitalize leading-none text-[#0C0C0C] md:text-[3.75rem]">
            {t("title")}
          </h2>
        </div>

        <div className="relative mx-auto w-full">
          <Image
            src="/images/technology/mediostar.jpg"
            alt="Mediostar Diodni Laser"
            width={1200}
            height={600}
            className="h-auto w-full"
          />
        </div>

        <div className="mt-8 md:mt-12 md:px-4 lg:mt-16 lg:px-12">
          <h3 className="mb-6 text-[1.35rem] font-black uppercase leading-tight text-[#0C0C0C] md:text-[1.6rem]">
            {t("heading")}
          </h3>
          <p className="mb-4 text-[17px] leading-relaxed text-[#0C0C0C] md:text-[18px]">
            {t.rich("p1", em)}
          </p>
          <p className="mb-4 text-[17px] leading-relaxed text-[#0C0C0C] md:text-[18px]">
            {t("p2")}
          </p>
          <p className="text-[17px] leading-relaxed text-[#0C0C0C] md:text-[18px]">
            {t.rich("p3", em)}
          </p>
        </div>
      </div>
    </section>
  );
}
