"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { BookButton } from "@/components/ui/BookButton";
import { Lightbox } from "@/components/ui/Lightbox";
import {
  brandCentreCount,
  externalHref,
  joinNames,
  locationsOf,
  type Location,
} from "@/config/locations";

export function LocationsSection() {
  const t = useTranslations("locations");
  const bookable = locationsOf("bookable");
  const teasers = locationsOf("teaser");
  const external = locationsOf("external");
  const names = joinNames(
    bookable.map((location) => location.name),
    t("nameOr"),
  );
  const [gallery, setGallery] = useState<string[] | null>(null);
  const [photo, setPhoto] = useState(0);

  return (
    <section id="lokacije" className="scroll-mt-[68px] bg-[#f5e6de] lg:scroll-mt-[84px]">
      <div className="mx-auto max-w-[1320px] px-4 py-9 lg:px-6 lg:py-20">
        <div className="mb-4 text-center lg:mb-11">
          <p className="mb-1 text-[11px] uppercase tracking-[3px] lg:mb-2 lg:text-[15px] lg:tracking-[5px]">
            {t("eyebrow")}
          </p>
          <h2 className="font-script text-[44px] font-normal leading-none lg:text-[60px]">
            {t("title")}
          </h2>
        </div>

        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-3 lg:gap-7">
          {bookable.map((location) => (
            <BookableCard
              key={location.id}
              location={location}
              onGallery={() => {
                if (!location.image) return;
                setGallery([location.image]);
                setPhoto(0);
              }}
            />
          ))}
          {teasers.map((location) => (
            <TeaserCard key={location.id} location={location} names={names} />
          ))}
        </div>

        <div
          data-brand-strip
          className="mt-[18px] flex flex-col gap-2.5 border-t border-[#d9b9ab] pt-3.5 lg:mt-14 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-7 lg:pt-9"
        >
          <div className="min-w-0 lg:flex-1 lg:basis-80">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] lg:mb-1.5 lg:text-[13px] lg:tracking-[0.14em]">
              <span className="lg:hidden">
                {t("familyShort", { count: brandCentreCount() })}
              </span>
              <span className="hidden lg:inline">{t("family")}</span>
            </p>
            <p className="hidden text-[22px] font-bold leading-snug lg:block">
              {t("familyCount", { count: brandCentreCount() })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:hidden">
            {external.map((location) => (
              <ExternalPill key={location.id} location={location} />
            ))}
          </div>
          <div className="hidden flex-wrap gap-[22px] lg:flex">
            {external.map((location) => (
              <ExternalMark key={location.id} location={location} />
            ))}
          </div>
        </div>
      </div>

      {gallery ? (
        <Lightbox
          images={gallery}
          index={photo}
          onClose={() => setGallery(null)}
          onIndexChange={setPhoto}
        />
      ) : null}
    </section>
  );
}

function BookableCard({ location, onGallery }: { location: Location; onGallery: () => void }) {
  const t = useTranslations("locations");

  return (
    <article className="flex flex-col bg-white">
      {location.image ? (
        <div className="relative h-[170px] w-full lg:aspect-[4/3] lg:h-auto">
          <Image src={location.image} alt={location.name} fill className="object-cover" sizes="(min-width: 1024px) 400px, 360px" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-1 p-3.5 lg:gap-2 lg:p-6">
        <h3 className="text-[17px] font-extrabold lg:text-[22px]">{location.name}</h3>
        <p className="text-[13px] lg:hidden">
          {location.address}
          {location.hours ? ` · ${location.hours}` : ""}
        </p>
        <p className="hidden text-[15px] lg:block">{location.address}</p>
        {location.hours ? <p className="hidden text-[15px] lg:block">{location.hours}</p> : null}
        <div className="hidden gap-4 pt-1 text-sm font-bold lg:flex">
          <button type="button" onClick={onGallery} className="underline-offset-2 hover:underline">
            {t("gallery")}
          </button>
          <a href="#kontakt">{t("directions")}</a>
        </div>
        <div className="flex-1" />
        <div className="mt-2 flex gap-2 lg:mt-2.5 lg:block">
          <BookButton
            centar={location.slug}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[#0C0C0C] px-3 text-center text-xs font-extrabold uppercase tracking-[0.04em] text-white lg:h-auto lg:w-full lg:px-5 lg:py-[15px] lg:text-sm lg:tracking-[0.06em]"
          >
            {t("bookAt", { name: location.name })}
          </BookButton>
          <button
            type="button"
            onClick={onGallery}
            className="inline-flex h-11 items-center rounded-full border-[1.5px] border-[#0C0C0C] px-3.5 text-xs font-extrabold uppercase lg:hidden"
          >
            {t("gallery")}
          </button>
        </div>
      </div>
    </article>
  );
}

function TeaserCard({ location, names }: { location: Location; names: string }) {
  const t = useTranslations("locations");
  const opening = location.openingLabel ? t("opening", { label: location.openingLabel }) : "";

  return (
    <article className="bg-white">
      <div className="flex items-center gap-3 p-3.5 lg:hidden">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-[#E4BDB0] px-1 text-center font-script text-sm leading-none">
          {location.address}
        </div>
        <div className="min-w-0 flex-1">
          <strong className="text-[15px]">{location.name}</strong>
          {opening ? (
            <>
              <br />
              <span className="text-xs text-[#3d3434]">{opening}</span>
            </>
          ) : null}
        </div>
        <span className="rounded-full bg-[#0C0C0C] px-[9px] py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white">
          {t("soon")}
        </span>
      </div>

      <div className="hidden lg:flex lg:h-full lg:flex-col">
        <div className="relative flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-[#E4BDB0]">
          <span className="absolute left-3.5 top-3.5 rounded-full bg-[#0C0C0C] px-3 py-[5px] text-xs font-extrabold uppercase tracking-[0.1em] text-white">
            {t("soon")}
          </span>
          <span className="font-script text-[46px] leading-none">{location.address}</span>
          {opening ? (
            <span className="text-sm font-bold uppercase tracking-[0.12em]">{opening}</span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-6">
          <h3 className="text-[22px] font-extrabold">{location.name}</h3>
          <p className="text-[15px] leading-normal text-[#3d3434]">{t("teaserBody", { names })}</p>
          <div className="flex-1" />
          <button
            type="button"
            disabled
            className="mt-2.5 cursor-not-allowed rounded-full border-[1.5px] border-[#6b5f5f] bg-transparent px-5 py-3.5 text-sm font-extrabold uppercase tracking-[0.06em] text-[#4a4040]"
          >
            {t("bookSoon")}
          </button>
        </div>
      </div>
    </article>
  );
}

function ExternalPill({ location }: { location: Location }) {
  const href = externalHref(location);
  const label = href ? `${location.name} ↗` : `${location.name} · ${location.url}`;
  const className = "rounded-full border border-[#c9b3a8] px-3.5 py-[9px] text-[13px] font-bold";
  if (!href) return <span className={className}>{label}</span>;
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}

function ExternalMark({ location }: { location: Location }) {
  const href = externalHref(location);
  const body = (
    <>
      {location.image ? (
        <Image src={location.image} alt="" width={52} height={52} className="h-[52px] w-[52px] rounded-full object-cover" />
      ) : null}
      <span className="text-[15px] font-bold">
        {location.name}
        <br />
        <span className="text-[13px] font-medium text-[#4a4040]">
          {href ? "↗" : location.url}
        </span>
      </span>
    </>
  );
  const className = "flex items-center gap-2.5 no-underline";
  if (!href) return <span className={className}>{body}</span>;
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  );
}
