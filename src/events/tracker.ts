import type {
  LLMShareEvent,
  EventType,
  ImpressionEvent,
  ClickEvent,
  ShareCreatedEvent,
  FallbackRawUrlEvent,
  ErrorEvent,
} from './types';
import type { NormalizedLLMShareConfig } from '../config/types';
import { generateUUID } from '../utils/uuid';

/**
 * Event tracker - handles event creation, batching, and sending
 */
export class EventTracker {
  private config: NormalizedLLMShareConfig;
  private viewId: string;
  private eventQueue: LLMShareEvent[] = [];
  private flushTimer: number | null = null;
  private unloadHandler: (() => void) | null = null;

  constructor(config: NormalizedLLMShareConfig) {
    this.config = config;
    this.viewId = generateUUID();
    this.setupUnloadHandler();
  }

  /**
   * Collect browser attribution data
   */
  private getAttributionData(): {
    referrer?: string;
    language?: string;
    timezone?: string;
    screen_width?: number;
    screen_height?: number;
    viewport_width?: number;
    viewport_height?: number;
  } {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {};
    }

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return {
        referrer: document.referrer || undefined,
        language: navigator.language || undefined,
        timezone: timezone || undefined,
        screen_width: window.screen?.width || undefined,
        screen_height: window.screen?.height || undefined,
        viewport_width: window.innerWidth || undefined,
        viewport_height: window.innerHeight || undefined,
      };
    } catch (error) {
      // Silently fail if attribution data can't be collected
      return {};
    }
  }

  /**
   * Get current view ID
   */
  getViewId(): string {
    return this.viewId;
  }

  /**
   * Create base event object
   */
  private createBaseEvent(eventType: EventType): Partial<LLMShareEvent> {
    return {
      event_id: generateUUID(),
      ts: new Date().toISOString(),
      event_type: eventType,
      site_id: this.config.siteId || null,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      view_id: this.viewId,
      mode: this.config.mode,
      ...this.getAttributionData(),
    };
  }

  /**
   * Push event to dataLayer if enabled
   */
  private pushToDataLayer(event: LLMShareEvent): void {
    if (!this.config.tracking.pushToDataLayer || typeof window === 'undefined') {
      return;
    }

    try {
      const dataLayerName = this.config.tracking.dataLayerName;
      const windowWithDataLayer = window as typeof window & {
        [key: string]: unknown[];
      };

      // Initialize dataLayer if it doesn't exist
      if (!windowWithDataLayer[dataLayerName]) {
        windowWithDataLayer[dataLayerName] = [];
      }

      // Push event to dataLayer
      windowWithDataLayer[dataLayerName].push(event);
    } catch (error) {
      if (this.config.debug.logToConsole) {
        console.error('[LLMShare] Error pushing to dataLayer:', error);
      }
    }
  }

  /**
   * Emit an event
   */
  emit(event: LLMShareEvent): void {
    // Send to callback if provided
    if (this.config.callbacks.onEvent) {
      try {
        this.config.callbacks.onEvent(event);
      } catch (error) {
        if (this.config.debug.logToConsole) {
          console.error('[LLMShare] Error in onEvent callback:', error);
        }
      }
    }

    // Push to dataLayer if enabled
    this.pushToDataLayer(event);

    // Log to console if debug mode enabled
    if (this.config.debug.logToConsole) {
      console.log('[LLMShare] Event:', event);
    }

    // Queue for batch send if tracking enabled
    if (this.config.tracking.enabled && this.config.endpoints.collector) {
      this.eventQueue.push(event);
      this.scheduleFlush();
    }
  }

  /**
   * Track impression (widget rendered)
   */
  trackImpression(): void {
    const event: ImpressionEvent = {
      ...this.createBaseEvent('impression'),
    } as ImpressionEvent;
    this.emit(event);
  }

  /**
   * Track click (LLM button clicked)
   */
  trackClick(llmId: string): void {
    const event: ClickEvent = {
      ...this.createBaseEvent('click'),
      llm_id: llmId,
    } as ClickEvent;
    this.emit(event);
  }

  /**
   * Track share created (share endpoint returned token/url)
   */
  trackShareCreated(
    llmId: string,
    shareUrl?: string,
    shareToken?: string
  ): void {
    const event: ShareCreatedEvent = {
      ...this.createBaseEvent('share_created'),
      llm_id: llmId,
      share_url: shareUrl,
      share_token: shareToken,
    } as ShareCreatedEvent;
    this.emit(event);
  }

  /**
   * Track fallback to raw URL (share failed)
   */
  trackFallbackRawUrl(llmId: string, rawUrl: string): void {
    const event: FallbackRawUrlEvent = {
      ...this.createBaseEvent('fallback_raw_url'),
      llm_id: llmId,
      raw_url: rawUrl,
    } as FallbackRawUrlEvent;
    this.emit(event);
  }

  /**
   * Track error (non-fatal issues)
   */
  trackError(errorMessage: string, errorType?: string): void {
    const event: ErrorEvent = {
      ...this.createBaseEvent('error'),
      error_message: errorMessage,
      error_type: errorType,
    } as ErrorEvent;
    this.emit(event);
  }

  /**
   * Schedule flush of event queue
   */
  private scheduleFlush(): void {
    if (this.flushTimer !== null) {
      return; // Already scheduled
    }

    if (this.config.tracking.batch) {
      // Use requestIdleCallback if available, otherwise setTimeout
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
          this.flushTimer = null;
          this.flush();
        });
      } else {
        this.flushTimer = window.setTimeout(() => {
          this.flushTimer = null;
          this.flush();
        }, this.config.tracking.flushIntervalMs);
      }
    } else {
      // Flush immediately if batching disabled
      this.flush();
    }
  }

  /**
   * Flush event queue to collector endpoint
   */
  private async flush(): Promise<void> {
    if (this.eventQueue.length === 0) {
      return;
    }

    // Check DNT if enabled
    if (
      this.config.tracking.respectDNT &&
      typeof navigator !== 'undefined' &&
      navigator.doNotTrack === '1'
    ) {
      this.eventQueue = [];
      return;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    if (!this.config.endpoints.collector) {
      return;
    }

    try {
      const response = await fetch(this.config.endpoints.collector, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          site_id: this.config.siteId,
          public_key: this.config.publicKey,
        }),
        keepalive: true, // Ensure request completes even if page unloads
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      // Silently fail - don't spam console unless debug mode
      if (this.config.debug.logToConsole) {
        console.error('[LLMShare] Failed to send events:', error);
      }
      // Re-queue events for retry (limit to prevent memory issues)
      if (this.eventQueue.length < 100) {
        this.eventQueue.unshift(...events);
      }
    }
  }

  /**
   * Setup unload handler to flush events on page unload
   */
  private setupUnloadHandler(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.unloadHandler = () => {
      // Flush immediately on unload
      if (this.eventQueue.length > 0) {
        // Use sendBeacon if available for reliable delivery
        if (
          typeof navigator !== 'undefined' &&
          navigator.sendBeacon &&
          this.config.endpoints.collector
        ) {
          const payload = JSON.stringify({
            events: this.eventQueue,
            site_id: this.config.siteId,
            public_key: this.config.publicKey,
          });
          navigator.sendBeacon(
            this.config.endpoints.collector,
            new Blob([payload], { type: 'application/json' })
          );
        } else {
          // Fallback to sync fetch (blocks unload but ensures delivery)
          const xhr = new XMLHttpRequest();
          xhr.open(
            'POST',
            this.config.endpoints.collector || '',
            false
          );
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(
            JSON.stringify({
              events: this.eventQueue,
              site_id: this.config.siteId,
              public_key: this.config.publicKey,
            })
          );
        }
      }
    };

    window.addEventListener('beforeunload', this.unloadHandler);
    window.addEventListener('pagehide', this.unloadHandler);
  }

  /**
   * Cleanup
   */
  destroy(): void {
    // Flush remaining events
    this.flush();

    // Remove unload handler
    if (this.unloadHandler && typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.unloadHandler);
      window.removeEventListener('pagehide', this.unloadHandler);
    }

    // Clear flush timer
    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }
}

