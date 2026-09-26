import { describe, it, expect } from 'vitest';
import { findCookieDomain, VisitorId, VISITOR_KEY } from '../src/identity/visitor';
import { isUUID } from '../src/utils/uuid';

const PUBLIC_SUFFIXES = new Set(['com', 'co.uk', 'uk', 'vercel.app', 'app']);

/**
 * Minimal document.cookie emulation: honors Domain (rejecting public
 * suffixes and non-matching domains like a browser does), host-only
 * cookies, and Max-Age<=0 deletion. Records every write for assertions.
 */
function fakeDoc(hostname: string) {
  const jar = new Map<string, { value: string; domain: string | null }>();
  const writes: string[] = [];
  return {
    writes,
    jar,
    get cookie(): string {
      return [...jar.entries()]
        .map(([k, v]) => `${k.split('|')[0]}=${v.value}`)
        .join('; ');
    },
    set cookie(raw: string) {
      writes.push(raw);
      const [pair, ...attrs] = raw.split(';').map((s) => s.trim());
      const eq = pair.indexOf('=');
      const name = pair.slice(0, eq);
      const value = pair.slice(eq + 1);
      let domain: string | null = null;
      let maxAge: number | null = null;
      for (const a of attrs) {
        const [k, v] = a.split('=');
        if (k.toLowerCase() === 'domain') domain = v.replace(/^\./, '');
        if (k.toLowerCase() === 'max-age') maxAge = Number(v);
      }
      if (domain !== null) {
        if (PUBLIC_SUFFIXES.has(domain)) return;
        if (hostname !== domain && !hostname.endsWith('.' + domain)) return;
      }
      const key = `${name}|${domain ?? ''}`;
      if (maxAge !== null && maxAge <= 0) jar.delete(key);
      else jar.set(key, { value, domain });
    },
  };
}

function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

const blockedStorage = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('SecurityError');
  },
  removeItem: () => {
    throw new Error('SecurityError');
  },
};

const UUID_A = '11111111-1111-4111-8111-111111111111';
const UUID_B = '22222222-2222-4222-8222-222222222222';

describe('findCookieDomain', () => {
  it('returns the registrable domain for a subdomain', () => {
    expect(findCookieDomain('app.example.com', fakeDoc('app.example.com'))).toBe('example.com');
  });

  it('skips multi-label public suffixes', () => {
    expect(findCookieDomain('www.shop.co.uk', fakeDoc('www.shop.co.uk'))).toBe('shop.co.uk');
  });

  it('stays on the tenant subdomain of a shared host', () => {
    expect(findCookieDomain('tenant.vercel.app', fakeDoc('tenant.vercel.app'))).toBe(
      'tenant.vercel.app'
    );
  });

  it('uses a host-only cookie for localhost, bare hosts and IPs', () => {
    expect(findCookieDomain('localhost', fakeDoc('localhost'))).toBeNull();
    expect(findCookieDomain('127.0.0.1', fakeDoc('127.0.0.1'))).toBeNull();
    expect(findCookieDomain('[::1]', fakeDoc('[::1]'))).toBeNull();
  });

  it('leaves no probe cookie behind', () => {
    const doc = fakeDoc('app.example.com');
    findCookieDomain('app.example.com', doc);
    expect(doc.cookie).toBe('');
  });
});

