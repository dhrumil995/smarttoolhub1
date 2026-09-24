/**
 * Safe Storage Utility
 * Provides resilient localStorage operations with in-memory fallback.
 * Prevents fatal unhandled exceptions when running inside sandboxed or cross-origin iframes
 * where window.localStorage access may throw SecurityError or DOMException.
 */

const memoryStore = new Map<string, string>();

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (_) {
      // Fallback to memory store if blocked by sandbox
    }
    return memoryStore.get(key) ?? null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (_) {
      // Fallback to memory store
    }
    memoryStore.set(key, value);
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (_) {}
    memoryStore.delete(key);
  },
};
