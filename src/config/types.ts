/**
 * Configuration types for LLM Share Widget
 */

import type { LLMShareEvent } from '../events/types';

export type WidgetMode = 'hosted' | 'self_hosted' | 'standalone';

export type WidgetPlacement =
  | 'center-right'
  | 'center-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'inline';

export type WidgetStyle = 'pill' | 'square' | 'minimal' | 'custom';

export type WidgetTheme = 'auto' | 'light' | 'dark';

export type LLMAction = 'copy' | 'link';

export interface LLMConfig {
  id: string;
  label: string;
  action: LLMAction;
  iconSvg?: string;
  iconUrl?: string;
  urlTemplate?: string; // For future link actions
}

export interface EndpointsConfig {
  collector?: string | null;
  share?: string | null;
  redirectBase?: string | null;
  widgetConfig?: string | null; // Optional: custom API endpoint for fetching widget config
}

export type InlineAlignment = 'left' | 'center' | 'right';

export interface WidgetConfig {
  placement?: WidgetPlacement;
  style?: WidgetStyle;
  theme?: WidgetTheme;
  zIndex?: number;
  offsetPx?: number;
  backgroundOpacity?: number;
  inlineSelector?: string | null;
  inlineAlignment?: InlineAlignment;
  showOnMobile?: boolean;
  showOn?: {
    pathPrefix?: string;
    scrollDistance?: number;
    showOnScroll?: boolean;
  };
  textLabel?: {
    enabled?: boolean;
    text?: string;
    position?: 'left' | 'right' | 'top';
    hideDelay?: number;
  };
  customCSS?: string;
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
  pushToDataLayer?: boolean;
  dataLayerName?: string;
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
  widget?: WidgetConfig;
  content?: ContentConfig;
  action?: LLMAction;
  llms?: string[];
  tracking?: TrackingConfig;
  callbacks?: CallbacksConfig;
  debug?: DebugConfig;
}

export interface NormalizedLLMShareConfig {
  version: string;
  siteId: string | null;
  publicKey: string | null;
  mode: WidgetMode;
  endpoints: Required<EndpointsConfig>;
  widget: Required<WidgetConfig>;
  content: Required<ContentConfig>;
  llms: LLMConfig[];
  tracking: Required<TrackingConfig>;
  callbacks: Required<CallbacksConfig>;
  debug: Required<DebugConfig>;
}

