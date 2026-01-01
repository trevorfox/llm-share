/**
 * Loader snippet - minimal script that reads config and injects widget bundle
 * Must be < 2KB minified + gzipped
 */

// Version is injected at build time via Vite define
declare const __VERSION__: string;

(function () {
  'use strict';

  // Get config from window.LLMShare
  const rawConfig = window.LLMShare;

  if (!rawConfig) {
    console.warn('[LLMShare] No config found. Please set window.LLMShare');
    return;
  }

  // Determine widget bundle URL
  // Default to versioned CDN URL, but can be overridden via config.widgetUrl
  const version = typeof __VERSION__ !== 'undefined' ? __VERSION__ : '1.0.0';
  const widgetUrl =
    rawConfig.widgetUrl ||
    `https://cdn.getsourced.ai/v${version}/widget.iife.js`;

  // Create script tag to load widget bundle
  const script = document.createElement('script');
  script.src = widgetUrl;
  script.async = true;
  script.defer = true;

  // Queue for early calls (if widget API is called before load)
  const queue: Array<() => void> = [];
  window.__LLMShareQueue = queue;

  // Handle widget load
  script.onload = () => {
    // Wait for DOM to be ready, then initialize
    const doInit = () => {
      if (window.LLMShareWidget && window.LLMShareWidget.init) {
        window.__LLMShareInitialized = true;
        window.LLMShareWidget.init(rawConfig);
      }
      delete window.__LLMShareQueue;
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', doInit);
    } else {
      doInit();
    }
  };

  script.onerror = () => {
    console.error('[LLMShare] Failed to load widget bundle from:', widgetUrl);
    delete window.__LLMShareQueue;
  };

  // Inject script
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
})();

