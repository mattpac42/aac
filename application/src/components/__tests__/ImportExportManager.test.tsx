import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImportExportManager } from '../ImportExportManager';
import * as exportService from '@/lib/utils/exportService';
import * as importService from '@/lib/utils/importService';

/**
 * ImportExportManager Component Tests
 *
 * WHY: Verify backup/restore functionality provides safe, clear UX for vocabulary management
 * REASON: Following TDD - write tests first, then implement component
 *
 * Test Coverage:
 * - Export section rendering and functionality
 * - Import section rendering and functionality
 * - Merge strategy selection
 * - File picker and drag-drop
 * - File validation
 * - Conflict detection and preview
 * - Progress indicators
 * - Success/error feedback
 * - Accessibility attributes
 * - Mobile responsiveness
 */

// Mock the service modules
vi.mock('@/lib/utils/exportService', () => ({
  exportVocabulary: vi.fn(),
  downloadExportFile: vi.fn(),
  getVocabularyCount: vi.fn(),
  formatFileSize: vi.fn((bytes: number) => `${(bytes / 1024).toFixed(1)} KB`),
}));

vi.mock('@/lib/utils/importService', () => ({
  importVocabulary: vi.fn(),
  readImportFile: vi.fn(),
  detectConflicts: vi.fn(),
  validateImportFile: vi.fn(),
}));

