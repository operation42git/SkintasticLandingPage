"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export function About() {
  const t = useTranslations("v2.about");
  return (
    <section className="about">
      <div className="ap ph-block" role="img" aria-label={t("imageAlt")} />
      <div className="at">
        <h2>{t("title")}</h2>
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
        <div className="certs">
          <span className="k">{t("certs")}</span>
          <div className="cl2">
            <Image src="/images/v2/wifi-ink.png" alt="WIFI" width={83} height={83} />
            <Image src="/images/v2/wko-ink.png" alt="WKO" width={200} height={64} />
          </div>
        </div>
      </div>
    </section>
  );
}
