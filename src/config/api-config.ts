/**
 * Fetch widget configuration from API
 * Only used in hosted mode when minimal config (just siteId/publicKey) is provided
 */

import type { LLMShareConfig } from './types';

/**
 * Check if config is "minimal" (only credentials, no widget/content/llms config)
 */
export function isMinimalConfig(config: LLMShareConfig): boolean {
  // If mode is explicitly self_hosted or standalone, never fetch from API
  if (config.mode === 'self_hosted' || config.mode === 'standalone') {
    return false;
  }

  // Consider minimal if only siteId/publicKey provided, no widget/content/llms
  const hasCredentials = !!(config.siteId || config.publicKey);
  const hasWidgetConfig = !!(config.widget && Object.keys(config.widget).length > 0);
  const hasContentConfig = !!(config.content && Object.keys(config.content).length > 0);
  const hasLLMs = !!(config.llms && config.llms.length > 0);

  return hasCredentials && !hasWidgetConfig && !hasContentConfig && !hasLLMs;
}

/**
 * Fetch config from API
 * Returns null if fetch fails (caller should fall back to defaults)
 */
export async function fetchConfigFromAPI(
  siteId: string | null | undefined,
  publicKey: string | null | undefined,
  apiEndpoint?: string | null
): Promise<LLMShareConfig | null> {
  if (!siteId || !publicKey) {
    return null;
  }

  // Determine API endpoint
  const endpoint = apiEndpoint || 'https://www.getsourced.ai/api/v1/widget-config';
  const url = `${endpoint}?siteId=${encodeURIComponent(siteId)}&publicKey=${encodeURIComponent(publicKey)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      console.warn(`[LLMShare] Failed to fetch config from API: ${response.status}`);
      return null;
    }

    const apiConfig = await response.json();
    return apiConfig as LLMShareConfig;
  } catch (error) {
    // Silently fail - this is expected for open-source users without our API
    if (error instanceof Error && error.name !== 'AbortError') {
      console.warn('[LLMShare] Error fetching config from API:', error.message);
    }
    return null;
  }
}

/**
 * Merge API config with inline config
 * 
 * Default: Client config takes precedence (allows per-page overrides)
 * Override: If server sets overrideClientConfig: true, server config takes precedence
 */
export function mergeConfigs(
  apiConfig: LLMShareConfig | null,
  inlineConfig: LLMShareConfig
): LLMShareConfig {
  if (!apiConfig) {
    return inlineConfig;
  }

  // Check if server wants to override client config
  const overrideClientConfig = (apiConfig as LLMShareConfig & { overrideClientConfig?: boolean }).overrideClientConfig === true;

  // `widget: false` (suppress all widget UI) doesn't deep-merge like the
  // rest of the widget config — narrow it out of the object-shaped merges
  // below and instead decide, per branch, whether the merge's "winning"
  // side's explicit false should propagate through untouched.
  const inlineWidget = inlineConfig.widget === false ? undefined : inlineConfig.widget;
  const apiWidget = apiConfig.widget === false ? undefined : apiConfig.widget;

  if (overrideClientConfig) {
    // Server config takes precedence - merge client into server (client fills gaps)
    // If the server explicitly disables the widget, honor that; otherwise
    // fall back to the client's explicit disable if the server didn't say
    // anything about `widget` at all.
    const widgetDisabled =
      apiConfig.widget !== undefined
        ? apiConfig.widget === false
        : inlineConfig.widget === false;

    return {
      ...inlineConfig,
      ...apiConfig,
      // Deep merge nested objects (server overrides client)
      widget: widgetDisabled
        ? false
        : {
            ...inlineWidget,
            ...apiWidget,
            textLabel: {
              ...inlineWidget?.textLabel,
              ...apiWidget?.textLabel,
            },
            showOn: {
              ...inlineWidget?.showOn,
              ...apiWidget?.showOn,
            },
          },
      content: {
        ...inlineConfig.content,
        ...apiConfig.content,
      },
      endpoints: {
        ...inlineConfig.endpoints,
        ...apiConfig.endpoints,
      },
      tracking: {
        ...inlineConfig.tracking,
        ...apiConfig.tracking,
      },
      callbacks: {
        ...inlineConfig.callbacks,
        ...apiConfig.callbacks,
      },
      debug: {
        ...inlineConfig.debug,
        ...apiConfig.debug,
      },
      // Arrays: server replaces client
      llms: apiConfig.llms || inlineConfig.llms,
    };
  } else {
    // Default: Client config takes precedence - merge server into client (client overrides server)
    // If the client explicitly disables the widget, honor that; otherwise
    // fall back to the server's explicit disable if the client didn't say
    // anything about `widget` at all.
    const widgetDisabled =
      inlineConfig.widget !== undefined
        ? inlineConfig.widget === false
        : apiConfig.widget === false;

    return {
      ...apiConfig,
      ...inlineConfig,
      // Deep merge nested objects (client overrides server)
      widget: widgetDisabled
        ? false
        : {
            ...apiWidget,
            ...inlineWidget,
            textLabel: {
              ...apiWidget?.textLabel,
              ...inlineWidget?.textLabel,
            },
            showOn: {
              ...apiWidget?.showOn,
              ...inlineWidget?.showOn,
            },
          },
      content: {
        ...apiConfig.content,
        ...inlineConfig.content,
      },
      endpoints: {
        ...apiConfig.endpoints,
        ...inlineConfig.endpoints,
      },
      tracking: {
        ...apiConfig.tracking,
        ...inlineConfig.tracking,
      },
      callbacks: {
        ...apiConfig.callbacks,
        ...inlineConfig.callbacks,
      },
      debug: {
        ...apiConfig.debug,
        ...inlineConfig.debug,
      },
      // Arrays: client replaces server
      llms: inlineConfig.llms || apiConfig.llms,
    };
  }
}

