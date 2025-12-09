# Data Persistence & Enhanced Customization - Product Requirements Document

## Overview

This PRD addresses the critical gap between the baseline AAC Communication Board (PRD-000) and the Product Vision's Theme 1 (Infinite Customization & Expandability) by implementing data persistence and unlimited vocabulary expansion capabilities. Currently, all user customizations (edited words, custom vocabulary, color themes, resources) are lost on page reload, severely limiting practical usability and preventing users from truly owning their communication boards.

**Goal**: Enable users to save all customizations permanently, add unlimited new words on-the-fly, upload custom symbols/photos, and import/export vocabulary sets, transforming the AAC board from a session-based prototype into a reliable, personalized communication tool.

**Vision Alignment**: This PRD directly implements foundational elements of:
- **Theme 1: Infinite Customization & Expandability** - Unlimited vocabulary growth, custom symbols, templates
- **Theme 5: User-Friendly Experience** - Offline functionality, data reliability, user ownership

## Goals

1. **Eliminate Data Loss**: Persist 100% of user customizations (words, colors, resources, settings) across browser sessions
2. **Enable Unlimited Vocabulary Growth**: Remove hardcoded word limits and allow users to add any number of custom words/categories
3. **Support Custom Visual Communication**: Enable users to upload and store custom photos/symbols for personalized boards
4. **Enable Vocabulary Portability**: Provide import/export functionality for backup, sharing, and cross-device transfer
5. **Ensure Offline Reliability**: Implement offline-first architecture so boards work without internet connection
6. **Maintain Performance**: Keep UI responsive (<200ms interaction time) even with hundreds of custom words

## User Stories

### Data Persistence
- **As a nonverbal user**, I want my word customizations saved permanently so that I don't lose my communication setup when I close the browser
- **As a caregiver**, I want to edit vocabulary and have changes persist across sessions so that the user has consistent communication access
- **As a speech pathologist**, I want to customize a client's board and have those changes saved automatically so that I don't need to reconfigure the board every visit

### Unlimited Vocabulary
- **As a nonverbal user**, I want to add new words instantly when I need them so that I can communicate any concept without limitations
- **As a speech pathologist**, I want to expand vocabulary beyond the current 139-word limit so that boards can grow with the user from childhood to adulthood
- **As a nonverbal user**, I want to create unlimited custom categories (e.g., "My Family", "School Friends", "Favorite Foods") so that I can organize my communication board meaningfully

### Custom Symbols & Photos
- **As a caregiver**, I want to upload photos of family members, pets, and favorite places so that the user can communicate about people and things in their life
- **As a speech pathologist**, I want to add custom symbols or photos for unique vocabulary needs so that boards reflect the user's individual context
- **As a nonverbal user**, I want to see photos of my actual family/friends when I talk about them so that my communication feels personal and authentic

### Import/Export & Backup
- **As a caregiver**, I want to export the user's vocabulary set as a backup so that I don't lose months of customization if the device fails
- **As a speech pathologist**, I want to export a template board I've created and import it for multiple clients so that I can efficiently set up similar communication needs
- **As a nonverbal user**, I want to transfer my vocabulary to a new device so that I can keep my communication setup if I get a new iPad/tablet
- **As a caregiver**, I want to share our customized board with the user's school so that they have consistent vocabulary across settings

### Offline Functionality
- **As a nonverbal user**, I want my communication board to work without internet so that I can always express myself regardless of connectivity
- **As a caregiver**, I want the app to load instantly offline so that the user doesn't experience delays when they need to communicate

## Functional Requirements

### Data Persistence Layer (Core Foundation)

1. **The system must implement IndexedDB for client-side data storage** with structured object stores for words, categories, settings, and resources
2. **The system must automatically save all user changes** within 500ms of modification with visual confirmation (e.g., "Saved" indicator)
3. **The system must restore all saved data on app initialization** before rendering the UI (show loading state if needed)
4. **The system must handle storage quota limits gracefully** by warning users when approaching browser storage limits (typically 50-100MB)
5. **The system must implement data versioning** to support schema migrations as features evolve
6. **The system must provide a "Reset to Defaults" option** that clears all custom data and restores baseline vocabulary (with confirmation prompt)

