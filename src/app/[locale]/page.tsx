import { DesignRoot } from "@/components/v2/DesignRoot";
import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // The new design is what the server sends (Ivan, 2026-11-06); DesignRoot swaps in the previous one in the
  // browser only for a tester who asked for it (?dizajn=sada or the header's design button).
  return <DesignRoot />;
}
