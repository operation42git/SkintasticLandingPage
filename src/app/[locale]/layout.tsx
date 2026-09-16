import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans, Great_Vibes } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
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

export const metadata: Metadata = {
  title: "skintastic LASER SKIN & BODY",
  description:
    "Trajno uklanjanje dlačica laserom uz Mediostar diodni laser. Besplatno savjetovanje. Zagreb, Wien, Graz, Stuttgart.",
  icons: {
    icon: "/images/logos/apple-touch-icon.png",
    apple: "/images/logos/apple-touch-icon.png",
  },
};

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

  if (!routing.locales.includes(locale as "hr" | "de")) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${plusJakartaSans.variable} ${greatVibes.variable} ${lumiosMarker.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <CookieConsent />
          <ScrollToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
