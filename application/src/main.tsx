import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { OfflineIndicator } from "./components/OfflineIndicator.tsx";
import { registerSW } from 'virtual:pwa-register';
import "./index.css";

/**
 * Service Worker Registration
 *
 * WHY: Enable PWA offline support for AAC users
 * REASON: Critical for reliable communication when internet is unavailable
 */
const updateSW = registerSW({
  onNeedRefresh() {
    // WHY: Prompt user when new version is available
    if (confirm('New version available. Reload to update?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  }
});

/**
 * Application Entry Point
 *
 * WHY: Wrapped in ErrorBoundary to catch database initialization errors
 * REASON: Following PRD-001 Task 2.5 - Error boundary for graceful failure handling
 */
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
    <OfflineIndicator />
  </ErrorBoundary>
);