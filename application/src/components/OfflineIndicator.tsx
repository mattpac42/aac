/**
 * OfflineIndicator Component
 *
 * WHY: Provides visual feedback for offline/online status in PWA
 * REASON: Critical for AAC users to know when app is working offline
 *
 * BEHAVIOR:
 * - Shows persistent indicator when offline
 * - Shows brief "Back online" toast when connection restored
 * - Auto-hides after 3 seconds when online
 * - Accessible with ARIA attributes
 */

import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(!navigator.onLine);

  useEffect(() => {
    // WHY: Show "Back online" message when connection restored
    const handleOnline = () => {
      setIsOnline(true);
      // Show "Back online" briefly, then hide
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };

    // WHY: Show persistent offline indicator when connection lost
    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true); // Keep visible while offline
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // REASON: Clean up event listeners to prevent memory leaks
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // REASON: Don't render anything if indicator should be hidden
  if (!showIndicator) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-opacity duration-300 ${
        isOnline
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-5 h-5" />
          <span>Back online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-5 h-5" />
          <span>Offline - App still works!</span>
        </>
      )}
    </div>
  );
}
