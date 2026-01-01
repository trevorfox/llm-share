const CHATGPT_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<title>OpenAI icon</title>
<path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill="currentColor"/>
</svg>`;
const CLAUDE_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<title>Claude</title>
<path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" fill="currentColor" fill-rule="evenodd"/>
</svg>`;
const GEMINI_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<title>Gemini</title>
<path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="currentColor" fill-rule="evenodd"/>
</svg>`;
const PERPLEXITY_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<title>Perplexity</title>
<path d="M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.188h2.884V0l7.053 6.494V.19h1.09v6.49L19.786 0zm-7.257 9.044v7.319l5.946 5.234V14.44l-5.946-5.397zm-1.099-.08l-5.946 5.398v7.235l5.946-5.234V8.965zm8.136 7.58h1.844V8.349H13.46l6.105 5.54v2.655zm-8.982-8.28H2.59v8.195h1.8v-2.576l6.192-5.62zM5.475 2.476v4.71h5.115l-5.115-4.71zm13.219 0l-5.115 4.71h5.115v-4.71z" fill="currentColor" fill-rule="evenodd"/>
</svg>`;
const COPY_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<title>Copy</title>
<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
</svg>`;
function getDefaultIcon(llmId) {
  const icons = {
    chatgpt: CHATGPT_ICON,
    claude: CLAUDE_ICON,
    gemini: GEMINI_ICON,
    perplexity: PERPLEXITY_ICON,
    copy: COPY_ICON
  };
  return icons[llmId.toLowerCase()];
}
const LLM_METADATA = {
  chatgpt: {
    label: "ChatGPT",
    iconSvg: CHATGPT_ICON,
    urlTemplate: "https://chat.openai.com/?q={prompt}"
  },
  claude: {
    label: "Claude",
    iconSvg: CLAUDE_ICON,
    urlTemplate: "https://claude.ai/new?q={prompt}"
  },
  gemini: {
    label: "Gemini",
    iconSvg: GEMINI_ICON,
    urlTemplate: "https://aistudio.google.com/prompts/new_chat?prompt={prompt}"
  },
  perplexity: {
    label: "Perplexity",
    iconSvg: PERPLEXITY_ICON,
    urlTemplate: "https://www.perplexity.ai/search?q={prompt}"
  },
  copy: {
    label: "Copy",
    iconSvg: COPY_ICON
  }
};
const DEFAULT_LLM_NAMES = ["chatgpt", "claude", "perplexity", "copy"];
function expandLLMs(llmNames, action) {
  return llmNames.map((name) => {
    const normalizedName = name.toLowerCase();
    const metadata = LLM_METADATA[normalizedName];
    const llmAction = normalizedName === "copy" ? "copy" : action;
    if (!metadata) {
      return {
        id: normalizedName,
        label: name.charAt(0).toUpperCase() + name.slice(1),
        action: llmAction
      };
    }
    return {
      id: normalizedName,
      label: metadata.label,
      action: llmAction,
      iconSvg: metadata.iconSvg,
      // Include URL template when action is 'link'
      urlTemplate: llmAction === "link" ? metadata.urlTemplate : void 0
    };
  });
}
function detectMode(config) {
  if (config.mode) {
    return config.mode;
  }
  if (config.siteId || config.publicKey) {
    return "hosted";
  }
  return "standalone";
}
function getDefaultEndpoints(mode) {
  if (mode === "hosted") {
    return {
      collector: "https://c.getsourced.ai/v1/events",
      share: "https://c.getsourced.ai/v1/share",
      redirectBase: "https://t.getsourced.ai/s/"
    };
  }
  return {
    collector: null,
    share: null,
    redirectBase: null
  };
}
function applyDefaults(config) {
  const mode = detectMode(config);
  const defaultEndpoints = getDefaultEndpoints(mode);
  const action = config.action ?? "link";
  const llmNames = config.llms && config.llms.length > 0 ? config.llms : DEFAULT_LLM_NAMES;
  const llms = expandLLMs(llmNames, action);
  return {
    version: config.version || "1",
    siteId: config.siteId ?? null,
    publicKey: config.publicKey ?? null,
    mode,
    endpoints: {
      collector: config.endpoints?.collector ?? defaultEndpoints.collector ?? null,
      share: config.endpoints?.share ?? defaultEndpoints.share ?? null,
      redirectBase: config.endpoints?.redirectBase ?? defaultEndpoints.redirectBase ?? null
    },
    widget: {
      placement: config.widget?.placement ?? "bottom-left",
      style: config.widget?.style ?? "minimal",
      theme: config.widget?.theme ?? "auto",
      zIndex: config.widget?.zIndex ?? 9999,
      offsetPx: config.widget?.offsetPx ?? 16,
      backgroundOpacity: config.widget?.backgroundOpacity ?? 0.5,
      inlineSelector: config.widget?.inlineSelector ?? null,
      inlineAlignment: config.widget?.inlineAlignment ?? "left",
      showOnMobile: config.widget?.showOnMobile ?? true,
      showOn: {
        pathPrefix: config.widget?.showOn?.pathPrefix ?? "/",
        scrollDistance: config.widget?.showOn?.scrollDistance ?? 200,
        showOnScroll: config.widget?.showOn?.showOnScroll ?? false
      },
      textLabel: {
        enabled: config.widget?.textLabel?.enabled ?? false,
        text: config.widget?.textLabel?.text ?? "Explore with AI",
        position: config.widget?.textLabel?.position ?? "top",
        hideDelay: config.widget?.textLabel?.hideDelay ?? 3e3
      }
    },
    content: {
      prompt: config.content?.prompt ?? "Summarize this page and answer my question:",
      includePageTitle: config.content?.includePageTitle ?? true,
      includeSelectedText: config.content?.includeSelectedText ?? true
    },
    llms,
    tracking: {
      enabled: config.tracking?.enabled ?? mode !== "standalone",
      batch: config.tracking?.batch ?? true,
      flushIntervalMs: config.tracking?.flushIntervalMs ?? 8e3,
      respectDNT: config.tracking?.respectDNT ?? true,
      pushToDataLayer: config.tracking?.pushToDataLayer ?? false,
      dataLayerName: config.tracking?.dataLayerName ?? "dataLayer"
    },
    callbacks: {
      onEvent: config.callbacks?.onEvent ?? null,
      onReady: config.callbacks?.onReady ?? null
    },
    debug: {
      logToConsole: config.debug?.logToConsole ?? false
    }
  };
}
function validateConfig(config) {
  if (!config || typeof config !== "object") {
    throw new Error("LLMShare config must be an object");
  }
  const configObj = config;
  if (configObj.mode) {
    const validModes = ["hosted", "self_hosted", "standalone"];
    if (!validModes.includes(configObj.mode)) {
      throw new Error(
        `Invalid mode: ${configObj.mode}. Must be one of: ${validModes.join(", ")}`
      );
    }
  }
  if (configObj.widget?.placement) {
    const validPlacements = [
      "center-right",
      "center-left",
      "bottom-right",
      "bottom-left",
      "inline"
    ];
    if (!validPlacements.includes(configObj.widget.placement)) {
      throw new Error(
        `Invalid placement: ${configObj.widget.placement}. Must be one of: ${validPlacements.join(", ")}`
      );
    }
  }
  if (configObj.widget?.textLabel?.position) {
    const validPositions = ["left", "right", "top"];
    if (!validPositions.includes(configObj.widget.textLabel.position)) {
      throw new Error(
        `Invalid textLabel position: ${configObj.widget.textLabel.position}. Must be one of: ${validPositions.join(", ")}`
      );
    }
  }
  if (configObj.widget?.style) {
    const validStyles = ["pill", "square", "minimal", "custom"];
    if (!validStyles.includes(configObj.widget.style)) {
      throw new Error(
        `Invalid style: ${configObj.widget.style}. Must be one of: ${validStyles.join(", ")}`
      );
    }
  }
  if (configObj.widget?.theme) {
    const validThemes = ["auto", "light", "dark"];
    if (!validThemes.includes(configObj.widget.theme)) {
      throw new Error(
        `Invalid theme: ${configObj.widget.theme}. Must be one of: ${validThemes.join(", ")}`
      );
    }
  }
  if (configObj.action) {
    if (!["copy", "link"].includes(configObj.action)) {
      throw new Error(`Invalid action: ${configObj.action}. Must be 'copy' or 'link'`);
    }
  }
  if (configObj.llms) {
    if (!Array.isArray(configObj.llms)) {
      throw new Error("llms must be an array");
    }
    for (const llm of configObj.llms) {
      if (typeof llm !== "string") {
        throw new Error("Each LLM must be a string (LLM name)");
      }
    }
  }
  return applyDefaults(configObj);
}
function getConfig() {
  if (typeof window === "undefined") {
    return null;
  }
  const windowWithConfig = window;
  if (!windowWithConfig.LLMShare) {
    return null;
  }
  try {
    return validateConfig(windowWithConfig.LLMShare);
  } catch (error) {
    console.error("[LLMShare] Config validation error:", error);
    return null;
  }
}
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
class EventTracker {
  constructor(config) {
    this.eventQueue = [];
    this.flushTimer = null;
    this.unloadHandler = null;
    this.config = config;
    this.viewId = generateUUID();
    this.setupUnloadHandler();
  }
  /**
   * Collect browser attribution data
   */
  getAttributionData() {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return {};
    }
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return {
        referrer: document.referrer || void 0,
        language: navigator.language || void 0,
        timezone: timezone || void 0,
        screen_width: window.screen?.width || void 0,
        screen_height: window.screen?.height || void 0,
        viewport_width: window.innerWidth || void 0,
        viewport_height: window.innerHeight || void 0
      };
    } catch (error) {
      return {};
    }
  }
  /**
   * Create base event object
   */
  createBaseEvent(eventType) {
    return {
      event_id: generateUUID(),
      ts: (/* @__PURE__ */ new Date()).toISOString(),
      event_type: eventType,
      site_id: this.config.siteId || null,
      page_url: typeof window !== "undefined" ? window.location.href : "",
      view_id: this.viewId,
      mode: this.config.mode,
      ...this.getAttributionData()
    };
  }
  /**
   * Push event to dataLayer if enabled
   */
  pushToDataLayer(event) {
    if (!this.config.tracking.pushToDataLayer || typeof window === "undefined") {
      return;
    }
    try {
      const dataLayerName = this.config.tracking.dataLayerName;
      const windowWithDataLayer = window;
      if (!windowWithDataLayer[dataLayerName]) {
        windowWithDataLayer[dataLayerName] = [];
      }
      windowWithDataLayer[dataLayerName].push(event);
    } catch (error) {
      if (this.config.debug.logToConsole) {
        console.error("[LLMShare] Error pushing to dataLayer:", error);
      }
    }
  }
  /**
   * Emit an event
   */
  emit(event) {
    if (this.config.callbacks.onEvent) {
      try {
        this.config.callbacks.onEvent(event);
      } catch (error) {
        if (this.config.debug.logToConsole) {
          console.error("[LLMShare] Error in onEvent callback:", error);
        }
      }
    }
    this.pushToDataLayer(event);
    if (this.config.debug.logToConsole) {
      console.log("[LLMShare] Event:", event);
    }
    if (this.config.tracking.enabled && this.config.endpoints.collector) {
      this.eventQueue.push(event);
      this.scheduleFlush();
    }
  }
  /**
   * Track impression (widget rendered)
   */
  trackImpression() {
    const event = {
      ...this.createBaseEvent("impression")
    };
    this.emit(event);
  }
  /**
   * Track click (LLM button clicked)
   */
  trackClick(llmId) {
    const event = {
      ...this.createBaseEvent("click"),
      llm_id: llmId
    };
    this.emit(event);
  }
  /**
   * Track share created (share endpoint returned token/url)
   */
  trackShareCreated(llmId, shareUrl, shareToken) {
    const event = {
      ...this.createBaseEvent("share_created"),
      llm_id: llmId,
      share_url: shareUrl,
      share_token: shareToken
    };
    this.emit(event);
  }
  /**
   * Track fallback to raw URL (share failed)
   */
  trackFallbackRawUrl(llmId, rawUrl) {
    const event = {
      ...this.createBaseEvent("fallback_raw_url"),
      llm_id: llmId,
      raw_url: rawUrl
    };
    this.emit(event);
  }
  /**
   * Track error (non-fatal issues)
   */
  trackError(errorMessage, errorType) {
    const event = {
      ...this.createBaseEvent("error"),
      error_message: errorMessage,
      error_type: errorType
    };
    this.emit(event);
  }
  /**
   * Schedule flush of event queue
   */
  scheduleFlush() {
    if (this.flushTimer !== null) {
      return;
    }
    if (this.config.tracking.batch) {
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(() => {
          this.flushTimer = null;
          this.flush();
        });
      } else {
        this.flushTimer = window.setTimeout(() => {
          this.flushTimer = null;
          this.flush();
        }, this.config.tracking.flushIntervalMs);
      }
    } else {
      this.flush();
    }
  }
  /**
   * Flush event queue to collector endpoint
   */
  async flush() {
    if (this.eventQueue.length === 0) {
      return;
    }
    if (this.config.tracking.respectDNT && typeof navigator !== "undefined" && navigator.doNotTrack === "1") {
      this.eventQueue = [];
      return;
    }
    const events = [...this.eventQueue];
    this.eventQueue = [];
    if (!this.config.endpoints.collector) {
      return;
    }
    try {
      const response = await fetch(this.config.endpoints.collector, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          events,
          site_id: this.config.siteId,
          public_key: this.config.publicKey
        }),
        keepalive: true
        // Ensure request completes even if page unloads
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      if (this.config.debug.logToConsole) {
        console.error("[LLMShare] Failed to send events:", error);
      }
      if (this.eventQueue.length < 100) {
        this.eventQueue.unshift(...events);
      }
    }
  }
  /**
   * Setup unload handler to flush events on page unload
   */
  setupUnloadHandler() {
    if (typeof window === "undefined") {
      return;
    }
    this.unloadHandler = () => {
      if (this.eventQueue.length > 0) {
        if (typeof navigator !== "undefined" && navigator.sendBeacon && this.config.endpoints.collector) {
          const payload = JSON.stringify({
            events: this.eventQueue,
            site_id: this.config.siteId,
            public_key: this.config.publicKey
          });
          navigator.sendBeacon(
            this.config.endpoints.collector,
            new Blob([payload], { type: "application/json" })
          );
        } else {
          const xhr = new XMLHttpRequest();
          xhr.open(
            "POST",
            this.config.endpoints.collector || "",
            false
          );
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(
            JSON.stringify({
              events: this.eventQueue,
              site_id: this.config.siteId,
              public_key: this.config.publicKey
            })
          );
        }
      }
    };
    window.addEventListener("beforeunload", this.unloadHandler);
    window.addEventListener("pagehide", this.unloadHandler);
  }
  /**
   * Cleanup
   */
  destroy() {
    this.flush();
    if (this.unloadHandler && typeof window !== "undefined") {
      window.removeEventListener("beforeunload", this.unloadHandler);
      window.removeEventListener("pagehide", this.unloadHandler);
    }
    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }
}
function isBrowserSupported() {
  if (typeof window === "undefined") {
    return false;
  }
  if (typeof fetch === "undefined" || typeof Promise === "undefined" || typeof document === "undefined") {
    return false;
  }
  return true;
}
function getPreferredColorScheme() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "light";
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}
function isClipboardAPIAvailable() {
  return typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined" && typeof navigator.clipboard.writeText === "function";
}
function isMobileDevice() {
  if (typeof window === "undefined") {
    return false;
  }
  const isSmallScreen = window.innerWidth <= 768;
  const userAgent = navigator.userAgent || navigator.vendor || (typeof window !== "undefined" && "opera" in window ? String(window.opera) : "");
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  return isSmallScreen || isMobileUA;
}
function getEffectiveTheme(config) {
  if (config.widget.theme === "auto") {
    return getPreferredColorScheme();
  }
  return config.widget.theme;
}
function generateStyles(config) {
  const theme = getEffectiveTheme(config);
  const isDark = theme === "dark";
  const opacity = config.widget.backgroundOpacity ?? 1;
  let borderRadius = "8px";
  const padding = "8px 16px";
  if (config.widget.style === "pill") {
    borderRadius = "24px";
  } else if (config.widget.style === "square") {
    borderRadius = "0px";
  } else if (config.widget.style === "minimal") {
    borderRadius = "4px";
  }
  const backgroundDark = isDark ? "#000000" : `rgba(0, 0, 0, ${opacity})`;
  const backgroundLight = `rgba(255, 255, 255, ${opacity})`;
  const backgroundRight = isDark ? "#000000" : `rgba(255, 255, 255, ${opacity})`;
  return `
    .llm-share-widget {
      position: fixed;
      z-index: ${config.widget.zIndex};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      box-sizing: border-box;
      transition: transform 0.3s ease-out;
    }
    
    .llm-share-widget.scroll-hidden {
      transform: translateY(100%);
    }
    
    .llm-share-widget-container {
      display: flex;
      align-items: center;
      gap: 12px;
      background: ${isDark ? backgroundDark : backgroundLight};
      border: 1px solid ${isDark ? "#999" : "#e5e5e5"};
      border-radius: ${borderRadius};
      padding: ${padding};
      box-shadow: 0 4px 12px rgba(0, 0, 0, ${isDark ? "0.5" : "0.15"});
      transition: all 0.3s ease-out;
      width: fit-content;
      min-height: 40px;
    }
    
    /* Square style: more prominent with stronger border and shadow */
    .llm-share-widget-container.style-square {
      border: 2px solid ${isDark ? "#666" : "#ccc"} !important;
      border-radius: 0px !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, ${isDark ? "0.6" : "0.2"}) !important;
    }
    
    /* Minimal style: more subtle with lighter border and less shadow */
    .llm-share-widget-container.style-minimal {
      border: 1px solid ${isDark ? "#333" : "#e0e0e0"} !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, ${isDark ? "0.3" : "0.1"}) !important;
    }
    
    /* When text label is on the right, respect theme */
    .llm-share-widget-container.text-right {
      background: ${backgroundRight};
      border: 1px solid ${isDark ? "#333" : "#e5e5e5"};
    }
    
    /* Ensure style classes override text-right border */
    .llm-share-widget-container.text-right.style-square {
      border: 2px solid ${isDark ? "#666" : "#ccc"} !important;
    }
    
    .llm-share-widget-container.text-right.style-minimal {
      border: 1px solid ${isDark ? "#333" : "#e0e0e0"} !important;
    }
    
    .llm-share-widget-container.layout-horizontal {
      flex-direction: row;
    }
    
    .llm-share-widget-container.layout-vertical {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .llm-share-text-label {
      overflow: hidden;
      transition: width 0.3s ease-out, opacity 0.3s ease-out;
      width: 0;
      opacity: 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 24px;
      margin: 0;
      padding: 0;
      white-space: nowrap;
    }
    
    .llm-share-text-label.text-visible {
      width: var(--text-label-width, 150px);
      opacity: 1;
    }
    
    .llm-share-widget-container.layout-vertical .llm-share-text-label {
      width: auto;
      opacity: 1;
      transition: opacity 0.3s ease-out;
      height: auto;
    }
    
    .llm-share-widget-container.layout-vertical .llm-share-text-label.text-visible {
      width: auto;
    }
    
    .llm-share-text-label span {
      font-weight: 500;
      font-size: 14px;
      color: ${isDark ? "#999" : "#1a1a1a"};
      white-space: nowrap;
      display: block;
      line-height: 1;
      margin: 0;
      padding: 0;
      text-indent: 0;
    }
    
    /* Text color when text label is on the right - respects theme */
    .llm-share-widget-container.text-right.theme-light .llm-share-text-label span {
      color: #1a1a1a;
    }
    .llm-share-widget-container.text-right.theme-dark .llm-share-text-label span {
      color: #999;
    }
    
    /* Light theme: black icons and text */
    .llm-share-widget-container.theme-light .llm-share-icon {
      color: #1a1a1a !important;
    }
    
    .llm-share-widget-container.theme-light .llm-share-text-label span {
      color: #1a1a1a !important;
    }
    
    /* Dark theme: white icons and gray text */
    .llm-share-widget-container.theme-dark .llm-share-icon {
      color: #ffffff !important;
    }
    
    .llm-share-widget-container.theme-dark .llm-share-text-label span {
      color: #999 !important;
    }
    
    .llm-share-buttons-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
      height: 24px;
      margin: 0;
      padding: 0;
    }
    
    .llm-share-widget.inline {
      position: static;
      display: inline-block;
      width: fit-content;
      vertical-align: top;
      margin: 0;
      padding: 0;
      line-height: 0;
    }
    
    .llm-share-widget.inline.align-left {
      margin-right: auto;
    }
    
    .llm-share-widget.inline.align-center {
      margin-left: auto;
      margin-right: auto;
      display: block;
    }
    
    .llm-share-widget.inline.align-right {
      margin-left: auto;
      display: block;
    }
    
    /* Ensure inline widget containers have symmetric vertical spacing */
    .llm-share-widget.inline .llm-share-widget-container {
      width: fit-content;
      margin: 0;
      vertical-align: top;
      min-height: auto;
      display: inline-flex;
    }
    
    .llm-share-widget-container {
      width: fit-content;
    }
    
    .llm-share-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: opacity 0.3s ease;
      text-decoration: none;
      line-height: 0;
      width: 24px;
      height: 24px;
      box-sizing: border-box;
    }
    
    .llm-share-button:hover {
      opacity: 0.8;
    }
    
    .llm-share-button:active {
      transform: scale(0.95);
    }
    
    /* Only show focus outline for keyboard navigation (not mouse clicks) */
    .llm-share-button:focus {
      outline: none;
    }
    
    /* Enhanced focus styles for keyboard navigation (WCAG AA compliant) */
    .llm-share-button:focus-visible {
      outline: 3px solid ${isDark ? "#60a5fa" : "#0052cc"};
      outline-offset: 3px;
      border-radius: 4px;
      box-shadow: 0 0 0 1px ${isDark ? "rgba(96, 165, 250, 0.3)" : "rgba(0, 82, 204, 0.3)"};
    }
    
    .llm-share-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${isDark ? "#ffffff" : "#1a1a1a"};
      line-height: 0;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    /* Black icons when text label is on the right */
    .llm-share-widget-container.text-right .llm-share-icon {
      color: #1a1a1a;
    }
    
    .llm-share-icon svg {
      width: 100%;
      height: 100%;
      display: block;
      margin: 0;
      padding: 0;
      flex-shrink: 0;
    }
    
    .llm-share-icon img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
      margin: 0;
      padding: 0;
      flex-shrink: 0;
    }
    
    .llm-share-label {
      flex: 1;
    }
    
    @media (max-width: 768px) {
      .llm-share-icon {
        width: 20px;
        height: 20px;
      }
      
      .llm-share-button {
        width: 20px;
        height: 20px;
        min-width: 44px;
        min-height: 44px;
        padding: 12px;
      }
      
      .llm-share-buttons-wrapper {
        gap: 12px;
      }
      
      .llm-share-widget-container {
        padding: 10px 12px;
        min-height: 44px;
      }
      
      /* Adjust offset for mobile bottom placements to prevent overlap with browser UI */
      .llm-share-widget.placement-bottom-left:not(.inline),
      .llm-share-widget.placement-bottom-right:not(.inline) {
        bottom: max(env(safe-area-inset-bottom, 0px), 16px) !important;
      }
      
      /* Adjust horizontal positioning for mobile */
      .llm-share-widget.placement-bottom-left:not(.inline),
      .llm-share-widget.placement-center-left:not(.inline) {
        left: max(env(safe-area-inset-left, 0px), 12px) !important;
      }
      
      .llm-share-widget.placement-bottom-right:not(.inline),
      .llm-share-widget.placement-center-right:not(.inline) {
        right: max(env(safe-area-inset-right, 0px), 12px) !important;
      }
      
      /* Ensure text label is readable on mobile */
      .llm-share-text-label span {
        font-size: 13px;
      }
      
      /* Stack vertically on very small screens if horizontal layout */
      @media (max-width: 480px) {
        .llm-share-widget-container.layout-horizontal {
          flex-wrap: wrap;
        }
        
        .llm-share-widget-container {
          padding: 8px 10px;
        }
        
        .llm-share-buttons-wrapper {
          gap: 10px;
        }
      }
    }
  `;
}
function injectStyles(config) {
  if (typeof document === "undefined") {
    return;
  }
  const styleId = "llm-share-widget-styles";
  const existing = document.getElementById(styleId);
  if (existing) {
    existing.remove();
  }
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = generateStyles(config);
  document.head.appendChild(style);
}
async function copyToClipboard(text) {
  if (typeof navigator === "undefined") {
    return false;
  }
  if (isClipboardAPIAvailable()) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
    }
  }
  if (typeof document !== "undefined") {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    } catch (error) {
      return false;
    }
  }
  return false;
}
function composePrompt(config, url) {
  const parts = [];
  if (config.content.prompt) {
    parts.push(config.content.prompt);
  }
  if (config.content.includePageTitle && typeof document !== "undefined") {
    const title = document.title || "";
    if (title) {
      parts.push(`

