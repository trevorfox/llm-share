import type { NormalizedLLMShareConfig } from '../config/types';
import { getPreferredColorScheme } from '../utils/browser';

/**
 * Get effective theme (resolve 'auto' to light/dark)
 */
export function getEffectiveTheme(config: NormalizedLLMShareConfig): 'light' | 'dark' {
  if (config.widget.theme === 'auto') {
    return getPreferredColorScheme();
  }
  return config.widget.theme;
}

/**
 * Generate CSS styles for widget
 */
export function generateStyles(config: NormalizedLLMShareConfig): string {
  const theme = getEffectiveTheme(config);
  const isDark = theme === 'dark';
  const opacity = config.widget.backgroundOpacity ?? 1.0;

  // Style-specific adjustments
  let borderRadius = '8px';
  const padding = '8px 16px'; // Reduced vertical padding from 12px to 8px
  
  if (config.widget.style === 'pill') {
    borderRadius = '24px';
  } else if (config.widget.style === 'square') {
    borderRadius = '0px'; // Truly square corners
  } else if (config.widget.style === 'minimal') {
    borderRadius = '4px';
  }

  // Convert opacity to rgba alpha value
  // Dark mode always uses solid black for better visibility
  const backgroundDark = isDark ? '#000000' : `rgba(0, 0, 0, ${opacity})`;
  const backgroundLight = `rgba(255, 255, 255, ${opacity})`;
  // Text-right background respects theme
  const backgroundRight = isDark ? '#000000' : `rgba(255, 255, 255, ${opacity})`;

  return `
    .llm-share-widget {
      position: fixed;
      z-index: ${config.widget.zIndex};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      box-sizing: border-box;
      transition: transform 0.3s ease-out;
    }
    
    .llm-share-widget.scroll-hidden {
      transform: translateY(100%);
    }
    
    .llm-share-widget-container {
      display: flex;
      align-items: center;
      gap: 12px;
      background: ${isDark ? backgroundDark : backgroundLight};
      border: 1px solid ${isDark ? '#999' : '#e5e5e5'};
      border-radius: ${borderRadius};
      padding: ${padding};
      box-shadow: 0 4px 12px rgba(0, 0, 0, ${isDark ? '0.5' : '0.15'});
      transition: all 0.3s ease-out;
      width: fit-content;
      min-height: 40px;
    }
    
    /* Square style: more prominent with stronger border and shadow */
    .llm-share-widget-container.style-square {
      border: 2px solid ${isDark ? '#666' : '#ccc'} !important;
      border-radius: 0px !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, ${isDark ? '0.6' : '0.2'}) !important;
    }
    
    /* Minimal style: more subtle with lighter border and less shadow */
    .llm-share-widget-container.style-minimal {
      border: 1px solid ${isDark ? '#333' : '#e0e0e0'} !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, ${isDark ? '0.3' : '0.1'}) !important;
    }
    
    /* When text label is on the right, respect theme */
    .llm-share-widget-container.text-right {
      background: ${backgroundRight};
      border: 1px solid ${isDark ? '#333' : '#e5e5e5'};
    }
    
    /* Ensure style classes override text-right border */
    .llm-share-widget-container.text-right.style-square {
      border: 2px solid ${isDark ? '#666' : '#ccc'} !important;
    }
    
    .llm-share-widget-container.text-right.style-minimal {
      border: 1px solid ${isDark ? '#333' : '#e0e0e0'} !important;
    }
    
    .llm-share-widget-container.layout-horizontal {
      flex-direction: row;
    }
    
    .llm-share-widget-container.layout-vertical {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .llm-share-text-label {
      overflow: hidden;
      transition: width 0.3s ease-out, opacity 0.3s ease-out;
      width: 0;
      opacity: 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 24px;
      margin: 0;
      padding: 0;
      white-space: nowrap;
    }
    
    .llm-share-text-label.text-visible {
      width: var(--text-label-width, 150px);
      opacity: 1;
    }
    
    .llm-share-widget-container.layout-vertical .llm-share-text-label {
      width: auto;
      opacity: 1;
      transition: opacity 0.3s ease-out;
      height: auto;
    }
    
    .llm-share-widget-container.layout-vertical .llm-share-text-label.text-visible {
      width: auto;
    }
    
    .llm-share-text-label span {
      font-weight: 500;
      font-size: 14px;
      color: ${isDark ? '#999' : '#1a1a1a'};
      white-space: nowrap;
      display: block;
      line-height: 1;
      margin: 0;
      padding: 0;
      text-indent: 0;
    }
    
    /* Text color when text label is on the right - respects theme */
    .llm-share-widget-container.text-right.theme-light .llm-share-text-label span {
      color: #1a1a1a;
    }
    .llm-share-widget-container.text-right.theme-dark .llm-share-text-label span {
      color: #999;
    }
    
    /* Light theme: black icons and text */
    .llm-share-widget-container.theme-light .llm-share-icon {
      color: #1a1a1a !important;
    }
    
    .llm-share-widget-container.theme-light .llm-share-text-label span {
      color: #1a1a1a !important;
    }
    
    /* Dark theme: white icons and gray text */
    .llm-share-widget-container.theme-dark .llm-share-icon {
      color: #ffffff !important;
    }
    
    .llm-share-widget-container.theme-dark .llm-share-text-label span {
      color: #999 !important;
    }
    
    .llm-share-buttons-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
      height: 24px;
      margin: 0;
      padding: 0;
    }
    
    .llm-share-widget.inline {
      position: static;
      display: inline-block;
      width: fit-content;
      vertical-align: top;
      margin: 0;
      padding: 0;
      line-height: 0;
    }
    
    .llm-share-widget.inline.align-left {
      margin-right: auto;
    }
    
    .llm-share-widget.inline.align-center {
      margin-left: auto;
      margin-right: auto;
      display: block;
    }
    
    .llm-share-widget.inline.align-right {
      margin-left: auto;
      display: block;
    }
    
    /* Ensure inline widget containers have symmetric vertical spacing */
    .llm-share-widget.inline .llm-share-widget-container {
      width: fit-content;
      margin: 0;
      vertical-align: top;
      min-height: auto;
      display: inline-flex;
    }
    
    .llm-share-widget-container {
      width: fit-content;
    }
    
    .llm-share-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: opacity 0.3s ease;
      text-decoration: none;
      line-height: 0;
      width: 24px;
      height: 24px;
      box-sizing: border-box;
    }
    
    .llm-share-button:hover {
      opacity: 0.8;
    }
    
    .llm-share-button:active {
      transform: scale(0.95);
    }
    
    /* Only show focus outline for keyboard navigation (not mouse clicks) */
    .llm-share-button:focus {
      outline: none;
    }
    
    /* Enhanced focus styles for keyboard navigation (WCAG AA compliant) */
    .llm-share-button:focus-visible {
      outline: 3px solid ${isDark ? '#60a5fa' : '#0052cc'};
      outline-offset: 3px;
      border-radius: 4px;
      box-shadow: 0 0 0 1px ${isDark ? 'rgba(96, 165, 250, 0.3)' : 'rgba(0, 82, 204, 0.3)'};
    }
    
    .llm-share-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${isDark ? '#ffffff' : '#1a1a1a'};
      line-height: 0;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    /* Black icons when text label is on the right */
    .llm-share-widget-container.text-right .llm-share-icon {
      color: #1a1a1a;
    }
    
    .llm-share-icon svg {
      width: 100%;
      height: 100%;
      display: block;
      margin: 0;
      padding: 0;
      flex-shrink: 0;
    }
    
    .llm-share-icon img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
      margin: 0;
      padding: 0;
      flex-shrink: 0;
    }
    
    .llm-share-label {
      flex: 1;
    }
    
    @media (max-width: 768px) {
      .llm-share-icon {
        width: 20px;
        height: 20px;
      }
      
      .llm-share-button {
        width: 20px;
        height: 20px;
        min-width: 44px;
        min-height: 44px;
        padding: 12px;
      }
      
      .llm-share-buttons-wrapper {
        gap: 12px;
      }
      
      .llm-share-widget-container {
        padding: 10px 12px;
        min-height: 44px;
      }
      
      /* Adjust offset for mobile bottom placements to prevent overlap with browser UI */
      .llm-share-widget.placement-bottom-left:not(.inline),
      .llm-share-widget.placement-bottom-right:not(.inline) {
        bottom: max(env(safe-area-inset-bottom, 0px), 16px) !important;
      }
      
      /* Adjust horizontal positioning for mobile */
      .llm-share-widget.placement-bottom-left:not(.inline),
      .llm-share-widget.placement-center-left:not(.inline) {
        left: max(env(safe-area-inset-left, 0px), 12px) !important;
      }
      
      .llm-share-widget.placement-bottom-right:not(.inline),
      .llm-share-widget.placement-center-right:not(.inline) {
        right: max(env(safe-area-inset-right, 0px), 12px) !important;
      }
      
      /* Ensure text label is readable on mobile */
      .llm-share-text-label span {
        font-size: 13px;
      }
      
      /* Stack vertically on very small screens if horizontal layout */
      @media (max-width: 480px) {
        .llm-share-widget-container.layout-horizontal {
          flex-wrap: wrap;
        }
        
        .llm-share-widget-container {
          padding: 8px 10px;
        }
        
        .llm-share-buttons-wrapper {
          gap: 10px;
        }
      }
    }
  `;
}

/**
 * Inject styles into document
 */
export function injectStyles(config: NormalizedLLMShareConfig): void {
  if (typeof document === 'undefined') {
    return;
  }

  const styleId = 'llm-share-widget-styles';
  
  // Remove existing styles if present
  const existing = document.getElementById(styleId);
  if (existing) {
    existing.remove();
  }

  // Create and inject style element
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = generateStyles(config);
  document.head.appendChild(style);
}

