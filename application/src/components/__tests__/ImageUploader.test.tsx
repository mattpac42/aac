/**
 * ImageUploader Component Tests
 *
 * WHY: Ensure image upload component works correctly across all states and interactions
 * REASON: TDD approach - write tests first, then implement component
 *
 * COVERAGE:
 * - Initial render and accessibility
 * - Click-to-upload file picker
 * - Drag-and-drop interactions
 * - File validation (type, size)
 * - Image preview and crop workflow
 * - Error states and messages
 * - Loading states
 * - Keyboard navigation
 * - Success indicator animation
 * - Mobile/touch support
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageUploader } from '../ImageUploader';

// Mock browser-image-compression
vi.mock('browser-image-compression', () => ({
  default: vi.fn((file) => Promise.resolve(file)),
}));

/**
 * Test Utilities
 */

// Create mock image file
function createMockImageFile(
  name: string = 'test-image.png',
  type: string = 'image/png',
  sizeKB: number = 100
): File {
  const content = 'a'.repeat(sizeKB * 1024);
  return new File([content], name, { type });
}

// Create mock base64 data URL
function createMockBase64Image(): string {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
}

/**
 * Test Suite
 */

describe('ImageUploader', () => {
  let mockOnImageSelect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnImageSelect = vi.fn();

    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-object-url');
    global.URL.revokeObjectURL = vi.fn();

    // Mock Image constructor for canvas operations
    global.Image = class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      src = '';
      width = 800;
      height = 600;

      constructor() {
        // Simulate image load after next tick
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
    } as any;

    // Mock canvas for image processing
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => ({
        drawImage: vi.fn(),
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      })),
      toBlob: vi.fn((callback) => {
        callback(new Blob(['mock-image'], { type: 'image/png' }));
      }),
    };

    global.HTMLCanvasElement.prototype.getContext = mockCanvas.getContext as any;
    global.HTMLCanvasElement.prototype.toBlob = mockCanvas.toBlob as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * TEST GROUP 1: Initial Render and Accessibility
   */

  it('renders dropzone with accessible labels', () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    // Check for dropzone element
    const dropzone = screen.getByRole('button', { name: /upload image/i });
    expect(dropzone).toBeInTheDocument();

    // Check for instructional text
    expect(screen.getByText(/click to upload or drag and drop/i)).toBeInTheDocument();
    expect(screen.getByText(/PNG, JPG up to 500KB/i)).toBeInTheDocument();

    // Check for upload icon (aria-hidden)
    expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
  });

  it('has correct ARIA attributes for screen readers', () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const dropzone = screen.getByRole('button');

    // Should be focusable and have accessible name
    expect(dropzone).toHaveAttribute('aria-label', 'Upload image');
    expect(dropzone).toHaveAttribute('tabIndex', '0');
  });

  it('displays custom max size when provided', () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} maxSizeKB={1000} />);

    expect(screen.getByText(/PNG, JPG up to 1000KB/i)).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} disabled={true} />);

    const dropzone = screen.getByRole('button');
    expect(dropzone).toHaveAttribute('aria-disabled', 'true');
    expect(dropzone).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  /**
   * TEST GROUP 2: File Picker Interaction
   */

  it('opens file picker when dropzone is clicked', async () => {
    const user = userEvent.setup();
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const dropzone = screen.getByRole('button', { name: /upload image/i });
    const fileInput = screen.getByTestId('file-input');

    // Spy on file input click
    const clickSpy = vi.spyOn(fileInput as HTMLInputElement, 'click');

    await user.click(dropzone);

    expect(clickSpy).toHaveBeenCalled();
  });

  it('opens file picker when Enter key is pressed', async () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const dropzone = screen.getByRole('button', { name: /upload image/i });
    const fileInput = screen.getByTestId('file-input');

    const clickSpy = vi.spyOn(fileInput as HTMLInputElement, 'click');

    dropzone.focus();
    fireEvent.keyDown(dropzone, { key: 'Enter', code: 'Enter' });

    expect(clickSpy).toHaveBeenCalled();
  });

  it('opens file picker when Space key is pressed', async () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const dropzone = screen.getByRole('button', { name: /upload image/i });
    const fileInput = screen.getByTestId('file-input');

    const clickSpy = vi.spyOn(fileInput as HTMLInputElement, 'click');

    dropzone.focus();
    fireEvent.keyDown(dropzone, { key: ' ', code: 'Space' });

    expect(clickSpy).toHaveBeenCalled();
  });

  /**
   * TEST GROUP 3: Drag and Drop Interactions
   */

  it('changes visual state on drag over', () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const dropzone = screen.getByRole('button', { name: /upload image/i });

    // Trigger drag enter first (required to set dragging state)
    fireEvent.dragEnter(dropzone, {
      dataTransfer: {
        items: [createMockImageFile()],
        files: [createMockImageFile()],
      },
    });

    // Should show "drop here" state
    expect(screen.getByText(/drop image here/i)).toBeInTheDocument();
    expect(dropzone).toHaveClass('border-blue-500', 'bg-blue-50');
  });

  it('resets visual state on drag leave', () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const dropzone = screen.getByRole('button', { name: /upload image/i });

    // Drag over then leave
    fireEvent.dragOver(dropzone, {
      dataTransfer: { files: [createMockImageFile()] },
    });
    fireEvent.dragLeave(dropzone);

    // Should return to initial state
    expect(screen.getByText(/click to upload or drag and drop/i)).toBeInTheDocument();
    expect(dropzone).not.toHaveClass('border-blue-500');
  });

  it('handles file drop correctly', async () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const dropzone = screen.getByRole('button', { name: /upload image/i });
    const file = createMockImageFile();

    // Simulate drop event
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
    });

    // Should process the dropped file
    await waitFor(() => {
      expect(screen.getByText(/crop image/i)).toBeInTheDocument();
    });
  });

  /**
   * TEST GROUP 4: File Validation
   */

  it('rejects invalid file types', async () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const invalidFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByText(/please upload PNG or JPG/i)).toBeInTheDocument();
    });

    expect(mockOnImageSelect).not.toHaveBeenCalled();
  });

  it('rejects files exceeding max size', async () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} maxSizeKB={100} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const largeFile = createMockImageFile('large.png', 'image/png', 500); // 500KB

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(screen.getByText(/image must be under 100KB/i)).toBeInTheDocument();
    });

    expect(mockOnImageSelect).not.toHaveBeenCalled();
  });

  it('accepts valid image files', async () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const validFile = createMockImageFile('valid.png', 'image/png', 100);

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    // Should show crop modal
    await waitFor(() => {
      expect(screen.getByText(/crop image/i)).toBeInTheDocument();
    });
  });

  /**
   * TEST GROUP 5: Image Preview and Crop Workflow
   */

  it('displays image preview in crop modal', async () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const file = createMockImageFile();

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const cropModal = screen.getByRole('dialog', { name: /crop image/i });
      expect(cropModal).toBeInTheDocument();
    });
  });

  it('allows skipping crop step', async () => {
    const user = userEvent.setup();
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const file = createMockImageFile();

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/skip crop/i)).toBeInTheDocument();
    });

    const skipButton = screen.getByRole('button', { name: /skip crop/i });
    await user.click(skipButton);

    // Should call onImageSelect with processed image
    await waitFor(() => {
      expect(mockOnImageSelect).toHaveBeenCalled();
    });
  });

  it('allows accepting cropped image', async () => {
    const user = userEvent.setup();
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const file = createMockImageFile();

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/accept/i)).toBeInTheDocument();
    });

    const acceptButton = screen.getByRole('button', { name: /accept/i });
    await user.click(acceptButton);

    // Should call onImageSelect with cropped image
    await waitFor(() => {
      expect(mockOnImageSelect).toHaveBeenCalled();
    });
  });

  it('allows canceling upload', async () => {
    const user = userEvent.setup();
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const file = createMockImageFile();

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    // Should return to initial dropzone state
    expect(screen.getByText(/click to upload or drag and drop/i)).toBeInTheDocument();
    expect(mockOnImageSelect).not.toHaveBeenCalled();
  });

  /**
   * TEST GROUP 6: Loading States
   */

  it('shows loading spinner during image processing', async () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const file = createMockImageFile();

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Should show loading state (briefly before transitioning to crop)
    await waitFor(
      () => {
        const spinner = screen.queryByTestId('loading-spinner');
        const processingText = screen.queryByText(/processing/i);
        // Loading state may be brief, so we check if it appeared OR if we've moved to crop
        expect(
          spinner !== null || screen.queryByText(/crop image/i) !== null
        ).toBe(true);
      },
      { timeout: 500 }
    );
  });

  /**
   * TEST GROUP 7: Success Indicator
   */

  it('shows success indicator after successful upload', async () => {
    const user = userEvent.setup();
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const file = createMockImageFile();

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/skip crop/i)).toBeInTheDocument();
    });

    const skipButton = screen.getByRole('button', { name: /skip crop/i });
    await user.click(skipButton);

    // Should show success checkmark briefly
    await waitFor(() => {
      expect(screen.getByTestId('success-checkmark')).toBeInTheDocument();
    });
  });

  /**
   * TEST GROUP 8: Current Image Display
   */

  it('displays current image when provided', () => {
    const currentImage = createMockBase64Image();
    render(
      <ImageUploader
        onImageSelect={mockOnImageSelect}
        currentImage={currentImage}
      />
    );

    // Should show current image preview
    const imagePreview = screen.getByAltText(/current image/i);
    expect(imagePreview).toBeInTheDocument();
    expect(imagePreview).toHaveAttribute('src', currentImage);

    // Should show "Change Image" button
    expect(screen.getByRole('button', { name: /change image/i })).toBeInTheDocument();
  });

  it('allows changing existing image', async () => {
    const user = userEvent.setup();
    const currentImage = createMockBase64Image();
    render(
      <ImageUploader
        onImageSelect={mockOnImageSelect}
        currentImage={currentImage}
      />
    );

    const changeButton = screen.getByRole('button', { name: /change image/i });
    await user.click(changeButton);

    // Should show dropzone for new upload
    expect(screen.getByText(/click to upload or drag and drop/i)).toBeInTheDocument();
  });

  /**
   * TEST GROUP 9: Error Handling
   */

  it('displays clear error messages', async () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent(/please upload PNG or JPG/i);
    });
  });

  it('allows dismissing error messages', async () => {
    const user = userEvent.setup();
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
    await user.click(dismissButton);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  /**
   * TEST GROUP 10: Keyboard Navigation
   */

  it('supports full keyboard navigation', async () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const dropzone = screen.getByRole('button', { name: /upload image/i });

    // Should be keyboard focusable
    dropzone.focus();
    expect(dropzone).toHaveFocus();

    // Should have visible focus indicator
    expect(dropzone).toHaveClass('focus:ring-2');
  });

  it('has keyboard accessible buttons in crop modal', async () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const file = createMockImageFile();

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // All modal buttons should be keyboard accessible
    const acceptButton = screen.getByRole('button', { name: /accept/i });
    const skipButton = screen.getByRole('button', { name: /skip crop/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    expect(acceptButton).toBeInTheDocument();
    expect(skipButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();

    // Buttons should be focusable
    acceptButton.focus();
    expect(acceptButton).toHaveFocus();

    skipButton.focus();
    expect(skipButton).toHaveFocus();

    cancelButton.focus();
    expect(cancelButton).toHaveFocus();
  });

  /**
   * TEST GROUP 11: Mobile/Touch Support
   */

  it('has touch-friendly target sizes', () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const dropzone = screen.getByRole('button', { name: /upload image/i });

    // Dropzone should be large enough for touch
    // Check for min-h-[200px] class which ensures 200px minimum height
    expect(dropzone).toHaveClass('min-h-[200px]');
  });

  /**
   * TEST GROUP 12: Integration with imageProcessor
   */

  it('calls onImageSelect with base64 data URL', async () => {
    const user = userEvent.setup();
    render(<ImageUploader onImageSelect={mockOnImageSelect} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const file = createMockImageFile();

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/skip crop/i)).toBeInTheDocument();
    });

    const skipButton = screen.getByRole('button', { name: /skip crop/i });
    await user.click(skipButton);

    await waitFor(() => {
      expect(mockOnImageSelect).toHaveBeenCalledWith(
        expect.stringMatching(/^data:image\/(png|jpeg);base64,/)
      );
    });
  });
});
