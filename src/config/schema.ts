import type { LLMShareConfig, NormalizedLLMShareConfig } from './types';
import { applyDefaults } from './defaults';

/**
 * Validate and normalize config
 */
export function validateConfig(
  config: unknown
): NormalizedLLMShareConfig {
  // Basic type check
  if (!config || typeof config !== 'object') {
    throw new Error('LLMShare config must be an object');
  }

  const configObj = config as LLMShareConfig;

  // Validate mode if provided
  if (configObj.mode) {
    const validModes = ['hosted', 'self_hosted', 'offline'];
    if (!validModes.includes(configObj.mode)) {
      throw new Error(
        `Invalid mode: ${configObj.mode}. Must be one of: ${validModes.join(', ')}`
      );
    }
  }

  // Validate widget placement if provided
  if (configObj.widget?.placement) {
    const validPlacements = [
      'center-right',
      'center-left',
      'bottom-right',
      'bottom-left',
      'inline',
    ];
    if (!validPlacements.includes(configObj.widget.placement)) {
      throw new Error(
        `Invalid placement: ${configObj.widget.placement}. Must be one of: ${validPlacements.join(', ')}`
      );
    }
  }
  
  // Validate textLabel position if provided
  if (configObj.widget?.textLabel?.position) {
    const validPositions = ['left', 'right', 'top'];
    if (!validPositions.includes(configObj.widget.textLabel.position)) {
      throw new Error(
        `Invalid textLabel position: ${configObj.widget.textLabel.position}. Must be one of: ${validPositions.join(', ')}`
      );
    }
  }

  // Validate widget style if provided
  if (configObj.widget?.style) {
    const validStyles = ['pill', 'square', 'minimal', 'custom'];
    if (!validStyles.includes(configObj.widget.style)) {
      throw new Error(
        `Invalid style: ${configObj.widget.style}. Must be one of: ${validStyles.join(', ')}`
      );
    }
  }

  // Validate widget theme if provided
  if (configObj.widget?.theme) {
    const validThemes = ['auto', 'light', 'dark'];
    if (!validThemes.includes(configObj.widget.theme)) {
      throw new Error(
        `Invalid theme: ${configObj.widget.theme}. Must be one of: ${validThemes.join(', ')}`
      );
    }
  }

  // Validate action if provided
  if (configObj.action) {
    if (!['copy', 'link'].includes(configObj.action)) {
      throw new Error(`Invalid action: ${configObj.action}. Must be 'copy' or 'link'`);
    }
  }

  // Validate LLMs if provided
  if (configObj.llms) {
    if (!Array.isArray(configObj.llms)) {
      throw new Error('llms must be an array');
    }
    for (const llm of configObj.llms) {
      if (typeof llm !== 'string') {
        throw new Error('Each LLM must be a string (LLM name)');
      }
    }
  }

  // Apply defaults and return normalized config
  return applyDefaults(configObj);
}

/**
 * Get config from window.LLMShare
 */
export function getConfig(): NormalizedLLMShareConfig | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const windowWithConfig = window as typeof window & {
    LLMShare?: LLMShareConfig;
  };

  if (!windowWithConfig.LLMShare) {
    return null;
  }

  try {
    return validateConfig(windowWithConfig.LLMShare);
  } catch (error) {
    console.error('[LLMShare] Config validation error:', error);
    return null;
  }
}

