/**
 * REASON: Verify IndexedDB schema definition and TypeScript interfaces
 *
 * These tests validate:
 * 1. TypeScript type safety for all interfaces
 * 2. Dexie database class structure
 * 3. Schema version and index definitions
 * 4. Singleton database instance
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { db, AACDatabase, Word, Category, Settings, Resource, Metadata, WordType } from '../schema';

describe('IndexedDB Schema', () => {
  beforeEach(async () => {
    // NOTE: Clean database before each test
    await db.delete();
    await db.open();
  });

  describe('TypeScript Interfaces', () => {
    it('should allow creating valid Word objects', () => {
      const word: Word = {
        id: 'test-id',
        text: 'hello',
        type: 'noun' as WordType,
        categoryId: 'cat-id',
        iconName: 'MessageCircle',
        order: 1,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isDefault: true
      };

      expect(word.id).toBe('test-id');
      expect(word.type).toBe('noun');
    });

    it('should allow creating valid Category objects', () => {
      const category: Category = {
        id: 'cat-id',
        name: 'Test Category',
        iconName: 'Folder',
        order: 1,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isDefault: true
      };

      expect(category.id).toBe('cat-id');
      expect(category.parentId).toBeUndefined();
    });

    it('should allow creating valid Settings objects', () => {
      const settings: Settings = {
        id: 'app-settings',
        wordTypeColors: {
          pronoun: { bg: '#fef3c7', border: '#fcd34d' },
          verb: { bg: '#dbeafe', border: '#60a5fa' },
          descriptive: { bg: '#dcfce7', border: '#4ade80' },
          noun: { bg: '#fce7f3', border: '#f472b6' },
          social: { bg: '#ede9fe', border: '#a78bfa' }
        },
        voiceSettings: {
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0
        },
        gridLayout: {
          columns: 4
        },
        uiPreferences: {
          showOfflineIndicator: true,
          autoSaveEnabled: true,
          confirmDeletes: true
        },
        modifiedAt: new Date()
      };

      expect(settings.id).toBe('app-settings');
      expect(settings.gridLayout.columns).toBe(4);
    });

    it('should allow creating valid Resource objects', () => {
      const resource: Resource = {
        id: 'res-id',
        title: 'Getting Started Guide',
        description: 'Learn how to use AAC',
        url: 'https://example.com',
        type: 'article',
        category: 'getting-started',
        createdAt: new Date(),
        isDefault: true
      };

      expect(resource.type).toBe('article');
      expect(resource.category).toBe('getting-started');
    });

    it('should allow creating valid Metadata objects', () => {
      const metadata: Metadata = {
        id: 'app-metadata',
        schemaVersion: 1,
        appVersion: '1.0.0',
        lastModified: new Date(),
        statistics: {
          totalWords: 100,
          customWords: 10,
          totalCategories: 20,
          customCategories: 5,
          customImages: 3,
          storageUsedMB: 2.5
        }
      };

      expect(metadata.id).toBe('app-metadata');
      expect(metadata.schemaVersion).toBe(1);
    });
  });

  describe('Database Schema', () => {
    it('should create database with correct name', () => {
      expect(db.name).toBe('aac-communication-board');
    });

    it('should define version 1 schema', () => {
      expect(db.verno).toBe(1);
    });

    it('should have all required tables', () => {
      expect(db.words).toBeDefined();
      expect(db.categories).toBeDefined();
      expect(db.settings).toBeDefined();
      expect(db.resources).toBeDefined();
      expect(db.metadata).toBeDefined();
    });

    it('should define correct indexes for words table', () => {
      const schema = db.table('words').schema;

      expect(schema.primKey.name).toBe('id');
      expect(schema.indexes).toContainEqual(
        expect.objectContaining({ name: 'categoryId' })
      );
      expect(schema.indexes).toContainEqual(
        expect.objectContaining({ name: 'type' })
      );
      expect(schema.indexes).toContainEqual(
        expect.objectContaining({ name: 'order' })
      );
      expect(schema.indexes).toContainEqual(
        expect.objectContaining({ name: 'createdAt' })
      );
    });

    it('should define correct indexes for categories table', () => {
      const schema = db.table('categories').schema;

      expect(schema.primKey.name).toBe('id');
      expect(schema.indexes).toContainEqual(
        expect.objectContaining({ name: 'parentId' })
      );
      expect(schema.indexes).toContainEqual(
        expect.objectContaining({ name: 'order' })
      );
    });

    it('should define correct indexes for resources table', () => {
      const schema = db.table('resources').schema;

      expect(schema.primKey.name).toBe('id');
      expect(schema.indexes).toContainEqual(
        expect.objectContaining({ name: 'category' })
      );
      expect(schema.indexes).toContainEqual(
        expect.objectContaining({ name: 'type' })
      );
    });
  });

  describe('Database Operations', () => {
    it('should allow inserting and retrieving a word', async () => {
      const word: Word = {
        id: 'word-1',
        text: 'test',
        type: 'noun',
        categoryId: 'cat-1',
        iconName: 'Star',
        order: 1,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isDefault: false
      };

      await db.words.add(word);
      const retrieved = await db.words.get('word-1');

      expect(retrieved).toBeDefined();
      expect(retrieved?.text).toBe('test');
      expect(retrieved?.type).toBe('noun');
    });

    it('should allow querying words by categoryId index', async () => {
      const words: Word[] = [
        {
          id: 'word-1',
          text: 'hello',
          type: 'noun',
          categoryId: 'cat-1',
          iconName: 'Star',
          order: 1,
          createdAt: new Date(),
          modifiedAt: new Date(),
          isDefault: false
        },
        {
          id: 'word-2',
          text: 'world',
          type: 'noun',
          categoryId: 'cat-1',
          iconName: 'Star',
          order: 2,
          createdAt: new Date(),
          modifiedAt: new Date(),
          isDefault: false
        }
      ];

      await db.words.bulkAdd(words);
      const results = await db.words.where('categoryId').equals('cat-1').toArray();

      expect(results).toHaveLength(2);
    });

    it('should allow singleton settings storage', async () => {
      const settings: Settings = {
        id: 'app-settings',
        wordTypeColors: {
          pronoun: { bg: '#fef3c7', border: '#fcd34d' },
          verb: { bg: '#dbeafe', border: '#60a5fa' },
          descriptive: { bg: '#dcfce7', border: '#4ade80' },
          noun: { bg: '#fce7f3', border: '#f472b6' },
          social: { bg: '#ede9fe', border: '#a78bfa' }
        },
        voiceSettings: {
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0
        },
        gridLayout: {
          columns: 4
        },
        uiPreferences: {
          showOfflineIndicator: true,
          autoSaveEnabled: true,
          confirmDeletes: true
        },
        modifiedAt: new Date()
      };

      await db.settings.put(settings);
      const retrieved = await db.settings.get('app-settings');

      expect(retrieved).toBeDefined();
      expect(retrieved?.gridLayout.columns).toBe(4);
    });
  });

  describe('Singleton Instance', () => {
    it('should export a singleton database instance', () => {
      expect(db).toBeInstanceOf(AACDatabase);
      expect(db).toBe(db); // Same instance
    });

    it('should be the same instance across imports', async () => {
      const { db: dbInstance1 } = await import('../schema');
      const { db: dbInstance2 } = await import('../schema');

      expect(dbInstance1).toBe(dbInstance2);
    });
  });
});
