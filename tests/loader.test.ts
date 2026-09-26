import { describe, it, expect } from 'vitest';

describe('Loader GetSourced stub', () => {
  it('queues identify and consent calls until the bundle loads', async () => {
    (window as any).LLMShare = { siteId: 's', publicKey: 'p', widgetUrl: 'https://cdn.test/widget.js' };
    const existing = { _q: [['consent', [false]]] };
    (window as any).GetSourced = existing;

    await import('../src/loader');

    const gs = (window as any).GetSourced;
    expect(gs).toBe(existing);
    expect(gs.getVisitorId()).toBeNull();
    gs.identify({ ref: 'u1' });
    gs.consent(true);
    expect(gs._q).toEqual([
      ['consent', [false]],
      ['identify', [{ ref: 'u1' }]],
      ['consent', [true]],
    ]);
    expect(document.querySelector('script[src="https://cdn.test/widget.js"]')).not.toBeNull();
  });
});
