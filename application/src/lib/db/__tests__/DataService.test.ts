import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataService } from '../DataService';
import { AACDatabase } from '../schema';
import type { Word, Category, Settings, Resource, Metadata } from '../schema';

// Mock Dexie database
vi.mock('../schema', () => {
  const createMockTable = () => ({
    add: vi.fn(),
    get: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    toArray: vi.fn(),
    where: vi.fn(() => ({
      equals: vi.fn(() => ({
        toArray: vi.fn()
      }))
    })),
    put: vi.fn()
  });

  const mockWords = createMockTable();
  const mockCategories = createMockTable();
  const mockSettings = createMockTable();
  const mockResources = createMockTable();
  const mockMetadata = createMockTable();

  return {
    AACDatabase: vi.fn(() => ({
      words: mockWords,
      categories: mockCategories,
      settings: mockSettings,
      resources: mockResources,
      metadata: mockMetadata
    })),
    db: {
      words: mockWords,
      categories: mockCategories,
      settings: mockSettings,
      resources: mockResources,
      metadata: mockMetadata
    }
  };
});

describe('DataService', () => {
  let service: DataService;
  let mockDb: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Create fresh service instance
    service = new DataService();
    mockDb = (service as any).db;
  });

  describe('UUID Generation', () => {
    it('should generate valid UUIDs', () => {
      const uuid = (service as any).generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = (service as any).generateUUID();
      const uuid2 = (service as any).generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('Word CRUD Operations', () => {
    describe('createWord', () => {
      it('should create a word with generated ID and timestamps', async () => {
        const wordData = {
          text: 'hello',
          type: 'social' as const,
          categoryId: 'cat-1',
          iconName: 'smile',
          order: 0,
          isDefault: false
        };

        const mockWord: Word = {
          id: 'generated-uuid',
          ...wordData,
          createdAt: new Date(),
          modifiedAt: new Date()
        };

        mockDb.words.add.mockResolvedValue(mockWord.id);
        mockDb.words.get.mockResolvedValue(mockWord);

        const result = await service.createWord(wordData);

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('createdAt');
        expect(result).toHaveProperty('modifiedAt');
        expect(result.text).toBe('hello');
        expect(mockDb.words.add).toHaveBeenCalledWith(
          expect.objectContaining({
            text: 'hello',
            type: 'social',
            categoryId: 'cat-1'
          })
        );
      });

      it('should handle errors during word creation', async () => {
        mockDb.words.add.mockRejectedValue(new Error('DB Error'));

        await expect(service.createWord({
          text: 'test',
          type: 'noun',
          categoryId: 'cat-1',
          iconName: 'box',
          order: 0,
          isDefault: false
        })).rejects.toThrow('Failed to create word');
      });
    });

    describe('getWord', () => {
      it('should retrieve a word by ID', async () => {
        const mockWord: Word = {
          id: 'word-1',
          text: 'hello',
          type: 'social',
          categoryId: 'cat-1',
          iconName: 'smile',
          order: 0,
          createdAt: new Date(),
          modifiedAt: new Date(),
          isDefault: false
        };

        mockDb.words.get.mockResolvedValue(mockWord);

        const result = await service.getWord('word-1');

        expect(result).toEqual(mockWord);
        expect(mockDb.words.get).toHaveBeenCalledWith('word-1');
      });

      it('should return undefined for non-existent word', async () => {
        mockDb.words.get.mockResolvedValue(undefined);

        const result = await service.getWord('non-existent');

        expect(result).toBeUndefined();
      });
    });

    describe('updateWord', () => {
      it('should update word and modify timestamp', async () => {
        mockDb.words.update.mockResolvedValue(1);

        await service.updateWord('word-1', { text: 'updated' });

        expect(mockDb.words.update).toHaveBeenCalledWith(
          'word-1',
          expect.objectContaining({
            text: 'updated',
            modifiedAt: expect.any(Date)
          })
        );
      });

      it('should handle update errors', async () => {
        mockDb.words.update.mockRejectedValue(new Error('DB Error'));

        await expect(service.updateWord('word-1', { text: 'fail' }))
          .rejects.toThrow('Failed to update word');
      });
    });

    describe('deleteWord', () => {
      it('should delete a word by ID', async () => {
        mockDb.words.delete.mockResolvedValue(undefined);

        await service.deleteWord('word-1');

        expect(mockDb.words.delete).toHaveBeenCalledWith('word-1');
      });

      it('should handle delete errors', async () => {
        mockDb.words.delete.mockRejectedValue(new Error('DB Error'));

        await expect(service.deleteWord('word-1'))
          .rejects.toThrow('Failed to delete word');
      });
    });

    describe('getWordsByCategory', () => {
      it('should retrieve words filtered by category', async () => {
        const mockWords: Word[] = [
          {
            id: 'word-1',
            text: 'hello',
            type: 'social',
            categoryId: 'cat-1',
            iconName: 'smile',
            order: 0,
            createdAt: new Date(),
            modifiedAt: new Date(),
            isDefault: false
          }
        ];

        const mockWhere = {
          equals: vi.fn(() => ({
            toArray: vi.fn().mockResolvedValue(mockWords)
          }))
        };
        mockDb.words.where.mockReturnValue(mockWhere);

        const result = await service.getWordsByCategory('cat-1');

        expect(result).toEqual(mockWords);
        expect(mockDb.words.where).toHaveBeenCalledWith('categoryId');
      });
    });

    describe('getAllWords', () => {
      it('should retrieve all words', async () => {
        const mockWords: Word[] = [
          {
            id: 'word-1',
            text: 'hello',
            type: 'social',
            categoryId: 'cat-1',
            iconName: 'smile',
            order: 0,
            createdAt: new Date(),
            modifiedAt: new Date(),
            isDefault: false
          }
        ];

        mockDb.words.toArray.mockResolvedValue(mockWords);

        const result = await service.getAllWords();

        expect(result).toEqual(mockWords);
        expect(mockDb.words.toArray).toHaveBeenCalled();
      });
    });
  });

  describe('Category CRUD Operations', () => {
    describe('createCategory', () => {
      it('should create a category with generated ID and timestamps', async () => {
        const categoryData = {
          name: 'Emotions',
          iconName: 'heart',
          order: 0,
          isDefault: false
        };

        const mockCategory: Category = {
          id: 'generated-uuid',
          ...categoryData,
          createdAt: new Date(),
          modifiedAt: new Date()
        };

        mockDb.categories.add.mockResolvedValue(mockCategory.id);
        mockDb.categories.get.mockResolvedValue(mockCategory);

        const result = await service.createCategory(categoryData);

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('createdAt');
        expect(result.name).toBe('Emotions');
      });
    });

    describe('getCategory', () => {
      it('should retrieve a category by ID', async () => {
        const mockCategory: Category = {
          id: 'cat-1',
          name: 'Emotions',
          iconName: 'heart',
          order: 0,
          createdAt: new Date(),
          modifiedAt: new Date(),
          isDefault: false
        };

        mockDb.categories.get.mockResolvedValue(mockCategory);

        const result = await service.getCategory('cat-1');

        expect(result).toEqual(mockCategory);
      });
    });

    describe('updateCategory', () => {
      it('should update category and modify timestamp', async () => {
        mockDb.categories.update.mockResolvedValue(1);

        await service.updateCategory('cat-1', { name: 'Updated' });

        expect(mockDb.categories.update).toHaveBeenCalledWith(
          'cat-1',
          expect.objectContaining({
            name: 'Updated',
            modifiedAt: expect.any(Date)
          })
        );
      });
    });

    describe('deleteCategory', () => {
      it('should delete a category by ID', async () => {
        mockDb.categories.delete.mockResolvedValue(undefined);

        await service.deleteCategory('cat-1');

        expect(mockDb.categories.delete).toHaveBeenCalledWith('cat-1');
      });
    });

    describe('getAllCategories', () => {
      it('should retrieve all categories', async () => {
        const mockCategories: Category[] = [
          {
            id: 'cat-1',
            name: 'Emotions',
            iconName: 'heart',
            order: 0,
            createdAt: new Date(),
            modifiedAt: new Date(),
            isDefault: false
          }
        ];

        mockDb.categories.toArray.mockResolvedValue(mockCategories);

        const result = await service.getAllCategories();

        expect(result).toEqual(mockCategories);
      });
    });

    describe('getCategoriesByParent', () => {
      it('should retrieve categories filtered by parent ID', async () => {
        const mockCategories: Category[] = [
          {
            id: 'cat-2',
            name: 'Subcategory',
            iconName: 'folder',
            parentId: 'cat-1',
            order: 0,
            createdAt: new Date(),
            modifiedAt: new Date(),
            isDefault: false
          }
        ];

        const mockWhere = {
          equals: vi.fn(() => ({
            toArray: vi.fn().mockResolvedValue(mockCategories)
          }))
        };
        mockDb.categories.where.mockReturnValue(mockWhere);

        const result = await service.getCategoriesByParent('cat-1');

        expect(result).toEqual(mockCategories);
      });

      it('should retrieve root categories when no parent ID provided', async () => {
        const mockCategories: Category[] = [
          {
            id: 'cat-1',
            name: 'Root',
            iconName: 'home',
            order: 0,
            createdAt: new Date(),
            modifiedAt: new Date(),
            isDefault: false
          },
          {
            id: 'cat-2',
            name: 'Child',
            iconName: 'file',
            parentId: 'cat-1',
            order: 0,
            createdAt: new Date(),
            modifiedAt: new Date(),
            isDefault: false
          }
        ];

        mockDb.categories.toArray.mockResolvedValue(mockCategories);

        const result = await service.getCategoriesByParent();

        expect(mockDb.categories.toArray).toHaveBeenCalled();
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Root');
      });
    });
  });

  describe('Settings Operations', () => {
    describe('getSettings', () => {
      it('should retrieve settings singleton', async () => {
        const mockSettings: Settings = {
          id: 'app-settings',
          wordTypeColors: {
            pronoun: { bg: '#fee', border: '#fcc' },
            verb: { bg: '#efe', border: '#cfc' },
            descriptive: { bg: '#eef', border: '#ccf' },
            noun: { bg: '#ffe', border: '#ffc' },
            social: { bg: '#fef', border: '#fcf' }
          },
          voiceSettings: {
            rate: 1,
            pitch: 1,
            volume: 1
          },
          gridLayout: {
            columns: 3
          },
          uiPreferences: {
            showOfflineIndicator: true,
            autoSaveEnabled: true,
            confirmDeletes: true
          },
          modifiedAt: new Date()
        };

        mockDb.settings.get.mockResolvedValue(mockSettings);

        const result = await service.getSettings();

        expect(result).toEqual(mockSettings);
        expect(mockDb.settings.get).toHaveBeenCalledWith('app-settings');
      });

      it('should create default settings if none exist', async () => {
        mockDb.settings.get.mockResolvedValue(undefined);

        const defaultSettings: Settings = {
          id: 'app-settings',
          wordTypeColors: {
            pronoun: { bg: '#fee', border: '#fcc' },
            verb: { bg: '#efe', border: '#cfc' },
            descriptive: { bg: '#eef', border: '#ccf' },
            noun: { bg: '#ffe', border: '#ffc' },
            social: { bg: '#fef', border: '#fcf' }
          },
          voiceSettings: {
            rate: 1,
            pitch: 1,
            volume: 1
          },
          gridLayout: {
            columns: 3
          },
          uiPreferences: {
            showOfflineIndicator: true,
            autoSaveEnabled: true,
            confirmDeletes: true
          },
          modifiedAt: expect.any(Date)
        };

        mockDb.settings.put.mockResolvedValue('app-settings');
        mockDb.settings.get.mockResolvedValueOnce(undefined).mockResolvedValueOnce(defaultSettings);

        const result = await service.getSettings();

        expect(mockDb.settings.put).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'app-settings'
          })
        );
        expect(result.id).toBe('app-settings');
      });
    });

    describe('updateSettings', () => {
      it('should update settings and modify timestamp', async () => {
        mockDb.settings.update.mockResolvedValue(1);

        await service.updateSettings({
          voiceSettings: { rate: 1.5, pitch: 1, volume: 1 }
        });

        expect(mockDb.settings.update).toHaveBeenCalledWith(
          'app-settings',
          expect.objectContaining({
            voiceSettings: { rate: 1.5, pitch: 1, volume: 1 },
            modifiedAt: expect.any(Date)
          })
        );
      });
    });
  });

  describe('Resource CRUD Operations', () => {
    describe('createResource', () => {
      it('should create a resource with generated ID and timestamp', async () => {
        const resourceData = {
          title: 'Getting Started Guide',
          description: 'Learn the basics',
          url: 'https://example.com/guide',
          type: 'article' as const,
          category: 'getting-started' as const,
          isDefault: true
        };

        const mockResource: Resource = {
          id: 'generated-uuid',
          ...resourceData,
          createdAt: new Date()
        };

        mockDb.resources.add.mockResolvedValue(mockResource.id);
        mockDb.resources.get.mockResolvedValue(mockResource);

        const result = await service.createResource(resourceData);

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('createdAt');
        expect(result.title).toBe('Getting Started Guide');
      });
    });

    describe('getResource', () => {
      it('should retrieve a resource by ID', async () => {
        const mockResource: Resource = {
          id: 'res-1',
          title: 'Guide',
          description: 'A guide',
          url: 'https://example.com',
          type: 'article',
          category: 'getting-started',
          createdAt: new Date(),
          isDefault: true
        };

        mockDb.resources.get.mockResolvedValue(mockResource);

        const result = await service.getResource('res-1');

        expect(result).toEqual(mockResource);
      });
    });

    describe('updateResource', () => {
      it('should update resource', async () => {
        mockDb.resources.update.mockResolvedValue(1);

        await service.updateResource('res-1', { title: 'Updated' });

        expect(mockDb.resources.update).toHaveBeenCalledWith(
          'res-1',
          { title: 'Updated' }
        );
      });
    });

    describe('deleteResource', () => {
      it('should delete a resource by ID', async () => {
        mockDb.resources.delete.mockResolvedValue(undefined);

        await service.deleteResource('res-1');

        expect(mockDb.resources.delete).toHaveBeenCalledWith('res-1');
      });
    });

    describe('getResourcesByCategory', () => {
      it('should retrieve resources filtered by category', async () => {
        const mockResources: Resource[] = [
          {
            id: 'res-1',
            title: 'Guide',
            description: 'A guide',
            url: 'https://example.com',
            type: 'article',
            category: 'getting-started',
            createdAt: new Date(),
            isDefault: true
          }
        ];

        const mockWhere = {
          equals: vi.fn(() => ({
            toArray: vi.fn().mockResolvedValue(mockResources)
          }))
        };
        mockDb.resources.where.mockReturnValue(mockWhere);

        const result = await service.getResourcesByCategory('getting-started');

        expect(result).toEqual(mockResources);
      });
    });
  });

  describe('Metadata Operations', () => {
    describe('getMetadata', () => {
      it('should retrieve metadata singleton', async () => {
        const mockMetadata: Metadata = {
          id: 'app-metadata',
          schemaVersion: 1,
          appVersion: '1.0.0',
          lastModified: new Date(),
          statistics: {
            totalWords: 0,
            customWords: 0,
            totalCategories: 0,
            customCategories: 0,
            customImages: 0,
            storageUsedMB: 0
          }
        };

        mockDb.metadata.get.mockResolvedValue(mockMetadata);

        const result = await service.getMetadata();

        expect(result).toEqual(mockMetadata);
      });

      it('should create default metadata if none exists', async () => {
        mockDb.metadata.get.mockResolvedValue(undefined);

        const defaultMetadata: Metadata = {
          id: 'app-metadata',
          schemaVersion: 1,
          appVersion: '1.0.0',
          lastModified: expect.any(Date),
          statistics: {
            totalWords: 0,
            customWords: 0,
            totalCategories: 0,
            customCategories: 0,
            customImages: 0,
            storageUsedMB: 0
          }
        };

        mockDb.metadata.put.mockResolvedValue('app-metadata');
        mockDb.metadata.get.mockResolvedValueOnce(undefined).mockResolvedValueOnce(defaultMetadata);

        const result = await service.getMetadata();

        expect(mockDb.metadata.put).toHaveBeenCalled();
        expect(result.id).toBe('app-metadata');
      });
    });

    describe('updateMetadata', () => {
      it('should update metadata and modify timestamp', async () => {
        mockDb.metadata.update.mockResolvedValue(1);

        await service.updateMetadata({
          statistics: {
            totalWords: 10,
            customWords: 5,
            totalCategories: 3,
            customCategories: 1,
            customImages: 2,
            storageUsedMB: 0.5
          }
        });

        expect(mockDb.metadata.update).toHaveBeenCalledWith(
          'app-metadata',
          expect.objectContaining({
            statistics: expect.any(Object),
            lastModified: expect.any(Date)
          })
        );
      });
    });
  });
});
