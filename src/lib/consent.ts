/**
 * The visitor's cookie choice: stored per category, read back exactly as given, announced to later scripts, and logged
 * in the booking app (docs/briefs/landing-cookie-consent.md, ADR-0068, ADR-0047).
 *
 * Pure on purpose: nothing here imports from `@/` or `next`, and everything that touches the world (the cookie jar, the
 * storage, `fetch`, the clock, the random source, the timer, the page's event) is passed in as an argument, so
 * `node --test src/lib/consent.test.mts` runs it with no environment variables. `CookieConsent.tsx` passes the real ones.
 *
 * RULE FOR ANY SCRIPT ADDED LATER (analytics, ads, a map, a chat): load it only when its category is `true` in
 * `getConsent()`, and again after `skt:consent-updated`. See docs/cookie-consent.md.
 */

export type CategoryKey = "functional" | "analytics" | "performance" | "ads";
export type Consent = Record<CategoryKey, boolean>;

/** The order in the cookie and in the record. */
export const CATEGORY_ORDER: readonly CategoryKey[] = ["functional", "analytics", "performance", "ads"];

export const CONSENT_COOKIE = "skt_consent";
export const CONSENT_ID_COOKIE = "skt_consent_id";
export const CONSENT_UPDATED_EVENT = "skt:consent-updated";
export const CONSENT_PENDING_KEY = "skt_consent_pending";

/** 180 days, as ADR-0047 says. */
export const COOKIE_MAX_AGE = 180 * 24 * 60 * 60;

/** At most this many unsent records are kept; the oldest is dropped first (proposed in the brief). */
export const QUEUE_MAX = 5;

/** A failed send is tried once more after this long (proposed in the brief). */
export const RETRY_DELAY_MS = 2000;

const V2 = /^v2\.([01])\.([01])\.([01])\.([01])\.([1-9][0-9]{0,5})\.(\d{4}-\d{2}-\d{2})$/;
const V1_NOTHING_GRANTED = /^v1\.1\.0\.0\.\d{4}-\d{2}-\d{2}$/;
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function noConsent(): Consent {
  return { functional: false, analytics: false, performance: false, ads: false };
}

export function anyGranted(consent: Consent): boolean {
  return CATEGORY_ORDER.some((key) => consent[key]);
}

