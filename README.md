# LLM Share Widget

A drop-in JavaScript widget that adds a customizable "send this page to an LLM" sharing layer to any website via a single script tag and config object.

## 🚀 [**Try the Interactive Setup Tool →**](https://trevorfox.github.io/llm-share/)

Generate your installation code with a visual configuration builder and live preview.

## Quick Start

**Simplest integration (standalone mode - no backend needed):**

```html
<script>
window.LLMShare = {
  mode: "standalone"
};
</script>
<script src="https://cdn.getsourced.ai/loader.js"></script>
```

That's it! The widget will appear on your page with smart defaults.

## Features

- 🚀 **Drop-in integration** - Single script tag + config object
- 🎨 **Customizable UI** - Position, theme, size, inline or overlay modes
- 📝 **Prompt templates** - Configurable prompts with page title, URL, and selected text
- 🤖 **Multiple LLM targets** - ChatGPT, Claude, Gemini, and more
- 📋 **Copy-to-clipboard** - Ready-to-use prompts copied to clipboard
- 🔗 **Link masking** - Optional share endpoint integration for masked links
- 📊 **Event tracking** - Privacy-respecting analytics with batching
- 🔧 **Three modes** - Hosted (SaaS), self-hosted, or standalone
- 🎯 **WordPress-ready** - Designed for easy plugin integration

## Installation

### CDN (Recommended for hosted SaaS)

```html
<script>
window.LLMShare = {
  siteId: "pub_123",
  publicKey: "pk_abc",
  mode: "hosted",
  endpoints: {
    collector: "https://c.getsourced.ai/v1/events",
    share: "https://c.getsourced.ai/v1/share",
    redirectBase: "https://t.getsourced.ai/s/"
  },
  // ... rest of config
};
</script>
<script src="https://cdn.getsourced.ai/loader.js"></script>
```

### npm

```bash
npm install @trevorfox/llm-share
```

```javascript
import { init } from '@trevorfox/llm-share';

init({
  mode: "standalone",
  // ... config
});
```

### Self-hosted

**Step 1: Build the widget**

```bash
# Clone the repository
git clone https://github.com/trevorfox/llm-share.git
cd llm-share

# Install dependencies
npm install

# Build the widget and loader
npm run build
```

This creates the `dist/` folder with:
- `loader.js` - The loader script (required)
- `widget.*.js` - Widget bundles in various formats
- Type definitions (`.d.ts` files)

**Step 2: Host the files**

Upload the `dist/` folder to your CDN or web server, then include:

```html
<script>
window.LLMShare = {
  mode: "standalone"
  // ... your config
};
</script>
<script src="https://your-cdn.com/path/to/dist/loader.js"></script>
```

**Required files for self-hosting:**
- `dist/loader.js` (required)
- `dist/widget.iife.js` (loaded automatically by loader.js)

## Configuration

### Basic Config

```javascript
window.LLMShare = {
  version: "1",
  siteId: "pub_123",           // Optional in standalone mode
  publicKey: "pk_abc",         // Optional in standalone mode
  mode: "hosted",              // hosted | self_hosted | standalone
  
  endpoints: {
    collector: "https://c.domain.com/v1/events",  // Optional
    share: "https://c.domain.com/v1/share",       // Optional
    redirectBase: "https://t.domain.com/s/"       // Optional
  },
  
  widget: {
    placement: "center-right",  // center-right | center-left | bottom-right | bottom-left | inline
    style: "pill",              // pill | square | minimal | custom
    theme: "auto",              // auto | light | dark
    zIndex: 999999,
    offsetPx: 16,
    inlineSelector: null,       // e.g. "#share-widget"
    showOn: { pathPrefix: "/" }
  },
  
  content: {
    prompt: "Summarize this page and answer my question:",
    includePageTitle: true,
    includeSelectedText: true
  },
  
  llms: [
    { id: "chatgpt", label: "ChatGPT", action: "copy" },
    { id: "claude", label: "Claude", action: "copy" },
    { id: "gemini", label: "Gemini", action: "copy" }
  ],
  
  tracking: {
    enabled: true,
    batch: true,
    flushIntervalMs: 8000,
    respectDNT: true
  },
  
  callbacks: {
    onEvent: (evt) => {
      // Handle events: impression, click, share_created, fallback_raw_url, error, pageview
    },
    onReady: () => {
      // Widget initialized
    }
  },
  
  debug: {
    logToConsole: false  // Set to true for debugging
  }
};
```

