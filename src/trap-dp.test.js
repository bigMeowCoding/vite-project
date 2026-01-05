import { describe, it, expect } from 'vitest';
import { trapDP } from './trap-dp';

describe('trapDP', () => {
  it('should handle standard case 1', () => {
    // Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
    // Output: 6
    const height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
    expect(trapDP(height)).toBe(6);
  });

  it('should handle standard case 2', () => {
    // Input: height = [4,2,0,3,2,5]
    // Output: 9
    const height = [4, 2, 0, 3, 2, 5];
    expect(trapDP(height)).toBe(9);
  });

  it('should return 0 for empty array', () => {
    expect(trapDP([])).toBe(0);
  });

  it('should return 0 for single element', () => {
    expect(trapDP([1])).toBe(0);
  });

  it('should return 0 for flat surface', () => {
    expect(trapDP([1, 1, 1])).toBe(0);
  });

  it('should return 0 for increasing heights', () => {
    expect(trapDP([1, 2, 3, 4])).toBe(0);
  });

  it('should return 0 for decreasing heights', () => {
    expect(trapDP([4, 3, 2, 1])).toBe(0);
  });
  
  it('should handle puddles', () => {
      // 3, 1, 2 -> 1 unit of water
      expect(trapDP([3, 1, 2])).toBe(1);
  });
});
