"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { externalHref, hoursFor, locationsOf, mapsSearchHref } from "@/config/locations";
import { BookButton } from "@/components/ui/BookButton";


export function Locations() {
  const t = useTranslations("v2.locations");
  const locale = useLocale();
  const zagreb = [...locationsOf("bookable"), ...locationsOf("teaser")];
  const family = locationsOf("external");

  return (
    <section className="wrap loc" id="v2-lokacije">
      <h2>{t("title")}</h2>
      <div className="lg">
        {zagreb.map((location) => {
          const teaser = location.type === "teaser";
          // The photo from locations.ts, as in the current design; without one, a quiet tile with a small label.
          const photo = location.image;
          const maps = mapsSearchHref(location.address);
          return (
            <article key={location.id} className={teaser ? "soon" : undefined}>
              <div className={`lp ${photo ? "" : teaser ? "lp3" : "lp2"}`}>
                {photo ? (
                  <Image
                    src={photo}
                    alt={location.name}
                    fill
                    className="object-cover"
                    style={{ objectPosition: "center 20%" }}
                    sizes="(max-width: 900px) 100vw, 400px"
                  />
                ) : (
                  <span>{t.has(`tile.${location.id}`) ? t(`tile.${location.id}`) : location.name}</span>
                )}
              </div>
              <h3>{location.name}</h3>
              <p>{location.address}</p>
              {teaser ? (
                <p className="mut">{t("soon")}</p>
              ) : (
                <>
                  {hoursFor(location, locale) ? <p className="mut">{hoursFor(location, locale)}</p> : null}
                  <div className="ll">
                    <BookButton centar={location.slug} className="lnk">
                      {t("book")}
                    </BookButton>
                    {maps ? (
                      <a className="lnk2" href={maps} target="_blank" rel="noopener noreferrer">
                        {t("directions")}
                      </a>
                    ) : (
                      <span className="lnk2">{t("directions")}</span>
                    )}
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
      <p className="fam">
        <span className="fl">{t("family")}</span>
        <span>
          {family.map((location, index) => {
            const href = externalHref(location);
            return (
              <span key={location.id}>
                {index > 0 ? " · " : ""}
                {href ? (
                  <a href={href} target="_blank" rel="noopener">
                    {location.name} ↗
                  </a>
                ) : (
                  location.name
                )}
              </span>
            );
          })}
        </span>
      </p>
    </section>
  );
}
