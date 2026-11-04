"use client";

import { useTranslations } from "next-intl";
import { contact, emailHref, givenLink } from "@/config/contact";
import { ChatIcon, PhoneIcon } from "./icons";

/** Kontakt: WhatsApp and call buttons; the e-mail line only once a real address is given. */
export function Contact() {
  const t = useTranslations("v2.contact");
  const current = useTranslations("contact");
  const email = givenLink(contact.email);
  const mailto = emailHref();
  return (
    <div className="wrap">
      <section className="contact" id="v2-kontakt">
        <div className="cx">
          <div>
            <span className="k">{current("eyebrow")}</span>
            <h2>{current("title")}</h2>
          </div>
          <div>
            <div className="cbt">
              <a className="btn" href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">
                <ChatIcon />
                {t("whatsappCta")}
              </a>
              <a className="btn2" href={contact.phoneHref}>
                <PhoneIcon />
                {t("callCta", { phone: contact.phoneDisplay })}
              </a>
            </div>
            {email && mailto ? (
              <p className="cm">
                {t.rich("emailLine", {
                  email,
                  link: (chunks) => <a href={mailto}>{chunks}</a>,
                })}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
