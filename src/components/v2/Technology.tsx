"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export function Technology() {
  const t = useTranslations("v2.tech");
  const facts = t.raw("facts") as { label: string; value: string }[];
  return (
    <section className="tech" id="v2-tehnologija">
      <div className="wrap tg">
        <div>
          <span className="k">{t("label")}</span>
          <h2>{t("title")}</h2>
          <p>{t("text")}</p>
          <dl>
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Image src="/images/v2/monolith.webp" alt={t("imageAlt")} width={1200} height={638} />
      </div>
    </section>
  );
}
