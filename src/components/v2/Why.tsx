"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ABOUT_IMAGE_V2 } from "@/config/design";

/** The three smaller points under the staff block; the laser one links to Tehnologija. */
const POINTS = ["laser", "studio", "noPackages"] as const;

/**
 * Zašto Skintastic? (landing-redesign rows 8 and 9 merged; Ivan, 2026-11-06). Left: label, heading, one short
 * paragraph and the photo. Right: the trained staff first and most prominent (no box), then three points in
 * three columns, then the certificates. A staff row (photo, name, role) comes once Ivan gives them.
 */
export function Why() {
  const t = useTranslations("v2.why");
  const why = useTranslations("why");
  return (
    <div className="wrap">
      <section className="why">
        <div className="wh">
          <span className="k">{why("eyebrow")}</span>
          <h2>{t("title")}</h2>
          <p className="wl">
            {t.rich("lead", { b: (chunks) => <b>{chunks}</b> })}
          </p>
          <div className="ap">
            <Image
              src={ABOUT_IMAGE_V2}
              alt={t("imageAlt")}
              fill
              sizes="(max-width: 900px) 100vw, 400px"
            />
          </div>
        </div>
        <div className="wr">
          <div className="staff">
            <span className="k ko">{t("staff.label")}</span>
            <h3>{t("staff.title")}</h3>
            <p>{t("staff.text")}</p>
          </div>
          <div className="wg">
            {POINTS.map((key) => (
              <div key={key}>
                <b>{t(`points.${key}.title`)}</b>
                <p>
                  {t(`points.${key}.text`)}
                  {key === "laser" ? (
                    <>
                      {" "}
                      <a className="wlk" href="#v2-tehnologija">
                        {t("points.laser.link")}
                      </a>
                    </>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
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
      </section>
    </div>
  );
}
