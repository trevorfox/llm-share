import type { NormalizedLLMShareConfig } from '../config/types';
import type { EventTracker } from '../events/tracker';
import { injectStyles, getEffectiveTheme } from './styles';
import { createLLMButton } from './Button';
import { isBrowserSupported, isMobileDevice } from '../utils/browser';

/**
 * Widget container class
 */
export class Widget {
  private config: NormalizedLLMShareConfig;
  private tracker: EventTracker;
  private container: HTMLElement | null = null;
  private isInitialized = false;
  private isVisible = false;
  private showTextInitially = true;
  private scrollRafRef: number | null = null;
  private textContainer: HTMLElement | null = null;
  private scrollHandler: (() => void) | null = null;

  constructor(config: NormalizedLLMShareConfig, tracker: EventTracker) {
    this.config = config;
    this.tracker = tracker;
  }

  /**
   * Initialize and render widget
   */
  init(): void {
    if (this.isInitialized) {
      return;
    }

    // Check browser support
    if (!isBrowserSupported()) {
      if (this.config.debug.logToConsole) {
        console.warn('[LLMShare] Browser not supported');
      }
      return;
    }

    // Check if widget should be shown on this page
    if (!this.shouldShow()) {
      return;
    }

    // Inject styles
    injectStyles(this.config);

    // Create container
    this.container = this.createContainer();

    // Render LLM buttons
    this.renderButtons();

    // Append to DOM
    this.appendToDOM();

    // Setup scroll detection if enabled
    this.setupScrollDetection();

    // Track impression
    this.tracker.trackImpression();

    // Call onReady callback
    if (this.config.callbacks.onReady) {
      try {
        this.config.callbacks.onReady();
      } catch (error) {
        if (this.config.debug.logToConsole) {
          console.error('[LLMShare] Error in onReady callback:', error);
        }
      }
    }

    this.isInitialized = true;
  }

  /**
   * Check if widget should be shown on current page
   */
  private shouldShow(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    // Check mobile visibility flag
    if (!this.config.widget.showOnMobile && isMobileDevice()) {
      return false;
    }

    const pathPrefix = this.config.widget.showOn.pathPrefix;
    if (pathPrefix && pathPrefix !== '/') {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith(pathPrefix)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Create widget container element
   */
  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'llm-share-widget';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'AI assistant options');

    // Handle inline vs overlay mode
    if (this.config.widget.placement === 'inline' && this.config.widget.inlineSelector) {
      container.classList.add('inline');
      // Add alignment class
      const alignment = this.config.widget.inlineAlignment ?? 'left';
      container.classList.add(`align-${alignment}`);
      return container;
    }

    // Overlay mode - set position
    container.style.position = 'fixed';
    
    // Add placement class for CSS targeting
    container.classList.add(`placement-${this.config.widget.placement}`);
    
    if (this.config.widget.placement === 'center-right') {
      container.style.right = `${this.config.widget.offsetPx}px`;
      container.style.top = '50%';
      container.style.transform = 'translateY(-50%)';
    } else if (this.config.widget.placement === 'center-left') {
      container.style.left = `${this.config.widget.offsetPx}px`;
      container.style.top = '50%';
      container.style.transform = 'translateY(-50%)';
    } else if (this.config.widget.placement === 'bottom-right') {
      container.style.right = `${this.config.widget.offsetPx}px`;
      container.style.bottom = `${this.config.widget.offsetPx}px`;
    } else if (this.config.widget.placement === 'bottom-left') {
      container.style.left = `${this.config.widget.offsetPx}px`;
      container.style.bottom = `${this.config.widget.offsetPx}px`;
      // Add initial hidden state if scroll-based visibility is enabled
      if (this.config.widget.showOn?.showOnScroll) {
        container.classList.add('scroll-hidden');
      }
    }

    return container;
  }

