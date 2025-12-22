/**
 * ImportExportManager Component
 *
 * WHY: Enable users to backup and restore their AAC vocabulary data
 * REASON: Data safety is critical - users need reliable backup/restore functionality
 *
 * FEATURES:
 * - Export vocabulary to JSON file
 * - Import vocabulary from JSON file
 * - Multiple merge strategies (replace, merge, skip)
 * - Conflict detection and preview
 * - Progress indicators
 * - Success/error feedback
 * - Drag-and-drop file upload
 * - Full keyboard navigation
 * - WCAG 2.1 AA accessibility
 *
 * ACCESSIBILITY:
 * - ARIA labels on all interactive elements
 * - Keyboard navigation (Tab, Enter, Space)
 * - Focus indicators visible and clear
 * - Screen reader announcements for state changes
 * - Touch targets 44x44px minimum
 * - Color contrast 4.5:1 for text
 *
 * USAGE:
 * <ImportExportManager onClose={() => handleClose()} />
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Download, Upload, Loader2, Check, AlertCircle, X, AlertTriangle, FileJson } from 'lucide-react';
import { cn } from './ui/utils';
import {
  exportVocabulary,
  downloadExportFile,
  getVocabularyCount,
  formatFileSize,
  type ExportData,
  type VocabularyCount,
} from '@/lib/utils/exportService';
import {
  importVocabulary,
  readImportFile,
  detectConflicts,
  validateImportFile,
  type MergeStrategy,
  type ImportResult,
  type ConflictResult,
} from '@/lib/utils/importService';

/**
 * Component Props
 */
export interface ImportExportManagerProps {
  /** Optional callback when component should close (for modal usage) */
  onClose?: () => void;
}

/**
 * Export state types
 */
type ExportState = 'idle' | 'exporting' | 'success' | 'error';

/**
 * Import state types
 */
type ImportState = 'idle' | 'importing' | 'success' | 'error';

/**
 * ImportExportManager Component
 */
