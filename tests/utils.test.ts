import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateUUID } from '../src/utils/uuid';
import { composePrompt } from '../src/utils/prompt';
import { applyDefaults } from '../src/config/defaults';

describe('Utils', () => {
  describe('UUID Generation', () => {
    it('should generate valid UUID v4', () => {
      const uuid = generateUUID();
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      // where y is one of 8, 9, a, or b
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate UUIDs with correct version (4)', () => {
      const uuid = generateUUID();
      // Version 4 is indicated by the 13th character being '4'
      expect(uuid[14]).toBe('4');
    });
  });

  describe('Prompt Composition', () => {
    beforeEach(() => {
      // Mock document.title
      Object.defineProperty(global.document, 'title', {
        writable: true,
        value: 'Test Page Title',
      });

      // Mock window.getSelection
      // Note: getSelection() returns a Selection object where toString() returns a string
      // The code calls selection.toString().trim(), so toString() must return a string
      Object.defineProperty(global.window, 'getSelection', {
        writable: true,
        configurable: true,
        value: vi.fn(() => ({
          toString: () => 'Selected text content',
        })),
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should compose prompt with URL only', () => {
      const config = applyDefaults({
        mode: 'offline',
        content: {
          prompt: 'Test prompt',
          includePageTitle: false,
          includeSelectedText: false,
        },
      });
      
      const prompt = composePrompt(config, 'https://example.com');
      expect(prompt).toContain('Test prompt');
      expect(prompt).toContain('https://example.com');
      expect(prompt).not.toContain('Page:');
      expect(prompt).not.toContain('Selected text:');
    });

    it('should include page title when enabled', () => {
      const config = applyDefaults({
        mode: 'offline',
        content: {
          prompt: 'Test prompt',
          includePageTitle: true,
          includeSelectedText: false,
        },
      });
      
      const prompt = composePrompt(config, 'https://example.com');
      expect(prompt).toContain('Test prompt');
      expect(prompt).toContain('Page: Test Page Title');
      expect(prompt).toContain('https://example.com');
    });

    it('should include selected text when enabled and present', () => {
      const config = applyDefaults({
        mode: 'offline',
        content: {
          prompt: 'Test prompt',
          includePageTitle: false,
          includeSelectedText: true,
        },
      });
      
      const prompt = composePrompt(config, 'https://example.com');
      expect(prompt).toContain('Test prompt');
      expect(prompt).toContain('Selected text: Selected text content');
      expect(prompt).toContain('https://example.com');
      // Verify the selected text is actually included (not just checking it doesn't error)
      const selectedTextMatch = prompt.match(/Selected text: (.+)/);
      expect(selectedTextMatch).toBeTruthy();
      expect(selectedTextMatch![1]).toBe('Selected text content');
    });

    it('should include both page title and selected text when both enabled', () => {
      const config = applyDefaults({
        mode: 'offline',
        content: {
          prompt: 'Test prompt',
          includePageTitle: true,
          includeSelectedText: true,
        },
      });
      
      const prompt = composePrompt(config, 'https://example.com');
      expect(prompt).toContain('Test prompt');
      expect(prompt).toContain('Page: Test Page Title');
      expect(prompt).toContain('Selected text: Selected text content');
      expect(prompt).toContain('https://example.com');
      // Verify order: prompt should come first, then page title, then selected text, then URL
      const promptIndex = prompt.indexOf('Test prompt');
      const pageIndex = prompt.indexOf('Page:');
      const selectedIndex = prompt.indexOf('Selected text:');
      const urlIndex = prompt.indexOf('URL:');
      expect(promptIndex).toBeLessThan(pageIndex);
      expect(pageIndex).toBeLessThan(selectedIndex);
      expect(selectedIndex).toBeLessThan(urlIndex);
    });

    it('should not include selected text when empty', () => {
      Object.defineProperty(global.window, 'getSelection', {
        writable: true,
        configurable: true,
        value: vi.fn(() => ({
          toString: () => '', // Empty string - trim() will be called on this string
        })),
      });

      const config = applyDefaults({
        mode: 'offline',
        content: {
          prompt: 'Test prompt',
          includePageTitle: false,
          includeSelectedText: true,
        },
      });
      
      const prompt = composePrompt(config, 'https://example.com');
      expect(prompt).not.toContain('Selected text:');
    });

    it('should not include selected text when only whitespace', () => {
      Object.defineProperty(global.window, 'getSelection', {
        writable: true,
        configurable: true,
        value: vi.fn(() => ({
          toString: () => '   \n\t  ', // Whitespace only - trim() will make it empty
        })),
      });

      const config = applyDefaults({
        mode: 'offline',
        content: {
          prompt: 'Test prompt',
          includePageTitle: false,
          includeSelectedText: true,
        },
      });
      
      const prompt = composePrompt(config, 'https://example.com');
      expect(prompt).not.toContain('Selected text:');
    });

    it('should not include selected text when too long (>1000 chars)', () => {
      const longText = 'a'.repeat(1001);
      Object.defineProperty(global.window, 'getSelection', {
        writable: true,
        configurable: true,
        value: vi.fn(() => ({
          toString: () => longText, // Long text - trim() will be called on this string
        })),
      });

      const config = applyDefaults({
        mode: 'offline',
        content: {
          prompt: 'Test prompt',
          includePageTitle: false,
          includeSelectedText: true,
        },
      });
      
      const prompt = composePrompt(config, 'https://example.com');
      expect(prompt).not.toContain('Selected text:');
    });

    it('should use default prompt when not specified', () => {
      const config = applyDefaults({
        mode: 'offline',
        content: {
          includePageTitle: false,
          includeSelectedText: false,
        },
      });
      
      const prompt = composePrompt(config, 'https://example.com');
      expect(prompt).toContain('Summarize this page and answer my question:');
      expect(prompt).toContain('https://example.com');
    });

    it('should handle empty page title gracefully', () => {
      Object.defineProperty(global.document, 'title', {
        writable: true,
        value: '',
      });
      
      const config = applyDefaults({
        mode: 'offline',
        content: {
          prompt: 'Test prompt',
          includePageTitle: true,
          includeSelectedText: false,
        },
      });
      
      const prompt = composePrompt(config, 'https://example.com');
      expect(prompt).not.toContain('Page:');
      expect(prompt).toContain('Test prompt');
      expect(prompt).toContain('https://example.com');
    });

    it('should format prompt with proper line breaks', () => {
      const config = applyDefaults({
        mode: 'offline',
        content: {
          prompt: 'Test prompt',
          includePageTitle: true,
          includeSelectedText: true,
        },
      });
      
      const prompt = composePrompt(config, 'https://example.com');
      // Should have double newlines between sections
      expect(prompt).toMatch(/\n\n/);
      const parts = prompt.split('\n\n');
      // Should have 4 parts: prompt, page title, selected text, URL
      expect(parts.length).toBe(4);
      expect(parts[0]).toBe('Test prompt');
      expect(parts[1]).toContain('Page: Test Page Title');
      expect(parts[2]).toContain('Selected text: Selected text content');
      expect(parts[3]).toContain('URL: https://example.com');
    });

    it('should handle null selection gracefully', () => {
      Object.defineProperty(global.window, 'getSelection', {
        writable: true,
        configurable: true,
        value: vi.fn(() => null), // getSelection returns null
      });

      const config = applyDefaults({
        mode: 'offline',
        content: {
          prompt: 'Test prompt',
          includePageTitle: false,
          includeSelectedText: true,
        },
      });
      
      const prompt = composePrompt(config, 'https://example.com');
      expect(prompt).not.toContain('Selected text:');
      expect(prompt).toContain('Test prompt');
      expect(prompt).toContain('https://example.com');
    });

    it('should handle empty prompt string', () => {
      const config = applyDefaults({
        mode: 'offline',
        content: {
          prompt: '', // Empty string should be treated as falsy
          includePageTitle: false,
          includeSelectedText: false,
        },
      });
      
      const prompt = composePrompt(config, 'https://example.com');
      // Empty prompt should not be included, only URL
      expect(prompt).not.toContain('Page:');
      expect(prompt).not.toContain('Selected text:');
      expect(prompt).toContain('URL: https://example.com');
      // Should start with URL (no prompt prefix)
      expect(prompt.trim()).toBe('URL: https://example.com');
    });

    it('should always include URL even when prompt is empty', () => {
      const config = applyDefaults({
        mode: 'offline',
        content: {
          prompt: '',
          includePageTitle: false,
          includeSelectedText: false,
        },
      });
      
      const prompt = composePrompt(config, 'https://example.com');
      expect(prompt).toBe('\n\nURL: https://example.com');
    });
  });
});

