import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EventTracker } from '../src/events/tracker';
import { applyDefaults } from '../src/config/defaults';
import type { LLMShareConfig } from '../src/config/types';

describe('EventTracker', () => {
  beforeEach(() => {
    // Mock window object with required methods
    global.window = {
      location: { href: 'https://example.com' },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as Window & typeof globalThis;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up dataLayer
    if (global.window && (global.window as any).dataLayer) {
      delete (global.window as any).dataLayer;
    }
    if (global.window && (global.window as any).customDataLayer) {
      delete (global.window as any).customDataLayer;
    }
  });

  describe('DataLayer Integration', () => {
    it('should not push to dataLayer when disabled', () => {
      const config = applyDefaults({
        mode: 'standalone',
        tracking: {
          pushToDataLayer: false,
        },
      } as LLMShareConfig);

      const tracker = new EventTracker(config);
      const event = {
        event_id: 'test-id',
        ts: new Date().toISOString(),
        event_type: 'impression' as const,
        page_url: 'https://example.com',
        view_id: 'view-id',
        mode: 'standalone' as const,
      };

      tracker.emit(event);

      expect((global.window as any).dataLayer).toBeUndefined();
    });

    it('should push to dataLayer when enabled', () => {
      const config = applyDefaults({
        mode: 'standalone',
        tracking: {
          pushToDataLayer: true,
        },
      } as LLMShareConfig);

      const tracker = new EventTracker(config);
      const event = {
        event_id: 'test-id',
        ts: new Date().toISOString(),
        event_type: 'impression' as const,
        page_url: 'https://example.com',
        view_id: 'view-id',
        mode: 'standalone' as const,
      };

      tracker.emit(event);

      expect((global.window as any).dataLayer).toBeDefined();
      expect((global.window as any).dataLayer).toHaveLength(1);
      expect((global.window as any).dataLayer[0]).toEqual(event);
    });

    it('should use custom dataLayer name when configured', () => {
      const config = applyDefaults({
        mode: 'standalone',
        tracking: {
          pushToDataLayer: true,
          dataLayerName: 'customDataLayer',
        },
      } as LLMShareConfig);

      const tracker = new EventTracker(config);
      const event = {
        event_id: 'test-id',
        ts: new Date().toISOString(),
        event_type: 'click' as const,
        page_url: 'https://example.com',
        view_id: 'view-id',
        mode: 'standalone' as const,
        llm_id: 'chatgpt',
      };

      tracker.emit(event);

      expect((global.window as any).customDataLayer).toBeDefined();
      expect((global.window as any).customDataLayer).toHaveLength(1);
      expect((global.window as any).customDataLayer[0]).toEqual(event);
      expect((global.window as any).dataLayer).toBeUndefined();
    });

    it('should append to existing dataLayer', () => {
      (global.window as any).dataLayer = [{ existing: 'event' }];

      const config = applyDefaults({
        mode: 'standalone',
        tracking: {
          pushToDataLayer: true,
        },
      } as LLMShareConfig);

      const tracker = new EventTracker(config);
      const event = {
        event_id: 'test-id',
        ts: new Date().toISOString(),
        event_type: 'impression' as const,
        page_url: 'https://example.com',
        view_id: 'view-id',
        mode: 'standalone' as const,
      };

      tracker.emit(event);

      expect((global.window as any).dataLayer).toHaveLength(2);
      expect((global.window as any).dataLayer[0]).toEqual({ existing: 'event' });
      expect((global.window as any).dataLayer[1]).toEqual(event);
    });

    it('should handle errors gracefully when pushing to dataLayer', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const config = applyDefaults({
        mode: 'standalone',
        tracking: {
          pushToDataLayer: true,
        },
        debug: {
          logToConsole: true,
        },
      } as LLMShareConfig);

      // Make dataLayer read-only to cause an error
      Object.defineProperty(global.window, 'dataLayer', {
        value: [],
        writable: false,
        configurable: true,
      });

      const tracker = new EventTracker(config);
      const event = {
        event_id: 'test-id',
        ts: new Date().toISOString(),
        event_type: 'impression' as const,
        page_url: 'https://example.com',
        view_id: 'view-id',
        mode: 'standalone' as const,
      };

      // Should not throw
      expect(() => tracker.emit(event)).not.toThrow();

      consoleErrorSpy.mockRestore();
    });
  });
});

