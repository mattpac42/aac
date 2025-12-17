import Dexie, { Table } from 'dexie';

// Type definitions
export type WordType = 'pronoun' | 'verb' | 'descriptive' | 'noun' | 'social';

export interface Word {
  id: string;              // UUID v4
  text: string;            // Display text
  type: WordType;          // 'pronoun' | 'verb' | 'descriptive' | 'noun' | 'social'
  categoryId: string;      // Foreign key to categories
  iconName: string;        // Lucide icon name
  customImageUrl?: string; // base64 data URL or Blob URL
  order: number;           // Display order within category
  createdAt: Date;
  modifiedAt: Date;
  isDefault: boolean;      // True for baseline vocabulary
}

export interface Category {
  id: string;              // UUID v4
  name: string;
  iconName: string;
  parentId?: string;       // For nested categories
  order: number;
  createdAt: Date;
  modifiedAt: Date;
  isDefault: boolean;
}

export interface Settings {
  id: 'app-settings';      // Singleton key
  wordTypeColors: {
    pronoun: { bg: string; border: string };
    verb: { bg: string; border: string };
    descriptive: { bg: string; border: string };
    noun: { bg: string; border: string };
    social: { bg: string; border: string };
  };
  voiceSettings: {
    voiceURI?: string;
    rate: number;
    pitch: number;
    volume: number;
  };
  gridLayout: {
    columns: number;
  };
  uiPreferences: {
    showOfflineIndicator: boolean;
    autoSaveEnabled: boolean;
    confirmDeletes: boolean;
  };
  modifiedAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'document' | 'tip';
  category: 'getting-started' | 'tips-for-partners' | 'modeling-teaching' | 'research-evidence';
  createdAt: Date;
  isDefault: boolean;
}

export interface Metadata {
  id: 'app-metadata';
  schemaVersion: number;
  appVersion: string;
  lastModified: Date;
  statistics: {
    totalWords: number;
    customWords: number;
    totalCategories: number;
    customCategories: number;
    customImages: number;
    storageUsedMB: number;
  };
}

// Database class
export class AACDatabase extends Dexie {
  words!: Table<Word>;
  categories!: Table<Category>;
  settings!: Table<Settings>;
  resources!: Table<Resource>;
  metadata!: Table<Metadata>;

  constructor() {
    super('aac-communication-board');

    this.version(1).stores({
      words: 'id, categoryId, type, order, createdAt',
      categories: 'id, parentId, order',
      settings: 'id',
      resources: 'id, category, type',
      metadata: 'id'
    });
  }
}

// Export singleton instance
export const db = new AACDatabase();
