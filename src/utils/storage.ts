export interface SavedItem {
  id: string;
  toolSlug: string;
  toolName: string;
  prompt: string;
  result: string;
  createdAt: number;
}

const STORAGE_KEY = 'smarttoolhub_history';

export function saveToolResult(toolSlug: string, toolName: string, prompt: string, result: string): void {
  try {
    if (typeof window === 'undefined') return;
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    const existing: SavedItem[] = existingRaw ? JSON.parse(existingRaw) : [];

    const newItem: SavedItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      toolSlug,
      toolName,
      prompt,
      result,
      createdAt: Date.now(),
    };

    // Keep up to 25 latest items
    const updated = [newItem, ...existing.filter(i => i.result !== result)].slice(0, 25);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    // Graceful fallback if localStorage is disabled or full
    console.warn('Could not save to localStorage', e);
  }
}

export function getToolHistory(): SavedItem[] {
  try {
    if (typeof window === 'undefined') return [];
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    return existingRaw ? JSON.parse(existingRaw) : [];
  } catch {
    return [];
  }
}

export function clearToolHistory(): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // No-op
  }
}
