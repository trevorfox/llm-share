/**
 * The `window.GetSourced` stub: queues identify/consent calls until the
 * bundle initializes and replays them. Used by the loader, and reinstalled
 * on destroy so calls between destroy and re-init are not lost.
 */
export function installGetSourcedStub(): NonNullable<Window['GetSourced']> {
  const gs = (window.GetSourced = window.GetSourced || ({} as NonNullable<Window['GetSourced']>));
  const calls = (gs._q = gs._q || []);
  gs.identify = gs.identify || ((...args: unknown[]) => void calls.push(['identify', args]));
  gs.consent = gs.consent || ((...args: unknown[]) => void calls.push(['consent', args]));
  gs.getVisitorId = gs.getVisitorId || (() => null);
  return gs;
}
