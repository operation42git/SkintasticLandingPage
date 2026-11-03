"use client";

import { useTranslations } from "next-intl";

export function Steps() {
  const t = useTranslations("v2.steps");
  const items = t.raw("items") as { title: string; text: string }[];
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
