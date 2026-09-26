import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { init } from '../src/widget';
import { isUUID } from '../src/utils/uuid';
import type { LLMShareEvent } from '../src/events/types';
import type { LLMShareConfig } from '../src/config/types';

/**
 * End-to-end tests for the visitor id, GetSourced.identify() and
 * cookieless mode, driven through init() in jsdom.
 */

const IDENTIFY_URL = 'https://collector.test/v1/identify';

function readCookie(name: string): string | null {
  const match = document.cookie.split('; ').find((c) => c.startsWith(name + '='));
  return match ? match.slice(name.length + 1) : null;
}

function hostedConfig(overrides: Partial<LLMShareConfig> = {}): LLMShareConfig {
  return {
    siteId: 'site_1',
    publicKey: 'pk_1',
    mode: 'hosted',
    widget: false,
    // Inline llms keeps init synchronous (no remote widget-config fetch).
    llms: ['chatgpt'],
    endpoints: { collector: 'https://collector.test/v1/events', identify: IDENTIFY_URL },
    tracking: { batch: false, respectDNT: true },
    ...overrides,
  };
}

function identifyCalls(fetchMock: ReturnType<typeof vi.fn>) {
  return fetchMock.mock.calls
    .filter(([url]) => url === IDENTIFY_URL)
    .map(([, opts]) => JSON.parse((opts as RequestInit).body as string));
}

