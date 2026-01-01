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
  // Prevent double initialization - check if already initialized
  if (typeof window !== 'undefined') {
    if (window.__LLMShareInstance) {
      if (window.LLMShare?.debug?.logToConsole) {
        console.warn('[LLMShare] Widget already initialized, skipping');
      }
      return; // Already initialized
    }
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
  
  // Auto-init if config exists and DOM is ready (for direct script inclusion)
  // But only if loader hasn't already initialized or isn't loading
  // Check __LLMShareLoading flag set by loader BEFORE script injection
  if (window.LLMShare && !window.__LLMShareInitialized && !window.__LLMShareInstance && !window.__LLMShareLoading) {
    const doInit = () => {
      // Double-check flags and instance to prevent race conditions
      if (!window.__LLMShareInitialized && !window.__LLMShareInstance && !window.__LLMShareLoading) {
        window.__LLMShareInitialized = true;
        init();
      }
    };
    
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doInit);
      } else {
        // Use setTimeout to ensure loader's onload has a chance to set the flag first
        setTimeout(doInit, 0);
      }
    }
  }
}

