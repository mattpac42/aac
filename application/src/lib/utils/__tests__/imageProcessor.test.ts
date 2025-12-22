/**
 * Test suite for client-side image processing utilities
 *
 * NOTE: Full image processing requires Canvas API which is difficult to mock in jsdom.
 * These tests focus on:
 * - API contracts and error handling
 * - Base64 conversion utilities (doesn't require Canvas)
 * - Validation logic
 * - Integration contracts
 *
 * Production testing should be done in real browser (E2E tests).
 */

import { describe, it, expect, vi } from 'vitest';
import {
  fileToBase64,
  base64ToBlob,
  validateImageFile,
  compressImage,
  resizeImage,
  getImageDimensions,
  processImageForStorage,
} from '../imageProcessor';

describe('imageProcessor utilities', () => {
  describe('fileToBase64', () => {
    it('should convert Blob to base64 data URL', async () => {
      const blob = new Blob(['test content'], { type: 'image/jpeg' });
      const base64 = await fileToBase64(blob);

      expect(base64).toMatch(/^data:image\/jpeg;base64,/);
      expect(base64.length).toBeGreaterThan(30);
    });

    it('should handle File objects', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const base64 = await fileToBase64(file);

      expect(base64).toMatch(/^data:image\/jpeg;base64,/);
    });

    it('should handle PNG type', async () => {
      const blob = new Blob(['test'], { type: 'image/png' });
      const base64 = await fileToBase64(blob);

      expect(base64).toMatch(/^data:image\/png;base64,/);
    });

    it('should throw error for empty blob', async () => {
      const emptyBlob = new Blob([]);

      await expect(fileToBase64(emptyBlob)).rejects.toThrow('Cannot convert empty file');
    });

    it('should return valid base64 string', async () => {
      const blob = new Blob(['hello world'], { type: 'image/jpeg' });
      const base64 = await fileToBase64(blob);

      // Verify it's a valid data URL
      expect(base64.split(',').length).toBe(2);

      // Verify base64 portion is valid
      const base64Data = base64.split(',')[1];
      expect(base64Data).toMatch(/^[A-Za-z0-9+/=]+$/);
    });
  });

  describe('base64ToBlob', () => {
    it('should convert base64 data URL to Blob', async () => {
      const testBlob = new Blob(['test content'], { type: 'image/jpeg' });
      const base64 = await fileToBase64(testBlob);
      const blob = base64ToBlob(base64);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/jpeg');
      expect(blob.size).toBeGreaterThan(0);
    });

    it('should handle PNG base64 strings', async () => {
      const testBlob = new Blob(['test'], { type: 'image/png' });
      const base64 = await fileToBase64(testBlob);
      const blob = base64ToBlob(base64);

      expect(blob.type).toBe('image/png');
    });

    it('should throw error for invalid base64 string', () => {
      expect(() => base64ToBlob('not-a-base64-string')).toThrow('must be a data URL');
    });

    it('should throw error for non-data-URL format', () => {
      expect(() => base64ToBlob('SGVsbG8gV29ybGQ=')).toThrow('must be a data URL');
    });

    it('should handle round-trip conversion', async () => {
      const original = new Blob(['hello world'], { type: 'image/jpeg' });
      const base64 = await fileToBase64(original);
      const restored = base64ToBlob(base64);

      expect(restored.type).toBe(original.type);
      expect(restored.size).toBe(original.size);
    });

    it('should extract correct MIME type', async () => {
      const jpegBlob = new Blob(['test'], { type: 'image/jpeg' });
      const jpegBase64 = await fileToBase64(jpegBlob);
      const jpegRestored = base64ToBlob(jpegBase64);

      expect(jpegRestored.type).toBe('image/jpeg');

      const pngBlob = new Blob(['test'], { type: 'image/png' });
      const pngBase64 = await fileToBase64(pngBlob);
      const pngRestored = base64ToBlob(pngBase64);

      expect(pngRestored.type).toBe('image/png');
    });
  });

  describe('validateImageFile', () => {
    it('should validate correct JPEG file', () => {
      const file = new File([new Blob(['test'])], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate correct PNG file', () => {
      const file = new File([new Blob(['test'])], 'test.png', { type: 'image/png' });
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
    });

    it('should reject non-image file types', () => {
      const textFile = new File(['hello'], 'test.txt', { type: 'text/plain' });
      const result = validateImageFile(textFile);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('type');
      expect(result.error).toContain('text/plain');
    });

    it('should reject files exceeding max size', () => {
      // Create 2KB blob
      const largeContent = 'x'.repeat(2048);
      const largeBlob = new Blob([largeContent]);
      const largeFile = new File([largeBlob], 'large.jpg', { type: 'image/jpeg' });

      // Set max size to 1KB
      const result = validateImageFile(largeFile, 1);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('size');
      expect(result.error).toMatch(/\d+KB.*exceeds/);
    });

    it('should accept files under max size', () => {
      const smallBlob = new Blob(['small']);
      const smallFile = new File([smallBlob], 'small.jpg', { type: 'image/jpeg' });

      // Set max size to 1MB
      const result = validateImageFile(smallFile, 1024);

      expect(result.valid).toBe(true);
    });

    it('should respect custom allowed types', () => {
      const webpFile = new File([new Blob(['test'])], 'test.webp', { type: 'image/webp' });

      // Default allowed types (without webp)
      const resultDefault = validateImageFile(webpFile);
      expect(resultDefault.valid).toBe(false);

      // Custom allowed types (with webp)
      const resultCustom = validateImageFile(webpFile, undefined, ['image/webp']);
      expect(resultCustom.valid).toBe(true);
    });

    it('should handle JPG as alias for JPEG', () => {
      const jpgFile = new File([new Blob(['test'])], 'test.jpg', { type: 'image/jpg' });
      const result = validateImageFile(jpgFile);

      expect(result.valid).toBe(true);
    });

    it('should provide helpful error messages', () => {
      const textFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validateImageFile(textFile);

      expect(result.error).toBeDefined();
      expect(result.error).toContain('Invalid file type');
      expect(result.error).toContain('text/plain');
      expect(result.error).toContain('Allowed types');
    });

    it('should handle undefined max size', () => {
      const file = new File([new Blob(['x'.repeat(10000)])], 'large.jpg', { type: 'image/jpeg' });

      // No max size specified - should pass
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
    });

    it('should validate edge case sizes', () => {
      // Exactly at limit
      const content = 'x'.repeat(1024); // 1KB
      const blob = new Blob([content]);
      const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });

      const result = validateImageFile(file, 1); // 1KB limit

      // Should pass (exactly at limit)
      expect(result.valid).toBe(true);
    });
  });

  describe('API contracts', () => {
    it('should export all required functions', () => {
      // This verifies the public API
      expect(compressImage).toBeDefined();
      expect(resizeImage).toBeDefined();
      expect(fileToBase64).toBeDefined();
      expect(base64ToBlob).toBeDefined();
      expect(validateImageFile).toBeDefined();
      expect(getImageDimensions).toBeDefined();
      expect(processImageForStorage).toBeDefined();
    });

    it('should have correct function signatures', () => {
      // Verify functions are async where expected
      expect(compressImage.constructor.name).toBe('AsyncFunction');
      expect(resizeImage.constructor.name).toBe('AsyncFunction');
      expect(fileToBase64.constructor.name).toBe('AsyncFunction');
      expect(getImageDimensions.constructor.name).toBe('AsyncFunction');
      expect(processImageForStorage.constructor.name).toBe('AsyncFunction');

      // Verify synchronous functions
      expect(typeof base64ToBlob).toBe('function');
      expect(typeof validateImageFile).toBe('function');
    });
  });

  describe('Error handling', () => {
    it('should throw meaningful errors', async () => {
      const emptyBlob = new Blob([]);

      await expect(fileToBase64(emptyBlob)).rejects.toThrow();
      await expect(fileToBase64(emptyBlob)).rejects.toThrow(/empty/i);
    });

    it('should handle invalid base64 gracefully', () => {
      expect(() => base64ToBlob('invalid')).toThrow();
      expect(() => base64ToBlob('')).toThrow();
      expect(() => base64ToBlob('data:')).toThrow();
    });

    it('should validate file objects', () => {
      const invalidFile = { name: 'test.jpg', type: 'image/jpeg' } as any;

      // This should not throw, just return invalid
      const result = validateImageFile(invalidFile as File);

      // May pass or fail depending on implementation
      // The key is it doesn't crash
      expect(result).toBeDefined();
      expect(result).toHaveProperty('valid');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle typical upload workflow', async () => {
      // 1. User selects file
      const file = new File([new Blob(['test image data'])], 'photo.jpg', { type: 'image/jpeg' });

      // 2. Validate file
      const validation = validateImageFile(file, 5000); // 5MB limit
      expect(validation.valid).toBe(true);

      // 3. Convert to base64 for storage
      const base64 = await fileToBase64(file);
      expect(base64).toMatch(/^data:image\/jpeg;base64,/);

      // 4. Later, convert back to blob for display
      const blob = base64ToBlob(base64);
      expect(blob.type).toBe('image/jpeg');
    });

    it('should handle rejection workflow', () => {
      // 1. User selects wrong file type
      const file = new File([new Blob(['content'])], 'document.pdf', { type: 'application/pdf' });

      // 2. Validation fails
      const validation = validateImageFile(file);
      expect(validation.valid).toBe(false);
      expect(validation.error).toBeDefined();
    });

    it('should handle size rejection workflow', () => {
      // 1. User selects too large file
      const largeContent = 'x'.repeat(10 * 1024 * 1024); // 10MB
      const file = new File([new Blob([largeContent])], 'huge.jpg', { type: 'image/jpeg' });

      // 2. Validation fails due to size
      const validation = validateImageFile(file, 5000); // 5MB limit
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('size');
    });
  });

  describe('Type safety', () => {
    it('should handle Blob and File types', async () => {
      const blob = new Blob(['test'], { type: 'image/jpeg' });
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      // Both should work
      const blobBase64 = await fileToBase64(blob);
      const fileBase64 = await fileToBase64(file);

      expect(blobBase64).toMatch(/^data:/);
      expect(fileBase64).toMatch(/^data:/);
    });

    it('should preserve MIME types', async () => {
      const types = ['image/jpeg', 'image/png', 'image/jpg'];

      for (const type of types) {
        const blob = new Blob(['test'], { type });
        const base64 = await fileToBase64(blob);
        const restored = base64ToBlob(base64);

        expect(restored.type).toBe(type);
      }
    });
  });
});

/**
 * NOTE ON TESTING STRATEGY
 *
 * This test suite focuses on the utilities that don't require full Canvas API simulation.
 * Functions like compressImage(), resizeImage(), getImageDimensions(), and
 * processImageForStorage() are tested manually in the browser and via E2E tests.
 *
 * Rationale:
 * - jsdom has incomplete Canvas implementation
 * - Mocking Canvas adds complexity and doesn't test real behavior
 * - Production code runs in real browsers with full Canvas API
 * - E2E tests provide better coverage for image processing workflows
 *
 * What we DO test here:
 * ✅ Base64 conversion (critical for storage)
 * ✅ File validation (critical for security)
 * ✅ Error handling
 * ✅ API contracts
 * ✅ Type safety
 *
 * What we test elsewhere:
 * 🌐 Full image processing (E2E browser tests)
 * 🌐 Canvas operations (manual browser testing)
 * 🌐 Compression quality (visual testing)
 * 🌐 Memory management (browser performance tests)
 */
