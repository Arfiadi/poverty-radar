import { describe, it, expect } from 'vitest';
import {
  formatPercent,
  formatYears,
  formatCurrencyMillion,
  formatGRDPTrillion,
  formatScore,
  formatDisparityRatio
} from '../utils/formatters';

describe('formatters utility', () => {
  describe('formatPercent', () => {
    it('formats numbers with standard 2 decimals and percent sign', () => {
      expect(formatPercent(12.3456)).toBe('12.35%');
      expect(formatPercent(0)).toBe('0.00%');
    });

    it('supports custom decimal precision', () => {
      expect(formatPercent(12.3456, 1)).toBe('12.3%');
      expect(formatPercent(12.3456, 3)).toBe('12.346%');
    });

    it('handles null, undefined, and NaN defensively', () => {
      expect(formatPercent(null)).toBe('—');
      expect(formatPercent(undefined)).toBe('—');
      expect(formatPercent(NaN)).toBe('—');
    });
  });

  describe('formatYears', () => {
    it('formats school years with thn suffix', () => {
      expect(formatYears(8.75)).toBe('8.75 thn');
      expect(formatYears(12)).toBe('12.00 thn');
    });

    it('handles null, undefined, and NaN defensively', () => {
      expect(formatYears(null)).toBe('—');
      expect(formatYears(undefined)).toBe('—');
      expect(formatYears(NaN)).toBe('—');
    });
  });

  describe('formatCurrencyMillion', () => {
    it('converts thousand rupiah to million rupiah formatted', () => {
      // 10,000 Ribu Rp = 10 Juta Rp
      const formatted = formatCurrencyMillion(10000);
      expect(formatted).toContain('Rp10');
      expect(formatted).toContain('jt');
    });

    it('handles null and undefined', () => {
      expect(formatCurrencyMillion(null)).toBe('—');
      expect(formatCurrencyMillion(undefined)).toBe('—');
    });
  });

  describe('formatGRDPTrillion', () => {
    it('formats trillion values (>= 1,000,000 million)', () => {
      // 2,500,000 Million IDR = 2.50 Trillion IDR
      const formatted = formatGRDPTrillion(2500000);
      expect(formatted).toContain('Rp2');
      expect(formatted).toContain('T');
    });

    it('formats billion values (< 1,000,000 million)', () => {
      // 500,000 Million IDR = 500.0 Billion IDR
      const formatted = formatGRDPTrillion(500000);
      expect(formatted).toContain('Rp500');
      expect(formatted).toContain('M');
    });

    it('handles null and undefined', () => {
      expect(formatGRDPTrillion(null)).toBe('—');
      expect(formatGRDPTrillion(undefined)).toBe('—');
    });
  });

  describe('formatScore', () => {
    it('formats float with 4 decimal precision by default', () => {
      expect(formatScore(0.27218)).toBe('0.2722');
      expect(formatScore(0.5, 2)).toBe('0.50');
    });

    it('handles null and undefined', () => {
      expect(formatScore(null)).toBe('—');
      expect(formatScore(undefined)).toBe('—');
    });
  });

  describe('formatDisparityRatio', () => {
    it('formats ratio with 2 decimals and x suffix', () => {
      expect(formatDisparityRatio(18.847)).toBe('18.85x');
    });

    it('handles null and undefined', () => {
      expect(formatDisparityRatio(null)).toBe('—');
      expect(formatDisparityRatio(undefined)).toBe('—');
    });
  });
});
