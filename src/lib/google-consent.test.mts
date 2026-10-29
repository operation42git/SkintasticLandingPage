// Run: node --test src/lib/google-consent.test.mts   (Node 22.18 or later; no dependency)
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { noConsent, type Consent } from "./consent.ts";
import {
  DENIED_ALL,
  GOOGLE_COOKIES,
  configsFor,
  cookieMatches,
  deletionStrings,
  domainsFor,
  eventTo,
  ga4CookieName,
  pageView,
  parseAdsId,
  parseGa4Id,
  scriptIdFor,
  scriptUrl,
  signalsFor,
  withdrew,
} from "./google-consent.ts";

const only = (key: keyof Consent): Consent => ({ ...noConsent(), [key]: true });
const IDS = { ga4: "G-ABC123DEF4", ads: "AW-123456789" };

describe("the signals", () => {
  it("analytics alone grants analytics_storage and nothing else (security is always granted)", () => {
    assert.deepEqual(signalsFor(only("analytics"), false), { ...DENIED_ALL, analytics_storage: "granted", security_storage: "granted" });
  });

  it("ads alone grants ad_storage and ad_user_data, never ad_personalization while it is not allowed", () => {
    assert.deepEqual(signalsFor(only("ads"), false), {
      ...DENIED_ALL,
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "denied",
      security_storage: "granted",
    });
  });

  it("ad_personalization follows ads when the switch is true", () => {
    assert.equal(signalsFor(only("ads"), true).ad_personalization, "granted");
    assert.equal(signalsFor(only("analytics"), true).ad_personalization, "denied");
    assert.equal(signalsFor(noConsent(), true).ad_personalization, "denied");
  });

  it("functional grants functionality_storage; performance grants no signal at all", () => {
    assert.deepEqual(signalsFor(only("functional"), false), { ...DENIED_ALL, functionality_storage: "granted", security_storage: "granted" });
    assert.deepEqual(signalsFor(only("performance"), false), signalsFor(noConsent(), false));
  });

  it("personalization_storage is always denied; security_storage always granted; no choice denies the rest", () => {
    for (const consent of [null, noConsent(), { functional: true, analytics: true, performance: true, ads: true }]) {
      const signals = signalsFor(consent, true);
      assert.equal(signals.personalization_storage, "denied");
      assert.equal(signals.security_storage, "granted");
    }
    assert.deepEqual(signalsFor(null, false), signalsFor(noConsent(), false));
  });

  it("all grants the three analytics and ads signals and functionality_storage", () => {
    const signals = signalsFor({ functional: true, analytics: true, performance: true, ads: true }, false);
    assert.equal(signals.analytics_storage, "granted");
    assert.equal(signals.ad_storage, "granted");
    assert.equal(signals.ad_user_data, "granted");
    assert.equal(signals.ad_personalization, "denied");
    assert.equal(signals.functionality_storage, "granted");
  });

  it("the default has every signal denied", () => {
    assert.equal(Object.values(DENIED_ALL).length, 7);
    assert.ok(Object.values(DENIED_ALL).every((value) => value === "denied"));
  });
});

describe("the load rule", () => {
  const combos: [string, Consent | null][] = [
    ["no choice", null],
    ["nothing allowed (Reject)", noConsent()],
    ["functional alone", only("functional")],
    ["performance alone", only("performance")],
    ["analytics alone", only("analytics")],
    ["ads alone", only("ads")],
    ["analytics and ads", { ...noConsent(), analytics: true, ads: true }],
  ];

  it("requests nothing for no choice, Reject, functional alone and performance alone", () => {
    for (const [, consent] of combos.slice(0, 4)) assert.equal(scriptIdFor(signalsFor(consent, false), IDS), null);
  });

  it("requests the GA4 ID for analytics, the Ads ID for ads alone, and the GA4 ID once for both", () => {
    assert.equal(scriptIdFor(signalsFor(only("analytics"), false), IDS), "G-ABC123DEF4");
    assert.equal(scriptIdFor(signalsFor(only("ads"), false), IDS), "AW-123456789");
    assert.equal(scriptIdFor(signalsFor({ ...noConsent(), analytics: true, ads: true }, false), IDS), "G-ABC123DEF4");
  });

  it("configures GA4 only with analytics and its ID, and Ads only with ads and its ID", () => {
    const all = signalsFor({ ...noConsent(), analytics: true, ads: true }, false);
    assert.deepEqual(configsFor(all, IDS), { ga4: true, ads: true });
    assert.deepEqual(configsFor(signalsFor(only("analytics"), false), IDS), { ga4: true, ads: false });
    assert.deepEqual(configsFor(signalsFor(only("ads"), false), IDS), { ga4: false, ads: true });
    assert.deepEqual(configsFor(all, { ga4: null, ads: IDS.ads }), { ga4: false, ads: true });
    assert.deepEqual(configsFor(all, { ga4: IDS.ga4, ads: null }), { ga4: true, ads: false });
    assert.deepEqual(configsFor(all, { ga4: null, ads: null }), { ga4: false, ads: false });
    assert.equal(scriptIdFor(all, { ga4: null, ads: null }), null);
  });

  it("builds the script URL from one ID", () => {
    assert.equal(scriptUrl("G-ABC123DEF4"), "https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF4");
  });

  it("sees a withdrawal when a granted signal turns denied, and not when one is only added", () => {
    const analytics = signalsFor(only("analytics"), false);
    const ads = signalsFor(only("ads"), false);
    const both = signalsFor({ ...noConsent(), analytics: true, ads: true }, false);
    const none = signalsFor(noConsent(), false);
    assert.deepEqual(withdrew(both, none), { analytics: true, ads: true });
    assert.deepEqual(withdrew(both, analytics), { analytics: false, ads: true });
    assert.deepEqual(withdrew(analytics, both), { analytics: false, ads: false });
    assert.deepEqual(withdrew(ads, analytics), { analytics: false, ads: true });
    assert.deepEqual(withdrew(null, both), { analytics: false, ads: false });
  });
});

