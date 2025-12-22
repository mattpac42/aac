import React, { useEffect, useState } from 'react';
import { Loader2, Check, AlertCircle, X } from 'lucide-react';
import { cn } from './ui/utils';

/**
 * AutoSaveIndicator Component
 *
 * WHY: Provides visual feedback for auto-save operations to build user trust
 * REASON: Users need to know when their data is being saved, successfully saved, or if an error occurred
 *
 * STATES:
 * - idle: Not visible
 * - saving: Blue background, spinner, "Saving..." text
 * - saved: Green background, check icon, "Saved ✓" text, auto-dismisses after 2s
 * - error: Red background, alert icon, "Error saving" text, persistent with retry/dismiss buttons
 *
 * ACCESSIBILITY:
 * - ARIA live region for screen readers
 * - Keyboard accessible buttons
 * - Sufficient color contrast
 * - Clear status communication
 */

export interface AutoSaveIndicatorProps {
  /** Current save status */
  status: 'idle' | 'saving' | 'saved' | 'error';
  /** Error object when status is 'error' */
  error?: Error;
  /** Callback to retry save operation */
  onRetry?: () => void;
}

export function AutoSaveIndicator({
  status,
  onRetry,
}: AutoSaveIndicatorProps): React.ReactElement | null {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // REASON: Auto-dismiss saved state after 2 seconds
  useEffect(() => {
    if (status === 'saved') {
      setIsVisible(true);
      setIsDismissed(false);

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else if (status === 'saving' || status === 'error') {
      setIsVisible(true);
      setIsDismissed(false);
    } else {
      setIsVisible(false);
      setIsDismissed(false);
    }
  }, [status]);

  // WHY: Handle dismiss button click for error state
  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  // WHY: Don't render anything if idle or dismissed
  if (status === 'idle' || !isVisible || isDismissed) {
    return null;
  }

  // REASON: Determine background color based on status
  const bgColorClass = status === 'saving'
    ? 'bg-blue-500'
    : status === 'saved'
    ? 'bg-green-500'
    : 'bg-red-500';

  return (
    <div
      data-testid="auto-save-indicator"
      role="status"
      aria-live="polite"
      className={cn(
        'fixed top-4 right-4 z-50',
        'px-4 py-3 rounded-lg shadow-lg',
        'text-white font-medium',
        'flex items-center gap-3',
        'transition-all duration-300 ease-in-out',
        bgColorClass
      )}
    >
      {/* SAVING STATE */}
      {status === 'saving' && (
        <>
          <Loader2
            data-testid="saving-spinner"
            className="h-5 w-5 animate-spin"
            aria-hidden="true"
          />
          <span>Saving...</span>
        </>
      )}

      {/* SAVED STATE */}
      {status === 'saved' && (
        <>
          <Check
            data-testid="saved-check-icon"
            className="h-5 w-5"
            aria-hidden="true"
          />
          <span>Saved ✓</span>
        </>
      )}

      {/* ERROR STATE */}
      {status === 'error' && (
        <>
          <AlertCircle
            data-testid="error-alert-icon"
            className="h-5 w-5"
            aria-hidden="true"
          />
          <span>Error saving</span>

          {/* RETRY BUTTON - Only show if onRetry callback provided */}
          {onRetry && (
            <button
              onClick={onRetry}
              aria-label="Retry save"
              className={cn(
                'ml-2 px-3 py-1 rounded',
                'bg-white/20 hover:bg-white/30',
                'transition-colors duration-200',
                'text-sm font-medium',
                'focus:outline-none focus:ring-2 focus:ring-white/50'
              )}
            >
              Retry
            </button>
          )}

          {/* DISMISS BUTTON */}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss error"
            className={cn(
              'ml-1 p-1 rounded',
              'hover:bg-white/20',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-white/50'
            )}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
