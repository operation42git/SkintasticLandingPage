"use client";

import { useTranslations } from "next-intl";
import type { Design } from "@/config/design";

/** The small pill shown only while the new design is remembered, so ordinary visitors never see it. */
export function DesignSwitch({ design, onChange }: { design: Design; onChange: (design: Design) => void }) {
  const t = useTranslations("v2.switch");
  return (
    <div className="v2-switch" role="group" aria-label={t("label")}>
      <span>{t("label")}</span>
      <button type="button" aria-pressed={design === "sada"} onClick={() => onChange("sada")}>
        {t("current")}
      </button>
      <button type="button" aria-pressed={design === "novo"} onClick={() => onChange("novo")}>
        {t("new")}
      </button>
    </div>
  );
}
