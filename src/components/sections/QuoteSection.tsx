import { useTranslations } from "next-intl";

export function QuoteSection() {
  const t = useTranslations("quote");

  return (
    <section
      id="quote"
      className="flex min-h-[50vh] flex-col items-center justify-center bg-[#EFD5CA] px-6 py-24 md:py-28"
    >
      <p className="font-script text-center text-[2.75rem] leading-[1.15] text-[#0C0C0C] md:text-[3.5rem]">
        {t("line1")}
        <br />
        {t("line2")}
        <br />
        {t("line3")}
      </p>
      <p className="mt-8 text-[14px] uppercase tracking-[5px] text-[#0C0C0C]">
        {t("author")}
      </p>
    </section>
  );
}
