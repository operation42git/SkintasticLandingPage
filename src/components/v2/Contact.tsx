"use client";

import { useTranslations } from "next-intl";
import { contact, emailHref, givenLink } from "@/config/contact";

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 20l1.3-3.8A8 8 0 1 1 8 19z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

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
            <span className="k">{t("label")}</span>
            <h2>{current("eyebrow")}</h2>
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
