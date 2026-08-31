import { useTranslations } from "next-intl";

export function GoetheQuoteSection() {
  const t = useTranslations("goetheQuote");

  return (
    <section className="flex flex-col items-center justify-center bg-[#EFD5CA] px-6 py-16 md:py-[100px]">
      <p className="font-script text-center text-[3.25rem] leading-[1.15] text-[#0C0C0C] md:text-[4.75rem] lg:text-[5.5rem]">
        {t("line1")}
        <br />
        {t("line2")}
      </p>
      <p className="mt-10 text-[14px] uppercase tracking-[5px] text-[#0C0C0C] md:mt-12">
        {t("author")}
      </p>
    </section>
  );
}
