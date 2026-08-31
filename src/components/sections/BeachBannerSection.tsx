import Image from "next/image";
import { useTranslations } from "next-intl";

export function BeachBannerSection() {
  const t = useTranslations("beachBanner");

  return (
    <section className="relative overflow-hidden bg-[#1a1516]">
      <div className="absolute inset-0">
        <Image
          src="/images/services/beach-package.jpg"
          alt="Beach paket"
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <div className="flex items-end gap-3 mb-2">
            <span className="text-4xl sm:text-5xl font-bold text-[#c9a96e]">
              {t("price")}
            </span>
            <span className="text-lg text-white/50 line-through mb-1">
              {t("oldPrice")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-white/70 leading-relaxed mb-8 max-w-xl">
            {t("desc")}
          </p>
          <a href="#offers" className="btn-gold">
            {t("cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
