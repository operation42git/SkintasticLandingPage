import Image from "next/image";
import { useTranslations } from "next-intl";
import { BookButton } from "@/components/ui/BookButton";

const STEPS = ["1", "2", "3"] as const;

export function HowItWorksSection() {
  const t = useTranslations("how");
  const chips = t.raw("chips") as string[];

  return (
    <section id="kako" className="scroll-mt-[68px] bg-[#E4BDB0] xl:scroll-mt-[84px]">
      <div className="mx-auto max-w-[1320px] px-4 py-9 xl:px-6 xl:py-20">
        <div className="mb-[18px] text-center xl:mb-11">
          <p className="mb-1 text-[11px] uppercase tracking-[3px] xl:mb-2 xl:text-[15px] xl:tracking-[5px]">
            {t("eyebrow")}
          </p>
          <h2 className="font-script text-[44px] font-normal leading-none xl:text-[60px]">
            {t("title")}
          </h2>
        </div>

        <div className="flex flex-col items-stretch gap-6 xl:flex-row xl:flex-wrap xl:items-center xl:gap-12">
          <div className="flex min-w-0 flex-1 basis-[520px] flex-col gap-2.5 xl:gap-[18px]">
            {STEPS.map((step) => (
              <div key={step} className="flex items-start gap-3 bg-white p-3.5 xl:gap-[18px] xl:p-[22px]">
                <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#0C0C0C] text-base font-extrabold text-white xl:h-11 xl:w-11 xl:text-lg">
                  {step}
                </span>
                <div>
                  <h3 className="text-[15px] font-extrabold xl:mb-1.5 xl:text-lg">{t(`steps.${step}.title`)}</h3>
                  <p className="mt-0.5 text-[13px] leading-snug xl:mt-0 xl:text-base xl:leading-[1.55]">
                    {t(`steps.${step}.body`)}
                  </p>
                </div>
              </div>
            ))}
            <BookButton className="mt-1.5 hidden items-center justify-center self-start rounded-full bg-[#0C0C0C] px-7 py-4 text-[15px] font-extrabold uppercase tracking-[0.05em] text-white xl:inline-flex">
              {t("cta")}
            </BookButton>
          </div>

          <div className="flex min-w-0 flex-1 basis-[480px] flex-col gap-3 xl:gap-[18px]">
            <Image
              src="/images/technology/mediostar.jpg"
              alt={t("mediostarAlt")}
              width={960}
              height={640}
              className="h-auto w-full bg-white"
            />
            <h3 className="text-sm font-extrabold uppercase xl:text-[22px]">
              {t("mediostarTitle")}
            </h3>
            <p className="text-sm leading-relaxed xl:text-base">{t("mediostarBody")}</p>
            <div className="flex flex-wrap gap-1.5 xl:gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white px-[11px] py-1.5 text-xs font-bold xl:px-3.5 xl:py-2 xl:text-[13px]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <BookButton className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0C0C0C] px-7 text-[13px] font-extrabold uppercase tracking-[0.05em] text-white xl:hidden">
            {t("cta")}
          </BookButton>
        </div>
      </div>
    </section>
  );
}
