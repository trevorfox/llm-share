/**
 * Event type definitions for LLM Share Widget
 */

export type EventType =
  | 'impression'
  | 'click'
  | 'share_created'
  | 'fallback_raw_url'
  | 'error';

export interface BaseEvent {
  event_id: string; // UUID v4
  ts: string; // ISO 8601 timestamp
  event_type: EventType;
  site_id?: string | null;
  page_url: string;
  view_id: string; // UUID v4 generated client-side per page load
  llm_id?: string; // e.g. "chatgpt", "claude"
  mode: 'hosted' | 'self_hosted' | 'standalone';
  metadata?: Record<string, unknown>;
  // Attribution data (browser-available data)
  language?: string; // navigator.language (e.g., "en-US")
  timezone?: string; // Intl.DateTimeFormat().resolvedOptions().timeZone (e.g., "America/Los_Angeles")
  screen_width?: number; // window.screen.width
  screen_height?: number; // window.screen.height
  viewport_width?: number; // window.innerWidth
  viewport_height?: number; // window.innerHeight
}

export interface ImpressionEvent extends BaseEvent {
  event_type: 'impression';
}

export interface ClickEvent extends BaseEvent {
  event_type: 'click';
  llm_id: string;
}

export interface ShareCreatedEvent extends BaseEvent {
  event_type: 'share_created';
  llm_id: string;
  share_url?: string;
  share_token?: string;
}

export interface FallbackRawUrlEvent extends BaseEvent {
  event_type: 'fallback_raw_url';
  llm_id: string;
  raw_url: string;
}

export interface ErrorEvent extends BaseEvent {
  event_type: 'error';
  error_message: string;
  error_type?: string;
}

export type LLMShareEvent =
  | ImpressionEvent
  | ClickEvent
  | ShareCreatedEvent
  | FallbackRawUrlEvent
  | ErrorEvent;

