import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { init, initAsync } from '../src/widget';
import { mergeConfigs } from '../src/config/api-config';
import { validateConfig } from '../src/config/schema';
import type { LLMShareEvent } from '../src/events/types';
import type { LLMShareConfig } from '../src/config/types';

/**
 * Tests for the `detect` module: the widget-independent pageview event
 * fired through the existing EventTracker pipeline on init.
 */
describe('Detect module', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete (window as any).__LLMShareInstance;
    delete (window as any).__LLMShareLoading;
    delete (window as any).LLMShare;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({}),
      })
    );
  });

  afterEach(() => {
    const instance = (window as any).__LLMShareInstance;
    if (instance) {
      instance.destroy();
    }
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function pageviewEvents(onEvent: ReturnType<typeof vi.fn>): LLMShareEvent[] {
    return onEvent.mock.calls
      .map(([evt]: [LLMShareEvent]) => evt)
      .filter((evt: LLMShareEvent) => evt.event_type === 'pageview');
  }

  it('fires exactly one pageview event on init when detect defaults on (legacy config)', () => {
    const onEvent = vi.fn();

    init({
      mode: 'standalone',
      tracking: { enabled: true },
      callbacks: { onEvent },
    });

    const events = pageviewEvents(onEvent);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      event_type: 'pageview',
      referrer: document.referrer || null,
      page_url: window.location.href,
      mode: 'standalone',
    });
    expect(events[0].view_id).toBe(window.__LLMShareInstance?.tracker.getViewId());

    // Legacy config (no `detect`/`widget` keys) still renders the widget.
    expect(document.querySelector('.llm-share-widget')).not.toBeNull();
  });

  it('carries attribution fields (language, timezone, screen/viewport) on the pageview event', () => {
    const onEvent = vi.fn();

    init({
      mode: 'standalone',
      tracking: { enabled: true },
      callbacks: { onEvent },
    });

    const [event] = pageviewEvents(onEvent);
    // Same attribution helper every other event uses (language, timezone,
    // screen/viewport) — jsdom reports screen dimensions as 0 (which the
    // existing helper treats as "unknown" -> undefined), so only assert on
    // the fields jsdom actually populates here.
    expect(event.language).toBeDefined();
    expect(event.timezone).toBeDefined();
    expect(event.viewport_width).toBeDefined();
    expect(event.viewport_height).toBeDefined();
    expect('screen_width' in event).toBe(true);
    expect('screen_height' in event).toBe(true);
  });

  it('does not fire a pageview event when detect is false', () => {
    const onEvent = vi.fn();

    init({
      mode: 'standalone',
      detect: false,
      tracking: { enabled: true },
      callbacks: { onEvent },
    });

    expect(pageviewEvents(onEvent)).toHaveLength(0);
    // Widget still renders — detect:false only affects the pageview event.
    expect(document.querySelector('.llm-share-widget')).not.toBeNull();
  });

  it('suppresses widget rendering when widget:false while the tracker still initializes and fires the pageview', () => {
    const onEvent = vi.fn();

    init({
      mode: 'standalone',
      widget: false,
      tracking: { enabled: true },
      callbacks: { onEvent },
    });

    expect(document.querySelector('.llm-share-widget')).toBeNull();
    expect(pageviewEvents(onEvent)).toHaveLength(1);
    expect(window.__LLMShareInstance?.tracker).toBeDefined();
  });

  it('renders the widget AND fires the pageview for a legacy config that sets neither key', () => {
    const onEvent = vi.fn();

    init({
      mode: 'standalone',
      tracking: { enabled: true },
      callbacks: { onEvent },
    });

    expect(document.querySelector('.llm-share-widget')).not.toBeNull();
    expect(pageviewEvents(onEvent)).toHaveLength(1);
  });

  it('does not send the pageview over the network when DNT is enabled and respectDNT is true', async () => {
    const originalDNT = Object.getOwnPropertyDescriptor(navigator, 'doNotTrack');
    Object.defineProperty(navigator, 'doNotTrack', {
      value: '1',
      configurable: true,
    });

    try {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);

      init({
        mode: 'standalone',
        widget: false,
        endpoints: { collector: 'https://collector.example.com/events' },
        tracking: { enabled: true, batch: false, respectDNT: true },
      });

      // flush() is async; let its microtasks settle.
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(fetchMock).not.toHaveBeenCalled();
    } finally {
      if (originalDNT) {
        Object.defineProperty(navigator, 'doNotTrack', originalDNT);
      } else {
        delete (navigator as any).doNotTrack;
      }
    }
  });

  it('does not send the pageview over the network when tracking is disabled (consent not granted)', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    init({
      mode: 'standalone',
      widget: false,
      endpoints: { collector: 'https://collector.example.com/events' },
      tracking: { enabled: false, batch: false },
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends the pageview over the network through the existing collector pipeline when tracking is allowed', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({}),
    });
    vi.stubGlobal('fetch', fetchMock);

    init({
      mode: 'standalone',
      widget: false,
      endpoints: { collector: 'https://collector.example.com/events' },
      tracking: { enabled: true, batch: false, respectDNT: false },
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, requestInit] = fetchMock.mock.calls[0];
    expect(url).toBe('https://collector.example.com/events');
    const body = JSON.parse(requestInit.body as string);
    expect(body.events).toHaveLength(1);
    expect(body.events[0].event_type).toBe('pageview');
  });
});