### Unlimited Vocabulary Expansion

7. **Users must be able to add unlimited new words to core vocabulary and categories** without hardcoded maximums (only constrained by browser storage limits)
8. **Users must be able to create unlimited new custom categories** with user-defined names and icons
9. **The system must support nested category hierarchies** up to 3 levels deep (e.g., Food → Breakfast → Cereals)
10. **Users must be able to reorder words and categories** via drag-and-drop or up/down controls
11. **The system must assign unique IDs to all words and categories** to support reliable persistence and referencing
12. **The system must validate word uniqueness within a category** and warn users if adding duplicates

### Custom Symbol & Photo Upload

13. **Users must be able to upload custom images (PNG, JPG, WebP, SVG)** for any word with file size limit of 1MB per image
14. **The system must store uploaded images in IndexedDB as base64 data URLs** for offline access
15. **The system must provide image preview before confirming upload** with crop/resize options
16. **The system must display a file size warning** if image exceeds recommended size (500KB) with option to proceed
17. **Users must be able to replace or remove custom images** and revert to default Lucide icons
18. **The system must implement lazy loading for custom images** to maintain performance with large vocabularies

### Import/Export Functionality

19. **The system must export vocabulary sets as JSON files** containing all words, categories, colors, custom images, and settings
20. **The system must import vocabulary sets from JSON files** with validation and conflict resolution
21. **Export files must include metadata**: app version, export date, vocabulary name, word count, custom image count
22. **Import must support three merge strategies**: Replace All (overwrite), Merge (add new, keep existing), Append (add all as duplicates)
23. **The system must warn users before replacing existing vocabulary** with preview of changes (X words added, Y words modified, Z words removed)
24. **Export files must handle custom images** by embedding base64 data or exporting as separate ZIP archive
25. **The system must validate imported JSON structure** and provide clear error messages for invalid files

### Offline-First Architecture

26. **The system must implement a service worker** for offline caching of app shell (HTML, CSS, JavaScript)
27. **The system must function fully offline** once initially loaded, with all data and images available from IndexedDB
28. **The system must display online/offline status indicator** in UI header
29. **The system must queue data changes when offline** and sync when connection restored (future cloud sync support)
30. **The system must cache all default Lucide icons** for offline availability

### Data Schema Design

31. **The system must implement structured IndexedDB schema** with the following object stores:
    - `words` - Core vocabulary items (id, text, icon, type, category, customImageUrl, createdAt, modifiedAt)
    - `categories` - Category definitions (id, name, iconName, parentId, order, createdAt)
    - `settings` - App configuration (wordTypeColors, voiceSettings, gridLayout, uiPreferences)
    - `resources` - Educational resources (id, title, description, url, type, category)
    - `metadata` - App state (version, lastModified, wordCount, categoryCount)

32. **The system must support compound indexes** for efficient queries (e.g., category + order for sorted word lists)
33. **The system must implement cascading deletes** when removing categories (prompt user to reassign or delete contained words)

### Performance Requirements

34. **Initial app load time must remain under 3 seconds** even with 500+ custom words
35. **Word addition/edit operations must complete in under 200ms** (excluding image upload time)
36. **Image upload and processing must complete in under 2 seconds** for typical photos (2-5MB originals)
37. **Export generation must complete in under 5 seconds** for vocabularies up to 1000 words
38. **Import processing must complete in under 10 seconds** for vocabularies up to 1000 words

### Data Migration & Backwards Compatibility

39. **The system must migrate existing session-based data to IndexedDB** on first load after feature deployment
40. **The system must support rollback to baseline state** if IndexedDB initialization fails (fallback to in-memory state)
41. **The system must version the data schema** (starting at v1) for future migration support
42. **Data exports must include schema version** to enable backwards-compatible imports

## Non-Goals (Out of Scope)

### Phase 1 Exclusions (Future PRDs)

