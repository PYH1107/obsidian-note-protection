import { describe, it, expect, beforeEach } from 'vitest';
import { AccessTracker } from '../accessTracker';

describe('AccessTracker', () => {
    let tracker: AccessTracker;

    beforeEach(() => {
        tracker = new AccessTracker();
    });

    describe('markAsTemporaryAccess', () => {
        it('should mark file as both temporary and session accessed', () => {
            tracker.markAsTemporaryAccess('secret.md');
            expect(tracker.isTemporaryAccess('secret.md')).toBe(true);
            expect(tracker.isAccessedThisSession('secret.md')).toBe(true);
        });

        it('should not affect unrelated files', () => {
            tracker.markAsTemporaryAccess('secret.md');
            expect(tracker.isAccessedThisSession('other.md')).toBe(false);
            expect(tracker.isTemporaryAccess('other.md')).toBe(false);
        });
    });

    describe('clearAccess', () => {
        it('should clear both session and temporary access for a file', () => {
            tracker.markAsTemporaryAccess('secret.md');
            tracker.clearAccess('secret.md');
            expect(tracker.isAccessedThisSession('secret.md')).toBe(false);
            expect(tracker.isTemporaryAccess('secret.md')).toBe(false);
        });

        it('should not affect other files', () => {
            tracker.markAsTemporaryAccess('a.md');
            tracker.markAsTemporaryAccess('b.md');
            tracker.clearAccess('a.md');
            expect(tracker.isTemporaryAccess('b.md')).toBe(true);
        });
    });

    describe('clearAll', () => {
        it('should clear all tracked files', () => {
            tracker.markAsTemporaryAccess('a.md');
            tracker.markAsTemporaryAccess('b.md');
            tracker.clearAll();
            expect(tracker.isAccessedThisSession('a.md')).toBe(false);
            expect(tracker.isAccessedThisSession('b.md')).toBe(false);
            expect(tracker.getTemporaryAccess()).toEqual([]);
        });
    });

    describe('getTemporaryAccess', () => {
        it('should return all temporary access file paths', () => {
            tracker.markAsTemporaryAccess('a.md');
            tracker.markAsTemporaryAccess('b.md');
            expect(tracker.getTemporaryAccess()).toEqual(
                expect.arrayContaining(['a.md', 'b.md'])
            );
        });

        it('should not include cleared files', () => {
            tracker.markAsTemporaryAccess('a.md');
            tracker.clearAccess('a.md');
            expect(tracker.getTemporaryAccess()).toEqual([]);
        });
    });
});
