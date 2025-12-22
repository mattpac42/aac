import { dataService } from '../db/DataService';
import type { Word, Category, Resource } from '../db/schema';

/**
 * WHY: Define merge strategies for vocabulary import
 * REASON: Different use cases require different import behaviors
 * - replace: Restore from backup (delete all, import fresh)
 * - merge: Sync between devices (update existing, add new)
 * - skip: Add vocabulary pack (only import non-existing items)
 */
export type MergeStrategy = 'replace' | 'merge' | 'skip';

/**
 * Import options configuration
 */
export interface ImportOptions {
  strategy: MergeStrategy;
  validateBeforeImport?: boolean; // Default: true
  onConflict?: (
    item: Word | Category,
    existing: Word | Category
  ) => 'keep-existing' | 'use-imported' | 'skip';
}

/**
 * Detailed import results with counts and error reporting
 */
export interface ImportResult {
  success: boolean;
  counts: {
    wordsImported: number;
    categoriesImported: number;
    resourcesImported: number;
    wordsSkipped: number;
    categoriesSkipped: number;
    conflicts: number;
  };
  errors: string[];
  warnings: string[];
}

/**
 * Export data structure (must match exportService.ts format)
 * WHY: Defines the expected format for import files
 * REASON: Ensures compatibility between export and import operations
 */
export interface ExportData {
  metadata: {
    version: string;
    exportedAt: string;
    exportedBy: string;
    itemCount: {
      words: number;
      categories: number;
      resources: number;
    };
  };
  data: {
    words: Word[];
    categories: Category[];
    resources: Resource[];
  };
}

/**
 * Read and parse JSON from File input
 * WHY: Users upload previously exported files
 * REASON: FileReader API required for browser file access
 */
export async function readImportFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Validate import file before processing
 * WHY: Catch invalid files early to provide better error messages
 * REASON: File validation prevents failed imports and data corruption
 *
 * @param file - File object to validate
 * @throws Error if file is invalid (wrong type, too large, etc.)
 */
export async function validateImportFile(file: File): Promise<void> {
  // Validate file type
  if (!file.name.endsWith('.json')) {
    throw new Error('Invalid file type. Please select a .json file.');
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 10MB.');
  }

  // Validate file is not empty
  if (file.size === 0) {
    throw new Error('File is empty.');
  }
}

/**
 * Validate export data structure
 * WHY: Prevent corrupt imports from malformed files
 * REASON: Type guards ensure data integrity before database writes
 */
function validateExportData(data: unknown): data is ExportData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const candidate = data as Partial<ExportData>;

  // Validate metadata structure
  if (!candidate.metadata || typeof candidate.metadata !== 'object') {
    return false;
  }

  const metadata = candidate.metadata;
  if (
    typeof metadata.version !== 'string' ||
    typeof metadata.exportedAt !== 'string' ||
    typeof metadata.exportedBy !== 'string' ||
    !metadata.itemCount
  ) {
    return false;
  }

  // Validate data structure
  if (!candidate.data || typeof candidate.data !== 'object') {
    return false;
  }

  const { words, categories, resources } = candidate.data;
  if (!Array.isArray(words) || !Array.isArray(categories) || !Array.isArray(resources)) {
    return false;
  }

  return true;
}

/**
 * Detect conflicts (duplicate IDs)
 * WHY: Identify duplicate IDs before import
 * REASON: Prevent data corruption from ID conflicts
 */
export async function detectConflicts(
  data: ExportData
): Promise<{ words: Word[]; categories: Category[] }> {
  const [existingWords, existingCategories] = await Promise.all([
    dataService.getAllWords(),
    dataService.getAllCategories(),
  ]);

  const existingWordIds = new Set(existingWords.map((w) => w.id));
  const existingCategoryIds = new Set(existingCategories.map((c) => c.id));

  const conflictingWords = data.data.words.filter((w) => existingWordIds.has(w.id));

  const conflictingCategories = data.data.categories.filter((c) =>
    existingCategoryIds.has(c.id)
  );

  return {
    words: conflictingWords,
    categories: conflictingCategories,
  };
}

/**
 * Import all data (helper for replace strategy)
 * WHY: Bulk insert all import data into database
 * REASON: Separate function for clarity and reusability
 */
async function importAllData(data: ExportData['data']): Promise<void> {
  // NOTE: Import categories first to satisfy foreign key constraints
  for (const category of data.categories) {
    await dataService.createCategory(category);
  }

  // Import words (reference categories)
  for (const word of data.words) {
    await dataService.createWord(word);
  }

  // Import resources
  for (const resource of data.resources) {
    await dataService.createResource(resource);
  }
}