### Smart Defaults

All config options have smart defaults. You can provide a minimal config:

```javascript
window.LLMShare = {
  mode: "standalone"
  // Widget will use defaults for everything else
};
```

## Detection mode

`detect` fires a single `pageview` event (page URL + referrer, plus the same
attribution fields — language, timezone, screen/viewport — every other
event carries) through the existing event pipeline on init. It defaults to
`true`, so every existing integration picks it up automatically alongside
the widget. It respects the same `tracking.enabled` / `tracking.respectDNT`
rules as every other event — no separate consent path, no new transport.

No classification happens client-side: the widget only reports what the
browser already exposes (referrer + URL). Deciding whether a visit came
from an AI assistant happens server-side, using that data.

Set `widget: false` to suppress all widget UI rendering while detection
(and event tracking generally) still runs — useful if you only want
referrer analytics on a page without the "send to AI" buttons:

```javascript
window.LLMShare = {
  siteId: "pub_123",
  publicKey: "pk_abc",
  detect: true,   // default; explicit here for clarity
  widget: false   // no UI — just the pageview event
};
```

To disable detection entirely (and keep only the widget's own
impression/click events), set `detect: false`.

Note: in hosted mode with only `siteId`/`publicKey`, the library still
fetches remote widget-config before the pageview fires (one extra request
per load; very fast bounces may be missed). Set `mode: "self_hosted"` or
`endpoints.widgetConfig` to skip or redirect that fetch.

## Self-Hosting

llm-share is backend-agnostic. By default (`mode: "hosted"`) it talks to the hosted GetSourced collector, but `mode: "self_hosted"` plus the `endpoints` config points the widget at any backend that implements this three-endpoint contract:

### The collector API contract

**`POST {collector}`** — batch event ingestion. Request:

```json
{
  "site_id": "pub_123",
  "public_key": "pk_abc",
  "events": [ { "event_type": "impression", "ts": "2026-01-01T00:00:00.000Z", "page_url": "https://…", "view_id": "<uuid>", "mode": "hosted", "referrer": null, "language": "en-US", "timezone": "…", "screen_width": 0, "screen_height": 0, "viewport_width": 0, "viewport_height": 0 } ]
}
```

Responses: `200 {"success": true, "inserted": n}`; `400` on validation errors (1–100 events per batch); `401` invalid credentials; `403` origin not in the site's allow-list.

**`POST {share}`** — create a tracked share link. Request: `{"url", "site_id", "public_key", "llm_id", "page_title?", "view_id?"}`. Response: `201 {"token", "slug", "share_url", "redirect_base"}`.

**`GET {redirectBase}{token}/{slug?}`** — resolve a share link: logs a `resolve` event and `302`s to the destination URL. Unknown/expired tokens return `404`.

There is also an optional remote-config endpoint (`GET /api/v1/widget-config?siteId=…&publicKey=…`) that returns a config object merged as `{siteId, publicKey, mode, …widget_config}` — useful when you want server-managed widget settings.

Origin validation, credentials, and batching semantics are defined by the reference implementation; the hosted service at `getsourced.ai` is one implementation of this contract, not a dependency.

## Examples

- **[index.html](./index.html)** - Interactive config builder tool to generate your configuration code
- See the [TESTING.md](./TESTING.md) guide for comprehensive testing examples

## Browser Support

Modern browsers only (last 2 major versions):
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions (iOS Safari 14+)
- Opera: Last 2 versions

**Required features:**
- ES2020+ JavaScript
- CSS Grid & Flexbox
- `navigator.clipboard` API (with fallback)
- `fetch` API
- `prefers-color-scheme` media query

## Bundle Size

- **Loader snippet**: < 2KB minified + gzipped
- **Widget bundle**: < 50KB minified + gzipped
- **Total payload**: < 52KB for first load

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Build loader separately
npm run build:loader

# Development mode (watch)
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint
```

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

