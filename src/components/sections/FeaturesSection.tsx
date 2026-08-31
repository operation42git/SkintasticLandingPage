import Image from "next/image";
import { useTranslations } from "next-intl";

const FEATURES = [
  { key: "experts", icon: "/images/icons/skintastic-icon-2.svg" },
  { key: "technology", icon: "/images/icons/skintastic-icon-1.svg" },
  { key: "hygiene", icon: "/images/icons/skintastic-icon-3.svg" },
  { key: "consultation", icon: "/images/icons/skintastic-icon-4.svg" },
];

export function FeaturesSection() {
  const t = useTranslations("features");

  return (
    <section className="bg-white">
      {/*
        Live site: #content.container is max-width 1600px with 50px side padding
        (content-size 1500px). Columns use gap: 4rem at a 18px root (= 72px).
        That gives ~321px per column — titles stay 1 line, body wraps to 2–3.
      */}
      <div className="mx-auto max-w-[1600px] px-5 md:px-[50px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:gap-x-[72px]">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.key}
              className={`relative flex flex-col items-center px-3 py-16 text-center lg:px-0 ${
                i < FEATURES.length - 1
                  ? "lg:after:absolute lg:after:top-0 lg:after:bottom-0 lg:after:-right-[36px] lg:after:w-px lg:after:bg-[#0C0C0C]/15"
                  : ""
              }`}
            >
              <div className="relative mb-6 h-[60px] w-[60px] shrink-0">
                <Image
                  src={feature.icon}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>

              <h3 className="mb-[0.7em] text-[18px] font-black uppercase leading-[1.3] text-[#0C0C0C]">
                {t(`${feature.key}.title`)}
              </h3>

              <p className="text-[18px] leading-[1.5] text-[#0C0C0C] whitespace-pre-line">
                {t(`${feature.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
