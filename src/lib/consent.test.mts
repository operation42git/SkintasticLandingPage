// Run: node --test src/lib/consent.test.mts   (Node 22.18 or later; no dependency)
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CATEGORY_ORDER,
  CONSENT_COOKIE,
  CONSENT_ID_COOKIE,
  CONSENT_PENDING_KEY,
  QUEUE_MAX,
  actionFor,
  decodeConsent,
  encodeConsent,
  enqueue,
  flushQueue,
  isConsentId,
  loadQueue,
  newConsentId,
  noConsent,
  readConsent,
  readConsentId,
  saveConsent,
  type Consent,
  type ConsentEnv,
  type LogRecord,
  type SendEnv,
} from "./consent.ts";

const ID = "3f2b8c1e-5a47-4d0b-9c1e-7a2b3c4d5e6f";
const DAY = new Date("2026-11-01T10:00:00");
const only = (key: keyof Consent): Consent => ({ ...noConsent(), [key]: true });
const both: Consent = { ...noConsent(), analytics: true, ads: true };

function memoryStore() {
  const items = new Map<string, string>();
  return {
    items,
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
    removeItem: (key: string) => void items.delete(key),
  };
}

/** A document.cookie that honours Max-Age=0 and keeps the attributes of the last write of each name. */
function jar() {
  const values = new Map<string, string>();
  const written: string[] = [];
  return {
    written,
    read: () => [...values].map(([name, value]) => `${name}=${value}`).join("; "),
    write: (cookie: string) => {
      written.push(cookie);
      const [pair, ...attrs] = cookie.split("; ");
      const eq = pair.indexOf("=");
      const name = pair.slice(0, eq);
      const value = pair.slice(eq + 1);
      if (attrs.includes("Max-Age=0")) values.delete(name);
      else values.set(name, value);
    },
  };
}

type Call = { url: string; init: RequestInit & { keepalive?: boolean }; queueAtCall: LogRecord[] };

function world(options: { statuses?: number[]; throws?: boolean; noStore?: boolean; hostname?: string; random?: ConsentEnv["random"] } = {}) {
  const cookies = jar();
  const store = memoryStore();
  const calls: Call[] = [];
  const waits: number[] = [];
  const warnings: string[] = [];
  const events: Consent[] = [];
  const statuses = [...(options.statuses ?? [])];
  const fakeFetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, init, queueAtCall: loadQueue(store) });
    if (options.throws) throw new TypeError("network");
    const status = statuses.shift() ?? 201;
    return { ok: status >= 200 && status < 300, status } as Response;
  }) as unknown as typeof fetch;
  const send: SendEnv = {
    store: options.noStore ? null : store,
    fetch: fakeFetch,
    logUrl: "https://app.example/api/public/consent-log",
    keepalive: true,
    wait: async (ms) => void waits.push(ms),
    warn: (message) => void warnings.push(message),
  };
  const env: ConsentEnv = {
    hostname: options.hostname ?? "skintastic.example",
    cookieDomain: "skintastic.example",
    readCookies: cookies.read,
    writeCookie: cookies.write,
    now: () => DAY,
    random: options.random ?? { randomUUID: () => ID, getRandomValues: (a) => a },
    generation: 1,
    bannerVersion: "2026-10-29.1",
    locale: "hr",
    dispatch: (consent) => void events.push(consent),
    send,
  };
  return { env, cookies, store, calls, waits, warnings, events };
}

