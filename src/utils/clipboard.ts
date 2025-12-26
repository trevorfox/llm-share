import { isClipboardAPIAvailable } from './browser';

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined') {
    return false;
  }

  // Try modern Clipboard API first
  if (isClipboardAPIAvailable()) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fall through to fallback
    }
  }

  // Fallback to execCommand for older browsers
  if (typeof document !== 'undefined') {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const success = document.execCommand('copy');
      document.body.removeChild(textArea);

      return success;
    } catch (error) {
      return false;
    }
  }

  return false;
}