describe('Visitor id, identify and consent', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let originalDNT: PropertyDescriptor | undefined;

  beforeEach(() => {
    document.body.innerHTML = '';
    document.cookie = 'gs_vid=; Max-Age=0; Path=/';
    localStorage.clear();
    delete (window as any).__LLMShareInstance;
    delete (window as any).__LLMShareLoading;
    delete (window as any).LLMShare;
    delete (window as any).GetSourced;
    originalDNT = Object.getOwnPropertyDescriptor(navigator, 'doNotTrack');
    fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, statusText: 'OK', json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    (window as any).__LLMShareInstance?.destroy();
    if (originalDNT) Object.defineProperty(navigator, 'doNotTrack', originalDNT);
    else delete (navigator as any).doNotTrack;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('persists gs_vid and sends it as visitor_id on every event in hosted mode', () => {
    const onEvent = vi.fn();
    init(hostedConfig({ callbacks: { onEvent } }));

    const id = window.GetSourced!.getVisitorId();
    expect(isUUID(id)).toBe(true);
    expect(readCookie('gs_vid')).toBe(id);
    expect(localStorage.getItem('gs_vid')).toBe(id);

    const events: LLMShareEvent[] = onEvent.mock.calls.map(([e]) => e);
    expect(events.length).toBeGreaterThan(0);
    expect(events.every((e) => e.visitor_id === id)).toBe(true);

    const sent = JSON.parse(fetchMock.mock.calls.find(([u]) => u === 'https://collector.test/v1/events')![1].body);
    expect(sent.events[0].visitor_id).toBe(id);
  });

  it('reuses the id on the next page load', () => {
    init(hostedConfig());
    const first = window.GetSourced!.getVisitorId();
    (window as any).__LLMShareInstance.destroy();
    init(hostedConfig());
    expect(window.GetSourced!.getVisitorId()).toBe(first);
  });

  it('sets no cookie and sends no visitor_id in standalone mode by default', () => {
    const onEvent = vi.fn();
    init({ mode: 'standalone', detect: true, widget: false, callbacks: { onEvent } });
    expect(readCookie('gs_vid')).toBeNull();
    expect(window.GetSourced!.getVisitorId()).toBeNull();
    expect(onEvent.mock.calls.every(([e]) => !('visitor_id' in e))).toBe(true);
  });

  it('lets self-hosted installs opt in with visitorId: true', () => {
    init({ mode: 'self_hosted', widget: false, visitorId: true, endpoints: { collector: 'https://x.test/e' } });
    expect(isUUID(readCookie('gs_vid'))).toBe(true);
  });

  describe('identify', () => {
    it('posts ref and a normalized email with the visitor id, dropping other fields', () => {
      init(hostedConfig());
      window.GetSourced!.identify({ ref: ' user-1 ', email: ' Ada@Example.COM ', name: 'Ada' } as any);
      const [body] = identifyCalls(fetchMock);
      expect(body).toMatchObject({
        site_id: 'site_1',
        public_key: 'pk_1',
        visitor_id: window.GetSourced!.getVisitorId(),
        ref: 'user-1',
        email: 'ada@example.com',
      });
      expect(body).not.toHaveProperty('name');
      expect(typeof body.ts).toBe('string');
      expect(typeof body.page_url).toBe('string');
    });

    it('sends the same identity once per page load', () => {
      init(hostedConfig());
      window.GetSourced!.identify({ ref: 'u1' });
      window.GetSourced!.identify({ ref: 'u1' });
      window.GetSourced!.identify({ ref: 'u1', email: 'a@b.co' });
      expect(identifyCalls(fetchMock)).toHaveLength(2);
    });

    it('ignores calls without a valid ref or email', () => {
      init(hostedConfig());
      window.GetSourced!.identify({} as any);
      window.GetSourced!.identify({ email: 'not-an-email' });
      window.GetSourced!.identify({ ref: 'x'.repeat(257) });
      window.GetSourced!.identify(null as any);
      expect(identifyCalls(fetchMock)).toHaveLength(0);
    });

    it('does nothing when no identify endpoint is configured', () => {
      init({ mode: 'self_hosted', widget: false, visitorId: true, endpoints: { collector: 'https://x.test/e' } });
      window.GetSourced!.identify({ ref: 'u1' });
      expect(fetchMock.mock.calls.filter(([u]) => String(u).includes('identify'))).toHaveLength(0);
    });

    it('never throws when the network fails', async () => {
      fetchMock.mockRejectedValue(new Error('offline'));
      init(hostedConfig());
      expect(() => window.GetSourced!.identify({ ref: 'u1' })).not.toThrow();
      await Promise.resolve();
    });

    it('replays identify calls queued before the bundle loaded', () => {
      (window as any).GetSourced = { _q: [['identify', [{ ref: 'early' }]]] };
      init(hostedConfig());
      expect(identifyCalls(fetchMock)[0]).toMatchObject({ ref: 'early' });
    });
  });

  describe('cookieless mode', () => {
    it('consent: false keeps the id in memory and writes nothing', () => {
      const onEvent = vi.fn();
      init(hostedConfig({ consent: false, callbacks: { onEvent } }));
      const id = window.GetSourced!.getVisitorId();
      expect(isUUID(id)).toBe(true);
      expect(readCookie('gs_vid')).toBeNull();
      expect(localStorage.getItem('gs_vid')).toBeNull();
      expect(onEvent.mock.calls.every(([e]) => e.visitor_id === id)).toBe(true);
    });

    it('a queued consent(false) applies before any cookie is written', () => {
      document.cookie = 'gs_vid=11111111-1111-4111-8111-111111111111; Path=/';
      const setter = vi.spyOn(document, 'cookie', 'set');
      (window as any).GetSourced = { _q: [['consent', [false]]] };
      init(hostedConfig());
      const writes = setter.mock.calls.map(([v]) => v as string).filter((v) => v.startsWith('gs_vid='));
      expect(writes.every((w) => w.includes('Max-Age=0'))).toBe(true);
      expect(readCookie('gs_vid')).toBeNull();
    });

    it('consent(false) at runtime deletes the cookie; consent(true) restores persistence', () => {
      init(hostedConfig());
      const persisted = window.GetSourced!.getVisitorId();
      window.GetSourced!.consent(false);
      expect(readCookie('gs_vid')).toBeNull();
      expect(localStorage.getItem('gs_vid')).toBeNull();
      const mem = window.GetSourced!.getVisitorId();
      expect(mem).not.toBe(persisted);
      window.GetSourced!.consent(true);
      expect(readCookie('gs_vid')).toBe(mem);
    });

    it('identify still works in cookieless mode with the page-scoped id', () => {
      init(hostedConfig({ consent: false }));
      window.GetSourced!.identify({ ref: 'u1' });
      expect(identifyCalls(fetchMock)[0].visitor_id).toBe(window.GetSourced!.getVisitorId());
    });

    it('Do Not Track behaves like cookieless mode and suppresses identify', () => {
      Object.defineProperty(navigator, 'doNotTrack', { value: '1', configurable: true });
      init(hostedConfig());
      expect(readCookie('gs_vid')).toBeNull();
      window.GetSourced!.consent(true);
      expect(readCookie('gs_vid')).toBeNull();
      window.GetSourced!.identify({ ref: 'u1' });
      expect(identifyCalls(fetchMock)).toHaveLength(0);
    });
  });
});
