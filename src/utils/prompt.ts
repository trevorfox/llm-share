import type { NormalizedLLMShareConfig } from '../config/types';

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    // Fallback: try to extract domain from string
    const match = url.match(/https?:\/\/(?:www\.)?([^\/]+)/);
    return match ? match[1] : url;
  }
}

/**
 * Compose prompt text with page information
 */
export function composePrompt(
  config: NormalizedLLMShareConfig,
  url: string
): string {
  const parts: string[] = [];

  // Get page title and domain for token replacement
  const pageTitle = typeof document !== 'undefined' ? document.title : '';
  const domain = extractDomain(url);

  // Add prompt template with token replacement
  if (config.content.prompt) {
    let promptText = config.content.prompt;
    
    // Replace tokens in prompt template
    promptText = promptText.replace(/{url}/g, url);
    promptText = promptText.replace(/{domain}/g, domain);
    promptText = promptText.replace(/{title}/g, pageTitle);
    
    parts.push(promptText);
  }

  // Add page title if enabled and not already in template
  // Only add if includePageTitle is true AND title token wasn't used
  if (
    config.content.includePageTitle &&
    typeof document !== 'undefined' &&
    (!config.content.prompt || !config.content.prompt.includes('{title}'))
  ) {
    const title = document.title || '';
    if (title) {
      parts.push(`\n\nPage: ${title}`);
    }
  }

  // Add selected text if enabled and present
  if (
    config.content.includeSelectedText &&
    typeof window !== 'undefined' &&
    window.getSelection
  ) {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      if (selectedText.length > 0 && selectedText.length < 1000) {
        // Limit selected text length
        parts.push(`\n\nSelected text: ${selectedText}`);
      }
    }
  }

  // Add URL if not already in template
  if (!config.content.prompt || !config.content.prompt.includes('{url}')) {
    parts.push(`\n\nURL: ${url}`);
  }

  return parts.join('');
}

