import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Auto-Save Utility with Debouncing
 *
 * WHY: Provides automatic saving functionality with debouncing to prevent
 * excessive save operations during rapid user input changes.
 *
 * REASON: Debouncing consolidates multiple rapid changes into a single save
 * operation, reducing database writes and improving performance.
 */

/**
 * Custom debounce function
 *
 * REASON: Implements debouncing without external dependencies like lodash.
 * Returns a debounced function that delays execution until after wait milliseconds
 * have elapsed since the last invocation.
 *
 * NOTE: Returns cleanup function to cancel pending invocations
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): {
  debouncedFn: (...args: Parameters<T>) => void;
  cancel: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = function(...args: Parameters<T>) {
    // Clear existing timeout to reset the delay
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };

  const cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return { debouncedFn, cancel };
}

export interface AutoSaveOptions {
  debounceMs?: number;
  onSaving?: () => void;
  onSaved?: () => void;
  onError?: (error: Error) => void;
}

export interface AutoSaveReturn<T> {
  triggerSave: (data: T) => void;
  isSaving: boolean;
  lastSaved: Date | null;
  error: Error | null;
}

/**
 * useAutoSave Hook
 *
 * WHY: Provides React components with automatic save functionality that debounces
 * rapid changes and provides status feedback for UI integration.
 *
 * @param saveFunction - Async function that performs the save operation
 * @param options - Optional configuration for debounce delay and callbacks
 * @returns Object with triggerSave function and state values
 *
 * @example
 * ```tsx
 * const { triggerSave, isSaving, lastSaved, error } = useAutoSave(
 *   async (data) => await dataService.updateWord(id, data),
 *   {
 *     debounceMs: 500,
 *     onSaving: () => console.log('Saving...'),
 *     onSaved: () => console.log('Saved!'),
 *     onError: (err) => console.error('Save failed:', err)
 *   }
 * );
 *
 * // Trigger auto-save on input change
 * const handleChange = (value) => {
 *   triggerSave({ text: value });
 * };
 * ```
 */
export function useAutoSave<T>(
  saveFunction: (data: T) => Promise<void>,
  options?: AutoSaveOptions
): AutoSaveReturn<T> {
  const {
    debounceMs = 500,
    onSaving,
    onSaved,
    onError,
  } = options || {};

  // State management
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Refs for cleanup and avoiding stale closures
  const isMountedRef = useRef(true);
  const cancelDebounceRef = useRef<(() => void) | null>(null);

  /**
   * Execute save operation
   *
   * NOTE: Wrapped in useCallback to maintain stable reference across renders
   * while accessing current callback values through options parameter
   */
  const executeSave = useCallback(
    async (data: T) => {
      // Don't update state if component unmounted
      if (!isMountedRef.current) return;

      try {
        // Set saving state and trigger onSaving callback
        setIsSaving(true);
        setError(null);
        onSaving?.();

        // Execute the save function
        await saveFunction(data);

        // Don't update state if component unmounted during async operation
        if (!isMountedRef.current) return;

        // Update success state
        setIsSaving(false);
        setLastSaved(new Date());
        onSaved?.();
      } catch (err) {
        // Don't update state if component unmounted during async operation
        if (!isMountedRef.current) return;

        // Handle error
        const error = err instanceof Error ? err : new Error(String(err));
        setIsSaving(false);
        setError(error);
        onError?.(error);
      }
    },
    [saveFunction, onSaving, onSaved, onError]
  );

  /**
   * Create debounced save function
   *
   * REASON: Effect recreates debounced function when dependencies change
   * to ensure callbacks and save function are always current
   */
  const debouncedSaveRef = useRef<((data: T) => void) | null>(null);

  useEffect(() => {
    const { debouncedFn, cancel } = debounce(executeSave, debounceMs);
    debouncedSaveRef.current = debouncedFn;
    cancelDebounceRef.current = cancel;

    return () => {
      cancel();
    };
  }, [executeSave, debounceMs]);

  /**
   * Cleanup on unmount
   *
   * WHY: Prevents memory leaks and state updates after unmount by marking
   * component as unmounted and cancelling pending debounced saves
   */
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cancelDebounceRef.current?.();
    };
  }, []);

  /**
   * Trigger save function
   *
   * NOTE: Stable reference that calls the current debounced function
   */
  const triggerSave = useCallback((data: T) => {
    debouncedSaveRef.current?.(data);
  }, []);

  return {
    triggerSave,
    isSaving,
    lastSaved,
    error,
  };
}
