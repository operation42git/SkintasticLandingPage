"use client";

import { useTranslations } from "next-intl";
import { treatmentsV2 } from "@/config/treatments-v2";
import { BookButton } from "@/components/ui/BookButton";

export function Treatments() {
  const t = useTranslations("v2.treatments");
  return (
    <div className="wrap" id="v2-tretmani">
      <section className="tp2">
        <div className="tl">
          <span className="k">{t("label")}</span>
          <h2>{t("title")}</h2>
          <p>{t("text")}</p>
          <BookButton className="btn">{t("all")}</BookButton>
        </div>
        <div className="tr3">
          <span className="k">{t("featured")}</span>
          <div className="t3">
            {treatmentsV2.map((item) => (
              <BookButton key={item.key} usluga={item.code}>
                <h3>{t(`items.${item.key}.name`)}</h3>
                <span className="p">
                  <small>{t("from")}</small>
                  {t(`items.${item.key}.price`)}
                </span>
              </BookButton>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
