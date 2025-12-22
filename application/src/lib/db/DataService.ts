import { db } from './schema';
import type { Word, Category, Settings, Resource, Metadata } from './schema';

/**
 * DataService provides CRUD operations for all IndexedDB object stores
 *
 * WHY: Centralized data access layer ensures consistent error handling,
 * automatic timestamp management, and simplified database operations.
 *
 * REASON: Service pattern separates data access from UI components,
 * making the codebase more maintainable and testable.
 */
export class DataService {
  private db: typeof db;

  constructor() {
    this.db = db;
  }

  /**
   * Generate UUID v4
   * REASON: Uses crypto.randomUUID() for cryptographically secure IDs
   */
  private generateUUID(): string {
    return crypto.randomUUID();
  }

  /**
   * Get current timestamp
   */
  private now(): Date {
    return new Date();
  }

  // ==================== WORD OPERATIONS ====================

  /**
   * Create a new word
   * NOTE: Automatically generates ID, createdAt, and modifiedAt timestamps
   */
  async createWord(word: Omit<Word, 'id' | 'createdAt' | 'modifiedAt'>): Promise<Word> {
    try {
      const now = this.now();
      const newWord: Word = {
        id: this.generateUUID(),
        ...word,
        createdAt: now,
        modifiedAt: now
      };

      await this.db.words.add(newWord);

      // Return the created word
      const created = await this.db.words.get(newWord.id);
      if (!created) {
        throw new Error('Failed to retrieve created word');
      }

      return created;
    } catch (error) {
      console.error('Error creating word:', error);
      throw new Error('Failed to create word: ' + (error as Error).message);
    }
  }

  /**
   * Get word by ID
   */
  async getWord(id: string): Promise<Word | undefined> {
    try {
      return await this.db.words.get(id);
    } catch (error) {
      console.error('Error getting word:', error);
      throw new Error('Failed to get word: ' + (error as Error).message);
    }
  }

  /**
   * Update word
   * NOTE: Automatically updates modifiedAt timestamp
   */
  async updateWord(id: string, changes: Partial<Word>): Promise<void> {
    try {
      const updates = {
        ...changes,
        modifiedAt: this.now()
      };

      await this.db.words.update(id, updates);
    } catch (error) {
      console.error('Error updating word:', error);
      throw new Error('Failed to update word: ' + (error as Error).message);
    }
  }

  /**
   * Delete word by ID
   */
  async deleteWord(id: string): Promise<void> {
    try {
      await this.db.words.delete(id);
    } catch (error) {
      console.error('Error deleting word:', error);
      throw new Error('Failed to delete word: ' + (error as Error).message);
    }
  }

  /**
   * Get all words in a category
   */
  async getWordsByCategory(categoryId: string): Promise<Word[]> {
    try {
      return await this.db.words
        .where('categoryId')
        .equals(categoryId)
        .toArray();
    } catch (error) {
      console.error('Error getting words by category:', error);
      throw new Error('Failed to get words by category: ' + (error as Error).message);
    }
  }

  /**
   * Get all words
   */
  async getAllWords(): Promise<Word[]> {
    try {
      return await this.db.words.toArray();
    } catch (error) {
      console.error('Error getting all words:', error);
      throw new Error('Failed to get all words: ' + (error as Error).message);
    }
  }

  // ==================== CATEGORY OPERATIONS ====================

  /**
   * Create a new category
   * NOTE: Automatically generates ID, createdAt, and modifiedAt timestamps
   */
  async createCategory(category: Omit<Category, 'id' | 'createdAt' | 'modifiedAt'>): Promise<Category> {
    try {
      const now = this.now();
      const newCategory: Category = {
        id: this.generateUUID(),
        ...category,
        createdAt: now,
        modifiedAt: now
      };

      await this.db.categories.add(newCategory);

      // Return the created category
      const created = await this.db.categories.get(newCategory.id);
      if (!created) {
        throw new Error('Failed to retrieve created category');
      }

      return created;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category: ' + (error as Error).message);
    }
  }

