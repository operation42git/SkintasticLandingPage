"use client";

import { useTranslations } from "next-intl";
import { BookButton } from "@/components/ui/BookButton";

/** On the phone the header's booking button becomes this bar at the bottom. */
export function StickyBar() {
  const t = useTranslations("v2");
  return (
    <div className="sticky">
      <BookButton className="btn">{t("book")}</BookButton>
    </div>
  );
}