describe('ImportExportManager Component', () => {
  const mockVocabularyCount = {
    words: 139,
    categories: 7,
    resources: 5,
  };

  const mockExportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    data: {
      words: [],
      categories: [],
      resources: [],
    },
  };

  const mockImportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    data: {
      words: [{ id: '1', text: 'test', type: 'noun', categoryId: 'cat1', iconName: 'Circle', order: 1, createdAt: new Date(), modifiedAt: new Date(), isDefault: false }],
      categories: [],
      resources: [],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(exportService.getVocabularyCount).mockResolvedValue(mockVocabularyCount);
    vi.mocked(exportService.exportVocabulary).mockResolvedValue(mockExportData);
    vi.mocked(exportService.downloadExportFile).mockReturnValue(undefined);
    vi.mocked(importService.readImportFile).mockResolvedValue(mockImportData);
    vi.mocked(importService.detectConflicts).mockResolvedValue({ words: [], categories: [] });
    vi.mocked(importService.validateImportFile).mockResolvedValue(true);
    vi.mocked(importService.importVocabulary).mockResolvedValue({
      wordsImported: 45,
      categoriesImported: 5,
      wordsUpdated: 12,
      categoriesUpdated: 0,
    });
  });

  describe('Component Rendering', () => {
    it('should render both export and import sections', () => {
      // ARRANGE & ACT
      render(<ImportExportManager />);

      // ASSERT
      expect(screen.getByRole('heading', { level: 2, name: /export vocabulary/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /import vocabulary/i })).toBeInTheDocument();
    });

    it('should display current vocabulary counts', async () => {
      // ARRANGE & ACT
      render(<ImportExportManager />);

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText(/139 words/i)).toBeInTheDocument();
        expect(screen.getByText(/7 categories/i)).toBeInTheDocument();
        expect(screen.getByText(/5 resources/i)).toBeInTheDocument();
      });
    });

    it('should render export button', () => {
      // ARRANGE & ACT
      render(<ImportExportManager />);

      // ASSERT
      const exportButton = screen.getByRole('button', { name: /export vocabulary/i });
      expect(exportButton).toBeInTheDocument();
    });

    it('should render import button (disabled initially)', () => {
      // ARRANGE & ACT
      render(<ImportExportManager />);

      // ASSERT
      const importButton = screen.getByRole('button', { name: /import vocabulary/i });
      expect(importButton).toBeInTheDocument();
      expect(importButton).toBeDisabled();
    });
  });

  describe('Export Functionality', () => {
    it('should trigger export when export button is clicked', async () => {
      // ARRANGE
      render(<ImportExportManager />);
      const exportButton = screen.getByRole('button', { name: /export vocabulary/i });

      // ACT
      fireEvent.click(exportButton);

      // ASSERT
      await waitFor(() => {
        expect(exportService.exportVocabulary).toHaveBeenCalledTimes(1);
      });
    });

    it('should download file after successful export', async () => {
      // ARRANGE
      render(<ImportExportManager />);
      const exportButton = screen.getByRole('button', { name: /export vocabulary/i });

      // ACT
      fireEvent.click(exportButton);

      // ASSERT
      await waitFor(() => {
        expect(exportService.downloadExportFile).toHaveBeenCalledWith(mockExportData);
      });
    });

    it('should show success message after export', async () => {
      // ARRANGE
      render(<ImportExportManager />);
      const exportButton = screen.getByRole('button', { name: /export vocabulary/i });

      // ACT
      fireEvent.click(exportButton);

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText(/export successful/i)).toBeInTheDocument();
      });
    });

    it('should show error message if export fails', async () => {
      // ARRANGE
      vi.mocked(exportService.exportVocabulary).mockRejectedValue(new Error('Export failed'));
      render(<ImportExportManager />);
      const exportButton = screen.getByRole('button', { name: /export vocabulary/i });

      // ACT
      fireEvent.click(exportButton);

      // ASSERT
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent(/export failed/i);
      });
    });

    it('should show loading indicator during export', async () => {
      // ARRANGE
      vi.mocked(exportService.exportVocabulary).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve(mockExportData), 100))
      );
      render(<ImportExportManager />);
      const exportButton = screen.getByRole('button', { name: /export vocabulary/i });

      // ACT
      fireEvent.click(exportButton);

      // ASSERT - Loading indicator should appear
      expect(screen.getByTestId('export-loading')).toBeInTheDocument();
    });
  });

  describe('Merge Strategy Selection', () => {
    it('should render all three merge strategy options', () => {
      // ARRANGE & ACT
      render(<ImportExportManager />);

      // ASSERT
      expect(screen.getByLabelText(/replace all/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/merge/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/skip duplicates/i)).toBeInTheDocument();
    });

    it('should have "merge" selected by default', () => {
      // ARRANGE & ACT
      render(<ImportExportManager />);

      // ASSERT
      const mergeOption = screen.getByLabelText(/merge/i);
      expect(mergeOption).toBeChecked();
    });

    it('should allow changing merge strategy', () => {
      // ARRANGE
      render(<ImportExportManager />);
      const replaceOption = screen.getByLabelText(/replace all/i);

      // ACT
      fireEvent.click(replaceOption);

      // ASSERT
      expect(replaceOption).toBeChecked();
    });

    it('should show warning icon for "replace all" strategy', () => {
      // ARRANGE & ACT
      render(<ImportExportManager />);

      // ASSERT
      const replaceLabel = screen.getByText(/replace all/i).closest('label');
      expect(replaceLabel).toHaveTextContent('⚠️');
    });
  });

  describe('File Selection', () => {
    it('should render file input', () => {
      // ARRANGE & ACT
      render(<ImportExportManager />);

      // ASSERT
      const fileInput = screen.getByTestId('file-input');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('accept', '.json,application/json');
    });

    it('should accept file selection via input', async () => {
      // ARRANGE
      render(<ImportExportManager />);
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([JSON.stringify(mockImportData)], 'vocabulary.json', { type: 'application/json' });

      // ACT
      fireEvent.change(fileInput, { target: { files: [file] } });

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText('vocabulary.json')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should show file size after selection', async () => {
      // ARRANGE
      render(<ImportExportManager />);
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([JSON.stringify(mockImportData)], 'vocabulary.json', { type: 'application/json' });

      // ACT
      fireEvent.change(fileInput, { target: { files: [file] } });

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText(/KB/i)).toBeInTheDocument();
      });
    });

    it('should enable import button after file selection', async () => {
      // ARRANGE
      render(<ImportExportManager />);
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([JSON.stringify(mockImportData)], 'vocabulary.json', { type: 'application/json' });

      // ACT
      fireEvent.change(fileInput, { target: { files: [file] } });

      // ASSERT
      await waitFor(() => {
        const importButton = screen.getByRole('button', { name: /import vocabulary/i });
        expect(importButton).not.toBeDisabled();
      });
    });

    it('should reject non-JSON files', async () => {
      // ARRANGE
      vi.mocked(importService.validateImportFile).mockRejectedValue(new Error('Only JSON files are supported'));
      render(<ImportExportManager />);
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File(['not json'], 'test.txt', { type: 'text/plain' });

      // ACT
      fireEvent.change(fileInput, { target: { files: [file] } });

      // ASSERT
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent(/only json files are supported/i);
      }, { timeout: 3000 });
    });
  });

  describe('Drag and Drop', () => {
    it('should accept file via drag and drop', async () => {
      // ARRANGE
      render(<ImportExportManager />);
      const dropzone = screen.getByTestId('dropzone');
      const file = new File([JSON.stringify(mockImportData)], 'vocabulary.json', { type: 'application/json' });

      // ACT
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
          items: [{ kind: 'file', type: 'application/json' }],
          types: ['Files'],
        },
      });

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText(/vocabulary.json/i)).toBeInTheDocument();
      });
    });

    it('should show dragging state', () => {
      // ARRANGE
      render(<ImportExportManager />);
      const dropzone = screen.getByTestId('dropzone');

      // ACT
      fireEvent.dragEnter(dropzone, {
        dataTransfer: {
          items: [{ kind: 'file', type: 'application/json' }],
          types: ['Files'],
        },
      });

      // ASSERT
      expect(dropzone).toHaveClass('border-blue-500');
    });
  });

  describe('Conflict Detection', () => {
    it('should detect conflicts after file selection', async () => {
      // ARRANGE
      vi.mocked(importService.detectConflicts).mockResolvedValue({
        words: [{ id: '1', text: 'test', type: 'noun', categoryId: 'cat1', iconName: 'Circle', order: 1, createdAt: new Date(), modifiedAt: new Date(), isDefault: false }],
        categories: [],
      });
      render(<ImportExportManager />);
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([JSON.stringify(mockImportData)], 'vocabulary.json', { type: 'application/json' });

      // ACT
      fireEvent.change(fileInput, { target: { files: [file] } });

      // ASSERT
      await waitFor(() => {
        expect(importService.detectConflicts).toHaveBeenCalled();
      });
    });

    it('should show conflict preview when conflicts exist', async () => {
      // ARRANGE
      vi.mocked(importService.detectConflicts).mockResolvedValue({
        words: Array(12).fill({ id: '1', text: 'test', type: 'noun', categoryId: 'cat1', iconName: 'Circle', order: 1, createdAt: new Date(), modifiedAt: new Date(), isDefault: false }),
        categories: Array(3).fill({ id: 'cat1', name: 'Test', iconName: 'Folder', order: 1, createdAt: new Date(), modifiedAt: new Date(), isDefault: false }),
      });
      render(<ImportExportManager />);
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([JSON.stringify(mockImportData)], 'vocabulary.json', { type: 'application/json' });

      // ACT
      fireEvent.change(fileInput, { target: { files: [file] } });

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText(/conflicts detected/i)).toBeInTheDocument();
        expect(screen.getByText(/12 words/i)).toBeInTheDocument();
        expect(screen.getByText(/3 categories/i)).toBeInTheDocument();
      });
    });

    it('should allow continuing import despite conflicts', async () => {
      // ARRANGE
      vi.mocked(importService.detectConflicts).mockResolvedValue({
        words: [{ id: '1', text: 'test', type: 'noun', categoryId: 'cat1', iconName: 'Circle', order: 1, createdAt: new Date(), modifiedAt: new Date(), isDefault: false }],
        categories: [],
      });
      render(<ImportExportManager />);
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([JSON.stringify(mockImportData)], 'vocabulary.json', { type: 'application/json' });

      // ACT - Select file with conflicts
      fireEvent.change(fileInput, { target: { files: [file] } });

      // ASSERT - Continue button should be available
      await waitFor(() => {
        const continueButton = screen.getByRole('button', { name: /continue import/i });
        expect(continueButton).toBeInTheDocument();
      });
    });
  });

  describe('Import Functionality', () => {
    it('should trigger import when import button is clicked', async () => {
      // ARRANGE
      render(<ImportExportManager />);
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([JSON.stringify(mockImportData)], 'vocabulary.json', { type: 'application/json' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /import vocabulary/i })).not.toBeDisabled();
      });

      const importButton = screen.getByRole('button', { name: /import vocabulary/i });

      // ACT
      fireEvent.click(importButton);

      // ASSERT
      await waitFor(() => {
        expect(importService.importVocabulary).toHaveBeenCalled();
      });
    });

    it('should pass selected merge strategy to import service', async () => {
      // ARRANGE
      render(<ImportExportManager />);
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([JSON.stringify(mockImportData)], 'vocabulary.json', { type: 'application/json' });
      const replaceOption = screen.getByLabelText(/replace all/i);

      // Select replace strategy
      fireEvent.click(replaceOption);

      // Select file
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /import vocabulary/i })).not.toBeDisabled();
      });

      const importButton = screen.getByRole('button', { name: /import vocabulary/i });

      // ACT
      fireEvent.click(importButton);

      // ASSERT
      await waitFor(() => {
        expect(importService.importVocabulary).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({ strategy: 'replace' })
        );
      });
    });

    it('should show success message after import', async () => {
      // ARRANGE
      render(<ImportExportManager />);
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([JSON.stringify(mockImportData)], 'vocabulary.json', { type: 'application/json' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /import vocabulary/i })).not.toBeDisabled();
      });

      const importButton = screen.getByRole('button', { name: /import vocabulary/i });

      // ACT
      fireEvent.click(importButton);

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText(/import successful/i)).toBeInTheDocument();
        expect(screen.getByText(/45 words imported/i)).toBeInTheDocument();
        expect(screen.getByText(/5 categories imported/i)).toBeInTheDocument();
        expect(screen.getByText(/12 words updated/i)).toBeInTheDocument();
      });
    });

    it('should show error message if import fails', async () => {
      // ARRANGE
      vi.mocked(importService.importVocabulary).mockRejectedValue(new Error('Import failed'));
      render(<ImportExportManager />);
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([JSON.stringify(mockImportData)], 'vocabulary.json', { type: 'application/json' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /import vocabulary/i })).not.toBeDisabled();
      });

      const importButton = screen.getByRole('button', { name: /import vocabulary/i });

      // ACT
      fireEvent.click(importButton);

      // ASSERT
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent(/import failed/i);
      }, { timeout: 3000 });
    });

    it('should show loading indicator during import', async () => {
      // ARRANGE
      vi.mocked(importService.importVocabulary).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ wordsImported: 10, categoriesImported: 2, wordsUpdated: 0, categoriesUpdated: 0 }), 100))
      );
      render(<ImportExportManager />);
      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      const file = new File([JSON.stringify(mockImportData)], 'vocabulary.json', { type: 'application/json' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /import vocabulary/i })).not.toBeDisabled();
      });

      const importButton = screen.getByRole('button', { name: /import vocabulary/i });

      // ACT
      fireEvent.click(importButton);

      // ASSERT - Loading indicator should appear
      expect(screen.getByTestId('import-loading')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on buttons', () => {
      // ARRANGE & ACT
      render(<ImportExportManager />);

      // ASSERT
      const exportButton = screen.getByRole('button', { name: /export vocabulary/i });
      const importButton = screen.getByRole('button', { name: /import vocabulary/i });

      expect(exportButton).toHaveAttribute('aria-label');
      expect(importButton).toHaveAttribute('aria-label');
    });

    it('should have proper ARIA labels on radio buttons', () => {
      // ARRANGE & ACT
      render(<ImportExportManager />);

      // ASSERT
      expect(screen.getByLabelText(/replace all/i)).toHaveAttribute('type', 'radio');
      expect(screen.getByLabelText(/merge/i)).toHaveAttribute('type', 'radio');
      expect(screen.getByLabelText(/skip duplicates/i)).toHaveAttribute('type', 'radio');
    });

    it('should have keyboard accessible file input', () => {
      // ARRANGE & ACT
      render(<ImportExportManager />);

      // ASSERT
      const filePickerButton = screen.getByRole('button', { name: /choose file/i });
      expect(filePickerButton).toBeInTheDocument();
    });

    it('should announce status changes to screen readers', async () => {
      // ARRANGE
      render(<ImportExportManager />);
      const exportButton = screen.getByRole('button', { name: /export vocabulary/i });

      // ACT
      fireEvent.click(exportButton);

      // ASSERT
      await waitFor(() => {
        const statusRegion = screen.getByRole('status');
        expect(statusRegion).toBeInTheDocument();
      });
    });
  });

  describe('Close Callback', () => {
    it('should call onClose callback when provided', () => {
      // ARRANGE
      const onClose = vi.fn();
      render(<ImportExportManager onClose={onClose} />);

      // ACT
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      // ASSERT
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not render close button if onClose not provided', () => {
      // ARRANGE & ACT
      render(<ImportExportManager />);

      // ASSERT
      const closeButton = screen.queryByRole('button', { name: /close/i });
      expect(closeButton).not.toBeInTheDocument();
    });
  });
});
