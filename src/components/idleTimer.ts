export class IdleTimer {
    private timers: Map<string, NodeJS.Timeout> = new Map();

    /**
     * 開始閒置計時器
     */
    start(filePath: string, idleTimeMs: number, callback: () => void): void {
        console.log('[IdleTimer] Starting timer for:', filePath, 'duration:', idleTimeMs, 'ms');

        // 清除舊計時器
        this.reset(filePath);

        // 設定新計時器
        const timer = setTimeout(() => {
            console.log('[IdleTimer] Timer callback executing for:', filePath);
            callback();
        }, idleTimeMs);
        this.timers.set(filePath, timer);

        console.log('[IdleTimer] Timer set successfully');
    }

    /**
     * 重置計時器
     */
    reset(filePath: string): void {
        const timer = this.timers.get(filePath);
        if (timer) {
            console.log('[IdleTimer] Resetting timer for:', filePath);
            clearTimeout(timer);
            this.timers.delete(filePath);
        }
    }

    /**
     * 清除所有計時器
     */
    clearAll(): void {
        for (const timer of this.timers.values()) {
            clearTimeout(timer);
        }
        this.timers.clear();
    }
}
