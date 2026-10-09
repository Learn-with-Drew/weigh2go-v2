import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { todayLocal } from '../../src/utils/date';

// Tests run with TZ=America/Los_Angeles (see tests/globalSetup.ts).
describe('todayLocal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the local calendar date, not the UTC date', () => {
    // 03:00 UTC on Oct 9 is 8:00pm on Oct 8 in Los Angeles.
    vi.setSystemTime(new Date('2026-10-09T03:00:00Z'));

    expect(todayLocal()).toBe('2026-10-08');
  });

  it('zero-pads month and day', () => {
    vi.setSystemTime(new Date('2026-01-05T20:00:00Z'));

    expect(todayLocal()).toBe('2026-01-05');
  });
});
