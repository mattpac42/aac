/**
 * ImageUploader Component
 *
 * WHY: Enable users to upload custom images for word buttons
 * REASON: Users need to personalize their AAC board with photos of family, favorite items, etc.
 *
 * FEATURES:
 * - Click-to-upload file picker
 * - Drag-and-drop zone with visual feedback
 * - Image preview with optional crop
 * - File validation (type, size)
 * - Loading states during processing
 * - Clear error messages
 * - Success indicator animation
 * - Full keyboard navigation
 * - WCAG 2.1 AA accessibility
 * - Mobile-friendly touch targets
 *
 * ACCESSIBILITY:
 * - ARIA labels on all interactive elements
 * - Keyboard navigation (Tab, Enter, Space, Escape)
 * - Focus indicators visible and clear
 * - Screen reader announcements for state changes
 * - Touch targets 44x44px minimum
 *
 * USAGE:
 * <ImageUploader
 *   onImageSelect={(base64) => handleImage(base64)}
 *   currentImage={existingImage}
 *   maxSizeKB={500}
 *   aspectRatio={1}
 * />
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Check, X, Loader2, AlertCircle } from 'lucide-react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { cn } from './ui/utils';
import {
  processImageForStorage,
  validateImageFile,
  base64ToBlob,
} from '@/lib/utils/imageProcessor';

/**
 * Component Props
 */
export interface ImageUploaderProps {
  /** Callback when image is selected and processed */
  onImageSelect: (imageData: string) => void;
  /** Current image URL for preview (optional) */
  currentImage?: string;
  /** Maximum file size in KB (default: 500KB) */
  maxSizeKB?: number;
  /** Aspect ratio for crop (default: 1 = square) */
  aspectRatio?: number;
  /** Disable all interactions */
  disabled?: boolean;
}

/**
 * Component State Types
 */
type UploadState =
  | 'idle' // No image, showing dropzone
  | 'dragging' // User is dragging file over dropzone
  | 'processing' // Loading/processing image
  | 'cropping' // Showing crop modal
  | 'success' // Brief success animation
  | 'preview' // Showing final image with "Change" button
  | 'error'; // Showing error message

interface UploadError {
  message: string;
}

/**
 * ImageUploader Component
 */
