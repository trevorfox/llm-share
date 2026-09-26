/**
 * Persistent visitor id (`gs_vid`).
 *
 * A first-party cookie on the registrable domain, so www. and app. share
 * one id, mirrored to localStorage as a fallback. With consent off the id
 * lives in memory only and nothing is written to the device.
 */

import { generateUUID, isUUID } from '../utils/uuid';

export const VISITOR_KEY = 'gs_vid';

// 400 days: the longest expiry Chrome accepts.
const MAX_AGE_SECONDS = 400 * 24 * 60 * 60;
const PROBE_KEY = 'gs_vid_probe';

/** The parts of `document` this module touches. */
export interface CookieDoc {
  cookie: string;
}

/** The parts of `Storage` this module touches. */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function readCookie(doc: CookieDoc, name: string): string | null {
  try {
    for (const part of doc.cookie.split(';')) {
      const eq = part.indexOf('=');
      if (eq > -1 && part.slice(0, eq).trim() === name) {
        return decodeURIComponent(part.slice(eq + 1).trim());
      }
    }
  } catch {
    // Cookie access can throw in sandboxed iframes.
  }
  return null;
}

function writeCookie(
  doc: CookieDoc,
  name: string,
  value: string,
  domain: string | null,
  maxAge: number,
  secure: boolean
): void {
  try {
    doc.cookie =
      `${name}=${encodeURIComponent(value)}` +
      (domain ? `; Domain=${domain}` : '') +
      `; Path=/; Max-Age=${maxAge}; SameSite=Lax` +
      (secure ? '; Secure' : '');
  } catch {
    // Ignore: cookies blocked.
  }
}

function isIPOrBareHost(hostname: string): boolean {
  return (
    !hostname.includes('.') ||
    hostname.startsWith('[') ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)
  );
}

/**
 * Find the registrable domain without a public-suffix list: try a probe
 * cookie on the shortest candidate first and keep the first one the
 * browser accepts (browsers refuse cookies on public suffixes). Returns
 * null for a host-only cookie.
 */
export function findCookieDomain(hostname: string, doc: CookieDoc): string | null {
  if (isIPOrBareHost(hostname)) {
    return null;
  }
  const labels = hostname.split('.');
  for (let i = 2; i <= labels.length; i++) {
    const candidate = labels.slice(-i).join('.');
    writeCookie(doc, PROBE_KEY, '1', candidate, 60, false);
    if (readCookie(doc, PROBE_KEY) === '1') {
      writeCookie(doc, PROBE_KEY, '', candidate, 0, false);
      return candidate;
    }
  }
  return null;
}

export interface VisitorIdOptions {
  hostname: string;
  secure: boolean;
  doc: CookieDoc | null;
  storage: KeyValueStore | null;
  consent: boolean;
}

export class VisitorId {
  private id: string;
  private consent: boolean;
  private readonly doc: CookieDoc | null;
  private readonly storage: KeyValueStore | null;
  private readonly secure: boolean;
  private readonly hostname: string;
  private cookieDomain: string | null | undefined;

  constructor(options: VisitorIdOptions) {
    this.doc = options.doc;
    this.storage = options.storage;
    this.secure = options.secure;
    this.hostname = options.hostname;
    this.consent = options.consent;

    if (this.consent) {
      this.id = this.readStored() ?? generateUUID();
      this.persist();
    } else {
      this.id = generateUUID();
      this.clearStored();
    }
  }

  /** The current visitor id. */
  get(): string {
    return this.id;
  }

  /**
   * Switch between persistent and cookieless mode. Revoking consent
   * deletes the stored id and moves to a fresh in-memory one, so the page
   * is no longer linkable to the stored id. Granting it persists the
   * current id.
   */
  setConsent(consent: boolean): void {
    if (consent === this.consent) {
      return;
    }
    this.consent = consent;
    if (consent) {
      this.persist();
    } else {
      this.clearStored();
      this.id = generateUUID();
    }
  }

  private domain(): string | null {
    if (this.cookieDomain === undefined) {
      this.cookieDomain = this.doc ? findCookieDomain(this.hostname, this.doc) : null;
    }
    return this.cookieDomain;
  }

  private readStored(): string | null {
    // The cookie wins a disagreement: it is shared across subdomains,
    // localStorage is per origin.
    const fromCookie = this.doc ? readCookie(this.doc, VISITOR_KEY) : null;
    if (isUUID(fromCookie)) {
      return fromCookie;
    }
    try {
      const fromStorage = this.storage?.getItem(VISITOR_KEY) ?? null;
      if (isUUID(fromStorage)) {
        return fromStorage;
      }
    } catch {
      // Ignore: storage blocked.
    }
    return null;
  }

  private persist(): void {
    if (this.doc) {
      writeCookie(this.doc, VISITOR_KEY, this.id, this.domain(), MAX_AGE_SECONDS, this.secure);
    }
    try {
      this.storage?.setItem(VISITOR_KEY, this.id);
    } catch {
      // Ignore: storage blocked.
    }
  }

  private clearStored(): void {
    if (this.doc) {
      const domain = this.domain();
      writeCookie(this.doc, VISITOR_KEY, '', domain, 0, this.secure);
      if (domain) {
        // A host-only copy could exist from a page where probing failed.
        writeCookie(this.doc, VISITOR_KEY, '', null, 0, this.secure);
      }
    }
    try {
      this.storage?.removeItem(VISITOR_KEY);
    } catch {
      // Ignore: storage blocked.
    }
  }
}
