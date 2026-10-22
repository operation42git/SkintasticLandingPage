import { useTranslations } from "next-intl";
import { BookButton } from "@/components/ui/BookButton";
import { contact, emailHref, facebookHref, instagramHref } from "@/config/contact";
import { locationsOf, mapsSearchHref } from "@/config/locations";

const iconClass = "h-[22px] w-[22px] xl:h-[26px] xl:w-[26px]";

function PhoneIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />
    </svg>
  );
}

export function ContactSection() {
  const t = useTranslations("contact");
  const bookable = locationsOf("bookable");
  const channels = [
    { key: "call", href: contact.phoneHref, value: contact.phoneDisplay, icon: <PhoneIcon /> },
    { key: "whatsapp", href: contact.whatsappHref, value: contact.phoneDisplay, icon: <WhatsAppIcon /> },
    { key: "email", href: emailHref(), value: contact.email, icon: <MailIcon /> },
    { key: "instagram", href: instagramHref(), value: contact.instagram, icon: <InstagramIcon /> },
    { key: "facebook", href: facebookHref(), value: contact.facebook, icon: <FacebookIcon /> },
  ];

  return (
    <section id="kontakt" className="scroll-mt-[68px] bg-[#f5f0e8] xl:scroll-mt-[84px]">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-4 py-9 xl:gap-9 xl:px-6 xl:py-20">
        <div className="text-center">
          <p className="mb-1 text-[11px] uppercase tracking-[3px] xl:mb-2 xl:text-[15px] xl:tracking-[5px]">
            {t("eyebrow")}
          </p>
          <h2 className="font-script text-[44px] font-normal leading-none xl:text-[56px]">{t("title")}</h2>
        </div>

        <div className="grid grid-cols-2 gap-2 xl:grid-cols-5 xl:gap-3">
          {channels.map((channel) => {
            const inner = (
              <>
                {channel.icon}
                <strong className="text-[13px] xl:text-[15px]">{t(channel.key)}</strong>
                <span className="hidden text-[13px] xl:block">{channel.value}</span>
              </>
            );
            const className =
              "flex min-h-11 items-center gap-2.5 bg-white p-3 no-underline xl:flex-col xl:items-center xl:gap-1.5 xl:p-[18px] xl:text-center";
            return channel.href ? (
              <a key={channel.key} href={channel.href} className={className}>
                {inner}
              </a>
            ) : (
              <div key={channel.key} className={className}>
                {inner}
              </div>
            );
          })}
        </div>

        <p className="text-center text-[13px] xl:hidden">
          {contact.phoneDisplay} · {contact.email}
        </p>

        <div className="grid gap-2.5 xl:grid-cols-2 xl:gap-6">
          {bookable.map((location) => {
            const maps = mapsSearchHref(location.address);
            const directionsClass =
              "inline-flex items-center text-[13px] font-extrabold xl:rounded-full xl:border-[1.5px] xl:border-[#0C0C0C] xl:px-5 xl:py-[11px] xl:uppercase";
            return (
              <div key={location.id} className="flex flex-col gap-2 bg-white p-3.5 xl:gap-2.5 xl:p-7">
                <h3 className="text-[15px] font-extrabold xl:text-xl">{location.name}</h3>
                <p className="text-[13px] leading-normal xl:text-base xl:leading-relaxed">
                  {location.address}
                  {location.hours ? (
                    <>
                      <br />
                      {location.hours}
                    </>
                  ) : null}
                  {location.parking ? (
                    <>
                      <br className="hidden xl:block" />
                      <span className="xl:hidden"> · </span>
                      {t("parking", { value: location.parking })}
                    </>
                  ) : null}
                </p>
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <BookButton
                    centar={location.slug}
                    className="inline-flex items-center justify-center rounded-full bg-[#0C0C0C] px-5 py-3 text-[13px] font-extrabold uppercase text-white"
                  >
                    {t("book")}
                  </BookButton>
                  {maps ? (
                    <a href={maps} className={directionsClass} target="_blank" rel="noopener noreferrer">
                      {t("directions")}
                    </a>
                  ) : (
                    <span className={directionsClass}>{t("directions")}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
