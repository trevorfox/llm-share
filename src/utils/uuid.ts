/**
 * Generate UUID v4
 */
export function generateUUID(): string {
  // Prefer the platform's cryptographically random implementation; the
  // visitor id persists for months, so collisions matter more than they
  // did for per-page view ids.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Simple UUID v4 implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Whether a value is a well-formed UUID (versions 1–8)
 */
export function isUUID(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value);
}
