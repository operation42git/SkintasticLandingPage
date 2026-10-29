import type { ReactNode } from "react";

// The <html> and <body> are in src/app/[locale]/layout.tsx, per language. A layout at the top is still required for the
// root page (src/app/page.tsx), so this one only passes its children through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
