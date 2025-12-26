/**
 * Create share URL via endpoint
 */
export async function createShareUrl(
  url: string,
  shareEndpoint: string,
  siteId: string | null,
  publicKey: string | null
): Promise<string | null> {
  try {
    const response = await fetch(shareEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        site_id: siteId,
        public_key: publicKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Expect response with token or url
    if (data.token && data.redirect_base) {
      return `${data.redirect_base}${data.token}`;
    } else if (data.url) {
      return data.url;
    } else if (data.share_url) {
      return data.share_url;
    }

    return null;
  } catch (error) {
    // Silently fail - will fallback to raw URL
    return null;
  }
}

