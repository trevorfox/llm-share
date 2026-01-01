/**
 * Main widget entry point
 */

import type { LLMShareConfig } from './config/types';
import { getConfig } from './config/schema';
import { EventTracker } from './events/tracker';
import { Widget } from './ui/Widget';
import { getDefaultIcon } from './icons';

import { validateConfig } from './config/schema';

/**
 * Initialize widget
 */
export function init(config?: LLMShareConfig): void {
  // Prevent double initialization
  if (typeof window !== 'undefined' && window.__LLMShareInstance) {
    return;
  }

  // Get config from window or parameter
  let normalizedConfig;
  
  if (config) {
    // Config passed directly (from loader)
    normalizedConfig = validateConfig(config);
  } else {
    // Get from window
    normalizedConfig = getConfig();
  }

  if (!normalizedConfig) {
    console.error('[LLMShare] Failed to initialize: invalid or missing config');
    return;
  }

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

// Export for UMD/IIFE builds
if (typeof window !== 'undefined') {
  window.LLMShareWidget = {
    init,
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

