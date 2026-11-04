"use client";

import { useLocale, useTranslations } from "next-intl";
import { givenLink } from "@/config/contact";

type ReviewItem = { title?: string; text: string; author: string; centre: string };

/**
 * Recenzije: the label and the brand line, then the reviews from `reviews.items` (two columns on the laptop).
 * The Google link, rating and count show only once they are real values, not bracket placeholders.
 */
export function Review() {
  const t = useTranslations("v2.review");
  const reviews = useTranslations("reviews");
  // Croatian „…“, English “…”.
  const [open, close] = useLocale() === "hr" ? ["\u201E", "\u201C"] : ["\u201C", "\u201D"];
  const items = reviews.raw("items") as ReviewItem[];
  const googleUrl = givenLink(reviews("googleUrl"));
  const rating = givenLink(reviews("rating"));
  const count = givenLink(reviews("count"));
  if (!items?.length) return null;

  return (
    <section className="quote">
      <div className="wrap rvw">
        <div className="rvh">
          <span className="k">{t("label")}</span>
          <h2>{t("title")}</h2>
          {rating && count ? (
            <p className="rvr">
              <b>{rating}</b> ★★★★★ · {reviews("countLabel", { count })}
            </p>
          ) : null}
          {googleUrl ? (
            <a className="lnk" href={googleUrl} target="_blank" rel="noopener noreferrer">
              {reviews("google")}
            </a>
          ) : null}
        </div>
        <div className="rvg">
          {items.map((item) => (
            <figure key={item.author + item.text.slice(0, 12)}>
              {item.title ? <span className="k">{item.title}</span> : null}
              <blockquote>
                {open}
                {item.text}
                {close}
              </blockquote>
              <figcaption>{item.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
