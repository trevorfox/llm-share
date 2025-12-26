import type { LLMConfig, NormalizedLLMShareConfig } from '../config/types';
import { copyToClipboard } from '../utils/clipboard';
import { composePrompt } from '../utils/prompt';
import type { EventTracker } from '../events/tracker';
import { createShareUrl } from '../utils/share';

/**
 * Create LLM button element
 */
export function createLLMButton(
  llm: LLMConfig,
  config: NormalizedLLMShareConfig,
  tracker: EventTracker,
  _container: HTMLElement
): HTMLElement {
  // Use anchor tag for link actions, button for copy actions
  const element = llm.action === 'link' && llm.urlTemplate
    ? document.createElement('a')
    : document.createElement('button');
  
  element.className = 'llm-share-button';
  
  // Set aria-label based on action type
  const ariaLabel = llm.action === 'copy'
    ? `Copy page content to ${llm.label}`
    : `Open current page in ${llm.label} to ask questions`;
  element.setAttribute('aria-label', ariaLabel);
  
  if (element instanceof HTMLButtonElement) {
    element.setAttribute('type', 'button');
  } else if (element instanceof HTMLAnchorElement) {
    element.setAttribute('rel', 'noopener noreferrer');
    element.setAttribute('target', '_blank');
    element.setAttribute('title', llm.label);
  }

  // Add icon if available
  if (llm.iconSvg) {
    const iconContainer = document.createElement('span');
    iconContainer.className = 'llm-share-icon';
    iconContainer.setAttribute('aria-hidden', 'true'); // Decorative icon, hidden from screen readers
    iconContainer.innerHTML = llm.iconSvg;
    element.appendChild(iconContainer);
  } else if (llm.iconUrl) {
    const icon = document.createElement('img');
    icon.className = 'llm-share-icon';
    icon.src = llm.iconUrl;
    icon.alt = `${llm.label} icon`;
    element.appendChild(icon);
  }

  // Don't show labels by default - icon-only mode for ExploreWithAI style
  // Labels can be shown by setting widget.style to something other than 'minimal'
  // or by explicitly configuring showLabels in the future

  // Handle click or set href
  if (llm.action === 'link' && llm.urlTemplate && element instanceof HTMLAnchorElement) {
    // Generate URL immediately for link actions
    const url = generateLLMUrl(llm, config);
    if (config.debug.logToConsole) {
      console.log(`[LLMShare] Generated URL for ${llm.id}:`, url);
    }
    if (url) {
      element.href = url;
      // Add click handler to track and ensure link opens
      element.addEventListener('click', (e) => {
        // Track click
        tracker.trackClick(llm.id);
        // Use window.open to ensure it opens in new tab
        e.preventDefault();
        const opened = window.open(url, '_blank', 'noopener,noreferrer');
        if (!opened && config.debug.logToConsole) {
          console.warn(`[LLMShare] Failed to open ${llm.id} link - popup may be blocked`);
        }
      });
    } else {
      // If URL generation fails, fall back to button behavior
      const button = document.createElement('button');
      button.className = element.className;
      button.setAttribute('type', 'button');
      // Preserve the aria-label from the element (which is already set for link action)
      button.setAttribute('aria-label', element.getAttribute('aria-label') || `Open current page in ${llm.label} to ask questions`);
      // Copy children
      while (element.firstChild) {
        button.appendChild(element.firstChild);
      }
      if (element.parentNode) {
        element.parentNode.replaceChild(button, element);
      }
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        await handleLLMClick(llm, config, tracker, button);
      });
      return button;
    }
  } else {
    element.addEventListener('click', async (e) => {
      e.preventDefault();
      await handleLLMClick(llm, config, tracker, element);
    });
  }

  return element;
}

/**
 * Generate LLM URL with prompt
 */
function generateLLMUrl(
  llm: LLMConfig,
  _config: NormalizedLLMShareConfig
): string | null {
  if (!llm.urlTemplate) {
    return null;
  }

  const currentUrl = window.location.href;
  const path = window.location.pathname || '/';
  
  // Generate prompt similar to ExploreWithAI component
  const prompt = encodeURIComponent(
    `Provide a detailed summary of ${currentUrl} so I can ask questions about it`
  );

  // Replace placeholders in URL template (if they exist)
  let url = llm.urlTemplate;
  if (url.includes('{url}')) {
    url = url.replace('{url}', encodeURIComponent(currentUrl));
  }
  if (url.includes('{prompt}')) {
    url = url.replace('{prompt}', prompt);
  }
  if (url.includes('{path}')) {
    url = url.replace('{path}', encodeURIComponent(path));
  }

  return url;
}

/**
 * Get or create live region for accessibility announcements
 */
function getLiveRegion(): HTMLElement {
  let liveRegion = document.getElementById('llm-share-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'llm-share-live-region';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'llm-share-live-region';
    // Visually hidden but accessible to screen readers
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }
  return liveRegion;
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message: string): void {
  const liveRegion = getLiveRegion();
  liveRegion.textContent = message;
  // Clear after announcement to allow re-announcement of same message
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 1000);
}

/**
 * Handle LLM button click
 */
async function handleLLMClick(
  llm: LLMConfig,
  config: NormalizedLLMShareConfig,
  tracker: EventTracker,
  buttonElement?: HTMLElement
): Promise<void> {
  // Track click
  tracker.trackClick(llm.id);

  const currentUrl = window.location.href;

  if (llm.action === 'copy') {
    // Try to create share URL first (if endpoint available)
    let finalUrl = currentUrl;
    
    if (config.endpoints.share) {
      try {
        const shareUrl = await createShareUrl(
          currentUrl,
          config.endpoints.share,
          config.siteId,
          config.publicKey
        );
        if (shareUrl) {
          finalUrl = shareUrl;
          tracker.trackShareCreated(llm.id, shareUrl);
        } else {
          tracker.trackFallbackRawUrl(llm.id, currentUrl);
        }
      } catch (error) {
        tracker.trackFallbackRawUrl(llm.id, currentUrl);
      }
    }

    // Compose prompt
    const prompt = composePrompt(config, finalUrl);

    // Copy to clipboard
    const success = await copyToClipboard(prompt);
    
    if (success) {
      // Announce success to screen readers
      announceToScreenReader(`Content copied to clipboard for ${llm.label}`);
      
      // Restore focus to button for keyboard users
      if (buttonElement && typeof buttonElement.focus === 'function') {
        // Use setTimeout to ensure clipboard operation completes first
        setTimeout(() => {
          buttonElement.focus();
        }, 100);
      }
      
      if (config.debug.logToConsole) {
        console.log('[LLMShare] Copied to clipboard:', prompt);
      }
    } else {
      // Announce failure to screen readers
      announceToScreenReader(`Failed to copy content to clipboard for ${llm.label}`);
      
      tracker.trackError('Failed to copy to clipboard', 'clipboard_error');
      if (config.debug.logToConsole) {
        console.error('[LLMShare] Failed to copy to clipboard');
      }
    }
  } else if (llm.action === 'link' && llm.urlTemplate) {
    const url = generateLLMUrl(llm, config);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}

