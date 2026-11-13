import type { ReactNode } from "react";

/**
 * The brand is always written "skintastic", lowercase (Ivan, 2026-11-13), also inside labels and buttons that
 * CSS sets in capitals: each occurrence is wrapped in `.brand` (text-transform: none, in globals.css).
 */
export function withBrand(text: string): ReactNode {
  const parts = text.split(/(skintastic)/gi);
  if (parts.length === 1) return text;
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="brand">
        skintastic
      </span>
    ) : (
      part
    ),
  );
}
