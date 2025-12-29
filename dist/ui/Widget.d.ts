import { NormalizedLLMShareConfig } from '../config/types';
import { EventTracker } from '../events/tracker';

export declare class Widget {
    private config;
    private tracker;
    private container;
    private isInitialized;
    private isVisible;
    private showTextInitially;
    private scrollRafRef;
    private textContainer;
    private scrollHandler;
    constructor(config: NormalizedLLMShareConfig, tracker: EventTracker);
    init(): void;
    private shouldShow;
    private createContainer;
    private setupScrollDetection;
    private startTextHideTimer;
    private createTextLabel;
    private renderButtons;
    private appendToDOM;
    destroy(): void;
}
//# sourceMappingURL=Widget.d.ts.map