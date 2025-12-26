import type { NormalizedLLMShareConfig } from '../config/types';

/**
 * Compose prompt text with page information
 */
export function composePrompt(
  config: NormalizedLLMShareConfig,
  url: string
): string {
  const parts: string[] = [];

  // Add prompt template
  if (config.content.prompt) {
    parts.push(config.content.prompt);
  }

  // Add page title if enabled
  if (config.content.includePageTitle && typeof document !== 'undefined') {
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

  // Add URL
  parts.push(`\n\nURL: ${url}`);

  return parts.join('');
}

