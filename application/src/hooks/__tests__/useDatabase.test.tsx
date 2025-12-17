import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDatabase } from '../useDatabase';
import { dataService } from '../../lib/db';
import type { Word, Category, Settings } from '../../lib/db';

/**
 * useDatabase Hook Test Suite
 *
 * WHY: Comprehensive test coverage ensures the hook properly manages state,
 * handles loading/error states, and correctly integrates with dataService
 *
 * REASON: Following TDD principles to verify all hook behaviors before implementation
 */

// Mock dataService
vi.mock('../../lib/db', () => ({
  dataService: {
    getAllWords: vi.fn(),
    getAllCategories: vi.fn(),
    getSettings: vi.fn(),
    createWord: vi.fn(),
    updateWord: vi.fn(),
    deleteWord: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
    updateSettings: vi.fn(),
  },
}));

describe('useDatabase', () => {
  const mockWords: Word[] = [
    {
      id: '1',
      text: 'hello',
      type: 'social',
      categoryId: 'cat-1',
      iconName: 'smile',
      order: 1,
      createdAt: new Date(),
      modifiedAt: new Date(),
      isDefault: true,
    },
  ];

  const mockCategories: Category[] = [
    {
      id: 'cat-1',
      name: 'Greetings',
      iconName: 'hand',
      order: 1,
      createdAt: new Date(),
      modifiedAt: new Date(),
      isDefault: true,
    },
  ];

  const mockSettings: Settings = {
    id: 'app-settings',
    wordTypeColors: {
      pronoun: { bg: '#fee', border: '#fcc' },
      verb: { bg: '#efe', border: '#cfc' },
      descriptive: { bg: '#eef', border: '#ccf' },
      noun: { bg: '#ffe', border: '#ffc' },
      social: { bg: '#fef', border: '#fcf' },
    },
    voiceSettings: { rate: 1, pitch: 1, volume: 1 },
    gridLayout: { columns: 3 },
    uiPreferences: {
      showOfflineIndicator: true,
      autoSaveEnabled: true,
      confirmDeletes: true,
    },
    modifiedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dataService.getAllWords).mockResolvedValue(mockWords);
    vi.mocked(dataService.getAllCategories).mockResolvedValue(mockCategories);
    vi.mocked(dataService.getSettings).mockResolvedValue(mockSettings);
  });

  describe('Data Loading', () => {
    it('should load data on mount', async () => {
      const { result } = renderHook(() => useDatabase());

      // Initially loading
      expect(result.current.loading).toBe(true);

      // Wait for data to load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.words).toEqual(mockWords);
      expect(result.current.categories).toEqual(mockCategories);
      expect(result.current.settings).toEqual(mockSettings);
      expect(result.current.error).toBeNull();
    });

    it('should handle loading errors', async () => {
      const errorMessage = 'Failed to load data';
      vi.mocked(dataService.getAllWords).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.words).toEqual([]);
    });

    it('should set loading to false even on partial errors', async () => {
      vi.mocked(dataService.getAllWords).mockRejectedValue(new Error('Word load failed'));

      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Word load failed');
    });
  });

  describe('Word Operations', () => {
    it('should add word and update state', async () => {
      const newWord: Word = {
        id: '2',
        text: 'goodbye',
        type: 'social',
        categoryId: 'cat-1',
        iconName: 'wave',
        order: 2,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isDefault: false,
      };

      vi.mocked(dataService.createWord).mockResolvedValue(newWord);

      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const wordData = {
        text: 'goodbye',
        type: 'social' as const,
        categoryId: 'cat-1',
        iconName: 'wave',
        order: 2,
        isDefault: false,
      };

      const returnedWord = await result.current.addWord(wordData);

      expect(returnedWord).toEqual(newWord);

      await waitFor(() => {
        expect(result.current.words).toContainEqual(newWord);
      });

      expect(dataService.createWord).toHaveBeenCalledWith(wordData);
    });

    it('should update word and update state', async () => {
      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updates = { text: 'hi' };
      await result.current.updateWord('1', updates);

      expect(dataService.updateWord).toHaveBeenCalledWith('1', updates);
    });

    it('should delete word and update state', async () => {
      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.deleteWord('1');

      expect(dataService.deleteWord).toHaveBeenCalledWith('1');

      await waitFor(() => {
        expect(result.current.words.find(w => w.id === '1')).toBeUndefined();
      });
    });

    it('should handle add word errors', async () => {
      const errorMessage = 'Failed to add word';
      vi.mocked(dataService.createWord).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const wordData = {
        text: 'test',
        type: 'social' as const,
        categoryId: 'cat-1',
        iconName: 'test',
        order: 1,
        isDefault: false,
      };

      await expect(result.current.addWord(wordData)).rejects.toThrow();

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });
    });
  });

  describe('Category Operations', () => {
    it('should add category and update state', async () => {
      const newCategory: Category = {
        id: 'cat-2',
        name: 'Actions',
        iconName: 'zap',
        order: 2,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isDefault: false,
      };

      vi.mocked(dataService.createCategory).mockResolvedValue(newCategory);

      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const categoryData = {
        name: 'Actions',
        iconName: 'zap',
        order: 2,
        isDefault: false,
      };

      const returnedCategory = await result.current.addCategory(categoryData);

      expect(returnedCategory).toEqual(newCategory);

      await waitFor(() => {
        expect(result.current.categories).toContainEqual(newCategory);
      });

      expect(dataService.createCategory).toHaveBeenCalledWith(categoryData);
    });

    it('should update category and update state', async () => {
      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updates = { name: 'Hello' };
      await result.current.updateCategory('cat-1', updates);

      expect(dataService.updateCategory).toHaveBeenCalledWith('cat-1', updates);
    });

    it('should delete category and update state', async () => {
      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.deleteCategory('cat-1');

      expect(dataService.deleteCategory).toHaveBeenCalledWith('cat-1');

      await waitFor(() => {
        expect(result.current.categories.find(c => c.id === 'cat-1')).toBeUndefined();
      });
    });

    it('should handle add category errors', async () => {
      const errorMessage = 'Failed to add category';
      vi.mocked(dataService.createCategory).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const categoryData = {
        name: 'Test',
        iconName: 'test',
        order: 1,
        isDefault: false,
      };

      await expect(result.current.addCategory(categoryData)).rejects.toThrow();

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });
    });
  });

  describe('Settings Operations', () => {
    it('should update settings', async () => {
      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updates = { voiceSettings: { rate: 1.5, pitch: 1, volume: 1 } };
      await result.current.updateSettings(updates);

      expect(dataService.updateSettings).toHaveBeenCalledWith(updates);
    });

    it('should handle update settings errors', async () => {
      const errorMessage = 'Failed to update settings';
      vi.mocked(dataService.updateSettings).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        result.current.updateSettings({ voiceSettings: { rate: 1.5, pitch: 1, volume: 1 } })
      ).rejects.toThrow();

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });
    });
  });

  describe('Refresh Functionality', () => {
    it('should reload all data on refresh', async () => {
      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous calls
      vi.clearAllMocks();

      // Call refresh
      await result.current.refresh();

      expect(dataService.getAllWords).toHaveBeenCalled();
      expect(dataService.getAllCategories).toHaveBeenCalled();
      expect(dataService.getSettings).toHaveBeenCalled();
    });

    it('should handle refresh errors', async () => {
      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const errorMessage = 'Refresh failed';
      vi.mocked(dataService.getAllWords).mockRejectedValue(new Error(errorMessage));

      await expect(result.current.refresh()).rejects.toThrow();

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
      });
    });
  });

  describe('State Management', () => {
    it('should initialize with empty state', () => {
      vi.mocked(dataService.getAllWords).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useDatabase());

      expect(result.current.words).toEqual([]);
      expect(result.current.categories).toEqual([]);
      expect(result.current.settings).toBeNull();
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should clear error on successful operations', async () => {
      // First, create an error
      vi.mocked(dataService.getAllWords).mockRejectedValueOnce(
        new Error('Initial error')
      );

      const { result } = renderHook(() => useDatabase());

      await waitFor(() => {
        expect(result.current.error).toBe('Initial error');
      });

      // Now resolve successfully
      vi.mocked(dataService.getAllWords).mockResolvedValue(mockWords);

      await result.current.refresh();

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });
});
