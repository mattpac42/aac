/**
 * OfflineIndicator Component Tests
 *
 * WHY: Tests offline/online status indicator for PWA offline support
 * REASON: Following TDD workflow - tests written first to drive implementation
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { OfflineIndicator } from '../OfflineIndicator';

describe('OfflineIndicator', () => {
  let onlineGetter: jest.SpyInstance;

  beforeEach(() => {
    // REASON: Mock navigator.onLine to control online/offline state
    onlineGetter = vi.spyOn(window.navigator, 'onLine', 'get');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Offline State', () => {
    it('renders offline indicator when app starts offline', () => {
      // GIVEN: App starts in offline mode
      onlineGetter.mockReturnValue(false);

      // WHEN: Component renders
      render(<OfflineIndicator />);

      // THEN: Offline indicator is visible
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/offline - app still works!/i)).toBeInTheDocument();
    });

    it('displays WiFi Off icon when offline', () => {
      // GIVEN: App is offline
      onlineGetter.mockReturnValue(false);

      // WHEN: Component renders
      const { container } = render(<OfflineIndicator />);

      // THEN: WifiOff icon is rendered (lucide-react renders as svg)
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('applies red background when offline', () => {
      // GIVEN: App is offline
      onlineGetter.mockReturnValue(false);

      // WHEN: Component renders
      render(<OfflineIndicator />);

      // THEN: Red background is applied
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('bg-red-500');
    });

    it('stays visible while offline', () => {
      // GIVEN: App is offline
      onlineGetter.mockReturnValue(false);

      // WHEN: Component renders and time passes
      render(<OfflineIndicator />);
      vi.advanceTimersByTime(5000);

      // THEN: Indicator remains visible
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Online State', () => {
    it('does not render when app starts online', () => {
      // GIVEN: App starts online
      onlineGetter.mockReturnValue(true);

      // WHEN: Component renders
      render(<OfflineIndicator />);

      // THEN: No indicator is shown
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('shows "Back online" message when connection restored', () => {
      // GIVEN: App starts online
      onlineGetter.mockReturnValue(true);
      render(<OfflineIndicator />);

      // WHEN: Connection is restored (online event fires)
      act(() => {
        onlineGetter.mockReturnValue(true);
        window.dispatchEvent(new Event('online'));
      });

      // THEN: "Back online" message appears
      expect(screen.getByText(/back online/i)).toBeInTheDocument();
    });

    it('displays WiFi icon when back online', () => {
      // GIVEN: App is back online
      onlineGetter.mockReturnValue(true);
      const { container } = render(<OfflineIndicator />);

      // WHEN: Online event fires
      act(() => {
        window.dispatchEvent(new Event('online'));
      });

      // THEN: Wifi icon is rendered
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('applies green background when back online', () => {
      // GIVEN: App is back online
      onlineGetter.mockReturnValue(true);
      render(<OfflineIndicator />);

      // WHEN: Online event fires
      act(() => {
        window.dispatchEvent(new Event('online'));
      });

      // THEN: Green background is applied
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('bg-green-500');
    });

    it('auto-hides "Back online" message after 3 seconds', () => {
      // GIVEN: App is back online
      onlineGetter.mockReturnValue(true);
      render(<OfflineIndicator />);

      // WHEN: Online event fires
      act(() => {
        window.dispatchEvent(new Event('online'));
      });
      expect(screen.getByRole('status')).toBeInTheDocument();

      // AND: 3 seconds pass
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // THEN: Indicator disappears
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('State Transitions', () => {
    it('transitions from offline to online correctly', () => {
      // GIVEN: App starts offline
      onlineGetter.mockReturnValue(false);
      render(<OfflineIndicator />);

      // WHEN: App goes online
      act(() => {
        onlineGetter.mockReturnValue(true);
        window.dispatchEvent(new Event('online'));
      });

      // THEN: Message changes from offline to back online
      expect(screen.getByText(/back online/i)).toBeInTheDocument();
      expect(screen.queryByText(/offline - app still works!/i)).not.toBeInTheDocument();
    });

    it('transitions from online to offline correctly', () => {
      // GIVEN: App starts online
      onlineGetter.mockReturnValue(true);
      render(<OfflineIndicator />);

      // WHEN: App goes offline
      act(() => {
        onlineGetter.mockReturnValue(false);
        window.dispatchEvent(new Event('offline'));
      });

      // THEN: Offline message appears
      expect(screen.getByText(/offline - app still works!/i)).toBeInTheDocument();
      expect(screen.queryByText(/back online/i)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has role="status" for screen readers', () => {
      // GIVEN: App is offline
      onlineGetter.mockReturnValue(false);

      // WHEN: Component renders
      render(<OfflineIndicator />);

      // THEN: role="status" is present
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has aria-live="polite" for non-intrusive announcements', () => {
      // GIVEN: App is offline
      onlineGetter.mockReturnValue(false);

      // WHEN: Component renders
      render(<OfflineIndicator />);

      // THEN: aria-live="polite" is present
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Event Listener Cleanup', () => {
    it('removes event listeners on unmount', () => {
      // GIVEN: Component is mounted
      onlineGetter.mockReturnValue(true);
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = render(<OfflineIndicator />);

      // WHEN: Component unmounts
      unmount();

      // THEN: Event listeners are removed
      expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    });
  });
});
