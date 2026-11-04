"use client";

import { useTranslations } from "next-intl";

export function Steps() {
  const t = useTranslations("v2.steps");
  // The current page's steps, word for word (how.steps.1–3).
  const how = useTranslations("how.steps");
  const items = ["1", "2", "3"].map((n) => ({ title: how(`${n}.title`), text: how(`${n}.body`) }));
  return (
    <div className="wrap">
      <section className="st3">
        <h2 className="k">{t("title")}</h2>
        {items.map((item, index) => (
          <div className="s3c" key={item.title}>
            <i aria-hidden="true">{String(index + 1).padStart(2, "0")}</i>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
