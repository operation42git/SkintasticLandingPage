"use client";

import { useTranslations } from "next-intl";

/** The current page's four points (why.features.*) and label, under the new design's heading. */
const FEATURES = ["experts", "technology", "hygiene", "consultation"] as const;

export function Why() {
  const t = useTranslations("v2.why");
  const why = useTranslations("why");
  return (
    <div className="wrap">
      <section className="why">
        <div className="wh">
          <span className="k">{why("eyebrow")}</span>
          <h2>{t("title")}</h2>
        </div>
        <div className="wg">
          {FEATURES.map((key) => (
            <div key={key}>
              <b>{why(`features.${key}.title`)}</b>
              <p>{why(`features.${key}.body`)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
