import { useState, useEffect, useCallback } from 'react';
import { dataService } from '../lib/db';
import type { Word, Category, Settings } from '../lib/db';

/**
 * useDatabase Hook
 *
 * WHY: Provides React components with convenient access to database operations
 * while managing loading states, errors, and automatic data synchronization.
 *
 * REASON: Encapsulates database interaction complexity and provides
 * a clean, type-safe API for UI components to consume data.
 */

export interface UseDatabaseReturn {
  // Data
  words: Word[];
  categories: Category[];
  settings: Settings | null;

  // Loading states
  loading: boolean;
  error: string | null;

  // Word operations
  addWord: (word: Omit<Word, 'id' | 'createdAt' | 'modifiedAt'>) => Promise<Word>;
  updateWord: (id: string, changes: Partial<Word>) => Promise<void>;
  deleteWord: (id: string) => Promise<void>;

  // Category operations
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'modifiedAt'>) => Promise<Category>;
  updateCategory: (id: string, changes: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Settings operations
  updateSettings: (changes: Partial<Omit<Settings, 'id'>>) => Promise<void>;

  // Refresh
  refresh: () => Promise<void>;
}

export function useDatabase(): UseDatabaseReturn {
  // State management
  const [words, setWords] = useState<Word[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load all data from database
   * NOTE: Called on mount and when refresh is requested
   */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [loadedWords, loadedCategories, loadedSettings] = await Promise.all([
        dataService.getAllWords(),
        dataService.getAllCategories(),
        dataService.getSettings(),
      ]);

      setWords(loadedWords);
      setCategories(loadedCategories);
      setSettings(loadedSettings);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      throw err; // Re-throw for refresh error handling
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load data on mount
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Add word operation
   * NOTE: Updates local state optimistically after successful creation
   */
  const addWord = useCallback(
    async (wordData: Omit<Word, 'id' | 'createdAt' | 'modifiedAt'>): Promise<Word> => {
      try {
        setError(null);
        const word = await dataService.createWord(wordData);
        setWords((prev) => [...prev, word]);
        return word;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add word';
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  /**
   * Update word operation with optimistic UI updates
   * WHY: Provides instant feedback to users while saving in background
   * REASON: Optimistic updates improve perceived performance by updating UI immediately,
   * then rolling back on failure instead of waiting for slow IndexedDB operations
   */
  const updateWord = useCallback(async (id: string, changes: Partial<Word>): Promise<void> => {
    // 1. Capture current state for rollback
    // NOTE: Store snapshot before optimistic update to enable rollback on failure
    const previousWords = words;

    // 2. Apply optimistic update to local state IMMEDIATELY
    // REASON: UI updates instantly, giving user immediate feedback
    setWords(prev => prev.map(w =>
      w.id === id ? { ...w, ...changes, modifiedAt: new Date() } : w
    ));

    setLoading(true);
    setError(null);

    try {
      // 3. Attempt background save to IndexedDB
      await dataService.updateWord(id, changes);
      // Success - keep optimistic update
    } catch (err) {
      // 4. ROLLBACK on failure - restore previous state
      // WHY: User needs to see accurate state when save fails
      setWords(previousWords);
      setError('Failed to update word');
      throw err; // Re-throw for caller handling
    } finally {
      setLoading(false);
    }
  }, [words]);

  /**
   * Delete word operation
   * NOTE: Removes from local state immediately
   */
  const deleteWord = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await dataService.deleteWord(id);
      setWords((prev) => prev.filter((word) => word.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete word';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Add category operation
   * NOTE: Updates local state optimistically after successful creation
   */
  const addCategory = useCallback(
    async (
      categoryData: Omit<Category, 'id' | 'createdAt' | 'modifiedAt'>
    ): Promise<Category> => {
      try {
        setError(null);
        const category = await dataService.createCategory(categoryData);
        setCategories((prev) => [...prev, category]);
        return category;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add category';
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  /**
   * Update category operation with optimistic UI updates
   * WHY: Provides instant feedback to users while saving in background
   * REASON: Optimistic updates improve perceived performance by updating UI immediately,
   * then rolling back on failure instead of waiting for slow IndexedDB operations
   */
  const updateCategory = useCallback(
    async (id: string, changes: Partial<Category>): Promise<void> => {
      // 1. Capture current state for rollback
      const previousCategories = categories;

      // 2. Apply optimistic update to local state IMMEDIATELY
      setCategories(prev => prev.map(c =>
        c.id === id ? { ...c, ...changes, modifiedAt: new Date() } : c
      ));

      setLoading(true);
      setError(null);

      try {
        // 3. Attempt background save to IndexedDB
        await dataService.updateCategory(id, changes);
        // Success - keep optimistic update
      } catch (err) {
        // 4. ROLLBACK on failure - restore previous state
        setCategories(previousCategories);
        setError('Failed to update category');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [categories]
  );

  /**
   * Delete category operation
   * NOTE: Removes from local state immediately
   */
  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await dataService.deleteCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Update settings operation with optimistic UI updates
   * WHY: Provides instant feedback to users while saving in background
   * REASON: Optimistic updates improve perceived performance by updating UI immediately,
   * then rolling back on failure instead of waiting for slow IndexedDB operations
   */
  const updateSettings = useCallback(
    async (changes: Partial<Omit<Settings, 'id'>>): Promise<void> => {
      // 1. Capture current state for rollback
      const previousSettings = settings;

      // 2. Apply optimistic update to local state IMMEDIATELY
      // NOTE: Deep merge nested objects like voiceSettings, gridLayout, etc.
      if (settings) {
        const optimisticSettings: Settings = {
          ...settings,
          ...changes,
          modifiedAt: new Date(),
        };

        // Deep merge nested objects to preserve unmodified fields
        if (changes.wordTypeColors) {
          optimisticSettings.wordTypeColors = {
            ...settings.wordTypeColors,
            ...changes.wordTypeColors,
          };
        }
        if (changes.voiceSettings) {
          optimisticSettings.voiceSettings = {
            ...settings.voiceSettings,
            ...changes.voiceSettings,
          };
        }
        if (changes.gridLayout) {
          optimisticSettings.gridLayout = {
            ...settings.gridLayout,
            ...changes.gridLayout,
          };
        }
        if (changes.uiPreferences) {
          optimisticSettings.uiPreferences = {
            ...settings.uiPreferences,
            ...changes.uiPreferences,
          };
        }

        setSettings(optimisticSettings);
      }

      setLoading(true);
      setError(null);

      try {
        // 3. Attempt background save to IndexedDB
        await dataService.updateSettings(changes);
        // Success - keep optimistic update
      } catch (err) {
        // 4. ROLLBACK on failure - restore previous state
        setSettings(previousSettings);
        setError('Failed to update settings');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [settings]
  );

  /**
   * Refresh all data
   * NOTE: Re-loads all data from database
   */
  const refresh = useCallback(async (): Promise<void> => {
    await loadData();
  }, [loadData]);

  return {
    // Data
    words,
    categories,
    settings,

    // Loading states
    loading,
    error,

    // Operations
    addWord,
    updateWord,
    deleteWord,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    refresh,
  };
}
