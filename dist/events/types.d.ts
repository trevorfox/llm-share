export type EventType = 'impression' | 'click' | 'share_created' | 'fallback_raw_url' | 'error';
export interface BaseEvent {
    event_id: string;
    ts: string;
    event_type: EventType;
    site_id?: string | null;
    page_url: string;
    view_id: string;
    llm_id?: string;
    mode: 'hosted' | 'self_hosted' | 'standalone';
    metadata?: Record<string, unknown>;
    referrer?: string;
    language?: string;
    timezone?: string;
    screen_width?: number;
    screen_height?: number;
    viewport_width?: number;
    viewport_height?: number;
}
export interface ImpressionEvent extends BaseEvent {
    event_type: 'impression';
}
export interface ClickEvent extends BaseEvent {
    event_type: 'click';
    llm_id: string;
}
export interface ShareCreatedEvent extends BaseEvent {
    event_type: 'share_created';
    llm_id: string;
    share_url?: string;
    share_token?: string;
}
export interface FallbackRawUrlEvent extends BaseEvent {
    event_type: 'fallback_raw_url';
    llm_id: string;
    raw_url: string;
}
export interface ErrorEvent extends BaseEvent {
    event_type: 'error';
    error_message: string;
    error_type?: string;
}
export type LLMShareEvent = ImpressionEvent | ClickEvent | ShareCreatedEvent | FallbackRawUrlEvent | ErrorEvent;
//# sourceMappingURL=types.d.ts.map