import React, { useState } from 'react';
import { AutoSaveIndicator } from '../AutoSaveIndicator';
import type { AutoSaveIndicatorProps } from '../AutoSaveIndicator';

/**
 * AutoSaveIndicator Demo Component
 *
 * WHY: Visual demonstration of all AutoSaveIndicator states for design review
 * REASON: Allows stakeholders to see and interact with the component
 *
 * DEMO FEATURES:
 * - Toggle between all 4 states (idle, saving, saved, error)
 * - Simulates auto-save behavior
 * - Shows retry functionality
 * - Demonstrates dismiss behavior
 */

export function AutoSaveIndicatorDemo(): React.ReactElement {
  const [status, setStatus] = useState<AutoSaveIndicatorProps['status']>('idle');
  const [simulateError] = useState(new Error('Network connection failed'));

  const handleSimulateSave = () => {
    // Start saving
    setStatus('saving');

    // Simulate save completion after 1.5 seconds
    setTimeout(() => {
      setStatus('saved');

      // Reset to idle after saved state auto-dismisses (2s)
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }, 1500);
  };

  const handleSimulateError = () => {
    // Start saving
    setStatus('saving');

    // Simulate save error after 1 second
    setTimeout(() => {
      setStatus('error');
    }, 1000);
  };

  const handleRetry = () => {
    console.log('Retry save operation');
    handleSimulateSave(); // Try again
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* AutoSaveIndicator */}
      <AutoSaveIndicator
        status={status}
        error={status === 'error' ? simulateError : undefined}
        onRetry={handleRetry}
      />

      {/* Demo Controls */}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          AutoSaveIndicator Component Demo
        </h1>
        <p className="text-slate-600 mb-8">
          Interactive demonstration of the auto-save status indicator component
        </p>

        {/* Current State Display */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-3">
            Current State
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-slate-600">Status:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md font-medium">
              {status}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            Trigger States
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setStatus('idle')}
              className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
            >
              Idle (Hidden)
            </button>
            <button
              onClick={() => setStatus('saving')}
              className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Saving
            </button>
            <button
              onClick={() => setStatus('saved')}
              className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              Saved (Auto-dismiss)
            </button>
            <button
              onClick={() => setStatus('error')}
              className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Error (Persistent)
            </button>
          </div>
        </div>

        {/* Simulated Workflows */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            Simulated Workflows
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleSimulateSave}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Simulate Successful Save
              <span className="block text-sm text-green-100 mt-1">
                Saving → Saved → Auto-dismiss
              </span>
            </button>
            <button
              onClick={handleSimulateError}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Simulate Save Error
              <span className="block text-sm text-red-100 mt-1">
                Saving → Error (with retry)
              </span>
            </button>
          </div>
        </div>

        {/* Design Specifications */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            Design Specifications
          </h2>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Position:</span>
              <span>Fixed, top-right (16px margins)</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Saving State:</span>
              <span>Blue (bg-blue-500), Spinner, "Saving..."</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Saved State:</span>
              <span>Green (bg-green-500), Check, "Saved ✓", Auto-dismiss 2s</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Error State:</span>
              <span>Red (bg-red-500), Alert, "Error saving", Retry/Dismiss</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Accessibility:</span>
              <span>ARIA live region, keyboard accessible</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">z-index:</span>
              <span>50 (above content)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