describe("the IDs", () => {
  it("accepts a well-formed GA4 and Ads ID", () => {
    assert.equal(parseGa4Id("G-ABC123"), "G-ABC123");
    assert.equal(parseGa4Id("G-ABCDEFGHIJ12"), "G-ABCDEFGHIJ12");
    assert.equal(parseAdsId("AW-123456"), "AW-123456");
    assert.equal(parseAdsId("AW-123456789012"), "AW-123456789012");
  });

  it("refuses a malformed one", () => {
    for (const bad of ["", "G-", "G-abc123", "G-ABC12", "G-ABCDEFGHIJ123", "g-ABC123DEF", "UA-123456", "G-ABC 123", "AW-123456789", " G-ABC123DEF"].filter((v) => v !== "AW-123456789")) {
      assert.equal(parseGa4Id(bad), null, bad);
    }
    for (const bad of ["", "AW-", "AW-12345", "AW-1234567890123", "AW-12345A", "aw-123456", "G-ABC123DEF", "AW 123456"]) {
      assert.equal(parseAdsId(bad), null, bad);
    }
  });
});

describe("the events", () => {
  it("always name the GA4 destination", () => {
    const [, name, params] = eventTo("G-ABC123DEF4", "page_view", { page_path: "/hr/" });
    assert.equal(name, "page_view");
    assert.equal(params.send_to, "G-ABC123DEF4");
  });

  it("send_to cannot be overridden by the parameters", () => {
    const [, , params] = eventTo("G-ABC123DEF4", "x", { send_to: "AW-123456789" });
    assert.equal(params.send_to, "G-ABC123DEF4");
  });

  it("a page_view carries the path, title, locale and the destination", () => {
    assert.deepEqual(pageView("G-ABC123DEF4", { path: "/hr/", title: "Skintastic", locale: "hr" }), [
      "event",
      "page_view",
      { page_path: "/hr/", page_title: "Skintastic", locale: "hr", send_to: "G-ABC123DEF4" },
    ]);
  });
});

describe("the cookies", () => {
  it("names the GA4 session cookie from the ID without G-", () => {
    assert.equal(ga4CookieName("G-ABC123DEF4"), "_ga_ABC123DEF4");
  });

  it("matches _ga and _ga_* as analytics and the Ads cookies and _gac_* as ads, and nothing else", () => {
    for (const name of ["_ga", "_ga_ABC123DEF4"]) {
      assert.equal(cookieMatches(name, GOOGLE_COOKIES.analytics), true, name);
      assert.equal(cookieMatches(name, GOOGLE_COOKIES.ads), false, name);
    }
    for (const name of ["_gcl_au", "_gcl_aw", "_gcl_gs", "_gcl_ag", "_gcl_gb", "_gac_UA123", "_gac_gb_123456"]) {
      assert.equal(cookieMatches(name, GOOGLE_COOKIES.ads), true, name);
      assert.equal(cookieMatches(name, GOOGLE_COOKIES.analytics), false, name);
    }
    for (const name of ["skt_consent", "skt_consent_id", "session", "_gat", "_gid", "ga"]) {
      assert.equal(cookieMatches(name, GOOGLE_COOKIES.analytics) || cookieMatches(name, GOOGLE_COOKIES.ads), false, name);
    }
  });

  it("tries the host and every parent suffix with at least two labels", () => {
    assert.deepEqual(domainsFor("www.example.hr"), ["www.example.hr", "example.hr"]);
    assert.deepEqual(domainsFor("a.b.example.hr"), ["a.b.example.hr", "b.example.hr", "example.hr"]);
    assert.deepEqual(domainsFor("example.hr"), ["example.hr"]);
    assert.deepEqual(domainsFor("localhost"), ["localhost"]);
    assert.deepEqual(domainsFor("127.0.0.1"), ["127.0.0.1"]);
    assert.ok(!domainsFor("www.example.hr").includes("hr"), "a bare top-level label is never tried");
  });

  it("expires only the withdrawn part's cookies, on the host alone and on each domain, and never the consent cookies", () => {
    const header = "skt_consent=v2.0.1.0.0.1.2026-11-01; _ga=GA1.2.3; _ga_ABC123DEF4=GS1; _gcl_au=1.1.2; _gac_x=1; skt_consent_id=abc";
    const analytics = deletionStrings([GOOGLE_COOKIES.analytics], header, "www.example.hr");
    assert.deepEqual(
      analytics.filter((s) => s.startsWith("_ga=")),
      ["_ga=; Path=/; Max-Age=0; SameSite=Lax", "_ga=; Path=/; Max-Age=0; SameSite=Lax; Domain=www.example.hr", "_ga=; Path=/; Max-Age=0; SameSite=Lax; Domain=example.hr"],
    );
    assert.ok(analytics.some((s) => s.startsWith("_ga_ABC123DEF4=")));
    assert.ok(!analytics.some((s) => s.startsWith("_gcl_au=") || s.startsWith("_gac_") || s.startsWith("skt_consent")));
    const ads = deletionStrings([GOOGLE_COOKIES.ads], header, "example.hr");
    assert.ok(ads.some((s) => s.startsWith("_gcl_au=")) && ads.some((s) => s.startsWith("_gac_x=")));
    assert.ok(!ads.some((s) => s.startsWith("_ga=") || s.startsWith("_ga_")));
    assert.deepEqual(deletionStrings([GOOGLE_COOKIES.analytics, GOOGLE_COOKIES.ads], "skt_consent=1", "example.hr"), []);
  });
});