  /**
   * Get category by ID
   */
  async getCategory(id: string): Promise<Category | undefined> {
    try {
      return await this.db.categories.get(id);
    } catch (error) {
      console.error('Error getting category:', error);
      throw new Error('Failed to get category: ' + (error as Error).message);
    }
  }

  /**
   * Update category
   * NOTE: Automatically updates modifiedAt timestamp
   */
  async updateCategory(id: string, changes: Partial<Category>): Promise<void> {
    try {
      const updates = {
        ...changes,
        modifiedAt: this.now()
      };

      await this.db.categories.update(id, updates);
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category: ' + (error as Error).message);
    }
  }

  /**
   * Delete category by ID
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      await this.db.categories.delete(id);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category: ' + (error as Error).message);
    }
  }

  /**
   * Get all categories
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.db.categories.toArray();
    } catch (error) {
      console.error('Error getting all categories:', error);
      throw new Error('Failed to get all categories: ' + (error as Error).message);
    }
  }

  /**
   * Get categories by parent ID
   * NOTE: Pass undefined to get root categories (no parent)
   * WHY: Dexie doesn't support undefined as a key value, so we filter manually for root categories
   */
  async getCategoriesByParent(parentId?: string): Promise<Category[]> {
    try {
      if (parentId === undefined) {
        // Get all categories and filter for those without a parent
        const allCategories = await this.db.categories.toArray();
        return allCategories.filter(cat => cat.parentId === undefined);
      }

      return await this.db.categories
        .where('parentId')
        .equals(parentId)
        .toArray();
    } catch (error) {
      console.error('Error getting categories by parent:', error);
      throw new Error('Failed to get categories by parent: ' + (error as Error).message);
    }
  }

  // ==================== SETTINGS OPERATIONS ====================

  /**
   * Create default settings
   * WHY: Provides sensible defaults for first-time users
   */
  private createDefaultSettings(): Settings {
    return {
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
      modifiedAt: this.now()
    };
  }

  /**
   * Get settings (singleton)
   * NOTE: Creates default settings if none exist
   */
  async getSettings(): Promise<Settings> {
    try {
      let settings = await this.db.settings.get('app-settings');

      if (!settings) {
        // Create default settings
        settings = this.createDefaultSettings();
        await this.db.settings.put(settings);
      }

      return settings;
    } catch (error) {
      console.error('Error getting settings:', error);
      throw new Error('Failed to get settings: ' + (error as Error).message);
    }
  }

  /**
   * Update settings
   * NOTE: Automatically updates modifiedAt timestamp
   * WHY: Deep merge ensures nested objects like voiceSettings are properly updated
   */
  async updateSettings(changes: Partial<Omit<Settings, 'id'>>): Promise<void> {
    try {
      // Get current settings to properly merge nested objects
      const currentSettings = await this.getSettings();

      // Deep merge changes with current settings
      const updates: Partial<Settings> = {
        ...changes,
        modifiedAt: this.now()
      };

      // Merge nested objects explicitly
      if (changes.wordTypeColors) {
        updates.wordTypeColors = {
          ...currentSettings.wordTypeColors,
          ...changes.wordTypeColors
        };
      }
      if (changes.voiceSettings) {
        updates.voiceSettings = {
          ...currentSettings.voiceSettings,
          ...changes.voiceSettings
        };
      }
      if (changes.gridLayout) {
        updates.gridLayout = {
          ...currentSettings.gridLayout,
          ...changes.gridLayout
        };
      }
      if (changes.uiPreferences) {
        updates.uiPreferences = {
          ...currentSettings.uiPreferences,
          ...changes.uiPreferences
        };
      }

      await this.db.settings.update('app-settings', updates);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw new Error('Failed to update settings: ' + (error as Error).message);
    }
  }

  // ==================== RESOURCE OPERATIONS ====================

  /**
   * Create a new resource
   * NOTE: Automatically generates ID and createdAt timestamp
   */
  async createResource(resource: Omit<Resource, 'id' | 'createdAt'>): Promise<Resource> {
    try {
      const newResource: Resource = {
        id: this.generateUUID(),
        ...resource,
        createdAt: this.now()
      };

      await this.db.resources.add(newResource);

      // Return the created resource
      const created = await this.db.resources.get(newResource.id);
      if (!created) {
        throw new Error('Failed to retrieve created resource');
      }

      return created;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw new Error('Failed to create resource: ' + (error as Error).message);
    }
  }

