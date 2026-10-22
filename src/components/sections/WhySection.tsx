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
      <div className="mx-auto max-w-[1320px] px-4 pb-0 pt-9 xl:px-6 xl:pt-20">
        <div className="mb-[18px] text-center xl:mb-11">
          <p className="mb-1 text-[11px] uppercase tracking-[3px] xl:mb-2 xl:text-[15px] xl:tracking-[5px]">
            {t("eyebrow")}
          </p>
          <h2 className="font-script text-[44px] font-normal leading-none xl:text-[60px]">
            {t("title")}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-[18px] xl:grid-cols-4 xl:gap-9">
          {FEATURES.map((feature) => (
            <div key={feature.key} className="flex flex-col items-center gap-1.5 text-center xl:gap-2.5">
              <Image
                src={feature.icon}
                alt=""
                width={52}
                height={52}
                className="h-10 w-10 object-contain xl:h-[52px] xl:w-[52px]"
              />
              <h3 className="text-xs font-extrabold uppercase xl:text-base">
                {t(`features.${feature.key}.title`)}
              </h3>
              <p className="hidden text-[15px] leading-normal text-[#3d3434] xl:block">
                {t(`features.${feature.key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 bg-[#e7c3b2] xl:mt-16 xl:bg-[#e8c6b6]">
        <div className="mx-auto flex max-w-[1320px] flex-col xl:flex-row xl:items-stretch xl:px-6">
          <div className="order-1 xl:order-2 xl:relative xl:min-h-[480px] xl:flex-1">
            <Image
              src="/images/about/frau-links.png"
              alt=""
              width={900}
              height={1100}
              className="h-[230px] w-full object-cover object-[center_30%] xl:absolute xl:inset-0 xl:h-full xl:object-[center_25%]"
            />
          </div>
          <div className="order-2 flex flex-col gap-2.5 px-4 py-[22px] xl:order-1 xl:my-16 xl:max-w-[520px] xl:flex-none xl:gap-4 xl:bg-[rgba(255,255,255,0.72)] xl:px-9 xl:py-9">
            <p className="text-[11px] uppercase tracking-[3px] xl:text-sm xl:tracking-[5px]">
              {t("aboutEyebrow")}
            </p>
            <p className="text-[15px] leading-snug xl:text-lg xl:leading-relaxed">
              {t.rich("about", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p className="font-script text-[32px] leading-none xl:text-[40px]">{t("tagline")}</p>
            <div className="flex flex-col gap-3 border-t-0 pt-1.5 xl:border-t xl:border-[#d9b9ab] xl:pt-4">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] xl:text-[13px] xl:tracking-[0.12em]">
                {t("certs")}
              </span>
              <div className="flex items-center gap-5 xl:gap-7">
                <Image src="/images/certs/wifi.webp" alt={t("wifiAlt")} width={120} height={56} className="h-10 w-auto xl:h-14" />
                <Image src="/images/certs/wko.webp" alt={t("wkoAlt")} width={140} height={44} className="h-8 w-auto xl:h-11" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
