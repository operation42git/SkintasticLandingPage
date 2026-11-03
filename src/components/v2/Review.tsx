"use client";

import { useTranslations } from "next-intl";
import { givenLink } from "@/config/contact";

/** One quote from the existing reviews; a bracket Google link is shown as text, not a link. */
export function Review() {
  const t = useTranslations("v2.review");
  const reviews = useTranslations("reviews");
  const first = (reviews.raw("items") as { text: string; author: string; centre: string }[])[0];
  const googleUrl = givenLink(reviews("googleUrl"));
  if (!first) return null;

  const go = (
    <>
      <i aria-hidden="true">›</i>
      {t("link")}
    </>
  );

  return (
    <section className="quote">
      <div className="wrap">
        <figure style={{ margin: 0 }}>
          <blockquote>“{first.text}”</blockquote>
          <figcaption>
            {first.author} · ★★★★★ · Google
          </figcaption>
        </figure>
        {googleUrl ? (
          <a className="go" href={googleUrl} target="_blank" rel="noopener noreferrer">
            {go}
          </a>
        ) : (
          <span className="go">{go}</span>
        )}
      </div>
    </section>
  );
}
