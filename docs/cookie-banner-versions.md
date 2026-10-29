# Cookie banner versions

One row for every `BANNER_VERSION` (`src/config/consent.ts`): what the dialog said and did from that date. It is the record of
what a logged choice was made against. Add a row whenever the dialog text, the categories or the data use change; raise
`CONSENT_GENERATION` as well only for a material change (a new category, tool, purpose or recipient) and say so in the row.

| Version | Date | Generation | What changed | Commit |
|---|---|---|---|---|
| `2026-10-29.1` | 2026-10-29 | 1 | First version with a logged, per-category choice. The dialog shows two choices (analytics, ads) and the privacy link; Reject, Save and Accept all look the same; the cookie is `v2` with a generation; `skt_consent_id` and the log to the booking app; `introLong` and the necessary-cookies text rewritten so they claim no third-party cookies are in use; Croatian wording fixed (Odbij, Prihvati sve, Prikaži više/manje, Uvijek aktivni, Neophodni, Funkcionalni, Izvedba). | the commit that added this file |
