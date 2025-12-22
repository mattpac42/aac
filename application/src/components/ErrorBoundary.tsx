import React, { Component, ReactNode } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from './ui/utils';

/**
 * ErrorBoundary Component
 *
 * WHY: Provides graceful error handling for database initialization failures
 * REASON: Users need clear error messages and recovery options when IndexedDB fails
 *
 * FEATURES:
 * - Catches errors during React render/lifecycle
 * - Detects database-specific vs generic errors
 * - Provides user-friendly error UI with recovery actions
 * - Expandable technical details for debugging
 * - Accessibility support with ARIA attributes
 *
 * RECOVERY OPTIONS:
 * - "Clear Storage & Reload" - Deletes IndexedDB + localStorage, then refreshes
 * - "Reload Page" - Simple page refresh
 *
 * USAGE:
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */

export interface ErrorBoundaryProps {
  /** Child components to render when no error */
  children: ReactNode;
  /** Optional custom fallback UI renderer */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean;
  /** The caught error object */
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Update state when error is caught
   * WHY: Static method required by React error boundary lifecycle
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details for debugging
   * WHY: Helps developers diagnose issues in production
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  /**
   * Reset error state and re-render children
   * WHY: Allows recovery without full page reload
   */
  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      // Otherwise use default error UI
      return <DefaultErrorUI error={this.state.error} onReset={this.reset} />;
    }

    return this.props.children;
  }
}

/**
 * Default Error UI Component
 *
 * WHY: Provides user-friendly error display with recovery options
 */
interface DefaultErrorUIProps {
  error: Error;
  onReset: () => void;
}

function DefaultErrorUI({ error }: DefaultErrorUIProps): React.ReactElement {
  const [showDetails, setShowDetails] = React.useState(false);

  // Detect if this is a database-related error
  const isDatabaseError = (err: Error): boolean => {
    return (
      err.message.includes('IndexedDB') ||
      err.message.includes('database') ||
      err.message.includes('Dexie') ||
      err.name === 'DatabaseError'
    );
  };

  const isDbError = isDatabaseError(error);

  /**
   * Clear all storage and reload
   * WHY: Provides nuclear option for corrupted database states
   */
  const clearStorageAndReload = async (): Promise<void> => {
    try {
      // Delete IndexedDB database
      await window.indexedDB.deleteDatabase('AACDatabase');

      // Clear localStorage
      localStorage.clear();

      // Reload page
      window.location.reload();
    } catch (err) {
      console.error('Error clearing storage:', err);
      // If clearing fails, just reload anyway
      window.location.reload();
    }
  };

  /**
   * Simple page reload
   * WHY: Often sufficient for transient errors
   */
  const reloadPage = (): void => {
    window.location.reload();
  };

  return (
    <div
      role="alert"
      className="min-h-screen bg-slate-50 flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 rounded-full p-3">
            <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
          </div>
        </div>

        {/* Error Heading */}
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-3">
          {isDbError ? 'Unable to Load Application' : 'Something Went Wrong'}
        </h2>

        {/* Error Message */}
        <p className="text-slate-600 text-center mb-6">
          {isDbError
            ? "We couldn't initialize your vocabulary storage. This might be due to browser storage restrictions or a full storage quota."
            : 'An unexpected error occurred. Please try reloading the page.'}
        </p>

        {/* Action Guidance */}
        <p className="text-sm text-slate-500 text-center mb-6">
          {isDbError
            ? 'Try clearing storage or reloading the page.'
            : 'If the problem persists, contact support.'}
        </p>

        {/* Recovery Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={clearStorageAndReload}
            aria-label="Clear storage and reload"
            className={cn(
              'w-full px-4 py-3 rounded-lg',
              'bg-red-600 hover:bg-red-700',
              'text-white font-medium',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
            )}
          >
            Clear Storage &amp; Reload
          </button>

          <button
            onClick={reloadPage}
            aria-label="Reload page"
            className={cn(
              'w-full px-4 py-3 rounded-lg',
              'bg-slate-200 hover:bg-slate-300',
              'text-slate-900 font-medium',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2'
            )}
          >
            Reload Page
          </button>
        </div>

        {/* Technical Details (Expandable) */}
        <div className="border-t border-slate-200 pt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
            aria-label="Technical details"
            className={cn(
              'w-full flex items-center justify-between',
              'text-sm text-slate-600 hover:text-slate-900',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 rounded'
            )}
          >
            <span className="font-medium">Technical Details</span>
            {showDetails ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          {showDetails && (
            <div className="mt-3 p-3 bg-slate-50 rounded text-xs font-mono text-slate-700 overflow-auto max-h-48">
              <div className="mb-2">
                <strong>Error:</strong> {error.message}
              </div>
              {error.stack && (
                <div>
                  <strong>Stack Trace:</strong>
                  <pre className="mt-1 whitespace-pre-wrap break-words">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
