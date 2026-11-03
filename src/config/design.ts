/**
 * The discreet switch between the current design and the new one (landing-redesign).
 * Everyone sees the current design. `?dizajn=novo` turns the new one on and remembers it in
 * localStorage; `?dizajn=sada` or the switch's "Sada" turns it off and forgets it.
 */
export type Design = "sada" | "novo";

export const DESIGN_STORAGE_KEY = "skt_design";
export const DESIGN_PARAM = "dizajn";

function readStored(): Design {
  try {
    return window.localStorage.getItem(DESIGN_STORAGE_KEY) === "novo" ? "novo" : "sada";
  } catch {
    return "sada";
  }
}

export function rememberDesign(design: Design): void {
  try {
    if (design === "novo") window.localStorage.setItem(DESIGN_STORAGE_KEY, "novo");
    else window.localStorage.removeItem(DESIGN_STORAGE_KEY);
  } catch {
    // Storage blocked: the current design shows, nothing to remember.
  }
}

/** The design for this page view: the URL parameter first (and remembered), else what was stored. */
export function designFromPage(search: string): Design {
  const asked = new URLSearchParams(search).get(DESIGN_PARAM);
  if (asked === "novo" || asked === "sada") {
    rememberDesign(asked);
    return asked === "novo" && readStored() === "novo" ? "novo" : "sada";
  }
  return readStored();
}
