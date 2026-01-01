/**
 * Create share URL via endpoint
 */
export async function createShareUrl(
  url: string,
  shareEndpoint: string,
  siteId: string | null,
  publicKey: string | null,
  llmId: string,
  pageTitle?: string,
  viewId?: string
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
        llm_id: llmId,
        page_title: pageTitle,
        view_id: viewId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Check for share_url first (preferred format from API)
    if (data.share_url) {
      return data.share_url;
    } else if (data.token && data.redirect_base) {
      // Fallback: construct URL from token and redirect_base
      const slug = data.slug ? `/${data.slug}` : '';
      return `${data.redirect_base}${data.token}${slug}`;
    } else if (data.url) {
      return data.url;
    }

    return null;
  } catch (error) {
    // Silently fail - will fallback to raw URL
    return null;
  }
}

