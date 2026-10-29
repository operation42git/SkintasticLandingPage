# Cookie banner versions

One row for every `BANNER_VERSION` (`src/config/consent.ts`): what the dialog said and did from that date. It is the record of
what a logged choice was made against. Add a row whenever the dialog text, the categories or the data use change; raise
`CONSENT_GENERATION` as well only for a material change (a new category, tool, purpose or recipient) and say so in the row.

| Version | Date | Generation | What changed | Commit |
|---|---|---|---|---|
| `2026-10-29.1` | 2026-10-29 | 1 | First version with a logged, per-category choice. The dialog shows two choices (analytics, ads) and the privacy link; Reject, Save and Accept all look the same; the cookie is `v2` with a generation; `skt_consent_id` and the log to the booking app; `introLong` and the necessary-cookies text rewritten so they claim no third-party cookies are in use; Croatian wording fixed (Odbij, Prihvati sve, Prikaži više/manje, Uvijek aktivni, Neophodni, Funkcionalni, Izvedba). | the commit that added this file |
| `2026-10-29.2` | 2026-10-29 | 1 | Google Analytics 4 and the Google Ads tag, loaded only after consent (Consent Mode v2, basic); the short intro and the analytics and ads descriptions now name Google Ireland Limited, the cookies (`_ga`, `_ga_*`, `_gcl_au`, `_gcl_aw`, `_gac_*`) and their lifetimes, and say that personalised ads are off. `CONSENT_GENERATION` stays 1: the first version was never published, so no visitor holds a choice made against it. (A new tool and recipient are a material change: raise the generation if version 1 was ever live.) | the commit that added this row |
