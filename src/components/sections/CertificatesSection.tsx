import Image from "next/image";
import { useTranslations } from "next-intl";

export function CertificatesSection() {
  const t = useTranslations("certificates");

  return (
    <section id="certificates" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1500px] px-6 text-center md:px-[50px]">
        <p className="mb-2 text-[14px] uppercase tracking-[5px] text-[#0C0C0C]">
          {t("badge")}
        </p>
        <h2 className="font-script mb-12 text-[clamp(2rem,1rem+2.5vw,3rem)] font-normal leading-none text-[#0C0C0C] md:mb-14">
          {t("title")}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
          <Image
            src="/images/certs/wifi.webp"
            alt="WIFI"
            width={83}
            height={83}
            className="h-20 w-auto"
          />
          <Image
            src="/images/certs/wko.webp"
            alt="Wirtschaftskammer Österreich"
            width={202}
            height={66}
            className="h-[60px] w-auto"
          />
        </div>
      </div>
    </section>
  );
}
