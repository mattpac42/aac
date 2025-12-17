import { describe, it, expect, beforeEach } from 'vitest';
import { dataService } from '../DataService';
import { db } from '../schema';

/**
 * Integration tests for DataService with real IndexedDB
 *
 * WHY: Validates that DataService works correctly with Dexie and IndexedDB
 * NOTE: These tests use fake-indexeddb to simulate a real database environment
 */
describe('DataService Integration Tests', () => {
  beforeEach(async () => {
    // Clear all tables before each test
    await db.words.clear();
    await db.categories.clear();
    await db.resources.clear();
    await db.settings.delete('app-settings');
    await db.metadata.delete('app-metadata');
  });

  describe('End-to-End Word Workflow', () => {
    it('should create, read, update, and delete a word', async () => {
      // Create a category first
      const category = await dataService.createCategory({
        name: 'Test Category',
        iconName: 'folder',
        order: 0,
        isDefault: false
      });

      // Create a word
      const word = await dataService.createWord({
        text: 'hello',
        type: 'social',
        categoryId: category.id,
        iconName: 'smile',
        order: 0,
        isDefault: false
      });

      expect(word.id).toBeDefined();
      expect(word.text).toBe('hello');
      expect(word.createdAt).toBeInstanceOf(Date);
      expect(word.modifiedAt).toBeInstanceOf(Date);

      // Read the word
      const retrieved = await dataService.getWord(word.id);
      expect(retrieved).toEqual(word);

      // Update the word
      const originalModifiedAt = word.modifiedAt;
      await new Promise(resolve => setTimeout(resolve, 10)); // Ensure timestamp difference
      await dataService.updateWord(word.id, { text: 'goodbye' });

      const updated = await dataService.getWord(word.id);
      expect(updated?.text).toBe('goodbye');
      expect(updated?.modifiedAt.getTime()).toBeGreaterThan(originalModifiedAt.getTime());

      // Delete the word
      await dataService.deleteWord(word.id);
      const deleted = await dataService.getWord(word.id);
      expect(deleted).toBeUndefined();
    });

    it('should filter words by category', async () => {
      const cat1 = await dataService.createCategory({
        name: 'Category 1',
        iconName: 'folder',
        order: 0,
        isDefault: false
      });

      const cat2 = await dataService.createCategory({
        name: 'Category 2',
        iconName: 'folder',
        order: 1,
        isDefault: false
      });

      await dataService.createWord({
        text: 'word1',
        type: 'noun',
        categoryId: cat1.id,
        iconName: 'box',
        order: 0,
        isDefault: false
      });

      await dataService.createWord({
        text: 'word2',
        type: 'noun',
        categoryId: cat2.id,
        iconName: 'box',
        order: 0,
        isDefault: false
      });

      await dataService.createWord({
        text: 'word3',
        type: 'noun',
        categoryId: cat1.id,
        iconName: 'box',
        order: 1,
        isDefault: false
      });

      const cat1Words = await dataService.getWordsByCategory(cat1.id);
      expect(cat1Words).toHaveLength(2);
      expect(cat1Words.map(w => w.text).sort()).toEqual(['word1', 'word3']);

      const cat2Words = await dataService.getWordsByCategory(cat2.id);
      expect(cat2Words).toHaveLength(1);
      expect(cat2Words[0].text).toBe('word2');
    });
  });

  describe('Settings Singleton', () => {
    it('should create default settings on first access', async () => {
      const settings = await dataService.getSettings();

      expect(settings.id).toBe('app-settings');
      expect(settings.wordTypeColors).toBeDefined();
      expect(settings.voiceSettings.rate).toBe(1);
      expect(settings.gridLayout.columns).toBe(3);
    });

    it('should persist settings updates', async () => {
      await dataService.updateSettings({
        voiceSettings: { rate: 1.5, pitch: 1.2, volume: 0.8 }
      });

      const settings = await dataService.getSettings();
      expect(settings.voiceSettings.rate).toBe(1.5);
      expect(settings.voiceSettings.pitch).toBe(1.2);
      expect(settings.voiceSettings.volume).toBe(0.8);
    });
  });

  describe('Metadata Singleton', () => {
    it('should create default metadata on first access', async () => {
      const metadata = await dataService.getMetadata();

      expect(metadata.id).toBe('app-metadata');
      expect(metadata.schemaVersion).toBe(1);
      expect(metadata.appVersion).toBe('1.0.0');
      expect(metadata.statistics.totalWords).toBe(0);
    });

    it('should update statistics correctly', async () => {
      await dataService.updateMetadata({
        statistics: {
          totalWords: 10,
          customWords: 5,
          totalCategories: 3,
          customCategories: 1,
          customImages: 2,
          storageUsedMB: 0.5
        }
      });

      const metadata = await dataService.getMetadata();
      expect(metadata.statistics.totalWords).toBe(10);
      expect(metadata.statistics.customWords).toBe(5);
    });
  });

  describe('Category Hierarchy', () => {
    it('should retrieve categories by parent ID', async () => {
      const parent = await dataService.createCategory({
        name: 'Parent',
        iconName: 'folder',
        order: 0,
        isDefault: false
      });

      const child1 = await dataService.createCategory({
        name: 'Child 1',
        iconName: 'file',
        parentId: parent.id,
        order: 0,
        isDefault: false
      });

      const child2 = await dataService.createCategory({
        name: 'Child 2',
        iconName: 'file',
        parentId: parent.id,
        order: 1,
        isDefault: false
      });

      const children = await dataService.getCategoriesByParent(parent.id);
      expect(children).toHaveLength(2);
      expect(children.map(c => c.name).sort()).toEqual(['Child 1', 'Child 2']);
    });

    it('should retrieve root categories when parent is undefined', async () => {
      await dataService.createCategory({
        name: 'Root 1',
        iconName: 'home',
        order: 0,
        isDefault: false
      });

      const parent = await dataService.createCategory({
        name: 'Root 2',
        iconName: 'home',
        order: 1,
        isDefault: false
      });

      await dataService.createCategory({
        name: 'Child',
        iconName: 'file',
        parentId: parent.id,
        order: 0,
        isDefault: false
      });

      const rootCategories = await dataService.getCategoriesByParent(undefined);
      expect(rootCategories).toHaveLength(2);
      expect(rootCategories.map(c => c.name).sort()).toEqual(['Root 1', 'Root 2']);
    });
  });

  describe('Resource Management', () => {
    it('should create and retrieve resources by category', async () => {
      await dataService.createResource({
        title: 'Getting Started',
        description: 'Introduction guide',
        url: 'https://example.com/guide',
        type: 'article',
        category: 'getting-started',
        isDefault: true
      });

      await dataService.createResource({
        title: 'Advanced Tips',
        description: 'Expert tips',
        url: 'https://example.com/tips',
        type: 'video',
        category: 'tips-for-partners',
        isDefault: true
      });

      const gettingStartedResources = await dataService.getResourcesByCategory('getting-started');
      expect(gettingStartedResources).toHaveLength(1);
      expect(gettingStartedResources[0].title).toBe('Getting Started');

      const tipsResources = await dataService.getResourcesByCategory('tips-for-partners');
      expect(tipsResources).toHaveLength(1);
      expect(tipsResources[0].title).toBe('Advanced Tips');
    });
  });
});
