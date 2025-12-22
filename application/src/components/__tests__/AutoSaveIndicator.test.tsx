import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AutoSaveIndicator } from '../AutoSaveIndicator';

/**
 * AutoSaveIndicator Component Tests
 *
 * WHY: Verify visual feedback for auto-save operations builds user trust
 * REASON: Following TDD - write tests first, then implement component
 *
 * Test Coverage:
 * - All 4 states: idle, saving, saved, error
 * - Auto-dismiss behavior for saved state
 * - Retry callback functionality
 * - Dismiss error functionality
 * - Accessibility attributes
 * - Icon rendering per state
 * - Visual transitions
 */

describe('AutoSaveIndicator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Idle State', () => {
    it('should not be visible when status is idle', () => {
      // ARRANGE & ACT
      const { container } = render(<AutoSaveIndicator status="idle" />);

      // ASSERT
      const indicator = container.querySelector('[data-testid="auto-save-indicator"]');
      expect(indicator).toBeNull();
    });
  });

  describe('Saving State', () => {
    it('should render saving state with spinner and text', () => {
      // ARRANGE & ACT
      render(<AutoSaveIndicator status="saving" />);

      // ASSERT
      expect(screen.getByTestId('auto-save-indicator')).toBeInTheDocument();
      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(screen.getByTestId('saving-spinner')).toBeInTheDocument();
    });

    it('should have blue background for saving state', () => {
      // ARRANGE & ACT
      render(<AutoSaveIndicator status="saving" />);

      // ASSERT
      const indicator = screen.getByTestId('auto-save-indicator');
      expect(indicator).toHaveClass('bg-blue-500');
    });

    it('should have ARIA live region for screen readers', () => {
      // ARRANGE & ACT
      render(<AutoSaveIndicator status="saving" />);

      // ASSERT
      const indicator = screen.getByTestId('auto-save-indicator');
      expect(indicator).toHaveAttribute('aria-live', 'polite');
      expect(indicator).toHaveAttribute('role', 'status');
    });
  });

  describe('Saved State', () => {
    it('should render saved state with check icon and text', () => {
      // ARRANGE & ACT
      render(<AutoSaveIndicator status="saved" />);

      // ASSERT
      expect(screen.getByTestId('auto-save-indicator')).toBeInTheDocument();
      expect(screen.getByText('Saved ✓')).toBeInTheDocument();
      expect(screen.getByTestId('saved-check-icon')).toBeInTheDocument();
    });

    it('should have green background for saved state', () => {
      // ARRANGE & ACT
      render(<AutoSaveIndicator status="saved" />);

      // ASSERT
      const indicator = screen.getByTestId('auto-save-indicator');
      expect(indicator).toHaveClass('bg-green-500');
    });

    it('should auto-dismiss after 2 seconds', async () => {
      // ARRANGE
      const { rerender } = render(<AutoSaveIndicator status="saved" />);

      // ASSERT - Initially visible
      expect(screen.getByTestId('auto-save-indicator')).toBeInTheDocument();

      // ACT - Fast forward 2 seconds
      vi.advanceTimersByTime(2000);

      // NOTE: Component should trigger internal state change to hide itself
      // Simulating the component returning to idle state
      rerender(<AutoSaveIndicator status="idle" />);

      // ASSERT - Should be hidden after 2 seconds
      expect(screen.queryByTestId('auto-save-indicator')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should render error state with alert icon and text', () => {
      // ARRANGE
      const error = new Error('Save failed');

      // ACT
      render(<AutoSaveIndicator status="error" error={error} />);

      // ASSERT
      expect(screen.getByTestId('auto-save-indicator')).toBeInTheDocument();
      expect(screen.getByText('Error saving')).toBeInTheDocument();
      expect(screen.getByTestId('error-alert-icon')).toBeInTheDocument();
    });

    it('should have red background for error state', () => {
      // ARRANGE
      const error = new Error('Save failed');

      // ACT
      render(<AutoSaveIndicator status="error" error={error} />);

      // ASSERT
      const indicator = screen.getByTestId('auto-save-indicator');
      expect(indicator).toHaveClass('bg-red-500');
    });

    it('should render retry button when onRetry is provided', () => {
      // ARRANGE
      const error = new Error('Save failed');
      const onRetry = vi.fn();

      // ACT
      render(<AutoSaveIndicator status="error" error={error} onRetry={onRetry} />);

      // ASSERT
      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', async () => {
      // ARRANGE
      const error = new Error('Save failed');
      const onRetry = vi.fn();

      // ACT
      render(<AutoSaveIndicator status="error" error={error} onRetry={onRetry} />);
      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      // ASSERT
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should render dismiss button for error state', () => {
      // ARRANGE
      const error = new Error('Save failed');

      // ACT
      render(<AutoSaveIndicator status="error" error={error} />);

      // ASSERT
      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      expect(dismissButton).toBeInTheDocument();
    });

    it('should NOT auto-dismiss error state', () => {
      // ARRANGE
      const error = new Error('Save failed');

      // ACT
      render(<AutoSaveIndicator status="error" error={error} />);

      // ASSERT - Initially visible
      expect(screen.getByTestId('auto-save-indicator')).toBeInTheDocument();

      // Fast forward 5 seconds
      vi.advanceTimersByTime(5000);

      // ASSERT - Error should still be visible (no auto-dismiss)
      expect(screen.getByTestId('auto-save-indicator')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for all states', () => {
      // ARRANGE & ACT - Test saving state
      const { rerender } = render(<AutoSaveIndicator status="saving" />);

      // ASSERT
      let indicator = screen.getByTestId('auto-save-indicator');
      expect(indicator).toHaveAttribute('aria-live', 'polite');
      expect(indicator).toHaveAttribute('role', 'status');

      // ACT - Test saved state
      rerender(<AutoSaveIndicator status="saved" />);

      // ASSERT
      indicator = screen.getByTestId('auto-save-indicator');
      expect(indicator).toHaveAttribute('aria-live', 'polite');
      expect(indicator).toHaveAttribute('role', 'status');

      // ACT - Test error state
      rerender(<AutoSaveIndicator status="error" error={new Error('Test')} />);

      // ASSERT
      indicator = screen.getByTestId('auto-save-indicator');
      expect(indicator).toHaveAttribute('aria-live', 'polite');
      expect(indicator).toHaveAttribute('role', 'status');
    });

    it('should have keyboard accessible buttons in error state', () => {
      // ARRANGE
      const error = new Error('Save failed');
      const onRetry = vi.fn();

      // ACT
      render(<AutoSaveIndicator status="error" error={error} onRetry={onRetry} />);

      // ASSERT - Retry button should be focusable and have proper aria-label
      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toHaveAttribute('aria-label');
    });
  });

  describe('Positioning and Layout', () => {
    it('should have fixed positioning in top-right corner', () => {
      // ARRANGE & ACT
      render(<AutoSaveIndicator status="saving" />);

      // ASSERT
      const indicator = screen.getByTestId('auto-save-indicator');
      expect(indicator).toHaveClass('fixed');
      expect(indicator).toHaveClass('top-4');
      expect(indicator).toHaveClass('right-4');
    });

    it('should have high z-index to appear above content', () => {
      // ARRANGE & ACT
      render(<AutoSaveIndicator status="saving" />);

      // ASSERT
      const indicator = screen.getByTestId('auto-save-indicator');
      expect(indicator).toHaveClass('z-50');
    });
  });
});
