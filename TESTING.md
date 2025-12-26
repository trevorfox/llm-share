# Testing Guide

## Testing Overview

There are two types of testing:

1. **Automated Unit Tests** - Run with Vitest
2. **Manual Browser Testing** - Test the widget in a real browser

---

## 1. Automated Unit Tests

### Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on changes)
npm test -- --watch

# Run tests with UI (interactive)
npm run test:ui
```

### Test Files

- `tests/config.test.ts` - Config validation and defaults
- `tests/utils.test.ts` - Utility functions (UUID, prompt composition)

### Writing New Tests

Create test files in `tests/` directory:

```typescript
import { describe, it, expect } from 'vitest';

describe('My Feature', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

---

## 2. Manual Browser Testing

### Quick Test Process

1. **Build the widget:**
   ```bash
   npm run build
   ```

2. **Start a local server:**
   ```bash
   npm run serve
   ```

3. **Open test page:**
   - Open http://localhost:8000/test.html in your browser
   - Open browser DevTools (F12) to see console logs

### Test Files

- `test.html` - Main interactive test page (root directory) with multiple widget configurations

### What to Test Manually

#### Basic Functionality
- [ ] Widget appears on page load
- [ ] Widget positioned correctly (center-right by default)
- [ ] All LLM buttons visible (ChatGPT, Claude, Gemini)
- [ ] Icons display correctly

#### Interactions
- [ ] Click button → prompt copied to clipboard
- [ ] Paste clipboard → verify prompt format
- [ ] Select text → click button → selected text included
- [ ] Multiple clicks work without errors

#### Theming
- [ ] Light theme displays correctly
- [ ] Dark theme displays correctly
- [ ] Auto theme matches system preference
- [ ] Theme changes when system theme changes

#### Placements
- [ ] `center-right` - Widget on right side, vertically centered
- [ ] `center-left` - Widget on left side, vertically centered
- [ ] `bottom-right` - Widget in bottom-right corner
- [ ] `inline` - Widget embedded in page content

#### Styles
- [ ] `pill` - Rounded pill shape
- [ ] `square` - Square corners
- [ ] `minimal` - Minimal padding

#### Events & Callbacks
- [ ] Console shows `impression` event on load
- [ ] Console shows `click` event on button click
- [ ] `onReady` callback fires
- [ ] `onEvent` callback receives events

#### Edge Cases
- [ ] Works without endpoints (offline mode)
- [ ] Works with invalid config (graceful fallback)
- [ ] Works on mobile viewport
- [ ] Works with browser back/forward navigation

---

## 3. Development Testing Workflow

### Recommended Workflow

1. **Start dev mode** (auto-rebuilds on changes):
   ```bash
   npm run dev
   ```

2. **In another terminal, start server:**
   ```bash
   npm run serve
   ```

3. **Open test page:**
   - http://localhost:8000/test.html
   - Keep browser DevTools open

4. **Make changes:**
   - Edit files in `src/`
   - Widget auto-rebuilds
   - Refresh browser to see changes

### Quick Checks Before Committing

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Run tests
npm test

# Build (verify production build works)
npm run build
```

---

## 4. Integration Testing

### Test with Different Configs

Edit `test.html` to test different configurations:

```javascript
// Test offline mode
window.LLMShare = {
  mode: "offline",
  // ...
};

// Test hosted mode (requires endpoints)
window.LLMShare = {
  mode: "hosted",
  endpoints: {
    collector: "https://c.sendto.chat/v1/events",
    // ...
  }
};

// Test inline placement
window.LLMShare = {
  widget: {
    placement: "inline",
    inlineSelector: "#share-widget"
  }
};
```

### Test in Different Browsers

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 14+)

---

## 5. Performance Testing

### Bundle Size Checks

After building, check sizes:
```bash
npm run build
ls -lh dist/
```

Targets:
- Loader: < 2KB gzipped ✅ (currently 0.38 KB)
- Widget: < 50KB gzipped ✅ (currently ~7-9 KB)

### Load Time

- Open test page
- Check Network tab in DevTools
- Verify scripts load quickly
- Check for any blocking resources

---

## 6. Debugging

### Enable Debug Mode

In `test.html`, set:
```javascript
debug: {
  logToConsole: true
}
```

### Common Issues

**Widget doesn't appear:**
- Check browser console for errors
- Verify `dist/loader.js` and `dist/widget.iife.js` exist
- Check script paths in HTML

**Events not firing:**
- Check `tracking.enabled` is `true`
- Verify endpoints are reachable (if using hosted mode)
- Check DNT (Do Not Track) isn't blocking

**Clipboard not working:**
- Check browser permissions
- Try in different browser
- Verify HTTPS/localhost (clipboard API requires secure context)

---

## 7. Test Checklist

Before releasing:

- [ ] All unit tests pass
- [ ] TypeScript compiles without errors
- [ ] Linter passes
- [ ] Widget works in Chrome
- [ ] Widget works in Firefox
- [ ] Widget works in Safari
- [ ] Widget works on mobile
- [ ] All placements work
- [ ] All themes work
- [ ] Clipboard functionality works
- [ ] Events fire correctly
- [ ] Bundle sizes within targets
- [ ] No console errors
- [ ] Accessibility (keyboard navigation works)
