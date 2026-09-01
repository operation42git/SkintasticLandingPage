"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Lightbox } from "@/components/ui/Lightbox";

// The Zagreb location is live on our own platform; all other locations still use Timify.
// Update NEXT_PUBLIC_BOOKING_URL in .env.local / hosting env when deploying.
const BOOKING_APP = (process.env.NEXT_PUBLIC_BOOKING_URL ?? "").replace(/\/$/, "");

const LOCATIONS = [
  {
    key: "zagreb",
    image: "/images/locations/zagreb.jpg",
    bookingUrl: `${BOOKING_APP}/book/zagreb-centar`,
    gallery: [
      "/images/locations/zagreb.jpg",
      "/images/locations/zagreb-2.jpeg",
      "/images/locations/zagreb-3.jpeg",
      "/images/locations/zagreb-4.jpeg",
      "/images/locations/zagreb-5.jpeg",
    ],
  },
  {
    key: "wien",
    image: "/images/locations/wien.jpg",
    bookingUrl: "https://www.timify.com/de/profile/skintastic-wien",
    gallery: [
      "/images/locations/wien.jpg",
      "/images/locations/wien-2.jpg",
      "/images/locations/wien-3.jpg",
      "/images/locations/wien-4.jpg",
      "/images/locations/wien-5.jpg",
      "/images/locations/wien-6.jpg",
    ],
  },
  {
    key: "grazPuntigam",
    image: "/images/locations/graz-puntigam.jpg",
    bookingUrl: "https://www.timify.com/de/profile/skintastic-graz-puntigam",
    gallery: [
      "/images/locations/graz-puntigam.jpg",
      "/images/locations/graz-puntigam-2.jpg",
      "/images/locations/graz-puntigam-3.jpg",
      "/images/locations/graz-puntigam-4.jpg",
      "/images/locations/graz-puntigam-5.jpg",
      "/images/locations/graz-puntigam-6.jpg",
    ],
  },
  {
    key: "grazCity",
    image: "/images/locations/graz-city.jpg",
    bookingUrl: "https://www.timify.com/de/profile/skintastic-graz-city",
    gallery: [
      "/images/locations/graz-city.jpg",
      "/images/locations/graz-city-2.jpg",
    ],
  },
  {
    key: "stuttgart",
    image: "/images/locations/stuttgart.jpg",
    bookingUrl: "https://www.timify.com/de/profile/skintastic-stuttgart",
    gallery: [
      "/images/locations/stuttgart.jpg",
      "/images/locations/stuttgart-2.jpg",
      "/images/locations/stuttgart-3.jpg",
      "/images/locations/stuttgart-4.jpg",
      "/images/locations/stuttgart-5.jpg",
      "/images/locations/stuttgart-6.jpg",
    ],
  },
];

export function LocationsSection() {
  const t = useTranslations("locations");
  const [gallery, setGallery] = useState<string[] | null>(null);
  const [photo, setPhoto] = useState(0);

  return (
    <section id="locations" className="bg-[#EFD5CA] pb-20 pt-10 md:pb-24 md:pt-14">
      <div className="mx-auto max-w-[1600px] px-5 md:px-[50px]">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-2 text-[16px] uppercase tracking-[5px] text-[#0C0C0C]">
            {t("subtitle")}
          </p>
          <h2 className="font-script text-[3.2rem] font-normal leading-none text-[#0C0C0C] md:text-[3.75rem]">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5 md:gap-6">
          {LOCATIONS.map((loc) => {
            const extra = t(`items.${loc.key}.extra`);

            return (
              <article
                key={loc.key}
                className="flex w-full min-w-0 flex-col items-center text-center"
              >
                <a
                  href={loc.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mb-4 aspect-[3/4] w-full overflow-hidden transition-opacity hover:opacity-80"
                >
                  <Image
                    src={loc.image}
                    alt={t(`items.${loc.key}.name`)}
                    fill
                    className="object-cover"
                    sizes="250px"
                  />
                </a>

                <p className="text-[15px] leading-snug text-[#0C0C0C]">
                  {t(`items.${loc.key}.address`)}
                </p>
                {extra ? (
                  <p className="text-[15px] leading-snug text-[#0C0C0C]">{extra}</p>
                ) : (
                  <p className="text-[15px] leading-snug text-transparent">.</p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setGallery(loc.gallery);
                    setPhoto(0);
                  }}
                  className="mt-3 inline-block rounded-full bg-[#88C9CD] px-6 py-2.5 text-[13px] font-black uppercase tracking-wide text-[#0C0C0C]"
                >
                  {t("gallery")}
                </button>
                <a
                  href={loc.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded-full bg-white px-5 py-2.5 text-[13px] font-black uppercase tracking-wide text-[#0C0C0C]"
                >
                  {t("prices")}
                </a>
              </article>
            );
          })}
        </div>
      </div>

      {gallery && (
        <Lightbox
          images={gallery}
          index={photo}
          onClose={() => setGallery(null)}
          onIndexChange={setPhoto}
        />
      )}
    </section>
  );
}
