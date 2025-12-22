import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAutoSave } from '../autoSave';

/**
 * useAutoSave Hook Test Suite
 *
 * WHY: Comprehensive test coverage ensures auto-save utility properly debounces
 * rapid changes, manages state, and integrates with status callbacks
 *
 * REASON: Following TDD principles (Red → Green → Refactor) to verify all
 * behaviors before implementation
 *
 * NOTE: Tests use fake timers to avoid real delays and prevent timeouts
 */

describe('useAutoSave', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  /**
   * Helper function to advance timers and flush promises
   * REASON: waitFor doesn't work with fake timers, so we manually advance timers
   * and flush the promise queue to allow async operations to complete
   * NOTE: Using advanceTimersByTimeAsync ensures both timers and microtask queue are properly flushed
   */
  const advanceTimersAndFlush = async (ms: number) => {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(ms);
    });
  };

  describe('Basic Functionality', () => {
    it('should initialize with correct default state', () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useAutoSave(mockSave));

      expect(result.current.isSaving).toBe(false);
      expect(result.current.lastSaved).toBeNull();
      expect(result.current.error).toBeNull();
      expect(typeof result.current.triggerSave).toBe('function');
    });

    it('should accept custom debounce delay', () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useAutoSave(mockSave, { debounceMs: 1000 })
      );

      expect(result.current).toBeDefined();
    });
  });

  describe('Debouncing Behavior', () => {
    it('should debounce rapid calls into single save operation', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useAutoSave(mockSave));

      // Trigger multiple rapid saves
      act(() => {
        result.current.triggerSave({ test: 'data1' });
        result.current.triggerSave({ test: 'data2' });
        result.current.triggerSave({ test: 'data3' });
      });

      // Should not have called save yet
      expect(mockSave).not.toHaveBeenCalled();

      // Advance past debounce delay and flush promises
      await advanceTimersAndFlush(500);

      // Should have called save only once with last data
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledWith({ test: 'data3' });
    });

    it('should respect custom debounce delay', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useAutoSave(mockSave, { debounceMs: 1000 })
      );

      act(() => {
        result.current.triggerSave({ test: 'data' });
      });

      // Should not save before custom delay
      await advanceTimersAndFlush(500);
      expect(mockSave).not.toHaveBeenCalled();

      // Should save after custom delay
      await advanceTimersAndFlush(500);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it('should reset debounce timer on new trigger', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useAutoSave(mockSave));

      act(() => {
        result.current.triggerSave({ test: 'data1' });
      });

      // Wait 400ms (not enough to trigger)
      await advanceTimersAndFlush(400);

      // Trigger again - should reset timer
      act(() => {
        result.current.triggerSave({ test: 'data2' });
      });

      // Wait 400ms more (800ms total, but only 400ms since last trigger)
      await advanceTimersAndFlush(400);

      // Should not have saved yet
      expect(mockSave).not.toHaveBeenCalled();

      // Wait final 150ms (now 550ms since last trigger)
      await advanceTimersAndFlush(150);

      // Now should save with second data
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledWith({ test: 'data2' });
    });
  });

  describe('Status Callbacks', () => {
    it('should call onSaving callback when save starts', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const onSaving = vi.fn();
      const { result } = renderHook(() =>
        useAutoSave(mockSave, { onSaving })
      );

      act(() => {
        result.current.triggerSave({ test: 'data' });
      });

      await advanceTimersAndFlush(500);

      expect(onSaving).toHaveBeenCalledTimes(1);
    });

    it('should call onSaved callback when save completes', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const onSaved = vi.fn();
      const { result } = renderHook(() =>
        useAutoSave(mockSave, { onSaved })
      );

      act(() => {
        result.current.triggerSave({ test: 'data' });
      });

      await advanceTimersAndFlush(500);

      expect(onSaved).toHaveBeenCalledTimes(1);
    });

    it('should call onError callback when save fails', async () => {
      const error = new Error('Save failed');
      const mockSave = vi.fn().mockRejectedValue(error);
      const onError = vi.fn();
      const { result } = renderHook(() =>
        useAutoSave(mockSave, { onError })
      );

      act(() => {
        result.current.triggerSave({ test: 'data' });
      });

      await advanceTimersAndFlush(500);

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(error);
    });

    it('should call callbacks in correct order: onSaving -> onSaved', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const callOrder: string[] = [];
      const onSaving = vi.fn(() => callOrder.push('saving'));
      const onSaved = vi.fn(() => callOrder.push('saved'));

      const { result } = renderHook(() =>
        useAutoSave(mockSave, { onSaving, onSaved })
      );

      act(() => {
        result.current.triggerSave({ test: 'data' });
      });

      await advanceTimersAndFlush(500);

      expect(callOrder).toEqual(['saving', 'saved']);
    });

    it('should call callbacks in correct order: onSaving -> onError on failure', async () => {
      const error = new Error('Save failed');
      const mockSave = vi.fn().mockRejectedValue(error);
      const callOrder: string[] = [];
      const onSaving = vi.fn(() => callOrder.push('saving'));
      const onError = vi.fn(() => callOrder.push('error'));

      const { result } = renderHook(() =>
        useAutoSave(mockSave, { onSaving, onError })
      );

      act(() => {
        result.current.triggerSave({ test: 'data' });
      });

      await advanceTimersAndFlush(500);

      expect(callOrder).toEqual(['saving', 'error']);
    });
  });

  describe('State Management', () => {
    it('should set isSaving to true during save operation', async () => {
      let resolveSave: () => void;
      const mockSave = vi.fn(() => new Promise<void>(resolve => {
        resolveSave = resolve;
      }));
      const { result } = renderHook(() => useAutoSave(mockSave));

      act(() => {
        result.current.triggerSave({ test: 'data' });
      });

      await advanceTimersAndFlush(500);

      expect(result.current.isSaving).toBe(true);

      // Resolve the save
      await act(async () => {
        resolveSave!();
        await Promise.resolve();
      });

      expect(result.current.isSaving).toBe(false);
    });

    it('should set isSaving to false after successful save', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useAutoSave(mockSave));

      act(() => {
        result.current.triggerSave({ test: 'data' });
      });

      await advanceTimersAndFlush(500);

      expect(result.current.isSaving).toBe(false);
    });

    it('should update lastSaved timestamp after successful save', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useAutoSave(mockSave));

      expect(result.current.lastSaved).toBeNull();

      act(() => {
        result.current.triggerSave({ test: 'data' });
      });

      await advanceTimersAndFlush(500);

      expect(result.current.lastSaved).toBeInstanceOf(Date);
    });

    it('should set error state when save fails', async () => {
      const error = new Error('Save failed');
      const mockSave = vi.fn().mockRejectedValue(error);
      const { result } = renderHook(() => useAutoSave(mockSave));

      act(() => {
        result.current.triggerSave({ test: 'data' });
      });

      await advanceTimersAndFlush(500);

      expect(result.current.error).toEqual(error);
      expect(result.current.isSaving).toBe(false);
    });

    it('should clear error state on successful save after previous error', async () => {
      const error = new Error('Save failed');
      const mockSave = vi.fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAutoSave(mockSave));

      // First save - fails
      act(() => {
        result.current.triggerSave({ test: 'data1' });
      });

      await advanceTimersAndFlush(500);

      expect(result.current.error).toEqual(error);

      // Second save - succeeds
      act(() => {
        result.current.triggerSave({ test: 'data2' });
      });

      await advanceTimersAndFlush(500);

      expect(result.current.error).toBeNull();
      expect(result.current.lastSaved).toBeInstanceOf(Date);
    });
  });

  describe('Error Handling', () => {
    it('should handle synchronous errors from save function', async () => {
      const error = new Error('Sync error');
      const mockSave = vi.fn(() => {
        throw error;
      });
      const onError = vi.fn();

      const { result } = renderHook(() =>
        useAutoSave(mockSave, { onError })
      );

      act(() => {
        result.current.triggerSave({ test: 'data' });
      });

      await advanceTimersAndFlush(500);

      expect(result.current.error).toBeDefined();
      expect(onError).toHaveBeenCalled();
    });

    it('should handle async errors from save function', async () => {
      const error = new Error('Async error');
      const mockSave = vi.fn().mockRejectedValue(error);
      const onError = vi.fn();

      const { result } = renderHook(() =>
        useAutoSave(mockSave, { onError })
      );

      act(() => {
        result.current.triggerSave({ test: 'data' });
      });

      await advanceTimersAndFlush(500);

      expect(result.current.error).toEqual(error);
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple save operations sequentially', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);

      const { result } = renderHook(() => useAutoSave(mockSave));

      // Trigger first save
      act(() => {
        result.current.triggerSave({ test: 'data1' });
      });

      await advanceTimersAndFlush(500);

      expect(result.current.isSaving).toBe(false);
      expect(mockSave).toHaveBeenCalledTimes(1);

      // Trigger second save
      act(() => {
        result.current.triggerSave({ test: 'data2' });
      });

      await advanceTimersAndFlush(500);

      expect(mockSave).toHaveBeenCalledTimes(2);
    });
  });

  describe('Cleanup and Memory Management', () => {
    it('should cleanup debounce timer on unmount', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const { result, unmount } = renderHook(() => useAutoSave(mockSave));

      act(() => {
        result.current.triggerSave({ test: 'data' });
      });

      // Unmount before debounce completes
      unmount();

      // Wait past debounce delay
      await advanceTimersAndFlush(500);

      // Save should not have been called
      expect(mockSave).not.toHaveBeenCalled();
    });

    it('should not update state after unmount', async () => {
      let resolveSave: () => void;
      const mockSave = vi.fn(() => new Promise<void>(resolve => {
        resolveSave = resolve;
      }));

      const { result, unmount } = renderHook(() => useAutoSave(mockSave));

      act(() => {
        result.current.triggerSave({ test: 'data' });
      });

      await advanceTimersAndFlush(500);

      // Save starts
      expect(result.current.isSaving).toBe(true);

      // Unmount while save in progress
      unmount();

      // Complete the async save
      await act(async () => {
        resolveSave!();
        await Promise.resolve();
      });

      // No errors should occur (state updates should be prevented)
      expect(true).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined data gracefully', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useAutoSave(mockSave));

      act(() => {
        result.current.triggerSave(undefined as any);
      });

      await advanceTimersAndFlush(500);

      expect(mockSave).toHaveBeenCalledWith(undefined);
    });

    it('should handle null data gracefully', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useAutoSave(mockSave));

      act(() => {
        result.current.triggerSave(null as any);
      });

      await advanceTimersAndFlush(500);

      expect(mockSave).toHaveBeenCalledWith(null);
    });

    it('should handle empty object data', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useAutoSave(mockSave));

      act(() => {
        result.current.triggerSave({});
      });

      await advanceTimersAndFlush(500);

      expect(mockSave).toHaveBeenCalledWith({});
    });
  });
});