- **Cloud synchronization across devices** - Requires authentication system and backend infrastructure (PRD-002: Cloud Sync & Collaboration)
- **Real-time collaboration with speech pathologists** - Depends on cloud sync foundation (PRD-002)
- **AI-powered word suggestions/prediction** - Separate feature requiring usage analytics (PRD-004: Intelligent Communication Assistance)
- **Advanced folder organization UI** (drag-and-drop board builder) - Enhanced UX feature for future phase (PRD-003: Navigation & Usability)
- **Template marketplace or sharing platform** - Requires backend infrastructure (PRD-002)
- **Multi-language support** - Internationalization is post-MVP (6-12 months)
- **Voice banking or custom TTS voices** - Technically complex, not critical for MVP (12+ months)
- **Usage analytics or communication logs** - Privacy-sensitive feature requiring separate PRD (PRD-005: Analytics & Insights)

### Explicitly Out of Scope

- Native mobile app versions (iOS/Android) - PWA approach for MVP
- Server-side storage or database - Client-side only for Phase 1
- Multi-user accounts on same device - Single-user experience for MVP
- Automatic vocabulary suggestions based on usage patterns - Requires analytics foundation
- Integration with external AAC systems or symbol libraries - Future interoperability feature

## Design Considerations

### UI/UX Requirements

**Data Persistence Feedback**:
- Visual "Saving..." indicator (animated spinner) during save operations
- "Saved ✓" confirmation message (auto-dismiss after 2 seconds)
- Offline mode indicator in header (gray cloud icon with "Offline" label)
- Clear error messages for storage failures with retry options

**Vocabulary Management UX**:
- "Add New Word" button prominently displayed on each category screen
- "Create New Category" option in navigation menu
- Inline editing for word labels (tap to edit, auto-save on blur)
- Drag handles for reordering (desktop) with up/down arrows (mobile fallback)
- Delete confirmation dialogs with "Are you sure?" warnings

**Custom Image Upload UX**:
- Image upload button alongside icon selection in Edit Words screen
- Image preview modal before confirming upload
- Crop/resize controls (simple center-crop with zoom slider)
- File size indicator and warning if > 500KB
- Fallback to Lucide icon if image fails to load

**Import/Export UX**:
- Settings screen section: "Backup & Restore"
- "Export Vocabulary" button → download JSON file with timestamp (e.g., `aac-board-2025-12-08.json`)
- "Import Vocabulary" button → file picker → preview changes → confirm/cancel
- Visual diff showing added/modified/removed words before import
- Progress indicator for large imports/exports

**Offline Experience**:
- Subtle online/offline indicator in app header (green "Online" | gray "Offline")
- Toast notification when connection status changes
- No functional degradation when offline (all features work)
- Future: Sync queue indicator when offline changes pending (PRD-002)

### Integration Points

**Browser APIs**:
- **IndexedDB API** - Primary data persistence layer
- **File API** - Image upload and import/export file handling
- **Service Worker API** - Offline caching and PWA functionality
- **Web Storage API** - Fallback for simple settings (localStorage)

**Existing Components (PRD-000)**:
- `App.tsx` - Refactor state management to load/save from IndexedDB
- `EditWordsScreen.tsx` - Add image upload, unlimited word addition, category creation
- `ColorThemeScreen.tsx` - Auto-save color changes to IndexedDB
- `SettingsScreen.tsx` - Add "Backup & Restore" section
- `ResourcesScreen.tsx` - Save custom resources to IndexedDB

**New Components Required**:
- `DataService.ts` - IndexedDB abstraction layer (CRUD operations)
- `ImageUploader.tsx` - Image upload UI with preview and crop
- `ImportExportManager.tsx` - Import/export UI and logic
- `OfflineIndicator.tsx` - Connection status display
- `MigrationService.ts` - Data schema migration utilities

**Data Flow**:
```
User Action (Add/Edit/Delete)
  → Component State Update (React setState)
  → DataService.save() (IndexedDB write)
  → Auto-save confirmation UI
  → On app reload: DataService.load() → Component State Initialization
```

## Technical Considerations

### Architecture Requirements