describe("the cookie value", () => {
  it("round-trips every single category, none and all", () => {
    const cases: Consent[] = [noConsent(), ...CATEGORY_ORDER.map((key) => only(key)), { functional: true, analytics: true, performance: true, ads: true }];
    for (const consent of cases) {
      assert.deepEqual(decodeConsent(encodeConsent(consent, 1, DAY), 1), consent);
    }
  });

  it("writes the documented shape", () => {
    assert.equal(encodeConsent({ ...noConsent(), analytics: true }, 1, DAY), "v2.0.1.0.0.1.2026-11-01");
  });

  it("reads a v1 cookie that granted something, a malformed value and an empty string as no choice", () => {
    assert.equal(decodeConsent("v1.1.1.0.2026-10-21", 1), null);
    assert.equal(decodeConsent("v1.1.0.1.2026-10-21", 1), null);
    assert.equal(decodeConsent("v2.0.1.0.2026-11-01", 1), null);
    assert.equal(decodeConsent("v2.0.2.0.0.1.2026-11-01", 1), null);
    assert.equal(decodeConsent("v2.0.1.0.0.0.2026-11-01", 1), null);
    assert.equal(decodeConsent("garbage", 1), null);
    assert.equal(decodeConsent("", 1), null);
    assert.equal(decodeConsent(null, 1), null);
  });

  it("reads v1.1.0.0.<date> (nothing granted) as a valid choice with everything off", () => {
    assert.deepEqual(decodeConsent("v1.1.0.0.2026-10-21", 1), noConsent());
  });

  it("asks again after a lower generation only when something was granted", () => {
    assert.equal(decodeConsent("v2.0.1.0.0.1.2026-11-01", 2), null);
    assert.deepEqual(decodeConsent("v2.0.0.0.0.1.2026-11-01", 2), noConsent());
    assert.deepEqual(decodeConsent("v2.0.1.0.0.2.2026-11-01", 2), { ...noConsent(), analytics: true });
    assert.deepEqual(decodeConsent("v2.0.1.0.0.3.2026-11-01", 2), { ...noConsent(), analytics: true });
  });
});

describe("the action", () => {
  it("is accept_all for the Accept all button", () => {
    assert.equal(actionFor(null, both, "accept_all"), "accept_all");
    assert.equal(actionFor(both, both, "accept_all"), "accept_all");
  });
  it("is save for a save that leaves something allowed and turns nothing off", () => {
    assert.equal(actionFor(null, only("analytics"), "save"), "save");
    assert.equal(actionFor(only("analytics"), both, "save"), "save");
  });
  it("is withdraw for a Reject or a Save that turns off something granted before", () => {
    assert.equal(actionFor(both, noConsent(), "reject"), "withdraw");
    assert.equal(actionFor(both, only("analytics"), "save"), "withdraw");
    assert.equal(actionFor(only("ads"), noConsent(), "save"), "withdraw");
  });
  it("is nothing for a first-time Reject and for a save that grants and withdraws nothing", () => {
    assert.equal(actionFor(null, noConsent(), "reject"), null);
    assert.equal(actionFor(null, noConsent(), "save"), null);
    assert.equal(actionFor(noConsent(), noConsent(), "reject"), null);
  });
});

describe("the consent ID", () => {
  it("uses randomUUID when there is one", () => {
    assert.equal(newConsentId({ randomUUID: () => ID, getRandomValues: (a) => a }), ID);
  });
  it("builds a valid v4 from random bytes when randomUUID is missing", () => {
    for (let i = 0; i < 50; i += 1) {
      const id = newConsentId({ getRandomValues: (a) => globalThis.crypto.getRandomValues(a as Uint8Array) as typeof a });
      assert.equal(isConsentId(id), true, id);
      assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    }
  });
  it("accepts only a UUID v4", () => {
    assert.equal(isConsentId("3f2b8c1e-5a47-1d0b-9c1e-7a2b3c4d5e6f"), false);
    assert.equal(isConsentId("nope"), false);
    assert.equal(isConsentId(null), false);
  });
});

describe("the queue", () => {
  const record = (n: number): LogRecord => ({ consentId: ID, categories: both, bannerVersion: "2026-10-29.1", locale: "hr", action: n % 2 ? "save" : "accept_all" });

  it("keeps five and drops the oldest first", () => {
    const store = memoryStore();
    for (let n = 0; n < 7; n += 1) enqueue(store, { ...record(n), bannerVersion: `2026-10-29.${n + 1}` }, new Date(2026, 10, 1, 10, 0, n));
    const queue = loadQueue(store);
    assert.equal(queue.length, QUEUE_MAX);
    assert.deepEqual(queue.map((item) => item.bannerVersion), ["2026-10-29.3", "2026-10-29.4", "2026-10-29.5", "2026-10-29.6", "2026-10-29.7"]);
  });

  it("survives broken stored JSON", () => {
    const store = memoryStore();
    store.setItem(CONSENT_PENDING_KEY, "{not json");
    assert.deepEqual(loadQueue(store), []);
    assert.deepEqual(loadQueue(null), []);
  });
});