  /**
   * Setup scroll detection for widget visibility
   */
  private setupScrollDetection(): void {
    if (!this.config.widget.showOn?.showOnScroll || !this.container) {
      return;
    }

    const scrollDistance = this.config.widget.showOn.scrollDistance ?? 200;

    this.scrollHandler = () => {
      if (this.scrollRafRef !== null) {
        cancelAnimationFrame(this.scrollRafRef);
      }

      this.scrollRafRef = requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const shouldBeVisible = scrollY > scrollDistance;
        
        if (shouldBeVisible !== this.isVisible) {
          this.isVisible = shouldBeVisible;
          if (this.container) {
            if (shouldBeVisible) {
              this.container.classList.remove('scroll-hidden');
              // Start text hide timer when widget becomes visible
              this.startTextHideTimer();
            } else {
              this.container.classList.add('scroll-hidden');
              this.showTextInitially = true; // Reset text visibility
              if (this.textContainer) {
                this.textContainer.classList.add('text-visible');
              }
            }
          }
        }
      });
    };

    // Initial check
    if (this.scrollHandler) {
      this.scrollHandler();
      // If widget is already visible after initial check, start timer
      if (this.isVisible && this.config.widget.textLabel?.enabled) {
        const textPosition = this.config.widget.textLabel?.position ?? 'right';
        const isHorizontal = textPosition === 'left' || textPosition === 'right';
        if (isHorizontal) {
          this.startTextHideTimer();
        }
      }
    }

    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  /**
   * Start timer to hide text label
   */
  private startTextHideTimer(): void {
    if (!this.config.widget.textLabel?.enabled) {
      return;
    }

    const hideDelay = this.config.widget.textLabel.hideDelay ?? 3000;
    
    setTimeout(() => {
      this.showTextInitially = false;
      if (this.textContainer) {
        this.textContainer.classList.remove('text-visible');
      }
    }, hideDelay);
  }

  /**
   * Create text label element
   */
  private createTextLabel(): HTMLElement | null {
    if (!this.config.widget.textLabel?.enabled) {
      return null;
    }

    const textLabel = this.config.widget.textLabel.text ?? 'Explore with AI';
    const textContainer = document.createElement('div');
    textContainer.className = 'llm-share-text-label';
    
    const textSpan = document.createElement('span');
    textSpan.textContent = textLabel;
    textContainer.appendChild(textSpan);

    // Measure text width and set CSS variable for smooth transition
    // Use canvas to measure text width accurately
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = '500 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif';
      const textWidth = Math.ceil(context.measureText(textLabel).width);
      textContainer.style.setProperty('--text-label-width', `${textWidth}px`);
    } else {
      // Fallback: create temporary span to measure
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.top = '-9999px';
      tempSpan.style.fontWeight = '500';
      tempSpan.style.fontSize = '14px';
      tempSpan.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.textContent = textLabel;
      document.body.appendChild(tempSpan);
      const textWidth = Math.ceil(tempSpan.offsetWidth);
      document.body.removeChild(tempSpan);
      textContainer.style.setProperty('--text-label-width', `${textWidth}px`);
    }
    textContainer.classList.add('text-visible');
    this.textContainer = textContainer;
    return textContainer;
  }

  /**
   * Render LLM buttons
   */
  private renderButtons(): void {
    if (!this.container) {
      return;
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'llm-share-widget-container';
    
    // Add style class for CSS targeting
    buttonContainer.classList.add(`style-${this.config.widget.style}`);
    
    // Add theme class for CSS targeting
    const theme = getEffectiveTheme(this.config);
    buttonContainer.classList.add(`theme-${theme}`);
    
    // Determine text position
    const textPosition = this.config.widget.textLabel?.position ?? 'right';
    const isHorizontal = textPosition === 'left' || textPosition === 'right';
    const isRight = textPosition === 'right';
    
    if (isHorizontal) {
      buttonContainer.classList.add('layout-horizontal');
      if (isRight) {
        buttonContainer.classList.add('text-right');
      }
    } else {
      buttonContainer.classList.add('layout-vertical');
    }

    // Create buttons wrapper
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.className = 'llm-share-buttons-wrapper';
    buttonsWrapper.setAttribute('role', 'group');
    buttonsWrapper.setAttribute('aria-label', 'AI assistant buttons');

    for (const llm of this.config.llms) {
      const button = createLLMButton(llm, this.config, this.tracker, buttonsWrapper);
      buttonsWrapper.appendChild(button);
    }

    // Add text label if enabled
    const textLabel = this.createTextLabel();
    
    if (textLabel && isHorizontal) {
      if (isRight) {
        // Text on the right - add after buttons
        buttonContainer.appendChild(buttonsWrapper);
        buttonContainer.appendChild(textLabel);
      } else {
        // Text on the left - add before buttons
        buttonContainer.appendChild(textLabel);
        buttonContainer.appendChild(buttonsWrapper);
      }
    } else if (textLabel && !isHorizontal) {
      // Vertical layout - text on top
      buttonContainer.appendChild(buttonsWrapper);
      buttonContainer.insertBefore(textLabel, buttonsWrapper);
    } else {
      // No text label
      buttonContainer.appendChild(buttonsWrapper);
    }

    this.container.appendChild(buttonContainer);

    // Setup hover for text expansion (only for horizontal layout)
    if (textLabel && this.config.widget.textLabel?.enabled && isHorizontal) {
      buttonContainer.addEventListener('mouseenter', () => {
        if (!this.showTextInitially && this.textContainer) {
          this.textContainer.classList.add('text-visible');
        }
      });

      buttonContainer.addEventListener('mouseleave', () => {
        if (!this.showTextInitially && this.textContainer) {
          this.textContainer.classList.remove('text-visible');
        }
      });
      
      // Start hide timer for horizontal layouts (only if widget is visible)
      // If scroll detection is enabled, the timer will start when widget becomes visible
      if (!this.config.widget.showOn?.showOnScroll || !this.container?.classList.contains('scroll-hidden')) {
        this.startTextHideTimer();
      }
    }
    
    this.container.appendChild(buttonContainer);
  }

  /**
   * Append widget to DOM
   */
  private appendToDOM(): void {
    if (!this.container || typeof document === 'undefined') {
      return;
    }

    // Inline mode - find target element
    if (this.config.widget.placement === 'inline' && this.config.widget.inlineSelector) {
      const target = document.querySelector(this.config.widget.inlineSelector);
      if (target) {
        // Add alignment class to parent container if it exists
        const alignment = this.config.widget.inlineAlignment ?? 'left';
        if (target instanceof HTMLElement) {
          target.classList.add(`align-${alignment}`);
        }
        target.appendChild(this.container);
        return;
      }
    }

    // Overlay mode - append to body
    document.body.appendChild(this.container);
  }

  /**
   * Destroy widget
   */
  destroy(): void {
    if (this.scrollRafRef !== null) {
      cancelAnimationFrame(this.scrollRafRef);
    }
    
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.textContainer = null;
    this.isInitialized = false;
    this.isVisible = false;
    this.showTextInitially = true;
  }
}

