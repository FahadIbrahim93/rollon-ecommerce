import { describe, it, expect } from 'vitest';
import { formatPrice, cn } from '../utils';

describe('utils', () => {
  describe('formatPrice', () => {
    it('should format price with currency symbol', () => {
      const result = formatPrice(1000);
      expect(result).toContain('৳');
    });

    it('should format large numbers', () => {
      const result = formatPrice(1000000);
      expect(result).toContain('৳');
    });
  });

  describe('cn', () => {
    it('should merge class names', () => {
      const result = cn('foo', 'bar');
      expect(result).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      const includeBar = false;
      const result = cn('foo', includeBar ? 'bar' : '', 'baz');
      expect(result).toBe('foo baz');
    });

    it('should handle empty strings', () => {
      const result = cn('foo', '', 'bar');
      expect(result).toBe('foo bar');
    });
  });
});