/**
 * Merge vocabulary using specified strategy
 * WHY: Apply different merge strategies based on use case
 * REASON: Replace, merge, and skip strategies have different business logic
 */
export async function mergeVocabulary(
  imported: ExportData,
  strategy: MergeStrategy
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    counts: {
      wordsImported: 0,
      categoriesImported: 0,
      resourcesImported: 0,
      wordsSkipped: 0,
      categoriesSkipped: 0,
      conflicts: 0,
    },
    errors: [],
    warnings: [],
  };

  try {
    switch (strategy) {
      case 'replace':
        // REASON: Clear all existing data, import fresh
        // WHY: Restore from backup use case
        await dataService.clearAll();
        await importAllData(imported.data);
        result.counts.wordsImported = imported.data.words.length;
        result.counts.categoriesImported = imported.data.categories.length;
        result.counts.resourcesImported = imported.data.resources.length;
        break;

      case 'merge': {
        // REASON: Add new items, update existing by ID
        // WHY: Sync between devices use case
        const conflicts = await detectConflicts(imported);
        result.counts.conflicts = conflicts.words.length + conflicts.categories.length;

        // Import categories first (for foreign key constraints)
        for (const category of imported.data.categories) {
          const existing = await dataService.getCategory(category.id);
          if (existing) {
            await dataService.updateCategory(category.id, category);
          } else {
            await dataService.createCategory(category);
            result.counts.categoriesImported++;
          }
        }

        // Import words
        for (const word of imported.data.words) {
          const existing = await dataService.getWord(word.id);
          if (existing) {
            await dataService.updateWord(word.id, word);
          } else {
            await dataService.createWord(word);
            result.counts.wordsImported++;
          }
        }

        // Import resources
        for (const resource of imported.data.resources) {
          const existing = await dataService.getResource(resource.id);
          if (existing) {
            await dataService.updateResource(resource.id, resource);
          } else {
            await dataService.createResource(resource);
            result.counts.resourcesImported++;
          }
        }
        break;
      }

      case 'skip': {
        // REASON: Only add items that don't exist
        // WHY: Add vocabulary pack use case (avoid duplicates)

        // Import categories first
        for (const category of imported.data.categories) {
          const existing = await dataService.getCategory(category.id);
          if (!existing) {
            await dataService.createCategory(category);
            result.counts.categoriesImported++;
          } else {
            result.counts.categoriesSkipped++;
          }
        }

        // Import words
        for (const word of imported.data.words) {
          const existing = await dataService.getWord(word.id);
          if (!existing) {
            await dataService.createWord(word);
            result.counts.wordsImported++;
          } else {
            result.counts.wordsSkipped++;
          }
        }

        // Import resources
        for (const resource of imported.data.resources) {
          const existing = await dataService.getResource(resource.id);
          if (!existing) {
            await dataService.createResource(resource);
            result.counts.resourcesImported++;
          }
          // NOTE: Resources don't have a skipped counter in current spec
        }
        break;
      }
    }

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(
      `Merge failed: ${error instanceof Error ? error.message : String(error)}`
    );
    return result;
  }
}

/**
 * Main import function
 * WHY: Single entry point for vocabulary import
 * REASON: Validates structure, checks version compatibility, applies merge strategy
 */
export async function importVocabulary(
  data: unknown,
  options: ImportOptions
): Promise<ImportResult> {
  // Initialize result
  const result: ImportResult = {
    success: false,
    counts: {
      wordsImported: 0,
      categoriesImported: 0,
      resourcesImported: 0,
      wordsSkipped: 0,
      categoriesSkipped: 0,
      conflicts: 0,
    },
    errors: [],
    warnings: [],
  };

  try {
    // 1. Validate structure
    if (!validateExportData(data)) {
      result.errors.push('Invalid import file structure');
      return result;
    }

    // 2. Validate version compatibility
    const exportData = data as ExportData;
    if (exportData.metadata.version !== '1.0') {
      result.errors.push(`Unsupported export version: ${exportData.metadata.version}`);
      return result;
    }

    // 3. Apply merge strategy
    const mergeResult = await mergeVocabulary(exportData, options.strategy);

    // WHY: Check if merge operation failed
    // REASON: Need to wrap merge errors with "Import failed" prefix
    if (!mergeResult.success) {
      result.success = false;
      result.errors = mergeResult.errors.map((err) =>
        err.startsWith('Merge failed') ? err.replace('Merge failed', 'Import failed') : err
      );
      return result;
    }

    result.success = mergeResult.success;
    result.counts = mergeResult.counts;
    result.warnings = mergeResult.warnings;
    result.errors = mergeResult.errors;

    return result;
  } catch (error) {
    result.errors.push(
      `Import failed: ${error instanceof Error ? error.message : String(error)}`
    );
    return result;
  }
}
