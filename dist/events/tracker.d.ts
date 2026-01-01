import { LLMShareEvent } from './types';
import { NormalizedLLMShareConfig } from '../config/types';

export declare class EventTracker {
    private config;
    private viewId;
    private eventQueue;
    private flushTimer;
    private unloadHandler;
    constructor(config: NormalizedLLMShareConfig);
    private getAttributionData;
    getViewId(): string;
    private createBaseEvent;
    private pushToDataLayer;
    emit(event: LLMShareEvent): void;
    trackImpression(): void;
    trackClick(llmId: string): void;
    trackShareCreated(llmId: string, shareUrl?: string, shareToken?: string): void;
    trackFallbackRawUrl(llmId: string, rawUrl: string): void;
    trackError(errorMessage: string, errorType?: string): void;
    private scheduleFlush;
    private flush;
    private setupUnloadHandler;
    destroy(): void;
}
//# sourceMappingURL=tracker.d.ts.map