import { describe, it, expect } from 'vitest';
import { validateConfig } from '../src/config/schema';
import type { LLMShareConfig } from '../src/config/types';

describe('Config Validation', () => {
  describe('Smart Defaults', () => {
    it('should apply all smart defaults for standalone mode', () => {
      const config: LLMShareConfig = {
        mode: 'standalone',
      };
      
      const normalized = validateConfig(config);
      
      // Mode defaults
      expect(normalized.mode).toBe('standalone');
      expect(normalized.version).toBe('1');
      expect(normalized.siteId).toBeNull();
      expect(normalized.publicKey).toBeNull();
      
      // Endpoint defaults (null for standalone)
      expect(normalized.endpoints.collector).toBeNull();
      expect(normalized.endpoints.share).toBeNull();
      expect(normalized.endpoints.redirectBase).toBeNull();
      
      // Widget defaults
      expect(normalized.widget.placement).toBe('bottom-left');
      expect(normalized.widget.style).toBe('minimal');
      expect(normalized.widget.theme).toBe('auto');
      expect(normalized.widget.zIndex).toBe(9999);
      expect(normalized.widget.offsetPx).toBe(16);
      expect(normalized.widget.backgroundOpacity).toBe(0.5);
      expect(normalized.widget.inlineSelector).toBeNull();
      expect(normalized.widget.inlineAlignment).toBe('left');
      expect(normalized.widget.showOnMobile).toBe(true);
      expect(normalized.widget.showOn.pathPrefix).toBe('/');
      expect(normalized.widget.showOn.scrollDistance).toBe(200);
      expect(normalized.widget.showOn.showOnScroll).toBe(false);
      expect(normalized.widget.textLabel.enabled).toBe(false);
      expect(normalized.widget.textLabel.text).toBe('Explore with AI');
      expect(normalized.widget.textLabel.position).toBe('top');
      expect(normalized.widget.textLabel.hideDelay).toBe(3000);
      
      // Content defaults
      expect(normalized.content.prompt).toBe('Summarize this page and answer my question:');
      expect(normalized.content.includePageTitle).toBe(true);
      expect(normalized.content.includeSelectedText).toBe(true);
      
      // LLM defaults
      expect(normalized.llms.length).toBe(4);
      expect(normalized.llms[0].id).toBe('chatgpt');
      expect(normalized.llms[1].id).toBe('claude');
      expect(normalized.llms[2].id).toBe('perplexity');
      expect(normalized.llms[3].id).toBe('copy');
      // First 3 LLMs should have 'link' action, 'copy' should have 'copy' action
      expect(normalized.llms[0].action).toBe('link');
      expect(normalized.llms[1].action).toBe('link');
      expect(normalized.llms[2].action).toBe('link');
      expect(normalized.llms[3].action).toBe('copy');
      
      // Tracking defaults (disabled for standalone mode)
      expect(normalized.tracking.enabled).toBe(false);
      expect(normalized.tracking.batch).toBe(true);
      expect(normalized.tracking.flushIntervalMs).toBe(8000);
      expect(normalized.tracking.respectDNT).toBe(true);
      expect(normalized.tracking.pushToDataLayer).toBe(false);
      expect(normalized.tracking.dataLayerName).toBe('dataLayer');
      
      // Callback defaults
      expect(normalized.callbacks.onEvent).toBeNull();
      expect(normalized.callbacks.onReady).toBeNull();
      
      // Debug defaults
      expect(normalized.debug.logToConsole).toBe(false);
    });

    it('should detect hosted mode from siteId', () => {
      const config: LLMShareConfig = {
        siteId: 'pub_123',
      };
      
      const normalized = validateConfig(config);
      expect(normalized.mode).toBe('hosted');
      expect(normalized.endpoints.collector).toBe('https://c.getsourced.ai/v1/events');
      expect(normalized.endpoints.share).toBe('https://c.getsourced.ai/v1/share');
      expect(normalized.endpoints.redirectBase).toBe('https://t.getsourced.ai/s/');
      expect(normalized.tracking.enabled).toBe(true);
    });

    it('should detect hosted mode from publicKey', () => {
      const config: LLMShareConfig = {
        publicKey: 'pk_abc',
      };
      
      const normalized = validateConfig(config);
      expect(normalized.mode).toBe('hosted');
      expect(normalized.endpoints.collector).toBe('https://c.getsourced.ai/v1/events');
      expect(normalized.endpoints.share).toBe('https://c.getsourced.ai/v1/share');
      expect(normalized.endpoints.redirectBase).toBe('https://t.getsourced.ai/s/');
    });

    it('should respect explicit mode even with siteId', () => {
      const config: LLMShareConfig = {
        siteId: 'pub_123',
        mode: 'self_hosted',
      };
      
      const normalized = validateConfig(config);
      expect(normalized.mode).toBe('self_hosted');
      expect(normalized.endpoints.collector).toBeNull();
      expect(normalized.endpoints.share).toBeNull();
      expect(normalized.endpoints.redirectBase).toBeNull();
    });

    it('should allow custom endpoints in hosted mode', () => {
      const config: LLMShareConfig = {
        siteId: 'pub_123',
        endpoints: {
          collector: 'https://custom.com/events',
          share: 'https://custom.com/share',
          redirectBase: 'https://custom.com/r/',
        },
      };
      
      const normalized = validateConfig(config);
      expect(normalized.mode).toBe('hosted');
      expect(normalized.endpoints.collector).toBe('https://custom.com/events');
      expect(normalized.endpoints.share).toBe('https://custom.com/share');
      expect(normalized.endpoints.redirectBase).toBe('https://custom.com/r/');
    });
  });

  describe('Validation', () => {
    it('should validate mode', () => {
      const config = {
        mode: 'invalid',
      } as unknown as LLMShareConfig;
      
      expect(() => validateConfig(config)).toThrow(/Invalid mode/);
    });

    it('should validate placement', () => {
      const config = {
        widget: {
          placement: 'invalid',
        },
      } as unknown as LLMShareConfig;
      
      expect(() => validateConfig(config)).toThrow(/Invalid placement/);
    });

    it('should validate style', () => {
      const config = {
        widget: {
          style: 'invalid',
        },
      } as unknown as LLMShareConfig;
      
      expect(() => validateConfig(config)).toThrow(/Invalid style/);
    });

    it('should validate theme', () => {
      const config = {
        widget: {
          theme: 'invalid',
        },
      } as unknown as LLMShareConfig;
      
      expect(() => validateConfig(config)).toThrow(/Invalid theme/);
    });

    it('should validate textLabel position', () => {
      const config = {
        widget: {
          textLabel: {
            position: 'invalid',
          },
        },
      } as unknown as LLMShareConfig;
      
      expect(() => validateConfig(config)).toThrow(/Invalid textLabel position/);
    });

    it('should validate action', () => {
      const config = {
        action: 'invalid',
      } as unknown as LLMShareConfig;
      
      expect(() => validateConfig(config)).toThrow(/Invalid action/);
    });

    it('should validate LLMs array', () => {
      const config = {
        llms: 'not-an-array',
      } as unknown as LLMShareConfig;
      
      expect(() => validateConfig(config)).toThrow(/llms must be an array/);
    });

    it('should validate LLM strings', () => {
      const config = {
        llms: [123, 'chatgpt'],
      } as unknown as LLMShareConfig;
      
      expect(() => validateConfig(config)).toThrow(/Each LLM must be a string/);
    });

    it('should reject non-object config', () => {
      expect(() => validateConfig(null)).toThrow(/must be an object/);
      expect(() => validateConfig('string')).toThrow(/must be an object/);
      expect(() => validateConfig(123)).toThrow(/must be an object/);
    });
  });

  describe('LLM Configuration', () => {
    it('should expand LLM names to full configs', () => {
      const config: LLMShareConfig = {
        llms: ['chatgpt', 'claude'],
        action: 'link',
      };
      
      const normalized = validateConfig(config);
      expect(normalized.llms.length).toBe(2);
      expect(normalized.llms[0].id).toBe('chatgpt');
      expect(normalized.llms[0].label).toBe('ChatGPT');
      expect(normalized.llms[0].action).toBe('link');
      expect(normalized.llms[0].iconSvg).toBeDefined();
      expect(normalized.llms[0].urlTemplate).toBeDefined();
      expect(normalized.llms[1].id).toBe('claude');
      expect(normalized.llms[1].label).toBe('Claude');
      expect(normalized.llms[1].action).toBe('link');
    });

    it('should default action to link', () => {
      const config: LLMShareConfig = {
        llms: ['chatgpt'],
      };
      
      const normalized = validateConfig(config);
      expect(normalized.llms[0].action).toBe('link');
      expect(normalized.llms[0].urlTemplate).toBeDefined();
    });

    it('should apply copy action to all LLMs', () => {
      const config: LLMShareConfig = {
        llms: ['chatgpt', 'claude'],
        action: 'copy',
      };
      
      const normalized = validateConfig(config);
      normalized.llms.forEach(llm => {
        expect(llm.action).toBe('copy');
        expect(llm.urlTemplate).toBeUndefined();
      });
    });

    it('should use default LLMs when not specified', () => {
      const config: LLMShareConfig = {};
      
      const normalized = validateConfig(config);
      expect(normalized.llms.length).toBe(4);
      expect(normalized.llms.map(l => l.id)).toEqual(['chatgpt', 'claude', 'perplexity', 'copy']);
    });
  });

  describe('Tracking Configuration', () => {
    it('should enable tracking by default in hosted mode', () => {
      const config: LLMShareConfig = {
        siteId: 'pub_123',
      };
      
      const normalized = validateConfig(config);
      expect(normalized.tracking.enabled).toBe(true);
    });

    it('should disable tracking by default in standalone mode', () => {
      const config: LLMShareConfig = {
        mode: 'standalone',
      };
      
      const normalized = validateConfig(config);
      expect(normalized.tracking.enabled).toBe(false);
    });

    it('should allow overriding tracking enabled', () => {
      const config: LLMShareConfig = {
        siteId: 'pub_123',
        tracking: {
          enabled: false,
        },
      };
      
      const normalized = validateConfig(config);
      expect(normalized.tracking.enabled).toBe(false);
    });

    it('should apply tracking defaults', () => {
      const config: LLMShareConfig = {
        siteId: 'pub_123',
      };
      
      const normalized = validateConfig(config);
      expect(normalized.tracking.batch).toBe(true);
      expect(normalized.tracking.flushIntervalMs).toBe(8000);
      expect(normalized.tracking.respectDNT).toBe(true);
      expect(normalized.tracking.pushToDataLayer).toBe(false);
      expect(normalized.tracking.dataLayerName).toBe('dataLayer');
    });

    it('should allow enabling pushToDataLayer', () => {
      const config: LLMShareConfig = {
        siteId: 'pub_123',
        tracking: {
          pushToDataLayer: true,
        },
      };
      
      const normalized = validateConfig(config);
      expect(normalized.tracking.pushToDataLayer).toBe(true);
      expect(normalized.tracking.dataLayerName).toBe('dataLayer');
    });

    it('should allow custom dataLayerName', () => {
      const config: LLMShareConfig = {
        siteId: 'pub_123',
        tracking: {
          pushToDataLayer: true,
          dataLayerName: 'customDataLayer',
        },
      };
      
      const normalized = validateConfig(config);
      expect(normalized.tracking.pushToDataLayer).toBe(true);
      expect(normalized.tracking.dataLayerName).toBe('customDataLayer');
    });
  });

  describe('Widget Configuration', () => {
    it('should apply all widget placement options', () => {
      const placements = ['center-right', 'center-left', 'bottom-right', 'bottom-left', 'inline'] as const;
      
      for (const placement of placements) {
        const config: LLMShareConfig = {
          widget: { placement },
        };
        
        const normalized = validateConfig(config);
        expect(normalized.widget.placement).toBe(placement);
      }
    });

    it('should apply all widget style options', () => {
      const styles = ['pill', 'square', 'minimal', 'custom'] as const;
      
      for (const style of styles) {
        const config: LLMShareConfig = {
          widget: { style },
        };
        
        const normalized = validateConfig(config);
        expect(normalized.widget.style).toBe(style);
      }
    });

    it('should apply all theme options', () => {
      const themes = ['auto', 'light', 'dark'] as const;
      
      for (const theme of themes) {
        const config: LLMShareConfig = {
          widget: { theme },
        };
        
        const normalized = validateConfig(config);
        expect(normalized.widget.theme).toBe(theme);
      }
    });

    it('should apply textLabel configuration', () => {
      const config: LLMShareConfig = {
        widget: {
          textLabel: {
            enabled: true,
            text: 'Custom label',
            position: 'right',
            hideDelay: 5000,
          },
        },
      };
      
      const normalized = validateConfig(config);
      expect(normalized.widget.textLabel.enabled).toBe(true);
      expect(normalized.widget.textLabel.text).toBe('Custom label');
      expect(normalized.widget.textLabel.position).toBe('right');
      expect(normalized.widget.textLabel.hideDelay).toBe(5000);
    });
  });

  describe('Content Configuration', () => {
    it('should apply custom prompt', () => {
      const config: LLMShareConfig = {
        content: {
          prompt: 'Custom prompt text',
        },
      };
      
      const normalized = validateConfig(config);
      expect(normalized.content.prompt).toBe('Custom prompt text');
    });

    it('should allow disabling page title inclusion', () => {
      const config: LLMShareConfig = {
        content: {
          includePageTitle: false,
        },
      };
      
      const normalized = validateConfig(config);
      expect(normalized.content.includePageTitle).toBe(false);
    });

    it('should allow disabling selected text inclusion', () => {
      const config: LLMShareConfig = {
        content: {
          includeSelectedText: false,
        },
      };
      
      const normalized = validateConfig(config);
      expect(normalized.content.includeSelectedText).toBe(false);
    });
  });
});

