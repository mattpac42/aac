/**
 * Client-side image processing utilities
 *
 * Provides functions for:
 * - Image compression to target file size
 * - Image resizing with aspect ratio preservation
 * - File/Blob to base64 conversion
 * - Base64 to Blob conversion
 * - Image file validation
 * - Image dimension extraction
 * - Full processing pipeline for storage
 *
 * All processing happens in the browser without server uploads.
 */

import imageCompression from 'browser-image-compression';

/**
 * Compress image to target file size
 *
 * REASON: Reduce storage space and improve performance
 * WHY: IndexedDB has size limits, smaller images load faster
 *
 * @param file - File or Blob to compress
 * @param maxSizeKB - Target maximum file size in kilobytes (default: 500KB)
 * @returns Compressed image as Blob
 * @throws Error if compression fails or file is invalid
 */
export async function compressImage(
  file: File | Blob,
  maxSizeKB: number = 500
): Promise<Blob> {
  try {
    const options = {
      maxSizeMB: maxSizeKB / 1024, // Convert KB to MB
      useWebWorker: true, // Non-blocking compression
      maxIteration: 10, // Quality vs size balance
      fileType: file.type, // Preserve original type
    };

    // NOTE: browser-image-compression expects File type
    const fileToCompress = file instanceof File
      ? file
      : new File([file], 'image.jpg', { type: file.type });

    const compressed = await imageCompression(fileToCompress, options);
    return compressed;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Image compression failed: ${message}`);
  }
}

/**
 * Resize image to maximum dimensions while maintaining aspect ratio
 *
 * REASON: Use Canvas API for client-side resize
 * WHY: No server upload needed, works offline, fast performance
 *
 * @param file - File or Blob to resize
 * @param maxWidthOrHeight - Maximum width or height in pixels (default: 800px)
 * @returns Resized image as Blob
 * @throws Error if resize fails or file is invalid
 */
export async function resizeImage(
  file: File | Blob,
  maxWidthOrHeight: number = 800
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        // Calculate new dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        // REASON: Only downscale, never upscale
        // WHY: Upscaling reduces quality and increases file size
        if (width <= maxWidthOrHeight && height <= maxWidthOrHeight) {
          // Image is already small enough, return as-is
          URL.revokeObjectURL(url);
          resolve(file);
          return;
        }

        // Calculate scaling factor
        if (width > height) {
          // Landscape orientation
          if (width > maxWidthOrHeight) {
            height = (height * maxWidthOrHeight) / width;
            width = maxWidthOrHeight;
          }
        } else {
          // Portrait or square orientation
          if (height > maxWidthOrHeight) {
            width = (width * maxWidthOrHeight) / height;
            height = maxWidthOrHeight;
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // REASON: Use high-quality image smoothing
        // WHY: Better visual quality after resize
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          },
          file.type || 'image/jpeg',
          0.95 // High quality
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        const message = error instanceof Error ? error.message : 'Unknown error';
        reject(new Error(`Image resize failed: ${message}`));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for resizing'));
    };

    img.src = url;
  });
}

/**
 * Convert File or Blob to base64 data URL
 *
 * REASON: Use FileReader API for conversion
 * WHY: Standard browser API, reliable, handles large files
 *
 * @param file - File or Blob to convert
 * @returns Base64 data URL string (e.g., "data:image/jpeg;base64,/9j/4AAQ...")
 * @throws Error if conversion fails or file is empty
 */
export async function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size === 0) {
      reject(new Error('Cannot convert empty file to base64'));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };

    reader.onerror = () => {
      reject(new Error(`FileReader error: ${reader.error?.message || 'Unknown error'}`));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Convert base64 data URL to Blob
 *
 * REASON: Extract MIME type and binary data from data URL
 * WHY: Need Blob for image processing and validation
 *
 * @param base64 - Base64 data URL string
 * @returns Blob with correct MIME type
 * @throws Error if base64 string is invalid
 */
export function base64ToBlob(base64: string): Blob {
  // Validate data URL format
  if (!base64.startsWith('data:')) {
    throw new Error('Invalid base64 string: must be a data URL (data:image/...)');
  }

  try {
    // Extract MIME type and base64 data
    const parts = base64.split(',');
    if (parts.length !== 2) {
      throw new Error('Invalid data URL format');
    }

    const mimeMatch = parts[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Could not extract MIME type from data URL');
    }

    const mimeType = mimeMatch[1];
    const base64Data = parts[1];

    // Decode base64 to binary
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: mimeType });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to convert base64 to blob: ${message}`);
  }
}

/**
 * Validate image file type and size
 *
 * REASON: Prevent invalid files from being processed
 * WHY: Invalid files cause errors, waste resources, break functionality
 *
 * @param file - File to validate
 * @param maxSizeKB - Optional maximum file size in kilobytes
 * @param allowedTypes - Optional array of allowed MIME types
 * @returns Validation result with valid flag and optional error message
 */
export function validateImageFile(
  file: File,
  maxSizeKB?: number,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg']
): { valid: boolean; error?: string } {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size if specified
  if (maxSizeKB !== undefined) {
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB) {
      return {
        valid: false,
        error: `File size (${fileSizeKB.toFixed(1)}KB) exceeds maximum (${maxSizeKB}KB)`,
      };
    }
  }

  return { valid: true };
}

/**
 * Get dimensions (width and height) of an image
 *
 * REASON: Load image into DOM to extract dimensions
 * WHY: Need dimensions for resize calculations and validation
 *
 * @param file - File or Blob to measure
 * @returns Object with width and height in pixels
 * @throws Error if image cannot be loaded
 */
export async function getImageDimensions(
  file: File | Blob
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image to get dimensions'));
    };

    img.src = url;
  });
}

/**
 * Process image for storage: resize, compress, and convert to base64
 *
 * REASON: Complete pipeline for preparing images for IndexedDB storage
 * WHY: Ensures all images are optimized, consistent size, ready to store
 *
 * @param file - File to process
 * @param options - Optional configuration
 * @param options.maxSizeKB - Maximum file size in KB (default: 500)
 * @param options.maxDimensions - Maximum width/height in pixels (default: 800)
 * @returns Base64 data URL ready for storage
 * @throws Error if processing fails
 */
export async function processImageForStorage(
  file: File,
  options: {
    maxSizeKB?: number;
    maxDimensions?: number;
  } = {}
): Promise<string> {
  const { maxSizeKB = 500, maxDimensions = 800 } = options;

  try {
    // Step 1: Resize image to max dimensions
    const resized = await resizeImage(file, maxDimensions);

    // Step 2: Compress to target file size
    const compressed = await compressImage(resized, maxSizeKB);

    // Step 3: Convert to base64 for storage
    const base64 = await fileToBase64(compressed);

    return base64;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Image processing failed: ${message}`);
  }
}