export function ImportExportManager({
  onClose,
}: ImportExportManagerProps): React.ReactElement {
  // State - Vocabulary counts
  const [vocabularyCount, setVocabularyCount] = useState<VocabularyCount>({
    words: 0,
    categories: 0,
    resources: 0,
  });

  // State - Export
  const [exportState, setExportState] = useState<ExportState>('idle');
  const [exportedFilename, setExportedFilename] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // State - Import
  const [importState, setImportState] = useState<ImportState>('idle');
  const [mergeStrategy, setMergeStrategy] = useState<MergeStrategy>('merge');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conflicts, setConflicts] = useState<ConflictResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  /**
   * Load vocabulary counts on mount
   */
  useEffect(() => {
    async function loadCounts() {
      try {
        const counts = await getVocabularyCount();
        setVocabularyCount(counts);
      } catch (error) {
        // Silent fail - counts are informational only
        console.error('Failed to load vocabulary counts:', error);
      }
    }
    loadCounts();
  }, []);

  /**
   * Handle export button click
   * REASON: Trigger vocabulary export and download
   */
  const handleExport = useCallback(async () => {
    try {
      setExportState('exporting');
      setExportError(null);

      // Export data
      const data = await exportVocabulary();

      // Generate filename
      const timestamp = new Date()
        .toISOString()
        .replace(/:/g, '-')
        .replace(/\..+/, '');
      const filename = `aac-vocabulary-${timestamp}.json`;

      // Download file
      downloadExportFile(data);

      // Update state
      setExportedFilename(filename);
      setExportState('success');

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setExportState('idle');
        setExportedFilename(null);
      }, 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      setExportError(message);
      setExportState('error');
    }
  }, []);

  /**
   * Handle file selection (from picker or drop)
   * REASON: Validate file and detect conflicts
   */
  const handleFileSelect = useCallback(async (file: File) => {
    try {
      // Reset state
      setImportError(null);
      setConflicts(null);
      setImportResult(null);

      // Validate file
      await validateImportFile(file);

      // Read and parse file
      const data = await readImportFile(file);

      // Detect conflicts
      const conflictResult = await detectConflicts(data);

      // Store file and conflicts
      setSelectedFile(file);
      setConflicts(conflictResult);

      // Show conflict modal if conflicts exist
      if (conflictResult.words.length > 0 || conflictResult.categories.length > 0) {
        setShowConflictModal(true);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid file';
      setImportError(message);
      setSelectedFile(null);
    }
  }, []);

  /**
   * Handle file input change
   */
  const handleFileInputChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        await handleFileSelect(file);
      }
      // Reset input value to allow same file selection
      event.target.value = '';
    },
    [handleFileSelect]
  );

  /**
   * Handle file picker button click
   */
  const handleFilePickerClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Drag and Drop Handlers
   */
  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounterRef.current++;
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      dragCounterRef.current = 0;
      setIsDragging(false);

      const file = event.dataTransfer.files?.[0];
      if (file) {
        await handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  /**
   * Handle import button click
   * REASON: Execute vocabulary import with selected strategy
   */
  const handleImport = useCallback(async () => {
    if (!selectedFile) return;

    try {
      setImportState('importing');
      setImportError(null);

      // Read file data
      const data = await readImportFile(selectedFile);

      // Import with strategy
      const result = await importVocabulary(data, { strategy: mergeStrategy });

      // Update state
      setImportResult(result);
      setImportState('success');
      setShowConflictModal(false);

      // Reload vocabulary counts
      const counts = await getVocabularyCount();
      setVocabularyCount(counts);

      // Reset to idle after 5 seconds
      setTimeout(() => {
        setImportState('idle');
        setImportResult(null);
        setSelectedFile(null);
      }, 5000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Import failed';
      setImportError(message);
      setImportState('error');
    }
  }, [selectedFile, mergeStrategy]);

  /**
   * Handle conflict modal continue
   */
  const handleContinueImport = useCallback(() => {
    setShowConflictModal(false);
    // User can now click import button
  }, []);

  /**
   * Handle conflict modal cancel
   */
  const handleCancelImport = useCallback(() => {
    setShowConflictModal(false);
    setSelectedFile(null);
    setConflicts(null);
  }, []);

  /**
   * Handle dismiss export error
   */
  const handleDismissExportError = useCallback(() => {
    setExportError(null);
    setExportState('idle');
  }, []);

  /**
   * Handle dismiss import error
   */
  const handleDismissImportError = useCallback(() => {
    setImportError(null);
    setImportState('idle');
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Import & Export Vocabulary
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Backup and restore your AAC vocabulary data
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className={cn(
              'p-2 rounded-lg',
              'hover:bg-gray-100',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
            )}
          >
            <X className="h-6 w-6 text-gray-500" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* EXPORT SECTION */}
        <div className="space-y-6">
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Download className="h-5 w-5" aria-hidden="true" />
              Export Vocabulary
            </h2>

            {/* Current Vocabulary Stats */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Current Vocabulary:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• {vocabularyCount.words} words</li>
                <li>• {vocabularyCount.categories} categories</li>
                <li>• {vocabularyCount.resources} resources</li>
              </ul>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={exportState === 'exporting'}
              aria-label="Export vocabulary"
              className={cn(
                'w-full flex items-center justify-center gap-2',
                'px-6 py-3 rounded-lg',
                'bg-blue-600 hover:bg-blue-700',
                'text-white font-medium',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {exportState === 'exporting' ? (
                <>
                  <Loader2
                    data-testid="export-loading"
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" aria-hidden="true" />
                  Export Vocabulary
                </>
              )}
            </button>

            {/* Export Success */}
            {exportState === 'success' && exportedFilename && (
              <div
                role="status"
                aria-live="polite"
                className={cn(
                  'mt-4 p-4 rounded-lg',
                  'bg-green-50 border border-green-200',
                  'flex items-start gap-3'
                )}
              >
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">Export successful!</p>
                  <p className="text-sm text-green-700 mt-1">
                    File: {exportedFilename}
                  </p>
                </div>
              </div>
            )}

            {/* Export Error */}
            {exportState === 'error' && exportError && (
              <div
                role="alert"
                className={cn(
                  'mt-4 p-4 rounded-lg',
                  'bg-red-50 border border-red-200',
                  'flex items-start gap-3'
                )}
              >
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-medium text-red-900">Export failed</p>
                  <p className="text-sm text-red-700 mt-1">{exportError}</p>
                </div>
                <button
                  onClick={handleDismissExportError}
                  aria-label="Dismiss error"
                  className={cn(
                    'p-1 rounded hover:bg-red-100',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-red-500'
                  )}
                >
                  <X className="h-4 w-4 text-red-600" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* IMPORT SECTION */}
        <div className="space-y-6">
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5" aria-hidden="true" />
              Import Vocabulary
            </h2>

            {/* Merge Strategy Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Merge Strategy:
              </p>
              <div className="space-y-2">
                {/* Replace All */}
                <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="mergeStrategy"
                    value="replace"
                    checked={mergeStrategy === 'replace'}
                    onChange={(e) => setMergeStrategy(e.target.value as MergeStrategy)}
                    className="mt-1"
                    aria-label="Replace all - Delete existing and import fresh data"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Replace All</span>
                      <AlertTriangle className="h-4 w-4 text-orange-500" aria-hidden="true" />
                      <span className="text-orange-500">⚠️</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Delete existing vocabulary and import fresh data
                    </p>
                  </div>
                </label>

                {/* Merge */}
                <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-blue-200 bg-blue-50 cursor-pointer">
                  <input
                    type="radio"
                    name="mergeStrategy"
                    value="merge"
                    checked={mergeStrategy === 'merge'}
                    onChange={(e) => setMergeStrategy(e.target.value as MergeStrategy)}
                    className="mt-1"
                    aria-label="Merge - Update existing items and add new ones"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Merge</span>
                      <span className="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-0.5 rounded">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Update existing items and add new ones
                    </p>
                  </div>
                </label>

                {/* Skip Duplicates */}
                <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="mergeStrategy"
                    value="skip"
                    checked={mergeStrategy === 'skip'}
                    onChange={(e) => setMergeStrategy(e.target.value as MergeStrategy)}
                    className="mt-1"
                    aria-label="Skip duplicates - Only add new items"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">Skip Duplicates</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Only add new items, keep existing unchanged
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* File Selection */}
            <div className="mb-6">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                data-testid="file-input"
                type="file"
                accept=".json,application/json"
                onChange={handleFileInputChange}
                className="hidden"
                aria-hidden="true"
              />

              {/* Dropzone */}
              <div
                data-testid="dropzone"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cn(
                  'flex flex-col items-center justify-center',
                  'min-h-[160px] p-6 rounded-lg',
                  'border-2 border-dashed',
                  'transition-all duration-200',
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                )}
              >
                {selectedFile ? (
                  <div className="flex items-center gap-3 w-full">
                    <FileJson className="h-8 w-8 text-blue-600" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setConflicts(null);
                      }}
                      aria-label="Remove file"
                      className={cn(
                        'p-2 rounded hover:bg-gray-200',
                        'transition-colors duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-gray-500'
                      )}
                    >
                      <X className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload
                      className={cn(
                        'h-10 w-10 mb-3',
                        isDragging ? 'text-blue-600' : 'text-gray-400'
                      )}
                      aria-hidden="true"
                    />
                    <button
                      onClick={handleFilePickerClick}
                      aria-label="Choose file"
                      className={cn(
                        'px-4 py-2 rounded-lg',
                        'bg-gray-200 hover:bg-gray-300',
                        'text-gray-900 font-medium text-sm',
                        'transition-colors duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                      )}
                    >
                      Choose File
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      or drag and drop JSON file here
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Import Button */}
            <button
              onClick={handleImport}
              disabled={!selectedFile || importState === 'importing'}
              aria-label="Import vocabulary"
              className={cn(
                'w-full flex items-center justify-center gap-2',
                'px-6 py-3 rounded-lg',
                'bg-green-600 hover:bg-green-700',
                'text-white font-medium',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {importState === 'importing' ? (
                <>
                  <Loader2
                    data-testid="import-loading"
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" aria-hidden="true" />
                  Import Vocabulary
                </>
              )}
            </button>

            {/* Import Success */}
            {importState === 'success' && importResult && (
              <div
                role="status"
                aria-live="polite"
                className={cn(
                  'mt-4 p-4 rounded-lg',
                  'bg-green-50 border border-green-200'
                )}
              >
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900">Import successful!</p>
                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                      <li>• {importResult.wordsImported} words imported</li>
                      <li>• {importResult.categoriesImported} categories imported</li>
                      {importResult.wordsUpdated > 0 && (
                        <li>• {importResult.wordsUpdated} words updated</li>
                      )}
                      {importResult.categoriesUpdated > 0 && (
                        <li>• {importResult.categoriesUpdated} categories updated</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Import Error */}
            {(importState === 'error' || importError) && (
              <div
                role="alert"
                className={cn(
                  'mt-4 p-4 rounded-lg',
                  'bg-red-50 border border-red-200',
                  'flex items-start gap-3'
                )}
              >
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-medium text-red-900">Import failed</p>
                  <p className="text-sm text-red-700 mt-1">{importError}</p>
                </div>
                <button
                  onClick={handleDismissImportError}
                  aria-label="Dismiss error"
                  className={cn(
                    'p-1 rounded hover:bg-red-100',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-red-500'
                  )}
                >
                  <X className="h-4 w-4 text-red-600" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conflict Modal */}
      {showConflictModal && conflicts && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="conflict-modal-title"
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 id="conflict-modal-title" className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-orange-500" aria-hidden="true" />
                Conflicts Detected
              </h3>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                The import file contains items that already exist:
              </p>
              <ul className="space-y-2 text-gray-700 mb-4">
                {conflicts.words.length > 0 && (
                  <li>• {conflicts.words.length} words</li>
                )}
                {conflicts.categories.length > 0 && (
                  <li>• {conflicts.categories.length} categories</li>
                )}
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900">
                  Current strategy: {mergeStrategy === 'replace' ? 'Replace All' : mergeStrategy === 'merge' ? 'Merge' : 'Skip Duplicates'}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  {mergeStrategy === 'replace' && 'All existing items will be deleted and replaced.'}
                  {mergeStrategy === 'merge' && 'Existing items will be updated with imported data.'}
                  {mergeStrategy === 'skip' && 'Conflicting items will be skipped.'}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={handleCancelImport}
                aria-label="Cancel"
                className={cn(
                  'px-6 py-2 rounded-lg',
                  'bg-gray-200 hover:bg-gray-300',
                  'text-gray-900 font-medium',
                  'transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleContinueImport}
                aria-label="Continue import"
                className={cn(
                  'px-6 py-2 rounded-lg',
                  'bg-blue-600 hover:bg-blue-700',
                  'text-white font-medium',
                  'transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                )}
              >
                Continue Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