export function ImageUploader({
  onImageSelect,
  currentImage,
  maxSizeKB = 500,
  aspectRatio = 1,
  disabled = false,
}: ImageUploaderProps): React.ReactElement {
  // State
  const [state, setState] = useState<UploadState>(
    currentImage ? 'preview' : 'idle'
  );
  const [error, setError] = useState<UploadError | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragCounterRef = useRef(0);

  /**
   * Handle file selection (from picker or drop)
   * REASON: Centralized file handling logic
   */
  const handleFileSelect = useCallback(
    async (file: File) => {
      if (disabled) return;

      // Reset error state
      setError(null);

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError({ message: 'Please upload PNG or JPG' });
        setState('error');
        return;
      }

      // Validate file size
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB > maxSizeKB) {
        setError({ message: `Image must be under ${maxSizeKB}KB` });
        setState('error');
        return;
      }

      // Store file and show processing state
      setSelectedFile(file);
      setState('processing');

      try {
        // Create object URL for preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Transition to crop modal
        setState('cropping');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setError({ message: `Upload failed: ${message}` });
        setState('error');
      }
    },
    [disabled, maxSizeKB]
  );

  /**
   * Handle file input change
   */
  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
      // Reset input value to allow same file selection
      event.target.value = '';
    },
    [handleFileSelect]
  );

  /**
   * Handle click to open file picker
   */
  const handleDropzoneClick = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  /**
   * Handle keyboard interaction
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleDropzoneClick();
      }
    },
    [disabled, handleDropzoneClick]
  );

  /**
   * Drag and Drop Handlers
   */
  const handleDragEnter = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (disabled) return;

      dragCounterRef.current++;
      if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
        setState('dragging');
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (disabled) return;

      dragCounterRef.current--;
      if (dragCounterRef.current === 0) {
        setState(currentImage ? 'preview' : 'idle');
      }
    },
    [disabled, currentImage]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (disabled) return;

      dragCounterRef.current = 0;

      const file = event.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      } else {
        setState(currentImage ? 'preview' : 'idle');
      }
    },
    [disabled, currentImage, handleFileSelect]
  );

  /**
   * Process and crop image
   * REASON: Extract cropped region and process for storage
   */
  const processCroppedImage = useCallback(
    async (skipCrop: boolean = false) => {
      if (!selectedFile) return;

      setState('processing');

      try {
        let fileToProcess = selectedFile;

        // If user cropped the image, extract the cropped region
        if (!skipCrop && completedCrop && imgRef.current) {
          const canvas = document.createElement('canvas');
          const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
          const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

          canvas.width = completedCrop.width;
          canvas.height = completedCrop.height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Failed to get canvas context');
          }

          ctx.drawImage(
            imgRef.current,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height
          );

          // Convert canvas to blob
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (b) => {
                if (b) resolve(b);
                else reject(new Error('Failed to create blob from canvas'));
              },
              selectedFile.type,
              0.95
            );
          });

          fileToProcess = new File([blob], selectedFile.name, {
            type: selectedFile.type,
          });
        }

        // Process image: resize, compress, convert to base64
        const base64 = await processImageForStorage(fileToProcess, {
          maxSizeKB,
          maxDimensions: 800,
        });

        // Show success indicator briefly
        setState('success');
        setPreviewUrl(base64);

        // Call parent callback
        onImageSelect(base64);

        // Transition to preview state after 1 second
        setTimeout(() => {
          setState('preview');
        }, 1000);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Processing failed';
        setError({ message });
        setState('error');
      }
    },
    [selectedFile, completedCrop, maxSizeKB, onImageSelect]
  );

  /**
   * Handle crop acceptance
   */
  const handleAcceptCrop = useCallback(() => {
    processCroppedImage(false);
  }, [processCroppedImage]);

  /**
   * Handle skip crop
   */
  const handleSkipCrop = useCallback(() => {
    processCroppedImage(true);
  }, [processCroppedImage]);

  /**
   * Handle cancel upload
   */
  const handleCancel = useCallback(() => {
    // Clean up object URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(currentImage || null);
    setError(null);
    setState(currentImage ? 'preview' : 'idle');
  }, [previewUrl, currentImage]);

  /**
   * Handle change image
   */
  const handleChangeImage = useCallback(() => {
    setState('idle');
    setPreviewUrl(null);
  }, []);

  /**
   * Handle error dismissal
   */
  const handleDismissError = useCallback(() => {
    setError(null);
    setState(currentImage ? 'preview' : 'idle');
  }, [currentImage]);

  /**
   * Cleanup object URLs on unmount
   */
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  /**
   * Render: Error State
   */
  if (state === 'error' && error) {
    return (
      <div className="w-full">
        <div
          role="alert"
          className={cn(
            'flex items-center gap-3 p-4 rounded-lg',
            'bg-red-50 border-2 border-red-200',
            'text-red-800'
          )}
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <p className="flex-1 text-sm font-medium">{error.message}</p>
          <button
            onClick={handleDismissError}
            aria-label="Dismiss error"
            className={cn(
              'p-1 rounded hover:bg-red-100',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
            )}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render: Success State
   */
  if (state === 'success') {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <div
          className={cn(
            'flex flex-col items-center gap-3',
            'animate-in fade-in zoom-in duration-300'
          )}
        >
          <div className="bg-green-100 rounded-full p-3">
            <Check
              data-testid="success-checkmark"
              className="h-12 w-12 text-green-600"
              aria-hidden="true"
            />
          </div>
          <p className="text-lg font-medium text-green-800">Image uploaded!</p>
        </div>
      </div>
    );
  }

  /**
   * Render: Preview State (showing current image)
   */
  if (state === 'preview' && previewUrl) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center gap-4">
          <img
            src={previewUrl}
            alt="Current image"
            className="max-w-[300px] rounded-lg shadow-md"
          />
          <button
            onClick={handleChangeImage}
            disabled={disabled}
            aria-label="Change image"
            className={cn(
              'px-6 py-3 rounded-lg',
              'bg-gray-200 hover:bg-gray-300',
              'text-gray-900 font-medium',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            Change Image
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render: Crop Modal
   */
  if (state === 'cropping' && previewUrl) {
    return (
      <div
        role="dialog"
        aria-label="Crop image"
        aria-modal="true"
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Crop Image</h2>
            <p className="text-sm text-gray-600 mt-1">
              Adjust the crop area or skip to use the full image
            </p>
          </div>

          {/* Crop Area */}
          <div className="p-6 flex justify-center">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
            >
              <img
                ref={imgRef}
                src={previewUrl}
                alt="Image to crop"
                className="max-w-full max-h-[50vh]"
              />
            </ReactCrop>
          </div>

          {/* Modal Actions */}
          <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              aria-label="Cancel"
              className={cn(
                'px-6 py-3 rounded-lg',
                'bg-gray-200 hover:bg-gray-300',
                'text-gray-900 font-medium',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
              )}
            >
              Cancel
            </button>

            <button
              onClick={handleSkipCrop}
              aria-label="Skip crop"
              className={cn(
                'px-6 py-3 rounded-lg',
                'bg-blue-500 hover:bg-blue-600',
                'text-white font-medium',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              )}
            >
              Skip Crop
            </button>

            <button
              onClick={handleAcceptCrop}
              aria-label="Accept"
              className={cn(
                'px-6 py-3 rounded-lg',
                'bg-green-600 hover:bg-green-700',
                'text-white font-medium',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              )}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render: Processing State
   */
  if (state === 'processing') {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            data-testid="loading-spinner"
            className="h-8 w-8 animate-spin text-blue-600"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-gray-700">Processing...</p>
        </div>
      </div>
    );
  }

  /**
   * Render: Dropzone (idle or dragging)
   */
  const isDragging = state === 'dragging';

  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        data-testid="file-input"
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Dropzone */}
      <div
        role="button"
        aria-label="Upload image"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={handleDropzoneClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          // Base styles
          'flex flex-col items-center justify-center',
          'min-h-[200px] p-8 rounded-lg',
          'border-2 border-dashed',
          'transition-all duration-200',
          'cursor-pointer',

          // Focus styles
          'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',

          // State-specific styles
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100',

          // Disabled styles
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {/* Upload Icon */}
        <Upload
          data-testid="upload-icon"
          className={cn(
            'h-12 w-12 mb-4',
            isDragging ? 'text-blue-600' : 'text-gray-400'
          )}
          aria-hidden="true"
        />

        {/* Text */}
        <p
          className={cn(
            'text-lg font-medium mb-1',
            isDragging ? 'text-blue-900' : 'text-gray-700'
          )}
        >
          {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
        </p>

        <p className="text-sm text-gray-500">
          PNG, JPG up to {maxSizeKB}KB
        </p>
      </div>
    </div>
  );
}
