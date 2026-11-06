"use client";

import { useLocale, useTranslations } from "next-intl";
import { givenLink } from "@/config/contact";

type ReviewItem = { title?: string; text: string; author: string };

/**
 * Recenzije: the label, the heading and one Google link with stars; then the new design's own four real Google
 * reviews (`v2.review.items`, Ivan, 2026-11-06; the current design keeps `reviews.items`), two columns on the laptop.
 */
export function Review() {
  const t = useTranslations("v2.review");
  const reviews = useTranslations("reviews");
  // Croatian and German „…“, English “…”.
  const [open, close] = useLocale() === "en" ? ["\u201C", "\u201D"] : ["\u201E", "\u201C"];
  const items = t.raw("items") as ReviewItem[];
  const googleUrl = givenLink(reviews("googleUrl"));
  if (!items?.length) return null;

  return (
    <section className="quote">
      <div className="wrap rvw">
        <div className="rvh">
          <span className="k">{t("label")}</span>
          <h2>{t("title")}</h2>
          {googleUrl ? (
            <a className="lnk" href={googleUrl} target="_blank" rel="noopener noreferrer">
              {t("google")}
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
