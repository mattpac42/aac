import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// REASON: Polyfill IndexedDB for jsdom test environment
import 'fake-indexeddb/auto';

// REASON: Automatically cleanup after each test
afterEach(() => {
  cleanup();
});
