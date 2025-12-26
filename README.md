# LLM Share Widget

A drop-in JavaScript widget that adds a customizable "send this page to an LLM" sharing layer to any website via a single script tag and config object.

## Features

- 🚀 **Drop-in integration** - Single script tag + config object
- 🎨 **Customizable UI** - Position, theme, size, inline or overlay modes
- 📝 **Prompt templates** - Configurable prompts with page title, URL, and selected text
- 🤖 **Multiple LLM targets** - ChatGPT, Claude, Gemini, and more
- 📋 **Copy-to-clipboard** - Ready-to-use prompts copied to clipboard
- 🔗 **Link masking** - Optional share endpoint integration for masked links
- 📊 **Event tracking** - Privacy-respecting analytics with batching
- 🔧 **Three modes** - Hosted (SaaS), self-hosted, or offline
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
    collector: "https://c.sendto.chat/v1/events",
    share: "https://c.sendto.chat/v1/share",
    redirectBase: "https://t.sendto.chat/s/"
  },
  // ... rest of config
};
</script>
<script src="https://cdn.sendto.chat/loader.js"></script>
```

### npm

```bash
npm install @sendto/llm-share
```

```javascript
import { init } from '@sendto/llm-share';

init({
  mode: "offline",
  // ... config
});
```

### Self-hosted

Download the `dist/` files and host them on your own CDN:

```html
<script>
window.LLMShare = {
  // ... config
};
</script>
<script src="https://your-cdn.com/path/to/loader.js"></script>
```

## Configuration

### Basic Config

```javascript
window.LLMShare = {
  version: "1",
  siteId: "pub_123",           // Optional in offline mode
  publicKey: "pk_abc",         // Optional in offline mode
  mode: "hosted",              // hosted | self_hosted | offline
  
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
  mode: "offline"
  // Widget will use defaults for everything else
};
```

## Examples

See `test.html` for interactive testing with multiple widget configurations including:
- Basic usage with default config
- Custom configurations with inline placement
- Various placement options (center-right, center-left, bottom-right, bottom-left)
- Different styles and themes

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