**Technology Stack (Building on PRD-000)**:
- **React 18.3.1** - Existing UI framework (no changes)
- **TypeScript** - Type-safe data models and IndexedDB interfaces
- **IndexedDB** - Client-side structured storage (browser native API)
- **Dexie.js** (recommended) - IndexedDB wrapper for simpler API and promises
- **Workbox** (Google) - Service worker library for offline caching
- **Vite 6.3.5** - Existing build system with PWA plugin support

**Data Storage Strategy**:
- **IndexedDB (recommended)**: Structured storage, handles large data (50MB+), supports indexes, async API, better for complex queries
- **LocalStorage (not recommended)**: Only 5-10MB limit, synchronous API (blocks UI), no structure, insufficient for image storage

**Rationale for IndexedDB**:
1. Storage capacity: 50MB+ (varies by browser) vs. LocalStorage 5-10MB
2. Async operations: Non-blocking saves won't freeze UI
3. Structured data: Native support for objects, arrays, indexes
4. Binary data: Can store images as Blobs or base64 efficiently
5. Transactions: Atomic operations prevent data corruption
6. Future-proof: Foundation for cloud sync (PRD-002) via sync queues

**Service Worker Strategy**:
- **Workbox** for precaching app shell (HTML/CSS/JS)
- **Network-first** strategy for data (IndexedDB is source of truth)
- **Cache-first** strategy for static assets (icons, images)
- **Background sync** preparation for future cloud sync (PRD-002)

### Dependencies

**New NPM Packages**:
- `dexie@^3.2.4` - Modern IndexedDB wrapper with TypeScript support
- `workbox-webpack-plugin@^7.0.0` OR `vite-plugin-pwa@^0.17.0` - Service worker generation
- `react-dropzone@^14.2.3` - Drag-and-drop file upload UI
- `react-image-crop@^11.0.5` - Image cropping interface
- `browser-image-compression@^2.0.2` - Client-side image optimization

**Existing Dependencies (No Changes)**:
- React 18.3.1, Vite 6.3.5, Tailwind CSS, Radix UI, Lucide React (all remain unchanged)

**External Services**:
- None (100% client-side, no backend required)

### Technical Constraints

**Browser Compatibility**:
- IndexedDB: Supported in all modern browsers (Chrome 24+, Firefox 16+, Safari 10+, Edge 12+)
- Service Workers: Chrome 40+, Firefox 44+, Safari 11.1+, Edge 17+
- File API: Universal modern browser support
- **Target**: Support last 2 versions of Chrome, Firefox, Safari, Edge (>95% coverage)

**Storage Limitations**:
- **Chrome/Edge**: ~60% of available disk space (typically 10GB+ on modern devices)
- **Firefox**: ~50% of available disk space with user prompt for >50MB
- **Safari**: 1GB limit (may prompt user for permission beyond 50MB)
- **Recommended User Limit**: Warn users at 25MB usage (~2500-5000 custom images depending on size)

**Performance Constraints**:
- IndexedDB operations should complete in <100ms for typical vocabularies (<500 words)
- Image compression should reduce uploads to <500KB when possible (balance quality vs. size)
- Service worker cache size should stay under 10MB for app shell
- Total app + data size target: <50MB for comfortable multi-device usage

**Security Constraints**:
- IndexedDB data is origin-scoped (domain-specific, not shared across sites)
- No encryption at rest (browser storage is plain-text) - future enhancement for sensitive data
- Service workers require HTTPS in production (automatically enforced by Vercel/Firebase)
- User data never leaves device in Phase 1 (cloud sync is PRD-002)

### Data Schema Design (Detailed)

**IndexedDB Database**: `aac-communication-board` (version 1)

**Object Store: `words`**
```typescript
interface Word {
  id: string;              // UUID v4
  text: string;            // Display text (e.g., "I", "want", "happy")
  type: WordType;          // 'pronoun' | 'verb' | 'descriptive' | 'noun' | 'social'
  categoryId: string;      // Foreign key to categories.id ('core' for core board)
  iconName: string;        // Lucide icon name (e.g., "user", "heart", "home")
  customImageUrl?: string; // base64 data URL or Blob URL
  order: number;           // Display order within category
  createdAt: Date;
  modifiedAt: Date;
  isDefault: boolean;      // True for baseline vocabulary, false for user-added
}
// Indexes: categoryId, type, order, createdAt
```

