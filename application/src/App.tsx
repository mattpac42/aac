import { useState, useEffect } from 'react';
import { CoreBoard } from './components/CoreBoard';
import { CategoryScreen } from './components/CategoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ResourcesScreen } from './components/ResourcesScreen';
import { MessageBar } from './components/MessageBar';
import { AutoSaveIndicator } from './components/AutoSaveIndicator';
import { initDatabase } from './lib/db/initDatabase';
import { dataService } from './lib/db/dataService';
import { useAutoSave } from './lib/utils/autoSave';
import type { WordType } from './lib/db/schema';
import type { WordTypeColors } from './components/settings/ColorThemeScreen';

/**
 * App Component - Migrated to IndexedDB
 *
 * WHY: Uses IndexedDB for persistent state management
 * REASON: Following PRD-001 Task 2.1 - Database integration
 */

export type { WordType };

export interface Word {
  text: string;
  icon: string;
  type: WordType;
}

export interface CategoryWord {
  text: string;
  icon: string;
}

export type CategoryName = 'People' | 'Food' | 'Places' | 'Feelings' | 'Actions' | 'School' | 'Weather' | 'Settings' | 'Resources' | 'Core';

export default function App() {
  // Database initialization state
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string>();

  // Application state
  const [message, setMessage] = useState<string[]>([]);
  const [currentScreen, setCurrentScreen] = useState<CategoryName>('Core');
  const [coreWords, setCoreWords] = useState<Word[]>([]);
  const [categoryWords, setCategoryWords] = useState<Record<string, CategoryWord[]>>({});
  const [wordTypeColors, setWordTypeColors] = useState<WordTypeColors>({
    pronoun: { bg: 'bg-yellow-200', border: 'border-yellow-400' },
    verb: { bg: 'bg-green-200', border: 'border-green-400' },
    descriptive: { bg: 'bg-blue-200', border: 'border-blue-400' },
    noun: { bg: 'bg-orange-200', border: 'border-orange-400' },
    social: { bg: 'bg-pink-200', border: 'border-pink-400' },
  });

  // Auto-save state for database persistence
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaveData, setLastSaveData] = useState<any>(null);

  /**
   * Auto-save hook for database persistence
   * WHY: Automatically persist changes to IndexedDB with debouncing
   */
  const { triggerSave, isSaving, error } = useAutoSave(
    async (data: any) => {
      // Implement save logic based on data type
      if (data.type === 'coreWords') {
        // Save core words to database
        // TODO: Implement actual database save
        console.log('Saving core words:', data.words);
      } else if (data.type === 'categoryWords') {
        // Save category words to database
        // TODO: Implement actual database save
        console.log('Saving category words:', data.words);
      } else if (data.type === 'colors') {
        // Save color settings to database
        // TODO: Implement actual database save
        console.log('Saving colors:', data.colors);
      }
    },
    {
      debounceMs: 500,
      onSaving: () => setSaveStatus('saving'),
      onSaved: () => setSaveStatus('saved'),
      onError: () => setSaveStatus('error')
    }
  );

  // Update save status based on hook state
  useEffect(() => {
    if (isSaving) {
      setSaveStatus('saving');
    } else if (error) {
      setSaveStatus('error');
    } else if (saveStatus === 'saving') {
      setSaveStatus('saved');
    }
  }, [isSaving, error]);

  /**
   * Initialize Database on Mount
   * WHY: Ensures database is ready before loading data
   */
  useEffect(() => {
    async function init() {
      try {
        // Step 1: Initialize database
        const result = await initDatabase();

        if (result.error) {
          setDbError(result.error);
          setLoading(false);
          return;
        }

        // Step 2: Load data from IndexedDB
        await loadDataFromDatabase();

        setLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setDbError((error as Error).message);
        setLoading(false);
      }
    }

    init();
  }, []);

  /**
   * Load Data from IndexedDB
   * WHY: Replace hardcoded arrays with database queries
   */
  async function loadDataFromDatabase() {
    try {
      // Load all data from database
      const [words, categories, settings] = await Promise.all([
        dataService.getAllWords(),
        dataService.getAllCategories(),
        dataService.getSettings()
      ]);

      // Transform database words to app format
      const coreCategory = categories.find(cat => cat.name.toLowerCase() === 'core');
      if (coreCategory) {
        const coreDbWords = words.filter(w => w.categoryId === coreCategory.id);
        const transformedCoreWords: Word[] = coreDbWords.map(w => ({
          text: w.text,
          icon: w.iconName,
          type: w.type
        }));
        setCoreWords(transformedCoreWords);
      }

      // Transform category words
      const categoryMap: Record<string, CategoryWord[]> = {};
      for (const category of categories) {
        if (category.name.toLowerCase() !== 'core') {
          const categoryDbWords = words.filter(w => w.categoryId === category.id);
          categoryMap[category.name] = categoryDbWords.map(w => ({
            text: w.text,
            icon: w.iconName
          }));
        }
      }
      setCategoryWords(categoryMap);

      // Load word type colors from settings
      if (settings.wordTypeColors) {
        const colorMap: WordTypeColors = {
          pronoun: {
            bg: convertHexToTailwind(settings.wordTypeColors.pronoun.bg),
            border: convertHexToTailwind(settings.wordTypeColors.pronoun.border)
          },
          verb: {
            bg: convertHexToTailwind(settings.wordTypeColors.verb.bg),
            border: convertHexToTailwind(settings.wordTypeColors.verb.border)
          },
          descriptive: {
            bg: convertHexToTailwind(settings.wordTypeColors.descriptive.bg),
            border: convertHexToTailwind(settings.wordTypeColors.descriptive.border)
          },
          noun: {
            bg: convertHexToTailwind(settings.wordTypeColors.noun.bg),
            border: convertHexToTailwind(settings.wordTypeColors.noun.border)
          },
          social: {
            bg: convertHexToTailwind(settings.wordTypeColors.social.bg),
            border: convertHexToTailwind(settings.wordTypeColors.social.border)
          }
        };
        setWordTypeColors(colorMap);
      }
    } catch (error) {
      console.error('Error loading data from database:', error);
      throw error;
    }
  }

  /**
   * Convert hex color to Tailwind class
   * HACK: Temporary mapping until we refactor to use hex colors directly
   */
  function convertHexToTailwind(hex: string): string {
    // Map database hex colors to Tailwind classes
    const colorMap: Record<string, string> = {
      '#fee': 'bg-yellow-200',
      '#fcc': 'border-yellow-400',
      '#efe': 'bg-green-200',
      '#cfc': 'border-green-400',
      '#eef': 'bg-blue-200',
      '#ccf': 'border-blue-400',
      '#ffe': 'bg-orange-200',
      '#ffc': 'border-orange-400',
      '#fef': 'bg-pink-200',
      '#fcf': 'border-pink-400'
    };
    return colorMap[hex] || hex;
  }

  const addWord = (word: string) => {
    setMessage([...message, word]);
  };

  const clearMessage = () => {
    setMessage([]);
  };

  const speakMessage = () => {
    if (message.length === 0) return;

    const utterance = new SpeechSynthesisUtterance(message.join(' '));
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const navigateToCategory = (category: CategoryName) => {
    setCurrentScreen(category);
  };

  const navigateToCore = () => {
    setCurrentScreen('Core');
  };

  const updateCoreWords = (newWords: Word[]) => {
    setCoreWords(newWords);
    const saveData = { type: 'coreWords', words: newWords };
    setLastSaveData(saveData);
    triggerSave(saveData);
  };

  const updateCategoryWords = (newWords: Record<string, CategoryWord[]>) => {
    setCategoryWords(newWords);
    const saveData = { type: 'categoryWords', words: newWords };
    setLastSaveData(saveData);
    triggerSave(saveData);
  };

  const updateWordTypeColors = (colors: WordTypeColors) => {
    setWordTypeColors(colors);
    const saveData = { type: 'colors', colors };
    setLastSaveData(saveData);
    triggerSave(saveData);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-xl text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (dbError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-600 text-xl font-bold mb-2">Error</div>
          <p className="text-slate-700 mb-4">{dbError}</p>
          <p className="text-sm text-slate-500">
            Please refresh the page or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Auto-save indicator */}
      <AutoSaveIndicator
        status={saveStatus}
        error={error || undefined}
        onRetry={() => lastSaveData && triggerSave(lastSaveData)}
      />

      <MessageBar
        message={message}
        onSpeak={speakMessage}
        onClear={clearMessage}
      />

      <div className="flex-1 overflow-auto">
        {currentScreen === 'Core' ? (
          <CoreBoard
            words={coreWords}
            wordTypeColors={wordTypeColors}
            onWordSelect={addWord}
            onNavigate={navigateToCategory}
          />
        ) : currentScreen === 'Settings' ? (
          <SettingsScreen
            coreWords={coreWords}
            categoryWords={categoryWords}
            wordTypeColors={wordTypeColors}
            onUpdateCoreWords={updateCoreWords}
            onUpdateCategoryWords={updateCategoryWords}
            onUpdateColors={updateWordTypeColors}
            onBack={navigateToCore}
          />
        ) : currentScreen === 'Resources' ? (
          <ResourcesScreen
            onBack={navigateToCore}
          />
        ) : (
          <CategoryScreen
            category={currentScreen}
            categoryWords={categoryWords}
            wordTypeColors={wordTypeColors}
            onWordSelect={addWord}
            onBack={navigateToCore}
          />
        )}
      </div>
    </div>
  );
}
