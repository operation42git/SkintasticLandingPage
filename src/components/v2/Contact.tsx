"use client";

import { useTranslations } from "next-intl";
import { contact, emailHref, facebookHref, instagramHref } from "@/config/contact";

function Channel({ label, value, href }: { label: string; value: string; href: string | null }) {
  const body = (
    <>
      <span>{label}</span>
      <b>{value}</b>
    </>
  );
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <div>{body}</div>
  );
}

/** Five channels; bracket placeholders are text, not links, as on the current page. */
export function Contact() {
  const t = useTranslations("v2.contact");
  return (
    <section className="wrap contact" id="v2-kontakt">
      <span className="k">{t("label")}</span>
      <div className="cg5">
        <Channel label={t("call")} value={contact.phoneDisplay} href={contact.phoneHref} />
        <Channel label={t("whatsapp")} value={contact.phoneDisplay} href={contact.whatsappHref} />
        <Channel label={t("email")} value={contact.email} href={emailHref()} />
        <Channel label={t("instagram")} value={contact.instagram} href={instagramHref()} />
        <Channel label={t("facebook")} value={contact.facebook} href={facebookHref()} />
      </div>
    </section>
  );
}
