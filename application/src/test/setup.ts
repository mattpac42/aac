import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// REASON: Polyfill IndexedDB for jsdom test environment
import 'fake-indexeddb/auto';

// REASON: Polyfill Canvas for image processing tests
// WHY: jsdom doesn't implement Canvas API, need node-canvas for tests
import { createCanvas, Image as CanvasImage } from 'canvas';

// REASON: Track blob URLs for proper cleanup
// WHY: Need to manage object URLs in test environment
const blobURLMap = new Map<string, Blob>();
let blobURLCounter = 0;

// REASON: Mock URL.createObjectURL and revokeObjectURL
// WHY: jsdom doesn't fully implement blob URLs
URL.createObjectURL = function (blob: Blob | MediaSource): string {
  const url = `blob:http://localhost/${blobURLCounter++}`;
  blobURLMap.set(url, blob as Blob);
  return url;
};

URL.revokeObjectURL = function (url: string): void {
  blobURLMap.delete(url);
};

// REASON: Mock document.createElement to provide Canvas support
// WHY: Need to intercept canvas creation for proper mocking
const originalCreateElement = document.createElement.bind(document);
document.createElement = function (tagName: string, options?: any): any {
  if (tagName.toLowerCase() === 'canvas') {
    const nodeCanvas = createCanvas(300, 150);
    const element: any = originalCreateElement(tagName, options);

    // Sync width/height properties
    Object.defineProperty(element, 'width', {
      get() { return nodeCanvas.width; },
      set(val: number) { nodeCanvas.width = val; },
    });

    Object.defineProperty(element, 'height', {
      get() { return nodeCanvas.height; },
      set(val: number) { nodeCanvas.height = val; },
    });

    // Mock getContext
    element.getContext = function (type: string) {
      if (type === '2d') {
        const ctx = nodeCanvas.getContext('2d');
        // Add imageSmoothingEnabled and imageSmoothingQuality
        (ctx as any).imageSmoothingEnabled = true;
        (ctx as any).imageSmoothingQuality = 'high';
        return ctx;
      }
      return null;
    };

    // Mock toBlob - CRITICAL: Must call callback asynchronously
    element.toBlob = function (
      callback: BlobCallback,
      mimeType: string = 'image/png',
      quality?: number
    ) {
      setImmediate(() => {
        try {
          const format = mimeType.includes('png') ? 'image/png' : 'image/jpeg';
          const buffer = nodeCanvas.toBuffer(format);
          const blob = new Blob([buffer], { type: mimeType });
          callback(blob);
        } catch (err) {
          callback(null);
        }
      });
    };

    return element;
  }

  return originalCreateElement(tagName, options);
};

// REASON: Mock Image class for loading images
// WHY: Need to handle blob URLs and data URLs in tests
class MockHTMLImageElement {
  width: number = 0;
  height: number = 0;
  private _src: string = '';
  private _onload: (() => void) | null = null;
  private _onerror: ((err: Error) => void) | null = null;

  set src(value: string) {
    this._src = value;
    setImmediate(async () => {
      try {
        if (value.startsWith('blob:')) {
          // Handle blob URLs - extract dimensions from stored blob
          const blob = blobURLMap.get(value);
          if (blob) {
            // Parse blob to get dimensions
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            try {
              const img = new CanvasImage();
              img.src = buffer;
              this.width = img.width;
              this.height = img.height;
            } catch (e) {
              // If can't parse, use default dimensions
              this.width = 100;
              this.height = 100;
            }
            if (this._onload) this._onload();
          } else {
            if (this._onerror) this._onerror(new Error('Blob not found'));
          }
        } else if (value.startsWith('data:')) {
          // Handle data URLs
          const base64Data = value.split(',')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          const img = new CanvasImage();
          img.src = buffer;
          this.width = img.width;
          this.height = img.height;
          if (this._onload) this._onload();
        } else {
          if (this._onerror) this._onerror(new Error('Unsupported image source'));
        }
      } catch (error) {
        if (this._onerror) this._onerror(error as Error);
      }
    });
  }

  get src() {
    return this._src;
  }

  set onload(handler: (() => void) | null) {
    this._onload = handler;
  }

  get onload() {
    return this._onload;
  }

  set onerror(handler: ((err: Error) => void) | null) {
    this._onerror = handler;
  }

  get onerror() {
    return this._onerror;
  }
}

(global as any).Image = MockHTMLImageElement as any;

// REASON: Automatically cleanup after each test
afterEach(() => {
  cleanup();
  // Clear blob URL map
  blobURLMap.clear();
  blobURLCounter = 0;
});
