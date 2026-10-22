export const contact = {
  phoneDisplay: "+385 95 757 5344",
  phoneHref: "tel:+385957575344",
  whatsappHref: "https://wa.me/385957575344",
  email: "[E-MAIL]",
  instagram: "[INSTAGRAM]",
  facebook: "[FACEBOOK]",
} as const;

/** A bracket placeholder is shown as text and is not used as a link. */
export function givenLink(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("[")) return null;
  return trimmed;
}

export function emailHref(email: string = contact.email): string | null {
  const given = givenLink(email);
  return given ? `mailto:${given}` : null;
}

export function instagramHref(): string | null {
  return givenLink(contact.instagram);
}

export function facebookHref(): string | null {
  return givenLink(contact.facebook);
}
