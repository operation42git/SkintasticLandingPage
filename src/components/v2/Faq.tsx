"use client";

import { useTranslations } from "next-intl";

type FaqEntry = { q: string; a: string | string[] };

// The same rule as the current FAQ: only <strong>, <em> and <br> survive.
function sanitize(html: string) {
  return html.replace(/<(?!\/?(?:strong|em|br)\b)[^>]*>/gi, "");
}

/** All items of the existing FAQ, in order, with their texts unchanged; the first one open. */
export function Faq() {
  const t = useTranslations("v2.faq");
  const faq = useTranslations("faq");
  const items = faq.raw("items") as FaqEntry[];
  return (
    <section className="faq" id="v2-pitanja">
      <div className="wrap fg">
        <div>
          <h2>{t("title")}</h2>
          <p className="fsub">{faq("subtitle")}</p>
        </div>
        <div>
          {items.map((item, index) => (
            <details key={item.q} open={index === 0}>
              <summary>{item.q}</summary>
              {(Array.isArray(item.a) ? item.a : [item.a]).map((paragraph, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: sanitize(paragraph) }} />
              ))}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