describe('VisitorId', () => {
  const host = 'app.example.com';

  it('creates a UUID and writes it to the registrable-domain cookie and localStorage', () => {
    const doc = fakeDoc(host);
    const storage = fakeStorage();
    const v = new VisitorId({ hostname: host, secure: true, doc, storage, consent: true });
    const id = v.get();
    expect(isUUID(id)).toBe(true);
    expect(doc.jar.get(`${VISITOR_KEY}|example.com`)?.value).toBe(id);
    expect(storage.data.get(VISITOR_KEY)).toBe(id);
    const write = doc.writes.find((w) => w.startsWith(`${VISITOR_KEY}=${id}`))!;
    expect(write).toContain('Domain=example.com');
    expect(write).toContain('Path=/');
    expect(write).toContain('Max-Age=34560000');
    expect(write).toContain('SameSite=Lax');
    expect(write).toContain('Secure');
  });

  it('omits Secure on http', () => {
    const doc = fakeDoc(host);
    new VisitorId({ hostname: host, secure: false, doc, storage: fakeStorage(), consent: true });
    expect(doc.writes.filter((w) => w.startsWith(VISITOR_KEY)).every((w) => !w.includes('Secure'))).toBe(true);
  });

  it('reuses an existing cookie id across subdomains and refreshes it', () => {
    const doc = fakeDoc(host);
    doc.cookie = `${VISITOR_KEY}=${UUID_A}; Domain=example.com`;
    const storage = fakeStorage({ [VISITOR_KEY]: UUID_B });
    const v = new VisitorId({ hostname: host, secure: true, doc, storage, consent: true });
    expect(v.get()).toBe(UUID_A);
    expect(storage.data.get(VISITOR_KEY)).toBe(UUID_A);
    expect(doc.writes.at(-1)).toContain('Max-Age=34560000');
  });

  it('falls back to localStorage when the cookie is gone', () => {
    const doc = fakeDoc(host);
    const storage = fakeStorage({ [VISITOR_KEY]: UUID_B });
    const v = new VisitorId({ hostname: host, secure: true, doc, storage, consent: true });
    expect(v.get()).toBe(UUID_B);
    expect(doc.jar.get(`${VISITOR_KEY}|example.com`)?.value).toBe(UUID_B);
  });

  it('replaces a stored value that is not a UUID', () => {
    const doc = fakeDoc(host);
    doc.cookie = `${VISITOR_KEY}=garbage; Domain=example.com`;
    const v = new VisitorId({ hostname: host, secure: true, doc, storage: fakeStorage(), consent: true });
    expect(v.get()).not.toBe('garbage');
    expect(isUUID(v.get())).toBe(true);
  });

  it('keeps working when localStorage throws', () => {
    const doc = fakeDoc(host);
    const v = new VisitorId({ hostname: host, secure: true, doc, storage: blockedStorage, consent: true });
    expect(isUUID(v.get())).toBe(true);
    expect(doc.jar.get(`${VISITOR_KEY}|example.com`)?.value).toBe(v.get());
  });

  it('keeps working with no storage at all', () => {
    const v = new VisitorId({ hostname: host, secure: true, doc: null, storage: null, consent: true });
    expect(isUUID(v.get())).toBe(true);
  });

  describe('cookieless mode', () => {
    it('writes nothing when consent is false from the start, and ignores stored ids', () => {
      const doc = fakeDoc(host);
      doc.cookie = `${VISITOR_KEY}=${UUID_A}; Domain=example.com`;
      const storage = fakeStorage({ [VISITOR_KEY]: UUID_A });
      const v = new VisitorId({ hostname: host, secure: true, doc, storage, consent: false });
      expect(isUUID(v.get())).toBe(true);
      expect(v.get()).not.toBe(UUID_A);
      expect(doc.cookie).toBe('');
      expect(storage.data.has(VISITOR_KEY)).toBe(false);
      expect(doc.writes.some((w) => w.startsWith(`${VISITOR_KEY}=${v.get()}`))).toBe(false);
    });

    it('consent(false) at runtime deletes storage and switches to a fresh id', () => {
      const doc = fakeDoc(host);
      const storage = fakeStorage();
      const v = new VisitorId({ hostname: host, secure: true, doc, storage, consent: true });
      const persisted = v.get();
      v.setConsent(false);
      expect(v.get()).not.toBe(persisted);
      expect(doc.cookie).toBe('');
      expect(storage.data.has(VISITOR_KEY)).toBe(false);
    });

    it('consent(true) persists the in-memory id', () => {
      const doc = fakeDoc(host);
      const storage = fakeStorage();
      const v = new VisitorId({ hostname: host, secure: true, doc, storage, consent: false });
      const mem = v.get();
      v.setConsent(true);
      expect(v.get()).toBe(mem);
      expect(doc.jar.get(`${VISITOR_KEY}|example.com`)?.value).toBe(mem);
      expect(storage.data.get(VISITOR_KEY)).toBe(mem);
    });
  });
});
