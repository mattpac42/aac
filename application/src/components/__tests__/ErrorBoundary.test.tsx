import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

/**
 * ErrorBoundary Component Tests
 *
 * WHY: Ensures error boundary correctly catches errors and provides recovery options
 * REASON: Critical for user experience when database initialization fails
 *
 * Test Coverage:
 * 1. Renders children when no error
 * 2. Catches and displays errors
 * 3. Shows database-specific error messages
 * 4. Shows generic error messages
 * 5. "Reload Page" button functionality
 * 6. "Clear Storage & Reload" button functionality
 * 7. Custom fallback prop
 * 8. Reset function clears error state
 * 9. Accessibility attributes
 * 10. Technical details expandable section
 * 11. componentDidCatch logs errors
 */

// Component that throws an error
const ThrowError = ({ error }: { error: Error }) => {
  throw error;
};

// Normal component for happy path
const NormalComponent = () => <div>Normal content</div>;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Mock window methods
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      reload: vi.fn(),
    } as any);

    // Mock indexedDB
    vi.spyOn(window.indexedDB, 'deleteDatabase').mockReturnValue({
      onsuccess: null,
      onerror: null,
    } as any);

    // Mock localStorage
    vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => {});

    // Mock console.error to prevent test output pollution
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('catches and displays error when child component throws', () => {
    const error = new Error('Test error');

    // Suppress React error boundary console errors for this test
    const originalError = console.error;
    console.error = vi.fn();

    render(
      <ErrorBoundary>
        <ThrowError error={error} />
      </ErrorBoundary>
    );

    // Should show error UI
    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();

    console.error = originalError;
  });

  it('displays database-specific error message for IndexedDB errors', () => {
    const dbError = new Error('IndexedDB initialization failed');

    render(
      <ErrorBoundary>
        <ThrowError error={dbError} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Unable to Load Application')).toBeInTheDocument();
    expect(
      screen.getByText(/couldn't initialize your vocabulary storage/i)
    ).toBeInTheDocument();
  });

  it('displays generic error message for non-database errors', () => {
    const genericError = new Error('Random error');

    render(
      <ErrorBoundary>
        <ThrowError error={genericError} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
    expect(
      screen.getByText(/unexpected error occurred/i)
    ).toBeInTheDocument();
  });

  it('calls window.location.reload when "Reload Page" button clicked', () => {
    const error = new Error('Test error');
    const reloadMock = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      reload: reloadMock,
    } as any);

    render(
      <ErrorBoundary>
        <ThrowError error={error} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByRole('button', { name: /reload page/i });
    fireEvent.click(reloadButton);

    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it('clears storage and reloads when "Clear Storage & Reload" clicked', async () => {
    const error = new Error('Database error');
    const reloadMock = vi.fn();
    const clearStorageMock = vi.fn();

    vi.spyOn(window, 'location', 'get').mockReturnValue({
      reload: reloadMock,
    } as any);

    // Mock indexedDB.deleteDatabase to return IDBRequest-like object
    const mockRequest = {
      onsuccess: null,
      onerror: null,
      result: undefined,
    };
    const deleteDbMock = vi.fn(() => {
      // Simulate successful deletion
      setTimeout(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess({} as any);
        }
      }, 0);
      return mockRequest as any;
    });
    vi.spyOn(window.indexedDB, 'deleteDatabase').mockImplementation(deleteDbMock);

    // Mock localStorage.clear
    Storage.prototype.clear = clearStorageMock;

    render(
      <ErrorBoundary>
        <ThrowError error={error} />
      </ErrorBoundary>
    );

    const clearButton = screen.getByRole('button', {
      name: /clear storage and reload/i,
    });

    fireEvent.click(clearButton);

    // Give async operations time to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(deleteDbMock).toHaveBeenCalledWith('AACDatabase');
    expect(clearStorageMock).toHaveBeenCalled();
    expect(reloadMock).toHaveBeenCalled();
  });

  it('uses custom fallback when provided', () => {
    const error = new Error('Test error');
    const customFallback = (err: Error, reset: () => void) => (
      <div>
        <h1>Custom Error UI</h1>
        <p>{err.message}</p>
        <button onClick={reset}>Custom Reset</button>
      </div>
    );

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError error={error} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /custom reset/i })).toBeInTheDocument();
  });

  it('reset function clears error state and re-renders children', () => {
    const error = new Error('Test error');
    let shouldThrow = true;

    const ComponentThatMaybeThrows = () => {
      if (shouldThrow) {
        throw error;
      }
      return <div>Recovered content</div>;
    };

    const customFallback = (_err: Error, reset: () => void) => (
      <div>
        <h1>Error occurred</h1>
        <button
          onClick={() => {
            shouldThrow = false;
            reset();
          }}
        >
          Reset
        </button>
      </div>
    );

    const { rerender } = render(
      <ErrorBoundary fallback={customFallback}>
        <ComponentThatMaybeThrows />
      </ErrorBoundary>
    );

    // Should show error
    expect(screen.getByText('Error occurred')).toBeInTheDocument();

    // Click reset
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    // Re-render to simulate React's re-render after state change
    rerender(
      <ErrorBoundary fallback={customFallback}>
        <ComponentThatMaybeThrows />
      </ErrorBoundary>
    );

    // Should show recovered content
    expect(screen.queryByText('Error occurred')).not.toBeInTheDocument();
    expect(screen.getByText('Recovered content')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    const error = new Error('Test error');

    render(
      <ErrorBoundary>
        <ThrowError error={error} />
      </ErrorBoundary>
    );

    // Check for alert role
    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toBeInTheDocument();

    // Check buttons have accessible names (using aria-label)
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear storage and reload/i })).toBeInTheDocument();

    // Check for heading
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('shows expandable technical details section', () => {
    const error = new Error('Detailed error message');
    error.stack = 'Error stack trace here';

    render(
      <ErrorBoundary>
        <ThrowError error={error} />
      </ErrorBoundary>
    );

    // Initially, technical details should not be visible
    expect(screen.queryByText('Detailed error message')).not.toBeInTheDocument();

    // Click to expand
    const expandButton = screen.getByRole('button', { name: /technical details/i });
    fireEvent.click(expandButton);

    // Now details should be visible
    expect(screen.getByText(/detailed error message/i)).toBeInTheDocument();
  });

  it('logs error to console via componentDidCatch', () => {
    const error = new Error('Test error for logging');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError error={error} />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught error:',
      error,
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );

    consoleErrorSpy.mockRestore();
  });

  it('detects database errors correctly', () => {
    const databaseErrors = [
      new Error('IndexedDB failed'),
      new Error('database connection error'),
      new Error('Dexie initialization failed'),
      Object.assign(new Error('Generic error'), { name: 'DatabaseError' }),
    ];

    databaseErrors.forEach((error) => {
      const { unmount } = render(
        <ErrorBoundary>
          <ThrowError error={error} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Unable to Load Application')).toBeInTheDocument();
      expect(
        screen.getByText(/couldn't initialize your vocabulary storage/i)
      ).toBeInTheDocument();

      unmount();
    });
  });
});
