import { useTranslations } from "next-intl";
import { instagramHref } from "@/config/contact";

type Review = {
  text: string;
  author: string;
  centre: string;
};

function externalHref(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("[")) return null;
  return trimmed;
}

export function ReviewsSection() {
  const t = useTranslations("reviews");
  const rawItems = t.raw("items") as Review[];
  const items = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems : [];
  const shown = items.slice(0, 3);
  const googleHref = externalHref(t("googleUrl"));
  const instagramLink = instagramHref();

  return (
    <section id="recenzije" className="scroll-mt-[68px] bg-[#EFD5CA] lg:scroll-mt-[84px]">
      <div className="mx-auto max-w-[1320px] px-0 py-9 lg:px-6 lg:py-20">
        <div className="mb-3.5 px-4 text-center lg:mb-10 lg:flex lg:items-end lg:justify-between lg:px-0 lg:text-left">
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[3px] lg:mb-2 lg:text-[15px] lg:tracking-[5px]">
              {t("badge")}
            </p>
            <h2 className="font-script text-[40px] font-normal leading-none lg:text-[56px]">
              {t("title")}
            </h2>
          </div>
          <p className="mt-2.5 text-sm lg:mt-0 lg:text-[15px] lg:leading-snug">
            <strong className="text-[22px] lg:text-[44px]">{t("rating")}</strong>
            <span className="lg:hidden"> ★★★★★ · {t("countLabel", { count: t("count") })}</span>
            <span className="hidden lg:ml-3 lg:inline-block">
              ★★★★★
              <br />
              {t("countLabel", { count: t("count") })}
            </span>
          </p>
        </div>

        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1.5 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {shown.map((review, index) => (
            <ReviewCard key={index} review={review} className="w-[290px] shrink-0 snap-start p-[18px]" />
          ))}
        </div>
        <div className="hidden gap-6 lg:grid lg:grid-cols-3">
          {shown.map((review, index) => (
            <ReviewCard key={index} review={review} className="p-7" />
          ))}
        </div>

        <p className="mt-3 flex flex-wrap justify-center gap-[18px] text-center lg:mt-7 lg:gap-7">
          {googleHref ? (
            <a
              href={googleHref}
              className="text-[13px] font-bold lg:text-[15px]"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("google")}
            </a>
          ) : (
            <span className="text-[13px] font-bold lg:text-[15px]">{t("google")}</span>
          )}
          {instagramLink ? (
            <a
              href={instagramLink}
              className="text-[13px] font-bold lg:text-[15px]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="lg:hidden">{t("instagramShort")}</span>
              <span className="hidden lg:inline">{t("instagram")}</span>
            </a>
          ) : (
            <span className="text-[13px] font-bold lg:text-[15px]">
              <span className="lg:hidden">{t("instagramShort")}</span>
              <span className="hidden lg:inline">{t("instagram")}</span>
            </span>
          )}
        </p>
      </div>
    </section>
  );
}

function ReviewCard({ review, className }: { review: Review; className: string }) {
  return (
    <figure className={`m-0 flex flex-col gap-2.5 bg-white lg:gap-3.5 ${className}`}>
      <span className="tracking-[0.2em]">★★★★★</span>
      <blockquote className="text-sm leading-snug lg:text-base lg:leading-relaxed">
        {`\u201E${review.text}\u201C`}
      </blockquote>
      <figcaption className="text-[13px] font-bold lg:text-sm">
        {review.author} · {review.centre}
      </figcaption>
    </figure>
  );
}
