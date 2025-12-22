import { dataService } from '../db/DataService';
import type { Word, Category, Settings, Resource } from '../db/schema';

/**
 * Vocabulary Count Type
 *
 * WHY: Provides summary statistics for vocabulary data
 * REASON: Used in UI to display current vocabulary size
 */
export interface VocabularyCount {
  words: number;
  categories: number;
  resources: number;
}

/**
 * Export Data Structure
 *
 * WHY: Standardized format ensures reliable import/export across sessions
 * REASON: Metadata enables validation and version compatibility checking
 */
export interface ExportData {
  metadata: {
    version: string; // Export format version (e.g., "1.0")
    exportedAt: string; // ISO 8601 timestamp
    appVersion: string; // App version from package.json
    vocabularyCount: {
      words: number;
      categories: number;
      resources: number;
    };
  };
  data: {
    words: Word[];
    categories: Category[];
    settings: Settings;
    resources: Resource[];
  };
}

/**
 * Export all vocabulary data from IndexedDB
 *
 * WHY: Users need to backup and share their custom vocabulary
 * REASON: Parallel data fetching optimizes performance for large datasets
 *
 * @returns Complete export data with metadata
 * @throws Error if database operations fail
 */
export async function exportVocabulary(): Promise<ExportData> {
  try {
    // REASON: Promise.all enables parallel fetching for better performance
    const [words, categories, settings, resources] = await Promise.all([
      dataService.getAllWords(),
      dataService.getAllCategories(),
      dataService.getSettings(),
      dataService.getAllResources(),
    ]);

    const exportData: ExportData = {
      metadata: {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
        vocabularyCount: {
          words: words.length,
          categories: categories.length,
          resources: resources.length,
        },
      },
      data: {
        words,
        categories,
        settings,
        resources,
      },
    };

    return exportData;
  } catch (error) {
    throw new Error(`Export failed: ${(error as Error).message}`);
  }
}

/**
 * Trigger browser download for export data
 *
 * WHY: Client-side export preserves privacy and enables offline functionality
 * REASON: Blob URLs avoid server uploads while enabling file downloads
 *
 * @param data - Export data to download
 * @param filename - Optional custom filename (auto-generated if not provided)
 */
export function downloadExportFile(
  data: ExportData,
  filename?: string
): void {
  // WHY: Pretty print JSON for human readability
  const jsonString = JSON.stringify(data, null, 2);

  // REASON: Blob with application/json enables proper file handling
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Create temporary download link
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || generateExportFilename();

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // IMPORTANT: Cleanup to prevent memory leak
  URL.revokeObjectURL(url);
}

/**
 * Generate timestamped export filename
 *
 * WHY: Unique filenames prevent accidental overwrites
 * REASON: Timestamp format enables chronological sorting
 *
 * @returns Filename in format: aac-vocabulary-YYYY-MM-DD-HHMMSS.json
 */
export function generateExportFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `aac-vocabulary-${year}-${month}-${day}-${hours}${minutes}${seconds}.json`;
}

/**
 * Validate export data structure
 *
 * WHY: Type guard enables safe import validation
 * REASON: Runtime validation catches corrupted or invalid export files
 *
 * @param data - Unknown data to validate
 * @returns True if data matches ExportData structure
 */
export function validateExportData(data: unknown): data is ExportData {
  // REASON: Early return pattern improves readability and performance
  if (!data || typeof data !== 'object') return false;

  const d = data as any;

  // Check metadata structure
  if (!d.metadata?.version || !d.metadata?.exportedAt) return false;

  // Check data structure
  if (!d.data?.words || !Array.isArray(d.data.words)) return false;
  if (!d.data?.categories || !Array.isArray(d.data.categories)) return false;
  if (!d.data?.settings || typeof d.data.settings !== 'object') return false;

  // NOTE: Resources are optional for backward compatibility
  // Early export formats may not include resources

  return true;
}

/**
 * Get current vocabulary counts from database
 *
 * WHY: Provides summary statistics for UI display
 * REASON: Helps users understand their vocabulary size before export
 *
 * @returns Current vocabulary counts
 * @throws Error if database operations fail
 */
export async function getVocabularyCount(): Promise<VocabularyCount> {
  try {
    const [words, categories, resources] = await Promise.all([
      dataService.getAllWords(),
      dataService.getAllCategories(),
      dataService.getAllResources(),
    ]);

    return {
      words: words.length,
      categories: categories.length,
      resources: resources.length,
    };
  } catch (error) {
    throw new Error(`Failed to get vocabulary count: ${(error as Error).message}`);
  }
}

/**
 * Format file size in human-readable format
 *
 * WHY: Users need to understand file sizes in familiar units
 * REASON: Byte counts are not intuitive, KB/MB are more user-friendly
 *
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "5.2 KB" or "1.3 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