**Object Store: `categories`**
```typescript
interface Category {
  id: string;              // UUID v4 ('core', 'people', 'food', etc. for defaults)
  name: string;            // Display name (e.g., "People", "My Family")
  iconName: string;        // Lucide icon name
  parentId?: string;       // For nested categories (null = top-level)
  order: number;           // Display order in navigation
  createdAt: Date;
  modifiedAt: Date;
  isDefault: boolean;      // True for baseline categories
}
// Indexes: parentId, order
```

**Object Store: `settings`**
```typescript
interface Settings {
  id: 'app-settings';      // Singleton key
  wordTypeColors: {
    pronoun: { bg: string; border: string };
    verb: { bg: string; border: string };
    descriptive: { bg: string; border: string };
    noun: { bg: string; border: string };
    social: { bg: string; border: string };
  };
  voiceSettings: {
    voiceURI?: string;
    rate: number;          // 0.5 - 2.0
    pitch: number;         // 0.0 - 2.0
    volume: number;        // 0.0 - 1.0
  };
  gridLayout: {
    columns: number;       // 3, 4, 5, 6 (default 5)
  };
  uiPreferences: {
    showOfflineIndicator: boolean;
    autoSaveEnabled: boolean;
    confirmDeletes: boolean;
  };
  modifiedAt: Date;
}
```

**Object Store: `resources`**
```typescript
interface Resource {
  id: string;              // UUID v4
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'document' | 'tip';
  category: 'getting-started' | 'tips-for-partners' | 'modeling-teaching' | 'research-evidence';
  createdAt: Date;
  isDefault: boolean;      // True for baseline resources
}
// Indexes: category, type
```

**Object Store: `metadata`**
```typescript
interface Metadata {
  id: 'app-metadata';      // Singleton key
  schemaVersion: number;   // Data schema version for migrations
  appVersion: string;      // App version when data last modified
  lastModified: Date;
  statistics: {
    totalWords: number;
    customWords: number;
    totalCategories: number;
    customCategories: number;
    customImages: number;
    storageUsedMB: number;
  };
}
```

**Export JSON Format**:
```typescript
interface ExportData {
  metadata: {
    exportVersion: string;     // e.g., "1.0"
    schemaVersion: number;
    appVersion: string;
    exportDate: string;        // ISO 8601
    vocabularyName?: string;   // User-provided name
  };
  words: Word[];
  categories: Category[];
  settings: Settings;
  resources: Resource[];
  // Custom images can be embedded as base64 or referenced for separate export
}
```

### Migration Strategy (Baseline → Phase 1)

**First-Load Data Migration**:
1. Check for existing IndexedDB database on app initialization
2. If not found, create new database with schema v1
3. Seed with baseline vocabulary from PRD-000 hardcoded defaults
4. Mark all baseline data as `isDefault: true`
5. Set metadata: `schemaVersion: 1`, `appVersion: "1.1.0"`

**Rollback/Fallback Strategy**:
- If IndexedDB fails to initialize (rare browser issues), fallback to in-memory state (PRD-000 behavior)
- Display warning banner: "Offline storage unavailable. Changes will not be saved."
- Provide "Download Backup" option to export current session data

**Future Schema Migrations** (PRD-002+):
- Increment `schemaVersion` when data structure changes
- Implement migration functions: `migrateV1toV2()`, etc.
- Run migrations automatically on app load if version mismatch detected

### Implementation Approach

**Phased Development** (recommended sequence):
1. **Phase 1A: IndexedDB Foundation** (Week 1)
   - Set up Dexie.js and define schema
   - Implement DataService layer (CRUD operations)
   - Migrate App.tsx state management to load from IndexedDB
   - Test data persistence for core words, categories, settings