/**
 * Regression coverage for the `mergeConfigs` seam noted in the Task 3
 * report: `widget: false` must survive the hosted-mode "minimal config"
 * path — siteId/publicKey only, `mode` unset or 'hosted' — where
 * `isMinimalConfig()` triggers a remote widget-config fetch and the result
 * is deep-merged with the inline config in `mergeConfigs`. Both merge
 * branches (`overrideClientConfig` false/absent = client wins, and
 * `overrideClientConfig: true` = server wins) must not silently coerce an
 * explicit `false` back into an enabled widget object.
 */
describe('detect + widget:false across the hosted remote-config merge path', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete (window as any).__LLMShareInstance;
    delete (window as any).__LLMShareLoading;
    delete (window as any).LLMShare;
  });

  afterEach(() => {
    const instance = (window as any).__LLMShareInstance;
    if (instance) {
      instance.destroy();
    }
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('init-level (mode unset + siteId/publicKey => isMinimalConfig => remote fetch)', () => {
    it('client-wins merge branch: widget stays suppressed even when the remote config returns a real widget object', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            widget: { placement: 'bottom-right', style: 'pill', theme: 'dark' },
          }),
        })
      );

      await initAsync({
        siteId: 'pub_123',
        publicKey: 'pk_abc',
        widget: false,
      });

      expect(document.querySelector('.llm-share-widget')).toBeNull();
      expect(window.__LLMShareInstance).toBeDefined();
      expect(window.__LLMShareInstance?.widget).toBeNull();
    });

    it('server-wins merge branch (overrideClientConfig: true): widget stays suppressed when the remote config does not opine on widget', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            overrideClientConfig: true,
            content: { prompt: 'Server-provided prompt' },
          }),
        })
      );

      await initAsync({
        mode: 'hosted',
        siteId: 'pub_123',
        publicKey: 'pk_abc',
        widget: false,
      });

      expect(document.querySelector('.llm-share-widget')).toBeNull();
      expect(window.__LLMShareInstance).toBeDefined();
      expect(window.__LLMShareInstance?.widget).toBeNull();
    });
  });

  describe('mergeConfigs-level (direct, no network)', () => {
    it('client-wins branch: merged config keeps widget:false when apiConfig sets a widget object', () => {
      const inlineConfig: LLMShareConfig = {
        siteId: 'pub_123',
        publicKey: 'pk_abc',
        widget: false,
      };
      const apiConfig: LLMShareConfig = {
        widget: { placement: 'bottom-right', style: 'pill' },
      };

      const merged = mergeConfigs(apiConfig, inlineConfig);
      expect(merged.widget).toBe(false);

      const normalized = validateConfig(merged);
      expect(normalized.widgetEnabled).toBe(false);
    });

    it("server-wins branch (overrideClientConfig: true): merged config falls back to the client's widget:false when apiConfig omits widget", () => {
      const inlineConfig: LLMShareConfig = {
        siteId: 'pub_123',
        publicKey: 'pk_abc',
        widget: false,
      };
      const apiConfig: LLMShareConfig & { overrideClientConfig: boolean } = {
        overrideClientConfig: true,
        content: { prompt: 'Server-provided prompt' },
      };

      const merged = mergeConfigs(apiConfig, inlineConfig);
      expect(merged.widget).toBe(false);

      const normalized = validateConfig(merged);
      expect(normalized.widgetEnabled).toBe(false);
    });
  });
});
