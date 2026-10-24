import { useTranslations } from "next-intl";

export function GoetheQuoteSection() {
  const t = useTranslations("goetheQuote");

  return (
    <section className="bg-[#E4BDB0] px-4 py-10 text-center lg:px-6 lg:py-16">
      <p className="font-script text-[38px] leading-[1.1] text-[#0C0C0C] lg:text-[54px]">
        {t("line1")}
        <br />
        {t("line2")}
      </p>
      <p className="mt-2.5 text-[11px] uppercase tracking-[4px] text-[#0C0C0C] lg:mt-3.5 lg:text-sm lg:tracking-[5px]">
        {t("author")}
      </p>
    </section>
  );
}
