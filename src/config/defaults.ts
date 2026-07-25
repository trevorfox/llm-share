import type {
  LLMShareConfig,
  NormalizedLLMShareConfig,
  WidgetMode,
  LLMConfig,
  LLMAction,
} from './types';
import {
  CHATGPT_ICON,
  CLAUDE_ICON,
  GEMINI_ICON,
  PERPLEXITY_ICON,
  COPY_ICON,
} from '../icons';

/**
 * LLM metadata mapping
 */
const LLM_METADATA: Record<string, { label: string; iconSvg: string; urlTemplate?: string }> = {
  chatgpt: { 
    label: 'ChatGPT', 
    iconSvg: CHATGPT_ICON,
    urlTemplate: 'https://chat.openai.com/?q={prompt}'
  },
  claude: { 
    label: 'Claude', 
    iconSvg: CLAUDE_ICON,
    urlTemplate: 'https://claude.ai/new?q={prompt}'
  },
  gemini: { 
    label: 'Gemini', 
    iconSvg: GEMINI_ICON,
    urlTemplate: 'https://aistudio.google.com/prompts/new_chat?prompt={prompt}'
  },
  perplexity: { 
    label: 'Perplexity', 
    iconSvg: PERPLEXITY_ICON,
    urlTemplate: 'https://www.perplexity.ai/search?q={prompt}'
  },
  copy: {
    label: 'Copy',
    iconSvg: COPY_ICON,
  },
};

/**
 * Default LLM names
 */
const DEFAULT_LLM_NAMES = ['chatgpt', 'claude', 'perplexity', 'copy'];

/**
 * Expand LLM names array into LLMConfig objects
 */
function expandLLMs(llmNames: string[], action: LLMAction): LLMConfig[] {
  return llmNames.map((name) => {
    const normalizedName = name.toLowerCase();
    const metadata = LLM_METADATA[normalizedName];
    
    // Special handling for 'copy' LLM - always use 'copy' action
    const llmAction = normalizedName === 'copy' ? 'copy' : action;
    
    if (!metadata) {
      // Fallback for unknown LLM names
      return {
        id: normalizedName,
        label: name.charAt(0).toUpperCase() + name.slice(1),
        action: llmAction,
      };
    }
    return {
      id: normalizedName,
      label: metadata.label,
      action: llmAction,
      iconSvg: metadata.iconSvg,
      // Include URL template when action is 'link'
      urlTemplate: llmAction === 'link' ? metadata.urlTemplate : undefined,
    };
  });
}

/**
 * Detect mode based on config
 */
function detectMode(config: LLMShareConfig): WidgetMode {
  if (config.mode) {
    return config.mode;
  }
  // If siteId/publicKey present, default to hosted
  if (config.siteId || config.publicKey) {
    return 'hosted';
  }
  // Otherwise standalone
  return 'standalone';
}

/**
 * Get default endpoints for hosted mode
 */
function getDefaultEndpoints(mode: WidgetMode): {
  collector: string | null;
  share: string | null;
  redirectBase: string | null;
} {
  if (mode === 'hosted') {
    // Default to your SaaS endpoints (can be overridden)
    return {
      collector: 'https://www.getsourced.ai/v1/events',
      share: 'https://www.getsourced.ai/v1/share',
      redirectBase: 'https://t.getsourced.ai/s/',
    };
  }
  return {
    collector: null,
    share: null,
    redirectBase: null,
  };
}

/**
 * Apply smart defaults to config
 */
export function applyDefaults(
  config: LLMShareConfig
): NormalizedLLMShareConfig {
  const mode = detectMode(config);
  const defaultEndpoints = getDefaultEndpoints(mode);

  // `widget: false` suppresses widget rendering; treat it as "no appearance
  // overrides" for the purposes of computing widget style defaults below,
  // and separately track whether the widget should render at all.
  const widgetEnabled = config.widget !== false;
  const widgetConfig = config.widget === false ? undefined : config.widget;

  // Get action (default to 'link')
  const action: LLMAction = config.action ?? 'link';
  
  // Expand LLM names to full configs
  const llmNames = config.llms && config.llms.length > 0 
    ? config.llms 
    : DEFAULT_LLM_NAMES;
  const llms = expandLLMs(llmNames, action);

  return {
    version: config.version || '1',
    siteId: config.siteId ?? null,
    publicKey: config.publicKey ?? null,
    mode,
    endpoints: {
      collector:
        config.endpoints?.collector ?? defaultEndpoints.collector ?? null,
      share: config.endpoints?.share ?? defaultEndpoints.share ?? null,
      redirectBase:
        config.endpoints?.redirectBase ??
        defaultEndpoints.redirectBase ??
        null,
    },
    widget: {
      placement: widgetConfig?.placement ?? 'bottom-left',
      style: widgetConfig?.style ?? 'minimal',
      theme: widgetConfig?.theme ?? 'auto',
      zIndex: widgetConfig?.zIndex ?? 9999,
      offsetPx: widgetConfig?.offsetPx ?? 16,
      backgroundOpacity: widgetConfig?.backgroundOpacity ?? 0.5,
      inlineSelector: widgetConfig?.inlineSelector ?? null,
      inlineAlignment: widgetConfig?.inlineAlignment ?? 'left',
      showOnMobile: widgetConfig?.showOnMobile ?? true,
      showOn: {
        pathPrefix: widgetConfig?.showOn?.pathPrefix ?? '/',
        scrollDistance: widgetConfig?.showOn?.scrollDistance ?? 200,
        showOnScroll: widgetConfig?.showOn?.showOnScroll ?? false,
      },
      textLabel: {
        enabled: widgetConfig?.textLabel?.enabled ?? false,
        text: widgetConfig?.textLabel?.text ?? 'Explore with AI',
        position: widgetConfig?.textLabel?.position ?? 'top',
        hideDelay: widgetConfig?.textLabel?.hideDelay ?? 3000,
      },
    },
    widgetEnabled,
    content: {
      prompt:
        config.content?.prompt ??
        'Summarize this page and answer my question:',
      includePageTitle: config.content?.includePageTitle ?? true,
      includeSelectedText: config.content?.includeSelectedText ?? true,
    },
    llms,
    tracking: {
      enabled: config.tracking?.enabled ?? mode !== 'standalone',
      batch: config.tracking?.batch ?? true,
      flushIntervalMs: config.tracking?.flushIntervalMs ?? 8000,
      respectDNT: config.tracking?.respectDNT ?? true,
      pushToDataLayer: config.tracking?.pushToDataLayer ?? false,
      dataLayerName: config.tracking?.dataLayerName ?? 'dataLayer',
    },
    callbacks: {
      onEvent: config.callbacks?.onEvent ?? null,
      onReady: config.callbacks?.onReady ?? null,
    },
    debug: {
      logToConsole: config.debug?.logToConsole ?? false,
    },
    detect: config.detect ?? true,
  };
}

