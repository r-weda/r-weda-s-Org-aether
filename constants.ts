import { useState, useEffect } from 'react';

// Custom hook for debouncing values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const INITIAL_XP_LEVELS = [0, 100, 300, 600, 1000, 1500, 2100, 3000];

export const calculateLevel = (xp: number) => {
    let level = 1;
    for (let i = 0; i < INITIAL_XP_LEVELS.length; i++) {
        if (xp >= INITIAL_XP_LEVELS[i]) {
            level = i + 1;
        } else {
            break;
        }
    }
    return level;
};
