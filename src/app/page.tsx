import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * `/` opens the page of the default language, the same as `/hr/`. The site is a static export, so there is no middleware and
 * no server to redirect: in `next dev` this is a 307, and in the exported site the page sends the browser on with JavaScript.
 * A redirect by the host would also cover a visitor with JavaScript off.
 */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}/`);
}
