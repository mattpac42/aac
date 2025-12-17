import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { initDatabase } from '../initDatabase';
import { seedDatabase } from '../seedData';
import { db } from '../schema';
import { dataService } from '../dataService';

/**
 * Database Initialization Tests
 *
 * WHY: Ensures database initialization handles all edge cases and error scenarios
 * REASON: Init function must gracefully handle database access, seeding, and errors
 */

// Mock seedDatabase to control behavior
vi.mock('../seedData', () => ({
  seedDatabase: vi.fn()
}));

describe('initDatabase', () => {
  beforeEach(async () => {
    // Clear all tables before each test
    await db.words.clear();
    await db.categories.clear();
    await db.settings.clear();
    await db.metadata.clear();
    await db.resources.clear();

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Successful Initialization', () => {
    it('should successfully initialize database on first run', async () => {
      // Mock seedDatabase to return success
      vi.mocked(seedDatabase).mockResolvedValue({
        success: true,
        message: 'Database seeded successfully',
        stats: {
          categories: 7,
          words: 139,
          skipped: false
        }
      });

      const result = await initDatabase();

      expect(result.initialized).toBe(true);
      expect(result.seeded).toBe(true);
      expect(result.error).toBeUndefined();
      expect(seedDatabase).toHaveBeenCalledTimes(1);
    });

    it('should skip seeding if database already has data', async () => {
      // Pre-populate database with a default category
      await dataService.createCategory({
        name: 'Test Category',
        iconName: 'TestIcon',
        order: 0,
        isDefault: true
      });

      // Mock seedDatabase to return already seeded
      vi.mocked(seedDatabase).mockResolvedValue({
        success: true,
        message: 'Database already seeded, skipping',
        stats: {
          categories: 0,
          words: 0,
          skipped: true
        }
      });

      const result = await initDatabase();

      expect(result.initialized).toBe(true);
      expect(result.seeded).toBe(false);
      expect(result.error).toBeUndefined();
      expect(seedDatabase).toHaveBeenCalledTimes(1);
    });

    it('should verify all object stores exist', async () => {
      // Mock seedDatabase
      vi.mocked(seedDatabase).mockResolvedValue({
        success: true,
        message: 'Database seeded successfully',
        stats: {
          categories: 7,
          words: 139,
          skipped: false
        }
      });

      const result = await initDatabase();

      // Verify we can access all object stores
      expect(db.words).toBeDefined();
      expect(db.categories).toBeDefined();
      expect(db.settings).toBeDefined();
      expect(db.resources).toBeDefined();
      expect(db.metadata).toBeDefined();

      expect(result.initialized).toBe(true);
    });

    it('should return correct status when seeding is performed', async () => {
      vi.mocked(seedDatabase).mockResolvedValue({
        success: true,
        message: 'Database seeded successfully with 139 words',
        stats: {
          categories: 7,
          words: 139,
          skipped: false
        }
      });

      const result = await initDatabase();

      expect(result).toEqual({
        initialized: true,
        seeded: true
      });
    });

    it('should return correct status when seeding is skipped', async () => {
      // Pre-populate with default data
      await dataService.createCategory({
        name: 'Core Board',
        iconName: 'Grid3x3',
        order: 0,
        isDefault: true
      });

      vi.mocked(seedDatabase).mockResolvedValue({
        success: true,
        message: 'Database already seeded, skipping',
        stats: {
          categories: 0,
          words: 0,
          skipped: true
        }
      });

      const result = await initDatabase();

      expect(result).toEqual({
        initialized: true,
        seeded: false
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Mock db.open to throw an error
      const originalOpen = db.open;
      db.open = vi.fn().mockRejectedValue(new Error('Database connection failed'));

      const result = await initDatabase();

      expect(result.initialized).toBe(false);
      expect(result.seeded).toBe(false);
      expect(result.error).toBe('Database connection failed');

      // Restore original
      db.open = originalOpen;
    });

    it('should handle seeding errors gracefully', async () => {
      vi.mocked(seedDatabase).mockResolvedValue({
        success: false,
        message: 'Failed to seed database: Quota exceeded',
        stats: {
          categories: 0,
          words: 0,
          skipped: false
        }
      });

      const result = await initDatabase();

      expect(result.initialized).toBe(true);
      expect(result.seeded).toBe(false);
      expect(result.error).toBe('Failed to seed database: Quota exceeded');
    });

    it('should handle timeout after 10 seconds', async () => {
      // Mock seedDatabase to never resolve
      vi.mocked(seedDatabase).mockImplementation(() =>
        new Promise(() => {}) // Never resolves
      );

      const result = await initDatabase();

      expect(result.initialized).toBe(false);
      expect(result.seeded).toBe(false);
      expect(result.error).toBe('Database initialization timeout');
    }, 11000); // Test timeout longer than 10s

    it('should provide user-friendly error messages', async () => {
      vi.mocked(seedDatabase).mockResolvedValue({
        success: false,
        message: 'Error: IndexedDB quota exceeded',
        stats: {
          categories: 0,
          words: 0,
          skipped: false
        }
      });

      const result = await initDatabase();

      expect(result.error).toBeDefined();
      expect(result.error).toContain('quota exceeded');
    });

    it('should log database connection errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const originalOpen = db.open;
      db.open = vi.fn().mockRejectedValue(new Error('Cannot access IndexedDB'));

      await initDatabase();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error initializing database:',
        expect.any(Error)
      );

      // Restore
      db.open = originalOpen;
      consoleSpy.mockRestore();
    });

    it('should log seeding errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(seedDatabase).mockResolvedValue({
        success: false,
        message: 'Seeding failed',
        stats: {
          categories: 0,
          words: 0,
          skipped: false
        }
      });

      await initDatabase();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error seeding database:',
        'Seeding failed'
      );

      consoleSpy.mockRestore();
    });

    it('should allow app to continue with fallback state on error', async () => {
      vi.mocked(seedDatabase).mockResolvedValue({
        success: false,
        message: 'Critical error',
        stats: {
          categories: 0,
          words: 0,
          skipped: false
        }
      });

      const result = await initDatabase();

      // Even on error, function returns a valid result object
      expect(result).toHaveProperty('initialized');
      expect(result).toHaveProperty('seeded');
      expect(result).toHaveProperty('error');
    });
  });

  describe('Database Accessibility', () => {
    it('should verify database is accessible before seeding', async () => {
      vi.mocked(seedDatabase).mockResolvedValue({
        success: true,
        message: 'Database seeded successfully',
        stats: {
          categories: 7,
          words: 139,
          skipped: false
        }
      });

      const result = await initDatabase();

      expect(result.initialized).toBe(true);
      // If initialized is true, database was accessible
    });

    it('should verify all object stores are accessible', async () => {
      vi.mocked(seedDatabase).mockResolvedValue({
        success: true,
        message: 'Database seeded successfully',
        stats: {
          categories: 7,
          words: 139,
          skipped: false
        }
      });

      await initDatabase();

      // Attempt to access each store
      const wordsCount = await db.words.count();
      const categoriesCount = await db.categories.count();
      const settingsCount = await db.settings.count();
      const resourcesCount = await db.resources.count();
      const metadataCount = await db.metadata.count();

      expect(wordsCount).toBeGreaterThanOrEqual(0);
      expect(categoriesCount).toBeGreaterThanOrEqual(0);
      expect(settingsCount).toBeGreaterThanOrEqual(0);
      expect(resourcesCount).toBeGreaterThanOrEqual(0);
      expect(metadataCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Seeding Decision Logic', () => {
    it('should call seedDatabase when no default categories exist', async () => {
      vi.mocked(seedDatabase).mockResolvedValue({
        success: true,
        message: 'Database seeded successfully',
        stats: {
          categories: 7,
          words: 139,
          skipped: false
        }
      });

      await initDatabase();

      expect(seedDatabase).toHaveBeenCalledTimes(1);
    });

    it('should call seedDatabase even when database has custom categories', async () => {
      // Add a custom (non-default) category
      await dataService.createCategory({
        name: 'Custom Category',
        iconName: 'CustomIcon',
        order: 0,
        isDefault: false // Not default
      });

      vi.mocked(seedDatabase).mockResolvedValue({
        success: true,
        message: 'Database seeded successfully',
        stats: {
          categories: 7,
          words: 139,
          skipped: false
        }
      });

      await initDatabase();

      // Should still seed because no default categories exist
      expect(seedDatabase).toHaveBeenCalledTimes(1);
    });

    it('should not skip initialization if only metadata exists', async () => {
      // Create metadata but no categories
      await dataService.getMetadata(); // Creates default metadata

      vi.mocked(seedDatabase).mockResolvedValue({
        success: true,
        message: 'Database seeded successfully',
        stats: {
          categories: 7,
          words: 139,
          skipped: false
        }
      });

      await initDatabase();

      expect(seedDatabase).toHaveBeenCalledTimes(1);
    });
  });
});
