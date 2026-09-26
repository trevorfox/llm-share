/**
 * TypeScript definitions for LLM Share Widget
 */

import type { LLMShareEvent } from './events/types';
import type { Widget } from './ui/Widget';
import type { EventTracker } from './events/tracker';

export type WidgetMode = 'hosted' | 'self_hosted' | 'standalone';
export type WidgetPlacement = 'center-right' | 'center-left' | 'bottom-right' | 'bottom-left' | 'inline';
export type WidgetStyle = 'pill' | 'square' | 'minimal' | 'custom';
export type WidgetTheme = 'auto' | 'light' | 'dark';
export type LLMAction = 'copy' | 'link';

export interface LLMConfig {
  id: string;
  label: string;
  action: LLMAction;
  iconSvg?: string;
  iconUrl?: string;
  urlTemplate?: string;
}

export interface EndpointsConfig {
  collector?: string | null;
  share?: string | null;
  redirectBase?: string | null;
  widgetConfig?: string | null;
  identify?: string | null;
}

export interface WidgetConfig {
  placement?: WidgetPlacement;
  style?: WidgetStyle;
  theme?: WidgetTheme;
  zIndex?: number;
  offsetPx?: number;
  backgroundOpacity?: number;
  inlineSelector?: string | null;
  showOn?: {
    pathPrefix?: string;
  };
}

export interface ContentConfig {
  prompt?: string;
  includePageTitle?: boolean;
  includeSelectedText?: boolean;
}

export interface TrackingConfig {
  enabled?: boolean;
  batch?: boolean;
  flushIntervalMs?: number;
  respectDNT?: boolean;
}

export interface CallbacksConfig {
  onEvent?: ((event: LLMShareEvent) => void) | null;
  onReady?: (() => void) | null;
}

export interface DebugConfig {
  logToConsole?: boolean;
}

export interface LLMShareConfig {
  version?: string;
  siteId?: string | null;
  publicKey?: string | null;
  mode?: WidgetMode;
  endpoints?: EndpointsConfig;
  // `false` suppresses ALL widget UI rendering while the tracker still
  // initializes (see `detect`). Any other value is the usual appearance config.
  widget?: WidgetConfig | false;
  content?: ContentConfig;
  action?: LLMAction;
  llms?: string[];
  tracking?: TrackingConfig;
  callbacks?: CallbacksConfig;
  debug?: DebugConfig;
  widgetUrl?: string; // For loader to override widget bundle URL
  // Fires a single `pageview` event (referrer + page URL, no client-side
  // classification) through the existing event pipeline on init. Defaults
  // to true so legacy configs pick it up automatically.
  detect?: boolean;
  // Persist `gs_vid` and send it as `visitor_id` (default: hosted mode only).
  visitorId?: boolean;
  // `false` = cookieless mode (default: true).
  consent?: boolean;
}

export interface IdentifyInput {
  ref?: string;
  email?: string;
}

export interface GetSourcedAPI {
  identify: (input: IdentifyInput) => void;
  consent: (granted: boolean) => void;
  getVisitorId: () => string | null;
  // Calls queued by the loader stub before the bundle loaded.
  _q?: Array<[string, unknown[]]>;
}

declare global {
  interface Window {
    LLMShare?: LLMShareConfig;
    LLMShareWidget?: {
      init: (config?: LLMShareConfig) => void;
      initAsync?: (config?: LLMShareConfig) => Promise<void>;
    };
    __LLMShareInstance?: {
      // null when `widget: false` suppressed widget rendering.
      widget: Widget | null;
      tracker: EventTracker;
      destroy: () => void;
    };
    __LLMShareQueue?: Array<() => void>;
    __LLMShareInitialized?: boolean;
    __LLMShareLoading?: boolean;
    GetSourced?: GetSourcedAPI;
  }
}

export function init(config?: LLMShareConfig): void;

