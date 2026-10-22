import Image from "next/image";
import { useTranslations } from "next-intl";

const FEATURES = [
  { key: "experts", icon: "/images/icons/skintastic-icon-2.svg" },
  { key: "technology", icon: "/images/icons/skintastic-icon-1.svg" },
  { key: "hygiene", icon: "/images/icons/skintastic-icon-3.svg" },
  { key: "consultation", icon: "/images/icons/skintastic-icon-4.svg" },
] as const;

export function WhySection() {
  const t = useTranslations("why");

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1320px] px-4 pb-0 pt-9 lg:px-6 lg:pt-20">
        <div className="mb-[18px] text-center lg:mb-11">
          <p className="mb-1 text-[11px] uppercase tracking-[3px] lg:mb-2 lg:text-[15px] lg:tracking-[5px]">
            {t("eyebrow")}
          </p>
          <h2 className="font-script text-[44px] font-normal leading-none lg:text-[60px]">
            {t("title")}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-[18px] lg:grid-cols-4 lg:gap-9">
          {FEATURES.map((feature) => (
            <div key={feature.key} className="flex flex-col items-center gap-1.5 text-center lg:gap-2.5">
              <Image
                src={feature.icon}
                alt=""
                width={52}
                height={52}
                className="h-10 w-10 object-contain lg:h-[52px] lg:w-[52px]"
              />
              <h3 className="text-xs font-extrabold uppercase lg:text-base">
                {t(`features.${feature.key}.title`)}
              </h3>
              <p className="hidden text-[15px] leading-normal text-[#3d3434] lg:block">
                {t(`features.${feature.key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 bg-[#e7c3b2] lg:mt-16 lg:bg-[#e8c6b6]">
        <div className="mx-auto flex max-w-[1320px] flex-col lg:flex-row lg:items-stretch lg:px-6">
          <div className="order-1 lg:order-2 lg:relative lg:min-h-[480px] lg:flex-1">
            <Image
              src="/images/about/frau-links.png"
              alt=""
              width={900}
              height={1100}
              className="h-[230px] w-full object-cover object-[center_30%] lg:absolute lg:inset-0 lg:h-full lg:object-[center_25%]"
            />
          </div>
          <div className="order-2 flex flex-col gap-2.5 px-4 py-[22px] lg:order-1 lg:my-16 lg:max-w-[520px] lg:flex-none lg:gap-4 lg:bg-[rgba(255,255,255,0.72)] lg:px-9 lg:py-9">
            <p className="text-[11px] uppercase tracking-[3px] lg:text-sm lg:tracking-[5px]">
              {t("aboutEyebrow")}
            </p>
            <p className="text-[15px] leading-snug lg:text-lg lg:leading-relaxed">
              {t.rich("about", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p className="font-script text-[32px] leading-none lg:text-[40px]">{t("tagline")}</p>
            <div className="flex flex-col gap-3 border-t-0 pt-1.5 lg:border-t lg:border-[#d9b9ab] lg:pt-4">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] lg:text-[13px] lg:tracking-[0.12em]">
                {t("certs")}
              </span>
              <div className="flex items-center gap-5 lg:gap-7">
                <Image src="/images/certs/wifi.webp" alt={t("wifiAlt")} width={120} height={56} className="h-10 w-auto lg:h-14" />
                <Image src="/images/certs/wko.webp" alt={t("wkoAlt")} width={140} height={44} className="h-8 w-auto lg:h-11" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