  /**
   * Get resource by ID
   */
  async getResource(id: string): Promise<Resource | undefined> {
    try {
      return await this.db.resources.get(id);
    } catch (error) {
      console.error('Error getting resource:', error);
      throw new Error('Failed to get resource: ' + (error as Error).message);
    }
  }

  /**
   * Update resource
   * NOTE: Resources don't have modifiedAt, so no automatic timestamp update
   */
  async updateResource(id: string, changes: Partial<Resource>): Promise<void> {
    try {
      await this.db.resources.update(id, changes);
    } catch (error) {
      console.error('Error updating resource:', error);
      throw new Error('Failed to update resource: ' + (error as Error).message);
    }
  }

  /**
   * Delete resource by ID
   */
  async deleteResource(id: string): Promise<void> {
    try {
      await this.db.resources.delete(id);
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw new Error('Failed to delete resource: ' + (error as Error).message);
    }
  }

  /**
   * Get resources by category
   */
  async getResourcesByCategory(category: string): Promise<Resource[]> {
    try {
      return await this.db.resources
        .where('category')
        .equals(category)
        .toArray();
    } catch (error) {
      console.error('Error getting resources by category:', error);
      throw new Error('Failed to get resources by category: ' + (error as Error).message);
    }
  }

  /**
   * Get all resources
   */
  async getAllResources(): Promise<Resource[]> {
    try {
      return await this.db.resources.toArray();
    } catch (error) {
      console.error('Error getting all resources:', error);
      throw new Error('Failed to get all resources: ' + (error as Error).message);
    }
  }

  // ==================== METADATA OPERATIONS ====================

  /**
   * Create default metadata
   * WHY: Initializes app metadata with version and statistics
   */
  private createDefaultMetadata(): Metadata {
    return {
      id: 'app-metadata',
      schemaVersion: 1,
      appVersion: '1.0.0',
      lastModified: this.now(),
      statistics: {
        totalWords: 0,
        customWords: 0,
        totalCategories: 0,
        customCategories: 0,
        customImages: 0,
        storageUsedMB: 0
      }
    };
  }

  /**
   * Get metadata (singleton)
   * NOTE: Creates default metadata if none exists
   */
  async getMetadata(): Promise<Metadata> {
    try {
      let metadata = await this.db.metadata.get('app-metadata');

      if (!metadata) {
        // Create default metadata
        metadata = this.createDefaultMetadata();
        await this.db.metadata.put(metadata);
      }

      return metadata;
    } catch (error) {
      console.error('Error getting metadata:', error);
      throw new Error('Failed to get metadata: ' + (error as Error).message);
    }
  }

  /**
   * Update metadata
   * NOTE: Automatically updates lastModified timestamp
   * WHY: Deep merge ensures nested statistics object is properly updated
   */
  async updateMetadata(changes: Partial<Omit<Metadata, 'id'>>): Promise<void> {
    try {
      // Get current metadata to properly merge nested objects
      const currentMetadata = await this.getMetadata();

      // Deep merge changes with current metadata
      const updates: Partial<Metadata> = {
        ...changes,
        lastModified: this.now()
      };

      // Merge statistics object if provided
      if (changes.statistics) {
        updates.statistics = {
          ...currentMetadata.statistics,
          ...changes.statistics
        };
      }

      await this.db.metadata.update('app-metadata', updates);
    } catch (error) {
      console.error('Error updating metadata:', error);
      throw new Error('Failed to update metadata: ' + (error as Error).message);
    }
  }

  // ==================== UTILITY OPERATIONS ====================

  /**
   * Clear all data from all object stores
   * WHY: Enable complete database reset for import replace strategy
   * REASON: Restore from backup requires clearing existing data first
   * NOTE: Does not delete settings or metadata (preserves app configuration)
   */
  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        this.db.words.clear(),
        this.db.categories.clear(),
        this.db.resources.clear(),
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear all data: ' + (error as Error).message);
    }
  }
}

// Export singleton instance
export const dataService = new DataService();
