import { useTranslations } from "next-intl";

type Review = {
  text: string;
  author: string;
  centre: string;
};

export function ReviewsSection() {
  const t = useTranslations("reviews");
  const items = t.raw("items") as Review[];
  if (!Array.isArray(items) || items.length === 0) return null;

  const shown = items.slice(0, 3);
  const googleUrl = t("googleUrl");
  const googleHref = googleUrl && !googleUrl.startsWith("[") ? googleUrl : null;

  return (
    <section id="recenzije" className="scroll-mt-[68px] bg-[#EFD5CA] xl:scroll-mt-[84px]">
      <div className="mx-auto max-w-[1320px] px-0 py-9 xl:px-6 xl:py-20">
        <div className="mb-3.5 px-4 text-center xl:mb-10 xl:flex xl:items-end xl:justify-between xl:px-0 xl:text-left">
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[3px] xl:mb-2 xl:text-[15px] xl:tracking-[5px]">
              {t("badge")}
            </p>
            <h2 className="font-script text-[40px] font-normal leading-none xl:text-[56px]">
              {t("title")}
            </h2>
          </div>
          <p className="mt-2.5 text-sm xl:mt-0 xl:text-[15px] xl:leading-snug">
            <strong className="text-[22px] xl:text-[44px]">{t("rating")}</strong>
            <span className="xl:hidden"> ★★★★★ · {t("countLabel", { count: t("count") })}</span>
            <span className="hidden xl:ml-3 xl:inline-block">
              ★★★★★
              <br />
              {t("countLabel", { count: t("count") })}
            </span>
          </p>
        </div>

        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1.5 [scrollbar-width:none] xl:hidden [&::-webkit-scrollbar]:hidden">
          {shown.map((review, index) => (
            <ReviewCard key={index} review={review} className="w-[290px] shrink-0 snap-start p-[18px]" />
          ))}
        </div>
        <div className="hidden gap-6 xl:grid xl:grid-cols-3">
          {shown.map((review, index) => (
            <ReviewCard key={index} review={review} className="p-7" />
          ))}
        </div>

        {googleHref ? (
          <p className="mt-3 text-center xl:mt-7">
            <a href={googleHref} className="text-[13px] font-bold xl:text-[15px]" target="_blank" rel="noopener noreferrer">
              {t("google")}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}

function ReviewCard({ review, className }: { review: Review; className: string }) {
  return (
    <figure className={`m-0 flex flex-col gap-2.5 bg-white xl:gap-3.5 ${className}`}>
      <span className="tracking-[0.2em]">★★★★★</span>
      <blockquote className="text-sm leading-snug xl:text-base xl:leading-relaxed">„{review.text}“</blockquote>
      <figcaption className="text-[13px] font-bold xl:text-sm">
        {review.author} · {review.centre}
      </figcaption>
    </figure>
  );
}
