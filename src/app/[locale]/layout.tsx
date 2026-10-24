import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans, Great_Vibes } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/config/booking";
import { contact } from "@/config/contact";
import { locationsOf } from "@/config/locations";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import "../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
  weight: "400",
});

const lumiosMarker = localFont({
  src: "../../fonts/Lumios-Marker.woff2",
  variable: "--font-lumios",
  display: "swap",
});

const ICONS = {
  icon: "/images/logos/apple-touch-icon.png",
  apple: "/images/logos/apple-touch-icon.png",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `${SITE_URL}/${locale}/` },
    icons: ICONS,
  };
}

function plainAnswer(answer: string | string[]): string {
  const html = Array.isArray(answer) ? answer.join(" ") : answer;
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function structuredData(locale: string, faqItems: { q: string; a: string | string[] }[]) {
  const pageUrl = `${SITE_URL}/${locale}/`;
  const telephone = contact.phoneHref.replace(/^tel:/, "");
  const businesses = locationsOf("bookable").map((location) => {
    const entry: Record<string, unknown> = {
      "@type": "LocalBusiness",
      "@id": `${pageUrl}#${location.id}`,
      name: location.name,
      url: pageUrl,
      telephone,
      image: location.image ? `${SITE_URL}${location.image}` : undefined,
    };
    if (location.address && !location.address.startsWith("[")) {
      entry.address = {
        "@type": "PostalAddress",
        streetAddress: location.address,
        addressCountry: "HR",
      };
    }
    return entry;
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      ...businesses,
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: plainAnswer(item.a) },
        })),
      },
    ],
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "hr" | "en")) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const faq = await getTranslations({ locale, namespace: "faq" });
  const jsonLd = structuredData(locale, faq.raw("items") as { q: string; a: string | string[] }[]);

  return (
    <html
      lang={locale}
      className={`${plusJakartaSans.variable} ${greatVibes.variable} ${lumiosMarker.variable}`}
    >
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NextIntlClientProvider messages={messages}>
          {children}
          <CookieConsent />
          <ScrollToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
