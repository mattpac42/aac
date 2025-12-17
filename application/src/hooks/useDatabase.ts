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
   * Update word operation
   * NOTE: Updates local state by refreshing after update
   */
  const updateWord = useCallback(async (id: string, changes: Partial<Word>): Promise<void> => {
    try {
      setError(null);
      await dataService.updateWord(id, changes);
      // Refresh words to get updated data
      const updatedWords = await dataService.getAllWords();
      setWords(updatedWords);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update word';
      setError(errorMessage);
      throw err;
    }
  }, []);

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
   * Update category operation
   * NOTE: Updates local state by refreshing after update
   */
  const updateCategory = useCallback(
    async (id: string, changes: Partial<Category>): Promise<void> => {
      try {
        setError(null);
        await dataService.updateCategory(id, changes);
        // Refresh categories to get updated data
        const updatedCategories = await dataService.getAllCategories();
        setCategories(updatedCategories);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
        setError(errorMessage);
        throw err;
      }
    },
    []
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
   * Update settings operation
   * NOTE: Updates local state by refreshing after update
   */
  const updateSettings = useCallback(
    async (changes: Partial<Omit<Settings, 'id'>>): Promise<void> => {
      try {
        setError(null);
        await dataService.updateSettings(changes);
        // Refresh settings to get updated data
        const updatedSettings = await dataService.getSettings();
        setSettings(updatedSettings);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
        setError(errorMessage);
        throw err;
      }
    },
    []
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