2. **Phase 1B: Unlimited Vocabulary** (Week 2)
   - Remove hardcoded word limits in EditWordsScreen.tsx
   - Add "Create New Category" functionality
   - Implement word/category ordering (drag-and-drop or arrows)
   - Test with 100+ custom words for performance

3. **Phase 1C: Custom Image Upload** (Week 2-3)
   - Build ImageUploader component with react-dropzone
   - Implement image compression and base64 conversion
   - Store images in IndexedDB
   - Lazy load images in WordButton component

4. **Phase 1D: Import/Export** (Week 3)
   - Build export functionality (JSON generation)
   - Build import UI with merge strategies
   - Test round-trip export → import workflow

5. **Phase 1E: Offline Support** (Week 4)
   - Configure service worker with Workbox/vite-plugin-pwa
   - Test offline functionality
   - Add online/offline status indicator

6. **Phase 1F: Testing & Polish** (Week 4)
   - Performance testing with large vocabularies (500+ words)
   - Cross-browser testing (Chrome, Firefox, Safari, Edge)
   - Accessibility audit (keyboard navigation, screen reader support)
   - User acceptance testing with speech pathologist advisory group

## Success Metrics

### Immediate Success Criteria (Launch Week)

- **Data Persistence Rate**: 100% of user customizations successfully saved and restored across browser sessions (zero data loss reports)
- **Performance**: Word addition/edit operations complete in <200ms for vocabularies up to 500 words
- **Storage Efficiency**: Average storage usage <50KB per 100 words (excluding custom images)
- **Offline Functionality**: App loads and functions fully offline after initial cache (zero degradation)

### 30-Day Success Metrics (Post-Launch)

- **Vocabulary Growth**: Average user vocabulary grows from 139 words (baseline) to 200+ words within 30 days of feature availability
- **Custom Image Adoption**: 40% of users upload at least one custom image within first month
- **Import/Export Usage**: 20% of users export their vocabulary at least once (indicates trust in backup feature)
- **Zero Critical Bugs**: No storage-related data loss or corruption reports
- **User Satisfaction**: "Data persistence" mentioned positively in 80%+ of user feedback

### 90-Day Success Metrics (Product-Market Fit Validation)

- **Unlimited Vocabulary Adoption**: 50% of active users have >250 words (beyond baseline 139)
- **Power Users**: 10% of users have >500 words, demonstrating scalability
- **Custom Categories**: 60% of users create at least one custom category
- **Offline Reliability**: <1% of sessions report offline functionality issues
- **Export/Import Adoption**: 40% of users use import/export (indicates cross-device or backup needs)

### Alignment with Product Vision Metrics (PRODUCT_VISION.md)

- **Average Board Vocabulary Size**: Target 150 words at 6 months (baseline: 50 at 3 months, 300 at 12 months)
- **Customization Rate**: Target 70% of users customize boards within first week (enables this metric)
- **App Store Rating**: Contribute to 4.3+ rating by addressing "data loss" complaints from baseline
- **Vocabulary Coverage**: Enable 90% vocabulary coverage for daily needs (unlimited expansion is prerequisite)

### Key Performance Indicators (KPIs)

| Metric | Baseline (PRD-000) | Week 1 Target | 30-Day Target | 90-Day Target |
|--------|-------------------|---------------|---------------|---------------|
| Words Saved Per User | 0 (session only) | 150+ (baseline + customs) | 200+ | 250+ |
| Custom Images Per User | 0 | 0-1 (early adopters) | 2-5 | 10+ |
| Storage Used Per User | 0KB (session) | 50KB avg | 500KB avg | 2MB avg |
| Offline Sessions % | 0% (requires internet) | 20% | 40% | 50% |
| Export/Import Actions | 0 | 5% users | 20% users | 40% users |
| Data Loss Reports | N/A (expected) | 0 | 0 | 0 |

## Open Questions

### Technical Decisions

