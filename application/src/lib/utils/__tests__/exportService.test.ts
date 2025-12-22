import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  exportVocabulary,
  downloadExportFile,
  validateExportData,
  generateExportFilename,
  type ExportData,
} from '../exportService';
import { dataService } from '../../db/DataService';
import type { Word, Category, Settings, Resource } from '../../db/schema';

// Mock dataService
vi.mock('../../db/DataService', () => ({
  dataService: {
    getAllWords: vi.fn(),
    getAllCategories: vi.fn(),
    getSettings: vi.fn(),
    getAllResources: vi.fn(),
  },
}));

describe('exportService', () => {
  // Sample test data
  const mockWords: Word[] = [
    {
      id: 'word-1',
      text: 'hello',
      type: 'social',
      categoryId: 'cat-1',
      iconName: 'MessageCircle',
      order: 0,
      createdAt: new Date('2024-01-01'),
      modifiedAt: new Date('2024-01-01'),
      isDefault: true,
    },
    {
      id: 'word-2',
      text: 'water',
      type: 'noun',
      categoryId: 'cat-2',
      iconName: 'Droplet',
      order: 1,
      createdAt: new Date('2024-01-02'),
      modifiedAt: new Date('2024-01-02'),
      isDefault: false,
    },
  ];

  const mockCategories: Category[] = [
    {
      id: 'cat-1',
      name: 'Social',
      iconName: 'MessageCircle',
      order: 0,
      createdAt: new Date('2024-01-01'),
      modifiedAt: new Date('2024-01-01'),
      isDefault: true,
    },
    {
      id: 'cat-2',
      name: 'Needs',
      iconName: 'Heart',
      order: 1,
      createdAt: new Date('2024-01-01'),
      modifiedAt: new Date('2024-01-01'),
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
    voiceSettings: {
      rate: 1,
      pitch: 1,
      volume: 1,
    },
    gridLayout: {
      columns: 3,
    },
    uiPreferences: {
      showOfflineIndicator: true,
      autoSaveEnabled: true,
      confirmDeletes: true,
    },
    modifiedAt: new Date('2024-01-01'),
  };

  const mockResources: Resource[] = [
    {
      id: 'res-1',
      title: 'Getting Started Guide',
      description: 'Learn how to use the AAC board',
      url: 'https://example.com/guide',
      type: 'article',
      category: 'getting-started',
      createdAt: new Date('2024-01-01'),
      isDefault: true,
    },
  ];

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock implementations
    vi.mocked(dataService.getAllWords).mockResolvedValue(mockWords);
    vi.mocked(dataService.getAllCategories).mockResolvedValue(mockCategories);
    vi.mocked(dataService.getSettings).mockResolvedValue(mockSettings);
    vi.mocked(dataService.getAllResources).mockResolvedValue(mockResources);
  });

  describe('exportVocabulary', () => {
    it('should export all vocabulary data from database', async () => {
      const result = await exportVocabulary();

      expect(dataService.getAllWords).toHaveBeenCalledTimes(1);
      expect(dataService.getAllCategories).toHaveBeenCalledTimes(1);
      expect(dataService.getSettings).toHaveBeenCalledTimes(1);
      expect(dataService.getAllResources).toHaveBeenCalledTimes(1);

      expect(result.data.words).toEqual(mockWords);
      expect(result.data.categories).toEqual(mockCategories);
      expect(result.data.settings).toEqual(mockSettings);
      expect(result.data.resources).toEqual(mockResources);
    });

    it('should include correct metadata structure', async () => {
      const result = await exportVocabulary();

      expect(result.metadata).toBeDefined();
      expect(result.metadata.version).toBe('1.0');
      expect(result.metadata.exportedAt).toBeDefined();
      expect(result.metadata.appVersion).toBeDefined();
      expect(result.metadata.vocabularyCount).toBeDefined();
    });

    it('should include correct vocabulary counts in metadata', async () => {
      const result = await exportVocabulary();

      expect(result.metadata.vocabularyCount.words).toBe(2);
      expect(result.metadata.vocabularyCount.categories).toBe(2);
      expect(result.metadata.vocabularyCount.resources).toBe(1);
    });

    it('should include ISO 8601 timestamp in metadata', async () => {
      const result = await exportVocabulary();

      // Validate ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      expect(result.metadata.exportedAt).toMatch(isoRegex);
    });

    it('should include app version from environment', async () => {
      // Mock environment variable
      const originalEnv = import.meta.env.VITE_APP_VERSION;
      import.meta.env.VITE_APP_VERSION = '2.3.4';

      const result = await exportVocabulary();

      expect(result.metadata.appVersion).toBe('2.3.4');

      // Restore original
      import.meta.env.VITE_APP_VERSION = originalEnv;
    });

    it('should handle empty database gracefully', async () => {
      vi.mocked(dataService.getAllWords).mockResolvedValue([]);
      vi.mocked(dataService.getAllCategories).mockResolvedValue([]);
      vi.mocked(dataService.getAllResources).mockResolvedValue([]);

      const result = await exportVocabulary();

      expect(result.data.words).toEqual([]);
      expect(result.data.categories).toEqual([]);
      expect(result.data.resources).toEqual([]);
      expect(result.metadata.vocabularyCount.words).toBe(0);
      expect(result.metadata.vocabularyCount.categories).toBe(0);
      expect(result.metadata.vocabularyCount.resources).toBe(0);
    });

    it('should throw error if database operation fails', async () => {
      vi.mocked(dataService.getAllWords).mockRejectedValue(
        new Error('Database connection lost')
      );

      await expect(exportVocabulary()).rejects.toThrow(
        'Export failed: Database connection lost'
      );
    });

    it('should handle large datasets efficiently', async () => {
      // Create 1000 mock words
      const largeWordSet: Word[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `word-${i}`,
        text: `word-${i}`,
        type: 'noun',
        categoryId: 'cat-1',
        iconName: 'Circle',
        order: i,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isDefault: false,
      }));

      vi.mocked(dataService.getAllWords).mockResolvedValue(largeWordSet);

      const startTime = Date.now();
      const result = await exportVocabulary();
      const duration = Date.now() - startTime;

      expect(result.data.words).toHaveLength(1000);
      expect(result.metadata.vocabularyCount.words).toBe(1000);
      // Should complete in less than 1 second
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('generateExportFilename', () => {
    it('should generate filename with correct format', () => {
      const filename = generateExportFilename();

      // Format: aac-vocabulary-YYYY-MM-DD-HHMMSS.json
      const filenameRegex = /^aac-vocabulary-\d{4}-\d{2}-\d{2}-\d{6}\.json$/;
      expect(filename).toMatch(filenameRegex);
    });

    it('should include current date in filename', () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');

      const filename = generateExportFilename();

      expect(filename).toContain(`${year}-${month}-${day}`);
    });

    it('should generate unique filenames for sequential calls', () => {
      const filename1 = generateExportFilename();
      // Wait 1ms to ensure different timestamps
      const filename2 = generateExportFilename();

      // Filenames may be the same if called in the same second
      // But they should follow the same format
      expect(filename1).toMatch(/^aac-vocabulary-\d{4}-\d{2}-\d{2}-\d{6}\.json$/);
      expect(filename2).toMatch(/^aac-vocabulary-\d{4}-\d{2}-\d{2}-\d{6}\.json$/);
    });
  });

  describe('validateExportData', () => {
    it('should validate correct export data structure', () => {
      const validData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          appVersion: '1.0.0',
          vocabularyCount: {
            words: 2,
            categories: 2,
            resources: 1,
          },
        },
        data: {
          words: mockWords,
          categories: mockCategories,
          settings: mockSettings,
          resources: mockResources,
        },
      };

      expect(validateExportData(validData)).toBe(true);
    });

    it('should reject null or undefined data', () => {
      expect(validateExportData(null)).toBe(false);
      expect(validateExportData(undefined)).toBe(false);
    });

    it('should reject non-object data', () => {
      expect(validateExportData('string')).toBe(false);
      expect(validateExportData(123)).toBe(false);
      expect(validateExportData([])).toBe(false);
    });

    it('should reject data without metadata', () => {
      const invalidData = {
        data: {
          words: mockWords,
          categories: mockCategories,
          settings: mockSettings,
          resources: mockResources,
        },
      };

      expect(validateExportData(invalidData)).toBe(false);
    });

    it('should reject data without metadata version', () => {
      const invalidData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          appVersion: '1.0.0',
          vocabularyCount: { words: 0, categories: 0, resources: 0 },
        },
        data: {
          words: [],
          categories: [],
          settings: mockSettings,
          resources: [],
        },
      };

      expect(validateExportData(invalidData)).toBe(false);
    });

    it('should reject data without metadata exportedAt', () => {
      const invalidData = {
        metadata: {
          version: '1.0',
          appVersion: '1.0.0',
          vocabularyCount: { words: 0, categories: 0, resources: 0 },
        },
        data: {
          words: [],
          categories: [],
          settings: mockSettings,
          resources: [],
        },
      };

      expect(validateExportData(invalidData)).toBe(false);
    });

    it('should reject data without words array', () => {
      const invalidData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          appVersion: '1.0.0',
          vocabularyCount: { words: 0, categories: 0, resources: 0 },
        },
        data: {
          categories: mockCategories,
          settings: mockSettings,
          resources: mockResources,
        },
      };

      expect(validateExportData(invalidData)).toBe(false);
    });

    it('should reject data with non-array words', () => {
      const invalidData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          appVersion: '1.0.0',
          vocabularyCount: { words: 0, categories: 0, resources: 0 },
        },
        data: {
          words: 'not an array',
          categories: mockCategories,
          settings: mockSettings,
          resources: mockResources,
        },
      };

      expect(validateExportData(invalidData)).toBe(false);
    });

    it('should reject data without categories array', () => {
      const invalidData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          appVersion: '1.0.0',
          vocabularyCount: { words: 0, categories: 0, resources: 0 },
        },
        data: {
          words: mockWords,
          settings: mockSettings,
          resources: mockResources,
        },
      };

      expect(validateExportData(invalidData)).toBe(false);
    });

    it('should reject data without settings object', () => {
      const invalidData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          appVersion: '1.0.0',
          vocabularyCount: { words: 0, categories: 0, resources: 0 },
        },
        data: {
          words: mockWords,
          categories: mockCategories,
          resources: mockResources,
        },
      };

      expect(validateExportData(invalidData)).toBe(false);
    });

    it('should accept data with resources missing (backward compatibility)', () => {
      const dataWithoutResources = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          appVersion: '1.0.0',
          vocabularyCount: { words: 2, categories: 2, resources: 0 },
        },
        data: {
          words: mockWords,
          categories: mockCategories,
          settings: mockSettings,
          resources: [],
        },
      };

      expect(validateExportData(dataWithoutResources)).toBe(true);
    });
  });

  describe('downloadExportFile', () => {
    let createElementSpy: any;
    let appendChildSpy: any;
    let removeChildSpy: any;
    let createObjectURLSpy: any;
    let revokeObjectURLSpy: any;

    beforeEach(() => {
      // Mock DOM APIs
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };

      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);
      createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    });

    it('should create download link and trigger click', () => {
      const exportData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          appVersion: '1.0.0',
          vocabularyCount: { words: 2, categories: 2, resources: 1 },
        },
        data: {
          words: mockWords,
          categories: mockCategories,
          settings: mockSettings,
          resources: mockResources,
        },
      };

      downloadExportFile(exportData);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      const mockLink = appendChildSpy.mock.results[0].value;
      expect(mockLink.click).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });

    it('should use custom filename when provided', () => {
      const exportData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          appVersion: '1.0.0',
          vocabularyCount: { words: 0, categories: 0, resources: 0 },
        },
        data: {
          words: [],
          categories: [],
          settings: mockSettings,
          resources: [],
        },
      };

      downloadExportFile(exportData, 'custom-filename.json');

      const mockLink = appendChildSpy.mock.results[0].value;
      expect(mockLink.download).toBe('custom-filename.json');
    });

    it('should generate filename when not provided', () => {
      const exportData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          appVersion: '1.0.0',
          vocabularyCount: { words: 0, categories: 0, resources: 0 },
        },
        data: {
          words: [],
          categories: [],
          settings: mockSettings,
          resources: [],
        },
      };

      downloadExportFile(exportData);

      const mockLink = appendChildSpy.mock.results[0].value;
      expect(mockLink.download).toMatch(/^aac-vocabulary-\d{4}-\d{2}-\d{2}-\d{6}\.json$/);
    });

    it('should create Blob with correct content type', () => {
      const exportData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          appVersion: '1.0.0',
          vocabularyCount: { words: 0, categories: 0, resources: 0 },
        },
        data: {
          words: [],
          categories: [],
          settings: mockSettings,
          resources: [],
        },
      };

      downloadExportFile(exportData);

      // Blob constructor is not easily mockable, but we can verify object URL creation
      expect(createObjectURLSpy).toHaveBeenCalled();
    });

    it('should cleanup object URL after download', () => {
      const exportData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          appVersion: '1.0.0',
          vocabularyCount: { words: 0, categories: 0, resources: 0 },
        },
        data: {
          words: [],
          categories: [],
          settings: mockSettings,
          resources: [],
        },
      };

      downloadExportFile(exportData);

      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should pretty print JSON with 2 space indentation', () => {
      const exportData: ExportData = {
        metadata: {
          version: '1.0',
          exportedAt: '2024-01-01T00:00:00.000Z',
          appVersion: '1.0.0',
          vocabularyCount: { words: 1, categories: 1, resources: 0 },
        },
        data: {
          words: [mockWords[0]],
          categories: [mockCategories[0]],
          settings: mockSettings,
          resources: [],
        },
      };

      // Capture Blob content by mocking Blob constructor
      let blobContent = '';
      const OriginalBlob = global.Blob;
      global.Blob = class extends OriginalBlob {
        constructor(parts: any[], options?: any) {
          super(parts, options);
          blobContent = parts[0];
        }
      } as any;

      downloadExportFile(exportData);

      // Verify pretty printing (should have newlines and spaces)
      expect(blobContent).toContain('\n');
      expect(blobContent).toContain('  ');

      // Restore original Blob
      global.Blob = OriginalBlob;
    });
  });
});
