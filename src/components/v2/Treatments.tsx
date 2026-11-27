"use client";

import { useTranslations } from "next-intl";
import { treatmentsV2 } from "@/config/treatments-v2";
import { BookButton } from "@/components/ui/BookButton";
import { BaseLine, PriceAmount, usePrice } from "@/components/ui/Price";

/** "od 59,90 €" (the app's lowest price when the switch is on) and its bazna cijena; nothing without a price. */
function TreatmentPrice({ code, from, typed }: { code: string; from: string; typed: string }) {
  const { show } = usePrice(code);
  if (!show) return null;
  return (
    <span className="pw">
      <span className="p">
        <small>{from}</small>
        <PriceAmount code={code} typed={typed} />
      </span>
      <BaseLine code={code} className="bz" />
    </span>
  );
}

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
                <TreatmentPrice code={item.code} from={t("from")} typed={t(`items.${item.key}.price`)} />
              </BookButton>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
