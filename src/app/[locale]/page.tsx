import { setRequestLocale } from "next-intl/server";
import { V2Page } from "@/components/v2/V2Page";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // The one design (Ivan, 2026-11-24: the previous design is retired). An old ?dizajn= link simply shows this page.
  return <V2Page />;
}
