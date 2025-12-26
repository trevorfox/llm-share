/**
 * Browser feature detection utilities
 */

/**
 * Check if browser supports required features
 */
export function isBrowserSupported(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check for required APIs
  if (
    typeof fetch === 'undefined' ||
    typeof Promise === 'undefined' ||
    typeof document === 'undefined'
  ) {
    return false;
  }

  return true;
}

/**
 * Get prefers-color-scheme value
 */
export function getPreferredColorScheme(): 'light' | 'dark' {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

/**
 * Check if clipboard API is available
 */
export function isClipboardAPIAvailable(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard !== 'undefined' &&
    typeof navigator.clipboard.writeText === 'function'
  );
}

/**
 * Check if device is mobile based on screen width and user agent
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check screen width (most reliable)
  const isSmallScreen = window.innerWidth <= 768;
  
  // Check user agent as secondary indicator
  // Note: window.opera is a legacy property for very old Opera browsers
  const userAgent = navigator.userAgent || navigator.vendor || (typeof window !== 'undefined' && 'opera' in window ? String((window as Record<string, unknown>).opera) : '');
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  
  // Consider it mobile if either condition is true
  return isSmallScreen || isMobileUA;
}

