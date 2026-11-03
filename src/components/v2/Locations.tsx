"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { locationsOf, mapsSearchHref } from "@/config/locations";
import { BookButton } from "@/components/ui/BookButton";

/** Locations with a photo of their own in the new design; the others get a linen tile with the area. */
const PHOTOS: Record<string, string> = { zapad: "/images/locations/zagreb.jpg" };

export function Locations() {
  const t = useTranslations("v2.locations");
  const zagreb = [...locationsOf("bookable"), ...locationsOf("teaser")];
  const family = locationsOf("external");

  return (
    <section className="wrap loc" id="v2-lokacije">
      <h2>{t("title")}</h2>
      <div className="lg">
        {zagreb.map((location) => {
          const teaser = location.type === "teaser";
          const photo = PHOTOS[location.id];
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
                    style={{ objectPosition: "center 18%" }}
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
                  {location.hours ? <p className="mut">{location.hours}</p> : null}
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
        <span>{t("family")}</span>
        <span>{family.map((location) => location.name).join(" · ")}</span>
      </p>
    </section>
  );
}
