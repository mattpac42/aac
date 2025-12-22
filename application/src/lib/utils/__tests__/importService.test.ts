import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  importVocabulary,
  readImportFile,
  detectConflicts,
  mergeVocabulary,
  type ImportOptions,
  type ImportResult,
  type ExportData,
} from '../importService';
import { dataService } from '../../db/DataService';
import type { Word, Category } from '../../db/schema';

// Mock DataService
vi.mock('../../db/DataService', () => ({
  dataService: {
    getAllWords: vi.fn(),
    getAllCategories: vi.fn(),
    getWord: vi.fn(),
    getCategory: vi.fn(),
    createWord: vi.fn(),
    createCategory: vi.fn(),
    updateWord: vi.fn(),
    updateCategory: vi.fn(),
    clearAll: vi.fn(),
  },
}));

describe('importService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('readImportFile', () => {
    it('should read and parse valid JSON file', async () => {
      // RED: Test for reading valid JSON file
      const jsonContent = JSON.stringify({ test: 'data' });
      const file = new File([jsonContent], 'test.json', { type: 'application/json' });

      const result = await readImportFile(file);

      expect(result).toEqual({ test: 'data' });
    });

    it('should reject invalid JSON file', async () => {
      // RED: Test for invalid JSON
      const file = new File(['{ invalid json }'], 'test.json', { type: 'application/json' });

      await expect(readImportFile(file)).rejects.toThrow('Invalid JSON file');
    });

    it('should handle file read errors', async () => {
      // RED: Test for file read errors
      const file = new File([], 'test.json', { type: 'application/json' });

      // Mock FileReader to simulate error
      const originalFileReader = global.FileReader;
      global.FileReader = class {
        readAsText() {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror(new Error('Read error'));
            }
          }, 0);
        }
      } as any;

      await expect(readImportFile(file)).rejects.toThrow('Failed to read file');

      global.FileReader = originalFileReader;
    });
  });

  describe('importVocabulary', () => {
    const validExportData: ExportData = {
      metadata: {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        exportedBy: 'Test User',
        itemCount: {
          words: 2,
          categories: 1,
          resources: 0,
        },
      },
      data: {
        words: [
          {
            id: 'word-1',
            text: 'hello',
            type: 'social',
            categoryId: 'cat-1',
            iconName: 'MessageSquare',
            order: 0,
            createdAt: new Date(),
            modifiedAt: new Date(),
            isDefault: false,
          },
          {
            id: 'word-2',
            text: 'goodbye',
            type: 'social',
            categoryId: 'cat-1',
            iconName: 'MessageSquare',
            order: 1,
            createdAt: new Date(),
            modifiedAt: new Date(),
            isDefault: false,
          },
        ] as Word[],
        categories: [
          {
            id: 'cat-1',
            name: 'Greetings',
            iconName: 'MessageSquare',
            order: 0,
            createdAt: new Date(),
            modifiedAt: new Date(),
            isDefault: false,
          },
        ] as Category[],
        resources: [],
      },
    };

    it('should validate export data structure', async () => {
      // RED: Test for invalid structure
      const invalidData = { random: 'data' };
      const options: ImportOptions = { strategy: 'replace' };

      const result = await importVocabulary(invalidData, options);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Invalid import file structure');
    });

    it('should validate export version compatibility', async () => {
      // RED: Test for incompatible version
      const incompatibleData = {
        ...validExportData,
        metadata: { ...validExportData.metadata, version: '2.0' },
      };
      const options: ImportOptions = { strategy: 'replace' };

      const result = await importVocabulary(incompatibleData, options);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Unsupported export version: 2.0');
    });

    it('should successfully import valid data with replace strategy', async () => {
      // RED: Test for successful replace import
      const options: ImportOptions = { strategy: 'replace' };
      vi.mocked(dataService.clearAll).mockResolvedValue(undefined);

      const result = await importVocabulary(validExportData, options);

      expect(result.success).toBe(true);
      expect(result.counts.wordsImported).toBe(2);
      expect(result.counts.categoriesImported).toBe(1);
      expect(dataService.clearAll).toHaveBeenCalled();
    });

    it('should handle empty import data', async () => {
      // RED: Test for empty data import
      const emptyData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          exportedBy: 'Test User',
          itemCount: { words: 0, categories: 0, resources: 0 },
        },
        data: { words: [], categories: [], resources: [] },
      };
      const options: ImportOptions = { strategy: 'replace' };

      const result = await importVocabulary(emptyData, options);

      expect(result.success).toBe(true);
      expect(result.counts.wordsImported).toBe(0);
      expect(result.counts.categoriesImported).toBe(0);
    });

    it('should handle import errors gracefully', async () => {
      // RED: Test for import error handling
      const options: ImportOptions = { strategy: 'replace' };
      vi.mocked(dataService.clearAll).mockRejectedValue(new Error('Database error'));

      const result = await importVocabulary(validExportData, options);

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('Import failed');
    });
  });

  describe('detectConflicts', () => {
    it('should detect duplicate word IDs', async () => {
      // RED: Test for word ID conflicts
      const existingWords: Word[] = [
        {
          id: 'word-1',
          text: 'existing',
          type: 'noun',
          categoryId: 'cat-1',
          iconName: 'Square',
          order: 0,
          createdAt: new Date(),
          modifiedAt: new Date(),
          isDefault: true,
        },
      ];

      const importData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          exportedBy: 'Test User',
          itemCount: { words: 1, categories: 0, resources: 0 },
        },
        data: {
          words: [
            {
              id: 'word-1',
              text: 'duplicate',
              type: 'verb',
              categoryId: 'cat-2',
              iconName: 'Circle',
              order: 0,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isDefault: false,
            },
          ] as Word[],
          categories: [],
          resources: [],
        },
      };

      vi.mocked(dataService.getAllWords).mockResolvedValue(existingWords);
      vi.mocked(dataService.getAllCategories).mockResolvedValue([]);

      const conflicts = await detectConflicts(importData);

      expect(conflicts.words).toHaveLength(1);
      expect(conflicts.words[0].id).toBe('word-1');
    });

    it('should detect duplicate category IDs', async () => {
      // RED: Test for category ID conflicts
      const existingCategories: Category[] = [
        {
          id: 'cat-1',
          name: 'Existing Category',
          iconName: 'Square',
          order: 0,
          createdAt: new Date(),
          modifiedAt: new Date(),
          isDefault: true,
        },
      ];

      const importData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          exportedBy: 'Test User',
          itemCount: { words: 0, categories: 1, resources: 0 },
        },
        data: {
          words: [],
          categories: [
            {
              id: 'cat-1',
              name: 'Duplicate Category',
              iconName: 'Circle',
              order: 0,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isDefault: false,
            },
          ] as Category[],
          resources: [],
        },
      };

      vi.mocked(dataService.getAllWords).mockResolvedValue([]);
      vi.mocked(dataService.getAllCategories).mockResolvedValue(existingCategories);

      const conflicts = await detectConflicts(importData);

      expect(conflicts.categories).toHaveLength(1);
      expect(conflicts.categories[0].id).toBe('cat-1');
    });

    it('should return empty arrays when no conflicts exist', async () => {
      // RED: Test for no conflicts scenario
      const importData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          exportedBy: 'Test User',
          itemCount: { words: 1, categories: 1, resources: 0 },
        },
        data: {
          words: [
            {
              id: 'new-word',
              text: 'new',
              type: 'noun',
              categoryId: 'new-cat',
              iconName: 'Square',
              order: 0,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isDefault: false,
            },
          ] as Word[],
          categories: [
            {
              id: 'new-cat',
              name: 'New Category',
              iconName: 'Square',
              order: 0,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isDefault: false,
            },
          ] as Category[],
          resources: [],
        },
      };

      vi.mocked(dataService.getAllWords).mockResolvedValue([]);
      vi.mocked(dataService.getAllCategories).mockResolvedValue([]);

      const conflicts = await detectConflicts(importData);

      expect(conflicts.words).toHaveLength(0);
      expect(conflicts.categories).toHaveLength(0);
    });
  });

  describe('mergeVocabulary - replace strategy', () => {
    it('should clear all data and import fresh with replace strategy', async () => {
      // RED: Test for replace strategy
      const importData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          exportedBy: 'Test User',
          itemCount: { words: 1, categories: 1, resources: 0 },
        },
        data: {
          words: [
            {
              id: 'word-1',
              text: 'hello',
              type: 'social',
              categoryId: 'cat-1',
              iconName: 'MessageSquare',
              order: 0,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isDefault: false,
            },
          ] as Word[],
          categories: [
            {
              id: 'cat-1',
              name: 'Greetings',
              iconName: 'MessageSquare',
              order: 0,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isDefault: false,
            },
          ] as Category[],
          resources: [],
        },
      };

      vi.mocked(dataService.clearAll).mockResolvedValue(undefined);

      const result = await mergeVocabulary(importData, 'replace');

      expect(dataService.clearAll).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.counts.wordsImported).toBe(1);
      expect(result.counts.categoriesImported).toBe(1);
    });
  });

  describe('mergeVocabulary - merge strategy', () => {
    it('should update existing items and add new items with merge strategy', async () => {
      // RED: Test for merge strategy
      const importData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          exportedBy: 'Test User',
          itemCount: { words: 2, categories: 1, resources: 0 },
        },
        data: {
          words: [
            {
              id: 'existing-word',
              text: 'updated',
              type: 'verb',
              categoryId: 'cat-1',
              iconName: 'Circle',
              order: 0,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isDefault: false,
            },
            {
              id: 'new-word',
              text: 'new',
              type: 'noun',
              categoryId: 'cat-1',
              iconName: 'Square',
              order: 1,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isDefault: false,
            },
          ] as Word[],
          categories: [
            {
              id: 'cat-1',
              name: 'Test Category',
              iconName: 'MessageSquare',
              order: 0,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isDefault: false,
            },
          ] as Category[],
          resources: [],
        },
      };

      vi.mocked(dataService.getAllWords).mockResolvedValue([]);
      vi.mocked(dataService.getAllCategories).mockResolvedValue([]);
      vi.mocked(dataService.getWord)
        .mockResolvedValueOnce({
          id: 'existing-word',
          text: 'old',
          type: 'noun',
          categoryId: 'cat-1',
          iconName: 'Square',
          order: 0,
          createdAt: new Date(),
          modifiedAt: new Date(),
          isDefault: true,
        })
        .mockResolvedValueOnce(undefined);
      vi.mocked(dataService.getCategory).mockResolvedValue(undefined);
      vi.mocked(dataService.updateWord).mockResolvedValue(undefined);
      vi.mocked(dataService.createWord).mockResolvedValue(importData.data.words[1]);
      vi.mocked(dataService.createCategory).mockResolvedValue(importData.data.categories[0]);

      const result = await mergeVocabulary(importData, 'merge');

      expect(result.success).toBe(true);
      expect(dataService.updateWord).toHaveBeenCalledWith('existing-word', importData.data.words[0]);
      expect(dataService.createWord).toHaveBeenCalledWith(importData.data.words[1]);
      expect(result.counts.wordsImported).toBeGreaterThan(0);
    });

    it('should detect and report conflicts during merge', async () => {
      // RED: Test for conflict detection in merge
      const importData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          exportedBy: 'Test User',
          itemCount: { words: 1, categories: 0, resources: 0 },
        },
        data: {
          words: [
            {
              id: 'conflict-word',
              text: 'conflicting',
              type: 'verb',
              categoryId: 'cat-1',
              iconName: 'Circle',
              order: 0,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isDefault: false,
            },
          ] as Word[],
          categories: [],
          resources: [],
        },
      };

      vi.mocked(dataService.getAllWords).mockResolvedValue([
        {
          id: 'conflict-word',
          text: 'existing',
          type: 'noun',
          categoryId: 'cat-1',
          iconName: 'Square',
          order: 0,
          createdAt: new Date(),
          modifiedAt: new Date(),
          isDefault: true,
        },
      ]);
      vi.mocked(dataService.getAllCategories).mockResolvedValue([]);
      vi.mocked(dataService.getWord).mockResolvedValue({
        id: 'conflict-word',
        text: 'existing',
        type: 'noun',
        categoryId: 'cat-1',
        iconName: 'Square',
        order: 0,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isDefault: true,
      });
      vi.mocked(dataService.updateWord).mockResolvedValue(undefined);

      const result = await mergeVocabulary(importData, 'merge');

      expect(result.counts.conflicts).toBe(1);
    });
  });

  describe('mergeVocabulary - skip strategy', () => {
    it('should only import items that do not exist with skip strategy', async () => {
      // RED: Test for skip strategy
      const importData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          exportedBy: 'Test User',
          itemCount: { words: 2, categories: 1, resources: 0 },
        },
        data: {
          words: [
            {
              id: 'existing-word',
              text: 'existing',
              type: 'noun',
              categoryId: 'cat-1',
              iconName: 'Square',
              order: 0,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isDefault: false,
            },
            {
              id: 'new-word',
              text: 'new',
              type: 'verb',
              categoryId: 'cat-1',
              iconName: 'Circle',
              order: 1,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isDefault: false,
            },
          ] as Word[],
          categories: [
            {
              id: 'cat-1',
              name: 'Test Category',
              iconName: 'MessageSquare',
              order: 0,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isDefault: false,
            },
          ] as Category[],
          resources: [],
        },
      };

      vi.mocked(dataService.getWord)
        .mockResolvedValueOnce({
          id: 'existing-word',
          text: 'existing',
          type: 'noun',
          categoryId: 'cat-1',
          iconName: 'Square',
          order: 0,
          createdAt: new Date(),
          modifiedAt: new Date(),
          isDefault: true,
        })
        .mockResolvedValueOnce(undefined);
      vi.mocked(dataService.getCategory).mockResolvedValue(undefined);
      vi.mocked(dataService.createWord).mockResolvedValue(importData.data.words[1]);
      vi.mocked(dataService.createCategory).mockResolvedValue(importData.data.categories[0]);

      const result = await mergeVocabulary(importData, 'skip');

      expect(result.success).toBe(true);
      expect(result.counts.wordsSkipped).toBe(1);
      expect(result.counts.wordsImported).toBe(1);
      expect(dataService.createWord).toHaveBeenCalledWith(importData.data.words[1]);
    });
  });

  describe('performance', () => {
    it('should import 1000 words in less than 2 seconds', async () => {
      // RED: Test for performance requirement
      const words: Word[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `word-${i}`,
        text: `word-${i}`,
        type: 'noun' as const,
        categoryId: 'cat-1',
        iconName: 'Square',
        order: i,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isDefault: false,
      }));

      const largeImportData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          exportedBy: 'Test User',
          itemCount: { words: 1000, categories: 1, resources: 0 },
        },
        data: {
          words,
          categories: [
            {
              id: 'cat-1',
              name: 'Test Category',
              iconName: 'MessageSquare',
              order: 0,
              createdAt: new Date(),
              modifiedAt: new Date(),
              isDefault: false,
            },
          ],
          resources: [],
        },
      };

      vi.mocked(dataService.clearAll).mockResolvedValue(undefined);

      const startTime = performance.now();
      await mergeVocabulary(largeImportData, 'replace');
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(2000);
    });
  });
});