describe("the send", () => {
  it("removes a record on 2xx, with exactly the record's fields in the body and X-Client-Id, keepalive and no credentials", async () => {
    const w = world();
    enqueue(w.store, { consentId: ID, categories: both, bannerVersion: "2026-10-29.1", locale: "hr", action: "accept_all" }, DAY);
    await flushQueue(w.env.send);
    assert.equal(w.calls.length, 1);
    const [call] = w.calls;
    assert.equal(call.url, "https://app.example/api/public/consent-log");
    assert.deepEqual(JSON.parse(String(call.init.body)), { consentId: ID, categories: both, bannerVersion: "2026-10-29.1", locale: "hr", action: "accept_all" });
    assert.equal("queuedAt" in JSON.parse(String(call.init.body)), false);
    assert.deepEqual(call.init.headers, { "Content-Type": "application/json", "X-Client-Id": ID });
    assert.equal(call.init.keepalive, true);
    assert.equal(call.init.credentials, "omit");
    assert.equal(loadQueue(w.store).length, 0);
  });

  it("drops a record on a 4xx (once warned) and keeps it on a 5xx or a 429 after one retry", async () => {
    const dropped = world({ statuses: [400] });
    enqueue(dropped.store, { consentId: ID, categories: both, bannerVersion: "v", locale: "hr", action: "save" }, DAY);
    await flushQueue(dropped.env.send);
    assert.equal(loadQueue(dropped.store).length, 0);
    assert.equal(dropped.warnings.length, 1);
    assert.equal(dropped.calls.length, 1);

    for (const status of [500, 503, 429]) {
      const kept = world({ statuses: [status, status] });
      enqueue(kept.store, { consentId: ID, categories: both, bannerVersion: "v", locale: "hr", action: "save" }, DAY);
      await flushQueue(kept.env.send);
      assert.equal(loadQueue(kept.store).length, 1, `status ${status}`);
      assert.equal(kept.calls.length, 2, "one retry");
      assert.deepEqual(kept.waits, [2000]);
    }
  });

  it("retries a thrown fetch once and then leaves the record for the next page load", async () => {
    const w = world({ throws: true });
    enqueue(w.store, { consentId: ID, categories: both, bannerVersion: "v", locale: "hr", action: "save" }, DAY);
    await flushQueue(w.env.send);
    assert.equal(w.calls.length, 2);
    assert.equal(loadQueue(w.store).length, 1);
  });

  it("succeeds on the retry and removes the record", async () => {
    const w = world({ statuses: [500, 201] });
    enqueue(w.store, { consentId: ID, categories: both, bannerVersion: "v", locale: "hr", action: "save" }, DAY);
    await flushQueue(w.env.send);
    assert.equal(w.calls.length, 2);
    assert.equal(loadQueue(w.store).length, 0);
  });

  it("sends the oldest first and stops at the first record that cannot be sent", async () => {
    const w = world({ statuses: [201, 500, 500] });
    for (const version of ["a", "b", "c"]) enqueue(w.store, { consentId: ID, categories: both, bannerVersion: version, locale: "hr", action: "save" }, DAY);
    await flushQueue(w.env.send);
    assert.deepEqual(w.calls.map((call) => JSON.parse(String(call.init.body)).bannerVersion), ["a", "b", "b"]);
    assert.deepEqual(loadQueue(w.store).map((item) => item.bannerVersion), ["b", "c"]);
  });
});

