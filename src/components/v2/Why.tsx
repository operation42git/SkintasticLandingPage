"use client";

import { useTranslations } from "next-intl";

export function Why() {
  const t = useTranslations("v2.why");
  const items = t.raw("items") as { title: string; text: string }[];
  return (
    <div className="wrap">
      <section className="why">
        <h2>{t("title")}</h2>
        <div className="wg">
          {items.map((item) => (
            <div key={item.title}>
              <b>{item.title}</b>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
