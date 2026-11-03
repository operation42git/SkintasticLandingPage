"use client";

import { useTranslations } from "next-intl";
import { FAQ_GROUPS_V2 } from "@/config/design";

type FaqEntry = { q: string; a: string | string[] };

// The same rule as the current FAQ: only <strong>, <em> and <br> survive.
function sanitize(html: string) {
  return html.replace(/<(?!\/?(?:strong|em|br)\b)[^>]*>/gi, "");
}

/** Opening one question closes the others: `name` does it natively; this covers browsers without it. */
function closeOthers(event: React.SyntheticEvent<HTMLDetailsElement>) {
  const opened = event.currentTarget;
  if (!opened.open) return;
  opened
    .closest(".fg")
    ?.querySelectorAll<HTMLDetailsElement>("details[open]")
    .forEach((other) => {
      if (other !== opened) other.open = false;
    });
}

/** All items of the existing FAQ, in order and in three groups, texts unchanged; one open at a time, the first on load. */
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
          {FAQ_GROUPS_V2.map((group) => (
            <div className="fgp" key={group.key}>
              <span className="k">{t(`groups.${group.key}`)}</span>
              {items.slice(group.from, group.to).map((item, offset) => (
                <details key={item.q} name="faq" open={group.from + offset === 0} onToggle={closeOthers}>
                  <summary>{item.q}</summary>
                  {/* A <br> in an answer becomes its own paragraph, about 10 px apart. */}
                  {(Array.isArray(item.a) ? item.a : [item.a])
                    .flatMap((answer) => answer.split(/<br\s*\/?>/i))
                    .filter((paragraph) => paragraph.trim())
                    .map((paragraph, i) => (
                      <p key={i} dangerouslySetInnerHTML={{ __html: sanitize(paragraph) }} />
                    ))}
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
