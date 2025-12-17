import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { initDatabase } from '../lib/db/initDatabase';
import { dataService } from '../lib/db/dataService';
import type { Category, Word, Settings } from '../lib/db/schema';

/**
 * App.tsx Integration Tests - IndexedDB Migration
 *
 * WHY: Verify that App.tsx properly initializes and loads data from IndexedDB
 * REASON: Following TDD - write tests first, then implement migration
 */

// Mock modules
vi.mock('../lib/db/initDatabase');
vi.mock('../lib/db/dataService');

describe('App.tsx - IndexedDB Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Database Initialization', () => {
    it('should call initDatabase on mount', async () => {
      // ARRANGE
      const mockInitDatabase = vi.mocked(initDatabase);
      mockInitDatabase.mockResolvedValue({
        initialized: true,
        seeded: true
      });

      vi.mocked(dataService.getAllWords).mockResolvedValue([]);
      vi.mocked(dataService.getAllCategories).mockResolvedValue([]);
      vi.mocked(dataService.getSettings).mockResolvedValue({
        id: 'app-settings',
        wordTypeColors: {
          pronoun: { bg: '#fee', border: '#fcc' },
          verb: { bg: '#efe', border: '#cfc' },
          descriptive: { bg: '#eef', border: '#ccf' },
          noun: { bg: '#ffe', border: '#ffc' },
          social: { bg: '#fef', border: '#fcf' }
        },
        voiceSettings: { rate: 1, pitch: 1, volume: 1 },
        gridLayout: { columns: 3 },
        uiPreferences: {
          showOfflineIndicator: true,
          autoSaveEnabled: true,
          confirmDeletes: true
        },
        modifiedAt: new Date()
      });

      // ACT
      render(<App />);

      // ASSERT
      await waitFor(() => {
        expect(mockInitDatabase).toHaveBeenCalledTimes(1);
      });
    });

    it('should show loading state during initialization', async () => {
      // ARRANGE
      let resolveInit: (value: any) => void;
      const initPromise = new Promise(resolve => {
        resolveInit = resolve;
      });

      vi.mocked(initDatabase).mockReturnValue(initPromise as any);

      // ACT
      render(<App />);

      // ASSERT - Loading state should be visible
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Cleanup
      resolveInit!({
        initialized: true,
        seeded: true
      });
    });

    it('should load data from IndexedDB after initialization', async () => {
      // ARRANGE
      vi.mocked(initDatabase).mockResolvedValue({
        initialized: true,
        seeded: true
      });

      const mockWords: Word[] = [
        {
          id: '1',
          text: 'I',
          type: 'pronoun',
          categoryId: 'core',
          iconName: 'User',
          order: 0,
          createdAt: new Date(),
          modifiedAt: new Date(),
          isDefault: true
        }
      ];

      const mockCategories: Category[] = [
        {
          id: 'core',
          name: 'Core',
          iconName: 'Grid',
          order: 0,
          createdAt: new Date(),
          modifiedAt: new Date(),
          isDefault: true
        }
      ];

      const mockSettings: Settings = {
        id: 'app-settings',
        wordTypeColors: {
          pronoun: { bg: '#fee', border: '#fcc' },
          verb: { bg: '#efe', border: '#cfc' },
          descriptive: { bg: '#eef', border: '#ccf' },
          noun: { bg: '#ffe', border: '#ffc' },
          social: { bg: '#fef', border: '#fcf' }
        },
        voiceSettings: { rate: 1, pitch: 1, volume: 1 },
        gridLayout: { columns: 3 },
        uiPreferences: {
          showOfflineIndicator: true,
          autoSaveEnabled: true,
          confirmDeletes: true
        },
        modifiedAt: new Date()
      };

      vi.mocked(dataService.getAllWords).mockResolvedValue(mockWords);
      vi.mocked(dataService.getAllCategories).mockResolvedValue(mockCategories);
      vi.mocked(dataService.getSettings).mockResolvedValue(mockSettings);

      // ACT
      render(<App />);

      // ASSERT
      await waitFor(() => {
        expect(dataService.getAllWords).toHaveBeenCalled();
        expect(dataService.getAllCategories).toHaveBeenCalled();
        expect(dataService.getSettings).toHaveBeenCalled();
      });
    });

    it('should display error message when initialization fails', async () => {
      // ARRANGE
      vi.mocked(initDatabase).mockResolvedValue({
        initialized: false,
        seeded: false,
        error: 'Database initialization failed'
      });

      // ACT
      render(<App />);

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
        expect(screen.getByText(/database initialization failed/i)).toBeInTheDocument();
      });
    });

    it('should hide loading state after successful initialization', async () => {
      // ARRANGE
      vi.mocked(initDatabase).mockResolvedValue({
        initialized: true,
        seeded: true
      });

      vi.mocked(dataService.getAllWords).mockResolvedValue([]);
      vi.mocked(dataService.getAllCategories).mockResolvedValue([]);
      vi.mocked(dataService.getSettings).mockResolvedValue({
        id: 'app-settings',
        wordTypeColors: {
          pronoun: { bg: '#fee', border: '#fcc' },
          verb: { bg: '#efe', border: '#cfc' },
          descriptive: { bg: '#eef', border: '#ccf' },
          noun: { bg: '#ffe', border: '#ffc' },
          social: { bg: '#fef', border: '#fcf' }
        },
        voiceSettings: { rate: 1, pitch: 1, volume: 1 },
        gridLayout: { columns: 3 },
        uiPreferences: {
          showOfflineIndicator: true,
          autoSaveEnabled: true,
          confirmDeletes: true
        },
        modifiedAt: new Date()
      });

      // ACT
      render(<App />);

      // ASSERT - Loading state should disappear
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Data Loading from IndexedDB', () => {
    it('should NOT use hardcoded word arrays', async () => {
      // ARRANGE
      vi.mocked(initDatabase).mockResolvedValue({
        initialized: true,
        seeded: true
      });

      vi.mocked(dataService.getAllWords).mockResolvedValue([]);
      vi.mocked(dataService.getAllCategories).mockResolvedValue([]);
      vi.mocked(dataService.getSettings).mockResolvedValue({
        id: 'app-settings',
        wordTypeColors: {
          pronoun: { bg: '#fee', border: '#fcc' },
          verb: { bg: '#efe', border: '#cfc' },
          descriptive: { bg: '#eef', border: '#ccf' },
          noun: { bg: '#ffe', border: '#ffc' },
          social: { bg: '#fef', border: '#fcf' }
        },
        voiceSettings: { rate: 1, pitch: 1, volume: 1 },
        gridLayout: { columns: 3 },
        uiPreferences: {
          showOfflineIndicator: true,
          autoSaveEnabled: true,
          confirmDeletes: true
        },
        modifiedAt: new Date()
      });

      // ACT
      render(<App />);

      // ASSERT - Must call database, not use hardcoded data
      await waitFor(() => {
        expect(dataService.getAllWords).toHaveBeenCalled();
      });
    });

    it('should organize words by category from database', async () => {
      // ARRANGE
      vi.mocked(initDatabase).mockResolvedValue({
        initialized: true,
        seeded: true
      });

      const mockWords: Word[] = [
        {
          id: '1',
          text: 'mom',
          type: 'noun',
          categoryId: 'people',
          iconName: 'UserCircle',
          order: 0,
          createdAt: new Date(),
          modifiedAt: new Date(),
          isDefault: true
        },
        {
          id: '2',
          text: 'dad',
          type: 'noun',
          categoryId: 'people',
          iconName: 'User',
          order: 1,
          createdAt: new Date(),
          modifiedAt: new Date(),
          isDefault: true
        }
      ];

      const mockCategories: Category[] = [
        {
          id: 'people',
          name: 'People',
          iconName: 'Users',
          order: 0,
          createdAt: new Date(),
          modifiedAt: new Date(),
          isDefault: true
        }
      ];

      vi.mocked(dataService.getAllWords).mockResolvedValue(mockWords);
      vi.mocked(dataService.getAllCategories).mockResolvedValue(mockCategories);
      vi.mocked(dataService.getSettings).mockResolvedValue({
        id: 'app-settings',
        wordTypeColors: {
          pronoun: { bg: '#fee', border: '#fcc' },
          verb: { bg: '#efe', border: '#cfc' },
          descriptive: { bg: '#eef', border: '#ccf' },
          noun: { bg: '#ffe', border: '#ffc' },
          social: { bg: '#fef', border: '#fcf' }
        },
        voiceSettings: { rate: 1, pitch: 1, volume: 1 },
        gridLayout: { columns: 3 },
        uiPreferences: {
          showOfflineIndicator: true,
          autoSaveEnabled: true,
          confirmDeletes: true
        },
        modifiedAt: new Date()
      });

      // ACT
      render(<App />);

      // ASSERT - Words should be loaded from database
      await waitFor(() => {
        expect(dataService.getAllWords).toHaveBeenCalled();
        expect(dataService.getAllCategories).toHaveBeenCalled();
      });
    });
  });
});
