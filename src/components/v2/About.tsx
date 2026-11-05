"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ABOUT_IMAGE_V2 } from "@/config/design";

export function About() {
  const t = useTranslations("v2.about");
  const why = useTranslations("why");
  return (
    <section className="about">
      <div className="wrap ab">
        <div className="ap">
          <Image
            src={ABOUT_IMAGE_V2}
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 900px) 100vw, 400px"
          />
        </div>
        <div className="at">
          <h2>{t("title")}</h2>
          {/* The current page's text (why.about). */}
          <p>{why.rich("about", { strong: (chunks) => <b>{chunks}</b> })}</p>
          <p>{t("p2")}</p>
          <div className="certs">
            <span className="k">{t("certs")}</span>
            <div className="cl2">
              <Image
                src="/images/v2/wifi-ink.png"
                alt="WIFI"
                width={83}
                height={83}
              />
              <Image
                src="/images/v2/wko-ink.png"
                alt="WKO"
                width={200}
                height={64}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
