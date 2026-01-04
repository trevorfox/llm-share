/**
 * Main widget entry point
 */

import type { LLMShareConfig, NormalizedLLMShareConfig } from './config/types';
import { validateConfig } from './config/schema';
import { isMinimalConfig, fetchConfigFromAPI, mergeConfigs } from './config/api-config';
import { EventTracker } from './events/tracker';
import { Widget } from './ui/Widget';
import { getDefaultIcon } from './icons';

/**
 * Internal function to initialize widget with normalized config
 */
function initializeWidget(normalizedConfig: NormalizedLLMShareConfig): void {
  // Add default icons to LLM configs if not provided
  for (const llm of normalizedConfig.llms) {
    if (!llm.iconSvg && !llm.iconUrl) {
      const defaultIcon = getDefaultIcon(llm.id);
      if (defaultIcon) {
        llm.iconSvg = defaultIcon;
      }
    }
  }

  // Create event tracker
  const tracker = new EventTracker(normalizedConfig);

  // Create and initialize widget
  const widget = new Widget(normalizedConfig, tracker);
  widget.init();

  // Expose widget instance for cleanup if needed
  if (typeof window !== 'undefined') {
    window.__LLMShareInstance = {
      widget,
      tracker,
      destroy: () => {
        widget.destroy();
        tracker.destroy();
        delete window.__LLMShareInstance;
      },
    };
    // Clear loading flag now that we're initialized
    delete window.__LLMShareLoading;
  }
}

/**
 * Initialize widget (async version that can fetch config from API)
 */
export async function initAsync(config?: LLMShareConfig): Promise<void> {
  // Prevent double initialization
  if (typeof window !== 'undefined' && window.__LLMShareInstance) {
    return;
  }

  // Get config from window or parameter
  let inlineConfig: LLMShareConfig | null = null;
  
  if (config) {
    // Config passed directly (from loader)
    inlineConfig = config;
  } else {
    // Get from window
    const windowWithConfig = window as typeof window & {
      LLMShare?: LLMShareConfig;
    };
    inlineConfig = windowWithConfig.LLMShare || null;
  }

  if (!inlineConfig) {
    console.error('[LLMShare] Failed to initialize: invalid or missing config');
    return;
  }

  // Check if we should fetch config from API
  let finalConfig = inlineConfig;
  if (isMinimalConfig(inlineConfig)) {
    // Fetch from API and merge with inline config
    const apiConfig = await fetchConfigFromAPI(
      inlineConfig.siteId,
      inlineConfig.publicKey,
      inlineConfig.endpoints?.widgetConfig as string | undefined
    );
    
    if (apiConfig) {
      finalConfig = mergeConfigs(apiConfig, inlineConfig);
    }
    // If API fetch fails, use inline config (which is minimal) - defaults will be applied
  }

  // Validate and normalize final config
  const normalizedConfig = validateConfig(finalConfig);
  
  if (!normalizedConfig) {
    console.error('[LLMShare] Failed to initialize: invalid config after merge');
    return;
  }

  // Initialize widget with normalized config
  initializeWidget(normalizedConfig);
}

/**
 * Initialize widget (synchronous version for backward compatibility)
 */
export function init(config?: LLMShareConfig): void {
  // Prevent double initialization
  if (typeof window !== 'undefined' && window.__LLMShareInstance) {
    return;
  }

  // If config is provided and not minimal, initialize synchronously (backward compatible)
  if (config && !isMinimalConfig(config)) {
    const normalizedConfig = validateConfig(config);
    if (normalizedConfig) {
      initializeWidget(normalizedConfig);
    }
    return;
  }

  // For minimal config or config from window, use async initialization
  initAsync(config).catch((error) => {
    console.error('[LLMShare] Failed to initialize widget:', error);
  });
}

// Export for UMD/IIFE builds
if (typeof window !== 'undefined') {
  window.LLMShareWidget = {
    init,
    initAsync,
  };
  
  // Auto-init only if NOT loaded via loader (loader sets __LLMShareLoading flag)
  if (window.LLMShare && !window.__LLMShareLoading) {
    const doInit = () => {
      if (!window.__LLMShareInstance) {
        init();
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', doInit);
    } else {
      doInit();
    }
  }
}