function stamp(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** `v2.<functional>.<analytics>.<performance>.<ads>.<generation>.<YYYY-MM-DD>` */
export function encodeConsent(consent: Consent, generation: number, now: Date): string {
  const bits = CATEGORY_ORDER.map((key) => (consent[key] ? "1" : "0")).join(".");
  return `v2.${bits}.${generation}.${stamp(now)}`;
}

/**
 * A valid choice, or null when there is none. A `v2` cookie of an older generation that granted something is no
 * choice (the dialog asks again); one with every category off stays valid. `v1.1.0.0.<date>` (nothing granted under
 * the old format) is a valid choice with everything off; any other `v1` value is no choice.
 */
export function decodeConsent(raw: string | null | undefined, currentGeneration: number): Consent | null {
  if (!raw) return null;
  if (V1_NOTHING_GRANTED.test(raw)) return noConsent();
  const match = V2.exec(raw);
  if (!match) return null;
  const consent: Consent = {
    functional: match[1] === "1",
    analytics: match[2] === "1",
    performance: match[3] === "1",
    ads: match[4] === "1",
  };
  const generation = Number(match[5]);
  if (generation < currentGeneration && anyGranted(consent)) return null;
  return consent;
}

// ---- cookies ----------------------------------------------------------------------------------

export function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function readCookie(header: string, name: string): string | null {
  const prefix = `${name}=`;
  for (const part of header.split("; ")) {
    if (part.startsWith(prefix)) return decodeURIComponent(part.slice(prefix.length));
  }
  return null;
}

type CookieWhere = { readonly hostname: string; readonly cookieDomain: string };

function attributes(where: CookieWhere, maxAge: number): string {
  const parts = ["Path=/", `Max-Age=${maxAge}`, "SameSite=Lax"];
  if (!isLocalHost(where.hostname)) parts.push(`Domain=${where.cookieDomain}`, "Secure");
  return parts.join("; ");
}

export function cookieString(name: string, value: string, where: CookieWhere): string {
  return `${name}=${value}; ${attributes(where, COOKIE_MAX_AGE)}`;
}

export function deleteCookieString(name: string, where: CookieWhere): string {
  return `${name}=; ${attributes(where, 0)}`;
}

// ---- the consent ID ---------------------------------------------------------------------------

export type RandomSource = {
  randomUUID?: () => string;
  getRandomValues: <T extends ArrayBufferView>(array: T) => T;
};

export function isConsentId(value: string | null | undefined): value is string {
  return typeof value === "string" && UUID_V4.test(value);
}

/** `crypto.randomUUID()`, or where that is missing (a plain-http address on the local network) a v4 built from random bytes. */
export function newConsentId(random: RandomSource): string {
  if (typeof random.randomUUID === "function") return random.randomUUID();
  const bytes = random.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// ---- the action and the record ------------------------------------------------------------------

export type Via = "accept_all" | "reject" | "save";
export type Action = "accept_all" | "save" | "withdraw";

/**
 * What the log is told, or null when nothing is sent. `before` is the choice read just before this save. A save that
 * turns off anything granted before is a `withdraw`; otherwise "Accept all" is `accept_all` and a save that leaves at
 * least one category allowed is `save`. A first-time Reject, and a save that grants and withdraws nothing, send nothing.
 */
export function actionFor(before: Consent | null, after: Consent, via: Via): Action | null {
  const withdrew = before !== null && CATEGORY_ORDER.some((key) => before[key] && !after[key]);
  if (withdrew) return "withdraw";
  if (via === "accept_all") return "accept_all";
  return anyGranted(after) ? "save" : null;
}

export type LogRecord = {
  readonly consentId: string;
  readonly categories: Consent;
  readonly bannerVersion: string;
  readonly locale: string;
  readonly action: Action;
};

type Queued = LogRecord & { readonly queuedAt: string };

// ---- the pending queue --------------------------------------------------------------------------

export type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function loadQueue(store: Store | null): Queued[] {
  if (!store) return [];
  try {
    const parsed: unknown = JSON.parse(store.getItem(CONSENT_PENDING_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as Queued[]) : [];
  } catch {
    return [];
  }
}

function saveQueue(store: Store | null, queue: readonly Queued[]): void {
  if (!store) return;
  try {
    if (queue.length === 0) store.removeItem(CONSENT_PENDING_KEY);
    else store.setItem(CONSENT_PENDING_KEY, JSON.stringify(queue));
  } catch {
    /* private mode or full: the record is lost only if the send also fails */
  }
}

/** Keeps the record before it is sent. At most QUEUE_MAX are kept; the oldest is dropped first. */
export function enqueue(store: Store | null, record: LogRecord, now: Date): void {
  const queue = [...loadQueue(store), { ...record, queuedAt: now.toISOString() }];
  saveQueue(store, queue.slice(-QUEUE_MAX));
}

/** Removes the first record that is exactly this one; a twin (same ID, same instant) stays for its own turn. */
function dequeue(store: Store | null, item: Queued): void {
  const queue = loadQueue(store);
  const wanted = JSON.stringify(item);
  const at = queue.findIndex((candidate) => JSON.stringify(candidate) === wanted);
  if (at === -1) return;
  queue.splice(at, 1);
  saveQueue(store, queue);
}

// ---- the send -----------------------------------------------------------------------------------

export type SendEnv = {
  readonly store: Store | null;
  readonly fetch: typeof fetch;
  readonly logUrl: string;
  readonly keepalive: boolean;
  readonly wait: (ms: number) => Promise<void>;
  readonly warn: (message: string) => void;
};

/** The sent body has exactly the record's fields: `queuedAt` stays local. */
function bodyOf(item: Queued): string {
  const record: LogRecord = {
    consentId: item.consentId,
    categories: item.categories,
    bannerVersion: item.bannerVersion,
    locale: item.locale,
    action: item.action,
  };
  return JSON.stringify(record);
}

type Outcome = "sent" | "dropped" | "retry";

async function sendOnce(env: SendEnv, item: Queued): Promise<Outcome> {
  let response: Response;
  try {
    response = await env.fetch(env.logUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Client-Id": item.consentId },
      body: bodyOf(item),
      keepalive: env.keepalive,
      credentials: "omit",
    });
  } catch {
    return "retry";
  }
  if (response.ok) return "sent";
  if (response.status >= 400 && response.status < 500 && response.status !== 429) return "dropped";
  return "retry";
}

/**
 * Sends the queue oldest first. A `2xx` removes the record; a `4xx` other than `429` can never succeed, so it is removed
 * with one warning; a thrown fetch, a `5xx` or a `429` is tried once more after RETRY_DELAY_MS and then the record stays
 * and the run stops. Never throws.
 */
export async function flushQueue(env: SendEnv, unstored: readonly Queued[] = []): Promise<void> {
  // Without storage (private mode) the record that was just made is sent from memory, once or twice, and not kept.
  for (const item of env.store ? loadQueue(env.store) : unstored) {
    let outcome = await sendOnce(env, item);
    if (outcome === "retry") {
      await env.wait(RETRY_DELAY_MS);
      outcome = await sendOnce(env, item);
    }
    if (outcome === "retry") return;
    if (outcome === "dropped") env.warn(`The consent log refused a record (${item.action}); it was dropped.`);
    dequeue(env.store, item);
  }
}

// ---- save and read ------------------------------------------------------------------------------

export type ConsentEnv = CookieWhere & {
  readonly readCookies: () => string;
  readonly writeCookie: (cookie: string) => void;
  readonly now: () => Date;
  readonly random: RandomSource;
  readonly generation: number;
  readonly bannerVersion: string;
  readonly locale: string;
  readonly dispatch: (consent: Consent) => void;
  readonly send: SendEnv;
};

export function readConsent(env: Pick<ConsentEnv, "readCookies" | "generation">): Consent | null {
  return decodeConsent(readCookie(env.readCookies(), CONSENT_COOKIE), env.generation);
}

export function readConsentId(env: Pick<ConsentEnv, "readCookies">): string | null {
  const value = readCookie(env.readCookies(), CONSENT_ID_COOKIE);
  return isConsentId(value) ? value : null;
}

/**
 * Saves a choice: the cookies first, then the event, then the log. The record is queued before it is sent, and the send
 * is not waited for (the returned promise is for tests; the dialog never awaits it).
 *
 * The ID cookie is made at the first save that allows something, kept while consent stands, and deleted after a
 * `withdraw` has been queued under it. A first-time Reject sets no ID and sends nothing.
 */
export function saveConsent(env: ConsentEnv, after: Consent, via: Via): Promise<void> {
  const before = readConsent(env);
  const action = actionFor(before, after, via);
  const now = env.now();
  env.writeCookie(cookieString(CONSENT_COOKIE, encodeConsent(after, env.generation, now), env));

  const existing = readConsentId(env);
  let id = existing;
  if (anyGranted(after)) {
    id = existing ?? newConsentId(env.random);
    env.writeCookie(cookieString(CONSENT_ID_COOKIE, id, env));
  }

  // A withdrawal whose ID cookie was lost is still logged, under an ID made for the record alone.
  const recordId = id ?? (action === "withdraw" ? newConsentId(env.random) : null);
  let item: Queued | null = null;
  if (action !== null && recordId !== null) {
    const record: LogRecord = { consentId: recordId, categories: after, bannerVersion: env.bannerVersion, locale: env.locale, action };
    enqueue(env.send.store, record, now);
    item = { ...record, queuedAt: now.toISOString() };
  }
  if (!anyGranted(after) && existing !== null) env.writeCookie(deleteCookieString(CONSENT_ID_COOKIE, env));

  env.dispatch(after);
  return item === null ? Promise.resolve() : flushQueue(env.send, [item]);
}

// ---- what a later script asks -------------------------------------------------------------------

let configuredGeneration = 1;

/** `src/config/consent.ts` calls this once with CONSENT_GENERATION, so `getConsent()` needs no argument. */
export function configureConsent(options: { readonly generation: number }): void {
  configuredGeneration = options.generation;
}

/**
 * What the visitor allowed, or null when there is no valid choice (and always null on the server). Any analytics or
 * ads script loads only when its category is `true` here, and again after `skt:consent-updated`.
 */
export function getConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  return readConsent({ readCookies: () => document.cookie, generation: configuredGeneration });
}
