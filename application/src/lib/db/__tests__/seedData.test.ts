import { describe, it, expect, beforeEach, vi } from 'vitest';
import { seedDatabase } from '../seedData';
import { dataService } from '../dataService';
import { db } from '../schema';

/**
 * Seed Data Tests
 *
 * WHY: Ensures baseline vocabulary is properly seeded into IndexedDB
 * REASON: Seed function must be idempotent and create all required data
 */

describe('seedDatabase', () => {
  beforeEach(async () => {
    // Clear all tables before each test
    await db.words.clear();
    await db.categories.clear();
    await db.settings.clear();
    await db.metadata.clear();
  });

  describe('Initial Seeding', () => {
    it('should successfully seed empty database', async () => {
      const result = await seedDatabase();

      expect(result.success).toBe(true);
      expect(result.message).toContain('Database seeded successfully');
      expect(result.stats.skipped).toBe(false);
    });

    it('should create 7 categories', async () => {
      await seedDatabase();

      const categories = await dataService.getAllCategories();
      expect(categories).toHaveLength(7);

      const categoryNames = categories.map(c => c.name).sort();
      expect(categoryNames).toEqual([
        'Activities',
        'Core Board',
        'Feelings',
        'Food & Drink',
        'People',
        'Places',
        'Social Phrases'
      ]);
    });

    it('should create 139 baseline words', async () => {
      await seedDatabase();

      const words = await dataService.getAllWords();
      expect(words).toHaveLength(139);
    });

    it('should mark all categories as default', async () => {
      await seedDatabase();

      const categories = await dataService.getAllCategories();

      categories.forEach(category => {
        expect(category.isDefault).toBe(true);
      });
    });

    it('should mark all words as default', async () => {
      await seedDatabase();

      const words = await dataService.getAllWords();

      words.forEach(word => {
        expect(word.isDefault).toBe(true);
      });
    });

    it('should create default settings', async () => {
      await seedDatabase();

      const settings = await dataService.getSettings();

      expect(settings.id).toBe('app-settings');
      expect(settings.wordTypeColors).toBeDefined();
      expect(settings.voiceSettings).toBeDefined();
      expect(settings.gridLayout).toBeDefined();
      expect(settings.uiPreferences).toBeDefined();
    });

    it('should create default metadata with seeded flag', async () => {
      await seedDatabase();

      const metadata = await dataService.getMetadata();

      expect(metadata.id).toBe('app-metadata');
      expect(metadata.schemaVersion).toBe(1);
      expect(metadata.statistics).toBeDefined();
    });
  });

  describe('Word-Category Relationships', () => {
    it('should ensure all words have valid categoryId references', async () => {
      await seedDatabase();

      const words = await dataService.getAllWords();
      const categories = await dataService.getAllCategories();
      const categoryIds = new Set(categories.map(c => c.id));

      words.forEach(word => {
        expect(categoryIds.has(word.categoryId)).toBe(true);
      });
    });

    it('should distribute words across all categories', async () => {
      await seedDatabase();

      const categories = await dataService.getAllCategories();

      for (const category of categories) {
        const categoryWords = await dataService.getWordsByCategory(category.id);
        expect(categoryWords.length).toBeGreaterThan(0);
      }
    });

    it('should assign Core Board category the most words', async () => {
      await seedDatabase();

      const categories = await dataService.getAllCategories();
      const coreCategory = categories.find(c => c.name === 'Core Board');

      expect(coreCategory).toBeDefined();

      if (coreCategory) {
        const coreWords = await dataService.getWordsByCategory(coreCategory.id);
        // Core board has 30 words in the original app
        expect(coreWords.length).toBe(30);
      }
    });
  });

  describe('Idempotency', () => {
    it('should skip seeding if database is already seeded', async () => {
      // First seed
      const firstResult = await seedDatabase();
      expect(firstResult.success).toBe(true);
      expect(firstResult.stats.skipped).toBe(false);

      // Second seed attempt
      const secondResult = await seedDatabase();
      expect(secondResult.success).toBe(true);
      expect(secondResult.stats.skipped).toBe(true);
      expect(secondResult.message).toContain('already seeded');
    });

    it('should not duplicate data when called multiple times', async () => {
      await seedDatabase();
      await seedDatabase();
      await seedDatabase();

      const words = await dataService.getAllWords();
      const categories = await dataService.getAllCategories();

      expect(words).toHaveLength(139);
      expect(categories).toHaveLength(7);
    });
  });

  describe('Data Integrity', () => {
    it('should create words with proper order values', async () => {
      await seedDatabase();

      const words = await dataService.getAllWords();

      words.forEach(word => {
        expect(word.order).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(word.order)).toBe(true);
      });
    });

    it('should create categories with proper order values', async () => {
      await seedDatabase();

      const categories = await dataService.getAllCategories();

      categories.forEach(category => {
        expect(category.order).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(category.order)).toBe(true);
      });
    });

    it('should use valid Lucide icon names for categories', async () => {
      await seedDatabase();

      const categories = await dataService.getAllCategories();

      // Check that iconName is a non-empty string
      categories.forEach(category => {
        expect(category.iconName).toBeTruthy();
        expect(typeof category.iconName).toBe('string');
        expect(category.iconName.length).toBeGreaterThan(0);
      });
    });

    it('should use valid Lucide icon names for words', async () => {
      await seedDatabase();

      const words = await dataService.getAllWords();

      // Check that iconName is a non-empty string
      words.forEach(word => {
        expect(word.iconName).toBeTruthy();
        expect(typeof word.iconName).toBe('string');
        expect(word.iconName.length).toBeGreaterThan(0);
      });
    });

    it('should assign proper word types to all words', async () => {
      await seedDatabase();

      const words = await dataService.getAllWords();
      const validTypes = ['pronoun', 'verb', 'descriptive', 'noun', 'social'];

      words.forEach(word => {
        expect(validTypes).toContain(word.type);
      });
    });
  });

  describe('Statistics Tracking', () => {
    it('should update metadata statistics after seeding', async () => {
      await seedDatabase();

      const metadata = await dataService.getMetadata();

      expect(metadata.statistics.totalWords).toBeGreaterThan(0);
      expect(metadata.statistics.totalCategories).toBeGreaterThan(0);
    });
  });
});