describe("saving a choice", () => {
  it("a first-time Reject sets only skt_consent: no ID, nothing sent, the event fires", async () => {
    const w = world();
    await saveConsent(w.env, noConsent(), "reject");
    assert.equal(readCookieNames(w.cookies.read()).join(), CONSENT_COOKIE);
    assert.equal(w.calls.length, 0);
    assert.equal(loadQueue(w.store).length, 0);
    assert.deepEqual(w.events, [noConsent()]);
    assert.deepEqual(readConsent(w.env), noConsent());
    assert.equal(readConsentId(w.env), null);
  });

  it("a save that allows something creates the ID, queues the record before the send, and sends one POST", async () => {
    const w = world();
    await saveConsent(w.env, only("analytics"), "save");
    assert.equal(readConsentId(w.env), ID);
    assert.equal(w.calls.length, 1);
    assert.equal(w.calls[0].queueAtCall.length, 1, "the record was in the queue when the send started");
    const sent = JSON.parse(String(w.calls[0].init.body));
    assert.deepEqual(sent, { consentId: ID, categories: only("analytics"), bannerVersion: "2026-10-29.1", locale: "hr", action: "save" });
    assert.deepEqual(readConsent(w.env), only("analytics"));
    assert.deepEqual(w.events, [only("analytics")]);
    assert.match(w.cookies.written[0], /^skt_consent=v2\.0\.1\.0\.0\.1\.2026-11-01; Path=\/; Max-Age=15552000; SameSite=Lax; Domain=skintastic\.example; Secure$/);
    assert.match(w.cookies.written[1], new RegExp(`^${CONSENT_ID_COOKIE}=${ID}; Path=/; Max-Age=15552000; SameSite=Lax; Domain=skintastic\\.example; Secure$`));
  });

  it("keeps the same ID across later saves", async () => {
    let n = 0;
    const w = world({ random: { randomUUID: () => (n++ === 0 ? ID : "ffffffff-ffff-4fff-bfff-ffffffffffff"), getRandomValues: (a) => a } });
    await saveConsent(w.env, only("analytics"), "save");
    await saveConsent(w.env, both, "accept_all");
    const ids = w.calls.map((call) => JSON.parse(String(call.init.body)).consentId);
    assert.deepEqual(ids, [ID, ID]);
  });

  it("allowing something and then rejecting everything logs a withdraw under the ID and then deletes the ID cookie", async () => {
    const w = world();
    await saveConsent(w.env, both, "accept_all");
    await saveConsent(w.env, noConsent(), "reject");
    const sent = w.calls.map((call) => JSON.parse(String(call.init.body)));
    assert.deepEqual(sent.map((s) => s.action), ["accept_all", "withdraw"]);
    assert.equal(sent[1].consentId, ID);
    assert.deepEqual(sent[1].categories, noConsent());
    assert.equal(readConsentId(w.env), null);
    assert.equal(readCookieNames(w.cookies.read()).join(), CONSENT_COOKIE);
    assert.match(w.cookies.written.at(-1) ?? "", /^skt_consent_id=; Path=\/; Max-Age=0;/);
  });

  it("the next allowing choice makes a new ID", async () => {
    let n = 0;
    const second = "ffffffff-ffff-4fff-bfff-ffffffffffff";
    const w = world({ random: { randomUUID: () => (n++ === 0 ? ID : second), getRandomValues: (a) => a } });
    await saveConsent(w.env, both, "accept_all");
    await saveConsent(w.env, noConsent(), "reject");
    await saveConsent(w.env, only("ads"), "save");
    assert.equal(readConsentId(w.env), second);
  });

  it("a Save with nothing allowed and nothing granted before sends nothing and sets no ID", async () => {
    const w = world();
    await saveConsent(w.env, noConsent(), "save");
    assert.equal(w.calls.length, 0);
    assert.equal(readConsentId(w.env), null);
  });

  it("logs a withdrawal even when the ID cookie was lost, under an ID made for the record", async () => {
    let n = 0;
    const lost = "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa";
    const w = world({ random: { randomUUID: () => (n++ === 0 ? ID : lost), getRandomValues: (a) => a } });
    await saveConsent(w.env, both, "accept_all");
    w.cookies.write(`${CONSENT_ID_COOKIE}=; Path=/; Max-Age=0`);
    await saveConsent(w.env, noConsent(), "reject");
    const last = JSON.parse(String(w.calls.at(-1)?.init.body));
    assert.equal(last.action, "withdraw");
    assert.equal(last.consentId, lost);
  });

  it("still sends the record when there is no storage, and never throws when the send fails", async () => {
    const w = world({ noStore: true, throws: true });
    await saveConsent(w.env, both, "accept_all");
    assert.equal(w.calls.length, 2, "one try and one retry, from memory");
  });

  it("writes no Domain and no Secure on localhost", async () => {
    const w = world({ hostname: "localhost" });
    await saveConsent(w.env, only("ads"), "save");
    assert.equal(w.cookies.written[0], "skt_consent=v2.0.0.0.1.1.2026-11-01; Path=/; Max-Age=15552000; SameSite=Lax");
  });

  it("a v2 cookie of an older generation that granted something reads as no choice (the dialog asks again)", async () => {
    const w = world();
    await saveConsent(w.env, only("analytics"), "save");
    assert.deepEqual(readConsent({ readCookies: w.cookies.read, generation: 1 }), only("analytics"));
    assert.equal(readConsent({ readCookies: w.cookies.read, generation: 2 }), null);
  });
});

function readCookieNames(header: string): string[] {
  return header.split("; ").filter(Boolean).map((part) => part.slice(0, part.indexOf("=")));
}
