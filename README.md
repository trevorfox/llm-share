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
      // Handle events: impression, click, share_created, fallback_raw_url, error
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

