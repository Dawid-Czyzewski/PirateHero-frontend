export const CONSENT_KEY = "fl-cookie-consent";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 365;

export type Consent = {
  v: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  date: string;
};

const CONSENT_EVENT = "fl:consent";

export function readConsentRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function subscribeConsent(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_EVENT, onChange);
  };
}

export function readConsent(): Consent | null {
  return parseConsent(readConsentRaw());
}

export function parseConsent(raw: string | null): Consent | null {
  if (!raw) return null;
  try {
    const c = JSON.parse(raw) as Partial<Consent>;
    if (c.v !== CONSENT_VERSION) return null;
    if (typeof c.analytics !== "boolean" || typeof c.marketing !== "boolean") {
      return null;
    }
    if (!c.date || Date.now() - Date.parse(c.date) > CONSENT_MAX_AGE_DAYS * 864e5) {
      return null;
    }
    return {
      v: CONSENT_VERSION,
      necessary: true,
      analytics: c.analytics,
      marketing: c.marketing,
      date: c.date,
    };
  } catch {
    return null;
  }
}

export function writeConsent(partial: {
  analytics: boolean;
  marketing: boolean;
}): Consent {
  const val: Consent = {
    v: CONSENT_VERSION,
    necessary: true,
    analytics: !!partial.analytics,
    marketing: !!partial.marketing,
    date: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(val));
  } catch {
    /* ignore quota */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: val }));
  return val;
}

export function formatConsentStatus(c: Consent | null): string {
  if (!c) return "";
  return `Zapisano: analityczne ${c.analytics ? "TAK" : "NIE"}, marketingowe ${c.marketing ? "TAK" : "NIE"}.`;
}