Page: ${title}`);
    }
  }
  if (config.content.includeSelectedText && typeof window !== "undefined" && window.getSelection) {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      if (selectedText.length > 0 && selectedText.length < 1e3) {
        parts.push(`

Selected text: ${selectedText}`);
      }
    }
  }
  parts.push(`

URL: ${url}`);
  return parts.join("");
}
async function createShareUrl(url, shareEndpoint, siteId, publicKey) {
  try {
    const response = await fetch(shareEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url,
        site_id: siteId,
        public_key: publicKey
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.token && data.redirect_base) {
      return `${data.redirect_base}${data.token}`;
    } else if (data.url) {
      return data.url;
    } else if (data.share_url) {
      return data.share_url;
    }
    return null;
  } catch (error) {
    return null;
  }
}
function createLLMButton(llm, config, tracker, _container) {
  const element = llm.action === "link" && llm.urlTemplate ? document.createElement("a") : document.createElement("button");
  element.className = "llm-share-button";
  const ariaLabel = llm.action === "copy" ? `Copy page content to ${llm.label}` : `Open current page in ${llm.label} to ask questions`;
  element.setAttribute("aria-label", ariaLabel);
  if (element instanceof HTMLButtonElement) {
    element.setAttribute("type", "button");
  } else if (element instanceof HTMLAnchorElement) {
    element.setAttribute("rel", "noopener noreferrer");
    element.setAttribute("target", "_blank");
    element.setAttribute("title", llm.label);
  }
  if (llm.iconSvg) {
    const iconContainer = document.createElement("span");
    iconContainer.className = "llm-share-icon";
    iconContainer.setAttribute("aria-hidden", "true");
    iconContainer.innerHTML = llm.iconSvg;
    element.appendChild(iconContainer);
  } else if (llm.iconUrl) {
    const icon = document.createElement("img");
    icon.className = "llm-share-icon";
    icon.src = llm.iconUrl;
    icon.alt = `${llm.label} icon`;
    element.appendChild(icon);
  }
  if (llm.action === "link" && llm.urlTemplate && element instanceof HTMLAnchorElement) {
    const url = generateLLMUrl(llm);
    if (config.debug.logToConsole) {
      console.log(`[LLMShare] Generated URL for ${llm.id}:`, url);
    }
    if (url) {
      element.href = url;
      element.addEventListener("click", (e) => {
        tracker.trackClick(llm.id);
        e.preventDefault();
        const opened = window.open(url, "_blank", "noopener,noreferrer");
        if (!opened && config.debug.logToConsole) {
          console.warn(`[LLMShare] Failed to open ${llm.id} link - popup may be blocked`);
        }
      });
    } else {
      const button = document.createElement("button");
      button.className = element.className;
      button.setAttribute("type", "button");
      button.setAttribute("aria-label", element.getAttribute("aria-label") || `Open current page in ${llm.label} to ask questions`);
      while (element.firstChild) {
        button.appendChild(element.firstChild);
      }
      if (element.parentNode) {
        element.parentNode.replaceChild(button, element);
      }
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        await handleLLMClick(llm, config, tracker, button);
      });
      return button;
    }
  } else {
    element.addEventListener("click", async (e) => {
      e.preventDefault();
      await handleLLMClick(llm, config, tracker, element);
    });
  }
  return element;
}
function generateLLMUrl(llm, _config) {
  if (!llm.urlTemplate) {
    return null;
  }
  const currentUrl = window.location.href;
  const path = window.location.pathname || "/";
  const prompt = encodeURIComponent(
    `Provide a detailed summary of ${currentUrl} so I can ask questions about it`
  );
  let url = llm.urlTemplate;
  if (url.includes("{url}")) {
    url = url.replace("{url}", encodeURIComponent(currentUrl));
  }
  if (url.includes("{prompt}")) {
    url = url.replace("{prompt}", prompt);
  }
  if (url.includes("{path}")) {
    url = url.replace("{path}", encodeURIComponent(path));
  }
  return url;
}
function getLiveRegion() {
  let liveRegion = document.getElementById("llm-share-live-region");
  if (!liveRegion) {
    liveRegion = document.createElement("div");
    liveRegion.id = "llm-share-live-region";
    liveRegion.setAttribute("role", "status");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "llm-share-live-region";
    liveRegion.style.position = "absolute";
    liveRegion.style.left = "-10000px";
    liveRegion.style.width = "1px";
    liveRegion.style.height = "1px";
    liveRegion.style.overflow = "hidden";
    document.body.appendChild(liveRegion);
  }
  return liveRegion;
}
function announceToScreenReader(message) {
  const liveRegion = getLiveRegion();
  liveRegion.textContent = message;
  setTimeout(() => {
    liveRegion.textContent = "";
  }, 1e3);
}
async function handleLLMClick(llm, config, tracker, buttonElement) {
  tracker.trackClick(llm.id);
  const currentUrl = window.location.href;
  if (llm.action === "copy") {
    let finalUrl = currentUrl;
    if (config.endpoints.share) {
      try {
        const shareUrl = await createShareUrl(
          currentUrl,
          config.endpoints.share,
          config.siteId,
          config.publicKey
        );
        if (shareUrl) {
          finalUrl = shareUrl;
          tracker.trackShareCreated(llm.id, shareUrl);
        } else {
          tracker.trackFallbackRawUrl(llm.id, currentUrl);
        }
      } catch (error) {
        tracker.trackFallbackRawUrl(llm.id, currentUrl);
      }
    }
    const prompt = composePrompt(config, finalUrl);
    const success = await copyToClipboard(prompt);
    if (success) {
      announceToScreenReader(`Content copied to clipboard for ${llm.label}`);
      if (buttonElement && typeof buttonElement.focus === "function") {
        setTimeout(() => {
          buttonElement.focus();
        }, 100);
      }
      if (config.debug.logToConsole) {
        console.log("[LLMShare] Copied to clipboard:", prompt);
      }
    } else {
      announceToScreenReader(`Failed to copy content to clipboard for ${llm.label}`);
      tracker.trackError("Failed to copy to clipboard", "clipboard_error");
      if (config.debug.logToConsole) {
        console.error("[LLMShare] Failed to copy to clipboard");
      }
    }
  } else if (llm.action === "link" && llm.urlTemplate) {
    const url = generateLLMUrl(llm);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }
}
class Widget {
  constructor(config, tracker) {
    this.container = null;
    this.isInitialized = false;
    this.isVisible = false;
    this.showTextInitially = true;
    this.scrollRafRef = null;
    this.textContainer = null;
    this.scrollHandler = null;
    this.config = config;
    this.tracker = tracker;
  }
  /**
   * Initialize and render widget
   */
  init() {
    if (this.isInitialized) {
      return;
    }
    if (!isBrowserSupported()) {
      if (this.config.debug.logToConsole) {
        console.warn("[LLMShare] Browser not supported");
      }
      return;
    }
    if (!this.shouldShow()) {
      return;
    }
    injectStyles(this.config);
    this.container = this.createContainer();
    this.renderButtons();
    this.appendToDOM();
    this.setupScrollDetection();
    this.tracker.trackImpression();
    if (this.config.callbacks.onReady) {
      try {
        this.config.callbacks.onReady();
      } catch (error) {
        if (this.config.debug.logToConsole) {
          console.error("[LLMShare] Error in onReady callback:", error);
        }
      }
    }
    this.isInitialized = true;
  }
  /**
   * Check if widget should be shown on current page
   */
  shouldShow() {
    if (typeof window === "undefined") {
      return false;
    }
    if (!this.config.widget.showOnMobile && isMobileDevice()) {
      return false;
    }
    const pathPrefix = this.config.widget.showOn.pathPrefix;
    if (pathPrefix && pathPrefix !== "/") {
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
  createContainer() {
    const container = document.createElement("div");
    container.className = "llm-share-widget";
    container.setAttribute("role", "region");
    container.setAttribute("aria-label", "AI assistant options");
    if (this.config.widget.placement === "inline" && this.config.widget.inlineSelector) {
      container.classList.add("inline");
      const alignment = this.config.widget.inlineAlignment ?? "left";
      container.classList.add(`align-${alignment}`);
      return container;
    }
    container.style.position = "fixed";
    container.classList.add(`placement-${this.config.widget.placement}`);
    if (this.config.widget.placement === "center-right") {
      container.style.right = `${this.config.widget.offsetPx}px`;
      container.style.top = "50%";
      container.style.transform = "translateY(-50%)";
    } else if (this.config.widget.placement === "center-left") {
      container.style.left = `${this.config.widget.offsetPx}px`;
      container.style.top = "50%";
      container.style.transform = "translateY(-50%)";
    } else if (this.config.widget.placement === "bottom-right") {
      container.style.right = `${this.config.widget.offsetPx}px`;
      container.style.bottom = `${this.config.widget.offsetPx}px`;
    } else if (this.config.widget.placement === "bottom-left") {
      container.style.left = `${this.config.widget.offsetPx}px`;
      container.style.bottom = `${this.config.widget.offsetPx}px`;
      if (this.config.widget.showOn?.showOnScroll) {
        container.classList.add("scroll-hidden");
      }
    }
    return container;
  }
  /**
   * Setup scroll detection for widget visibility
   */
  setupScrollDetection() {
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
              this.container.classList.remove("scroll-hidden");
              this.startTextHideTimer();
            } else {
              this.container.classList.add("scroll-hidden");
              this.showTextInitially = true;
              if (this.textContainer) {
                this.textContainer.classList.add("text-visible");
              }
            }
          }
        }
      });
    };
    if (this.scrollHandler) {
      this.scrollHandler();
      if (this.isVisible && this.config.widget.textLabel?.enabled) {
        const textPosition = this.config.widget.textLabel?.position ?? "right";
        const isHorizontal = textPosition === "left" || textPosition === "right";
        if (isHorizontal) {
          this.startTextHideTimer();
        }
      }
    }
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
  }
  /**
   * Start timer to hide text label
   */
  startTextHideTimer() {
    if (!this.config.widget.textLabel?.enabled) {
      return;
    }
    const hideDelay = this.config.widget.textLabel.hideDelay ?? 3e3;
    setTimeout(() => {
      this.showTextInitially = false;
      if (this.textContainer) {
        this.textContainer.classList.remove("text-visible");
      }
    }, hideDelay);
  }
  /**
   * Create text label element
   */
  createTextLabel() {
    if (!this.config.widget.textLabel?.enabled) {
      return null;
    }
    const textLabel = this.config.widget.textLabel.text ?? "Explore with AI";
    const textContainer = document.createElement("div");
    textContainer.className = "llm-share-text-label";
    const textSpan = document.createElement("span");
    textSpan.textContent = textLabel;
    textContainer.appendChild(textSpan);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.font = '500 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif';
      const textWidth = Math.ceil(context.measureText(textLabel).width);
      textContainer.style.setProperty("--text-label-width", `${textWidth}px`);
    } else {
      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.style.top = "-9999px";
      tempSpan.style.fontWeight = "500";
      tempSpan.style.fontSize = "14px";
      tempSpan.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif';
      tempSpan.style.whiteSpace = "nowrap";
      tempSpan.textContent = textLabel;
      document.body.appendChild(tempSpan);
      const textWidth = Math.ceil(tempSpan.offsetWidth);
      document.body.removeChild(tempSpan);
      textContainer.style.setProperty("--text-label-width", `${textWidth}px`);
    }
    textContainer.classList.add("text-visible");
    this.textContainer = textContainer;
    return textContainer;
  }
  /**
   * Render LLM buttons
   */
  renderButtons() {
    if (!this.container) {
      return;
    }
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "llm-share-widget-container";
    buttonContainer.classList.add(`style-${this.config.widget.style}`);
    const theme = getEffectiveTheme(this.config);
    buttonContainer.classList.add(`theme-${theme}`);
    const textPosition = this.config.widget.textLabel?.position ?? "right";
    const isHorizontal = textPosition === "left" || textPosition === "right";
    const isRight = textPosition === "right";
    if (isHorizontal) {
      buttonContainer.classList.add("layout-horizontal");
      if (isRight) {
        buttonContainer.classList.add("text-right");
      }
    } else {
      buttonContainer.classList.add("layout-vertical");
    }
    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.className = "llm-share-buttons-wrapper";
    buttonsWrapper.setAttribute("role", "group");
    buttonsWrapper.setAttribute("aria-label", "AI assistant buttons");
    for (const llm of this.config.llms) {
      const button = createLLMButton(llm, this.config, this.tracker);
      buttonsWrapper.appendChild(button);
    }
    const textLabel = this.createTextLabel();
    if (textLabel && isHorizontal) {
      if (isRight) {
        buttonContainer.appendChild(buttonsWrapper);
        buttonContainer.appendChild(textLabel);
      } else {
        buttonContainer.appendChild(textLabel);
        buttonContainer.appendChild(buttonsWrapper);
      }
    } else if (textLabel && !isHorizontal) {
      buttonContainer.appendChild(buttonsWrapper);
      buttonContainer.insertBefore(textLabel, buttonsWrapper);
    } else {
      buttonContainer.appendChild(buttonsWrapper);
    }
    this.container.appendChild(buttonContainer);
    if (textLabel && this.config.widget.textLabel?.enabled && isHorizontal) {
      buttonContainer.addEventListener("mouseenter", () => {
        if (!this.showTextInitially && this.textContainer) {
          this.textContainer.classList.add("text-visible");
        }
      });
      buttonContainer.addEventListener("mouseleave", () => {
        if (!this.showTextInitially && this.textContainer) {
          this.textContainer.classList.remove("text-visible");
        }
      });
      if (!this.config.widget.showOn?.showOnScroll || !this.container?.classList.contains("scroll-hidden")) {
        this.startTextHideTimer();
      }
    }
  }
  /**
   * Append widget to DOM
   */
  appendToDOM() {
    if (!this.container || typeof document === "undefined") {
      return;
    }
    if (this.config.widget.placement === "inline" && this.config.widget.inlineSelector) {
      const target = document.querySelector(this.config.widget.inlineSelector);
      if (target) {
        const alignment = this.config.widget.inlineAlignment ?? "left";
        if (target instanceof HTMLElement) {
          target.classList.add(`align-${alignment}`);
        }
        target.appendChild(this.container);
        return;
      }
    }
    document.body.appendChild(this.container);
  }
  /**
   * Destroy widget
   */
  destroy() {
    if (this.scrollRafRef !== null) {
      cancelAnimationFrame(this.scrollRafRef);
    }
    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
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
function init(config) {
  if (typeof window !== "undefined" && window.__LLMShareInstance) {
    return;
  }
  let normalizedConfig;
  if (config) {
    normalizedConfig = validateConfig(config);
  } else {
    normalizedConfig = getConfig();
  }
  if (!normalizedConfig) {
    console.error("[LLMShare] Failed to initialize: invalid or missing config");
    return;
  }
  for (const llm of normalizedConfig.llms) {
    if (!llm.iconSvg && !llm.iconUrl) {
      const defaultIcon = getDefaultIcon(llm.id);
      if (defaultIcon) {
        llm.iconSvg = defaultIcon;
      }
    }
  }
  const tracker = new EventTracker(normalizedConfig);
  const widget = new Widget(normalizedConfig, tracker);
  widget.init();
  if (typeof window !== "undefined") {
    window.__LLMShareInstance = {
      widget,
      tracker,
      destroy: () => {
        widget.destroy();
        tracker.destroy();
        delete window.__LLMShareInstance;
      }
    };
    delete window.__LLMShareLoading;
  }
}
if (typeof window !== "undefined") {
  window.LLMShareWidget = {
    init
  };
  if (window.LLMShare && !window.__LLMShareLoading) {
    const doInit = () => {
      if (!window.__LLMShareInstance) {
        init();
      }
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", doInit);
    } else {
      doInit();
    }
  }
}
export {
  init
};
//# sourceMappingURL=widget.es.js.map