- [x] **Storage Technology**: IndexedDB (recommended) vs. LocalStorage? **Decision: IndexedDB** (rationale documented above)
- [ ] **IndexedDB Wrapper**: Use Dexie.js, idb (Jake Archibald), or raw IndexedDB API? **Recommendation: Dexie.js** (better TypeScript support, simpler API, active maintenance)
- [ ] **Image Storage Format**: Base64 data URLs (simple, inline) vs. Blob storage (more efficient, requires URL.createObjectURL)? **Recommendation: Base64** for Phase 1 simplicity, migrate to Blobs in PRD-002 if performance issues
- [ ] **Service Worker Library**: Workbox (Google) vs. vite-plugin-pwa (Vite-specific) vs. custom? **Recommendation: vite-plugin-pwa** (better Vite integration, zero config)
- [ ] **Image Compression Library**: browser-image-compression vs. compressor.js vs. manual canvas resize? **Recommendation: browser-image-compression** (better compression ratios, TypeScript support)

### UX/Product Decisions

- [ ] **Default Vocabulary on First Load**: Keep PRD-000 baseline 139 words or start with minimal set (10-20 core words) and let users build from scratch?
- [ ] **Category Nesting Limit**: 3 levels (as specified) or unlimited? Consider UX complexity vs. flexibility
- [ ] **Image Upload Limits**: 1MB per image (as specified) or more generous? Balance storage vs. quality
- [ ] **Import Merge Strategy Default**: Which merge strategy should be the default - Replace, Merge, or Append?
- [ ] **Export File Naming**: Auto-generate filename with timestamp (e.g., `aac-board-2025-12-08.json`) or prompt user for custom name?
- [ ] **Delete Confirmation Granularity**: Confirm every delete or only for categories with multiple words?

### User Testing & Validation

- [ ] **Image Upload UX**: Do users prefer inline crop during upload or full-screen crop modal? (Usability testing needed)
- [ ] **Import Preview UI**: How much detail in diff preview? (Word-by-word or summary counts?) (Usability testing needed)
- [ ] **Offline Indicator Placement**: Header (as specified) or bottom-right toast? (Usability testing needed)
- [ ] **Storage Quota Warnings**: At what percentage of quota should we warn users? (50%, 75%, 90%?)

### Future PRD Coordination

- [ ] **Cloud Sync Data Model** (PRD-002): Will IndexedDB schema need changes to support sync queue? (Consider sync metadata fields: `syncStatus`, `lastSyncedAt`)
- [ ] **Analytics Events** (PRD-005): What vocabulary usage events should be tracked? (Word additions, custom images, exports, etc.)
- [ ] **Collaboration Conflicts** (PRD-002): How will import/export interact with real-time collaboration? (Need conflict resolution strategy)

---

## Related Documents

**Dependencies**:
- `/Users/mattpacione/git/health_services/AAC/.claude/tasks/1_backlog/000-baseline-foundation/prd-000-baseline-foundation.md` - Current baseline functionality
- `/Users/mattpacione/git/health_services/AAC/PRODUCT_VISION.md` - Strategic vision and themes

**Related Future PRDs**:
- PRD-002: Cloud Sync & Collaboration (Theme 2) - Builds on IndexedDB foundation with backend sync
- PRD-003: Navigation & Usability Enhancements (Theme 4) - Advanced folder organization, search, favorites
- PRD-004: Intelligent Communication Assistance (Theme 3) - AI word prediction (requires usage analytics)
- PRD-005: Analytics & Insights - Privacy-respecting usage tracking (depends on data persistence)

**Project Context**:
- `/Users/mattpacione/git/health_services/AAC/PROJECT_CONTEXT.md` - Technical stack and architecture overview
- `/Users/mattpacione/git/health_services/AAC/.claude/tasks/project-status.md` - Project status tracking

---

**Created**: 2025-12-08
**Author**: Tactical Product Manager Agent
**Status**: Draft - Ready for Review
**PRD Number**: 001
**Vision Theme**: Theme 1 (Infinite Customization), Theme 5 (User-Friendly Experience)
**Estimated Effort**: 4 weeks (1 sprint) - Phased implementation as outlined above
**Priority**: High - Critical foundation for all future features (data persistence blocks PRD-002 cloud sync)
