import { describe, it, expect } from 'vitest';
import { formatEventDate } from './utils';

describe('formatEventDate', () => {
  it('should format a date object correctly', () => {
    const date = new Date('2026-05-10T10:00:00');
    const formatted = formatEventDate(date);
    expect(formatted).toContain('May 10');
    expect(formatted).toContain('10:00 AM');
  });

  it('should format a date string correctly', () => {
    const dateStr = '2026-05-10T14:30:00';
    const formatted = formatEventDate(dateStr);
    expect(formatted).toContain('May 10');
    expect(formatted).toContain('2:30 PM');
  });
});
