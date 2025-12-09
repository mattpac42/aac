# AAC Communication Board - Baseline Foundation (Phase 0) - Product Requirements Document

## Overview

This PRD documents the current state of the AAC Communication Board application as of December 2025, serving as the foundational baseline for all future development. The application is a working React-based AAC (Augmentative and Alternative Communication) tool designed to empower nonverbal individuals to communicate independently.

**Goal**: Establish a comprehensive baseline documentation of all existing functionality, technical architecture, and current capabilities to serve as the foundation for future PRDs and feature development aligned with the product vision documented in PRODUCT_VISION.md.

**Vision Reference**: This baseline implements the initial groundwork for the long-term vision outlined in `/Users/mattpacione/git/health_services/AAC/PRODUCT_VISION.md`, which envisions "an AAC platform that empowers nonverbal individuals to communicate with complete freedom and independence, growing from their first three buttons to unlimited expression without ever switching apps."

## Current State Summary

The AAC Communication Board App is a fully functional MVP with:
- **Frontend**: React 18.3.1 with TypeScript, Vite 6.3.5 build system
- **UI Framework**: Tailwind CSS with comprehensive Radix UI component library
- **Deployment**: Configured for both Vercel (production) and Firebase Hosting
- **Core Features**: Communication board with 30 core words, 7 category-specific word sets, message composition, text-to-speech, settings customization, and educational resources for communication partners

The app is production-ready and currently deployed at:
- **Vercel (Production)**: https://aac-taupe.vercel.app
- **Firebase Hosting**: https://aac-ai-device.web.app

## Goals

1. **Document Current Capabilities**: Provide a complete inventory of all implemented features, components, and functionality as of Phase 0
2. **Establish Technical Baseline**: Record the exact tech stack, architecture patterns, and deployment configuration for future reference
3. **Define Scope Boundaries**: Clearly delineate what IS implemented versus what remains in the product vision for future phases
4. **Enable Future Development**: Create foundation documentation that future PRDs can reference and build upon
5. **Maintain Product Vision Alignment**: Map current implementation to the strategic themes in PRODUCT_VISION.md

## User Stories

### Implemented User Stories (Current Baseline)

- **As a nonverbal user**, I want to tap word buttons to build sentences so that I can express my thoughts and needs
- **As a nonverbal user**, I want to hear my composed message spoken aloud so that others can understand my communication
- **As a nonverbal user**, I want to navigate between different word categories (People, Food, Places, etc.) so that I can find the right words for what I want to say
- **As a nonverbal user**, I want to see color-coded word buttons (pronouns, verbs, nouns, etc.) so that I can visually distinguish word types
- **As a communication partner (caregiver/family)**, I want to customize core vocabulary words so that I can personalize the board for the user's specific needs
- **As a communication partner**, I want to access educational resources about AAC modeling and best practices so that I can better support the user's communication development
- **As a speech pathologist**, I want to customize word colors and themes so that I can adapt the board to individual user preferences and needs
- **As a speech pathologist**, I want to add new words to categories so that I can expand vocabulary based on user goals

### Future User Stories (Not Yet Implemented)

- **As a nonverbal user**, I want AI-powered word prediction to speed up my communication (Vision: Theme 3 - Intelligent Communication Assistance)
- **As a speech pathologist**, I want to remotely update client boards and sync changes across devices (Vision: Theme 2 - Collaborative Board Management)
- **As a nonverbal user**, I want to create unlimited custom folders and nested categories (Vision: Theme 1 - Infinite Customization)
- **As a nonverbal user**, I want to use the board offline without internet connection (Vision: Theme 5 - User-Friendly Experience)

## Functional Requirements (Current Implementation)

### Core Communication Board

1. **The system must display a 5x6 grid of 30 core vocabulary words** organized in a fixed layout with icon and text labels
2. **The system must support 5 word types with distinct color coding**: pronoun (yellow), verb (green), descriptive (blue), noun (orange), social (pink)
3. **Users must be able to tap/click word buttons to add them to the message composition area**
4. **The system must support navigation to 7 category-specific word screens**: People (15 words), Food (17 words), Places (15 words), Feelings (16 words), Actions (17 words), School (15 words), Weather (14 words)
5. **Category screens must display words in a 5-column grid layout with back navigation to core board**

### Message Composition & Speech Output

6. **The system must display a message bar at the top of the screen showing all selected words in sequence**
7. **Users must be able to clear the entire message with a single button press**
8. **The system must convert composed messages to speech using browser Web Speech API** with configurable rate (0.9), pitch (1.0), and volume (1.0)
9. **The Speak button must be disabled when no message is composed**
10. **The system must display placeholder text "Tap words to build your message..." when message is empty**

### Settings & Customization

11. **Users must be able to access a Settings screen with 5 customization options**: Edit Words, Change Voice, Adjust Volume, Grid Layout, Colors & Theme
12. **The Edit Words feature must allow adding, editing, and deleting core vocabulary words** with text, icon selection, and word type assignment
13. **The Edit Words feature must allow adding, editing, and deleting category-specific words** with text and icon selection
14. **The Color Theme feature must allow customizing background and border colors for each word type** (pronoun, verb, descriptive, noun, social)
15. **The system must persist color theme changes in component state** (note: not yet persisted across sessions - in-memory only)
16. **The Voice Settings screen must exist as a placeholder** for future voice selection functionality
17. **The Volume Settings screen must exist as a placeholder** for future volume/rate/pitch controls
18. **The Grid Layout screen must exist as a placeholder** for future grid size customization

### Educational Resources

19. **The system must provide a Resources screen categorized into 4 tabs**: Getting Started, Tips for Partners, Modeling & Teaching, Research & Evidence
20. **The Resources screen must display 6 default educational resources** including articles on partner modeling, core vocabulary, and AAC best practices
21. **Users must be able to add custom resources** with title, description, URL, type (article/video/document/tip), and category assignment
22. **Users must be able to delete custom or default resources** with confirmation prompt
23. **Resources must support 4 content types with distinct visual styling**: article (green), video (red), document (blue), tip (yellow)
24. **The system must display an informational banner explaining the importance of communication partner modeling**
25. **External resource links must open in new browser tabs**

### User Interface & Navigation

26. **The application must use a responsive layout with max-width constraint (7xl/80rem)** for optimal tablet/desktop viewing
27. **All word buttons must display Lucide React icons with text labels**
28. **Navigation must support 9 category buttons** (7 content categories + Resources + Settings) displayed in a single row beneath the core board
29. **Category and Settings buttons must use consistent accent styling** to distinguish from word buttons
30. **Back navigation must be available from all category and settings screens** returning to the core board
31. **The UI must use Tailwind CSS with slate color palette** as the primary design system
32. **All interactive elements must use Radix UI components** (Button, Card, Dialog, Input, Select, etc.) for accessibility

### Data Management (Current State)

33. **Core words vocabulary must be stored in component state** initialized from hardcoded defaults (30 words)
34. **Category words must be stored in component state** initialized from hardcoded defaults (109 total words across 7 categories)
35. **Word type color mappings must be stored in component state** initialized from hardcoded defaults
36. **Resources must be stored in component state** initialized from hardcoded defaults (6 resources)
37. **All data must reset to defaults on page reload** (no persistence layer implemented yet)

### Technical Infrastructure

38. **The application must build successfully using Vite 6.3.5** with React SWC plugin for fast refresh
39. **The application must be deployable to Vercel** via `vercel --prod` command with automatic GitHub Actions CI/CD
40. **The application must be deployable to Firebase Hosting** via `firebase deploy --only hosting` command
41. **The build output must be generated in `application/build/` directory**
42. **The application must serve from Firebase project ID `aac-ai-device`**
43. **The application must run locally via `npm run dev`** on Vite development server
44. **The application must support both GitLab (internal mirror) and GitHub (CI/CD) remotes**

## Non-Goals (Out of Scope for Baseline)

The following features are documented in PRODUCT_VISION.md but are NOT implemented in the current baseline:

### Theme 1: Infinite Customization & Expandability (Not Yet Implemented)
- Unlimited vocabulary expansion beyond hardcoded word sets
- Drag-and-drop visual board builder
- Folder hierarchy and nested categories
- Custom symbol/photo upload from device
- On-the-fly word addition during conversations
- Template library for common use cases
- Import/export vocabulary sets
- User-customizable grid sizes and layouts (placeholder UI exists)

### Theme 2: Collaborative Board Management (Not Yet Implemented)
- Cloud-based board synchronization across devices
- User authentication system
- Remote board editing by speech pathologists/caregivers
- Role-based permissions (pathologist, caregiver, user)
- Real-time multi-user collaboration
- Board version history and change notifications
- Shared vocabulary library and template marketplace

### Theme 3: Intelligent Communication Assistance (Not Yet Implemented)
- AI-powered word prediction
- Context-aware phrase suggestions
- Personalized learning models based on usage patterns
- Frequently used vocabulary shortcuts
- Predictive text toggle controls

### Theme 4: Easy Navigation & Findability (Partially Implemented)
- Multi-level folder hierarchy with breadcrumbs (basic 2-level navigation exists)
- Search functionality across all boards
- Favorites/quick access bar
- Customizable home screen shortcuts
- Advanced visual cues and color coding (basic color coding exists)

### Theme 5: User-Friendly Experience (Partially Implemented)
- Offline functionality with service workers (app requires internet currently)
- Guided onboarding flow for new users
- Built-in help/tutorial system
- Settings for motor control adaptations (button size, dwell time)
- Data persistence across sessions (currently all in-memory)
- Voice selection beyond browser defaults (placeholder UI exists)
- Volume/rate/pitch controls (placeholder UI exists)

### Additional Out of Scope Items
- Mobile native apps (iOS/Android)
- Multi-language support
- Voice banking/personalized speech synthesis
- Eye-tracking or switch access input methods
- Analytics and usage tracking
- Insurance billing integration
- Marketplace for third-party templates
- User accounts and profiles
- Cloud backup and restore
- Export communication logs or reports

## Design Considerations

### Current UI/UX Implementation

**Visual Design**:
- Clean, minimalist interface with slate color palette (bg-slate-50 background)
- Large, touch-friendly buttons (80px height for primary actions)
- Consistent 4-unit spacing (gap-4 = 1rem) throughout grid layouts
- Rounded corners (rounded-xl = 0.75rem) on all interactive elements
- Shadow and border effects for depth and visual hierarchy
- Color-coded word types for visual distinction (yellow/green/blue/orange/pink)

**Component Architecture**:
- Modular component design with clear separation of concerns
- Reusable UI primitives from Radix UI library
- Type-safe props interfaces using TypeScript
- Consistent prop naming patterns (onWordSelect, onNavigate, onBack, etc.)

**Accessibility Features**:
- Semantic HTML structure with heading hierarchy
- Icon + text labels on all buttons for clarity
- Disabled state styling for unavailable actions
- High contrast color schemes (400/600 shades for borders/fills)
- Lucide React icons for consistent, recognizable symbols

**Navigation Patterns**:
- Flat 2-level navigation hierarchy (Core Board → Category/Settings screens)
- Consistent "Back to Core Board" pattern across all sub-screens
- Visual breadcrumbs via header titles
- Tab-based organization for Resources screen

### Integration Points

**Browser APIs**:
- Web Speech API (`window.speechSynthesis`) for text-to-speech output
- Standard DOM events for user interactions

**Build System**:
- Vite configuration for React + TypeScript + SWC
- Tailwind CSS configuration with content path scanning
- Node 20.x runtime environment

**Deployment Platforms**:
- Vercel project ID: `prj_a4aMmlOThWynGu7PMmd21pSVVwhx`
- Vercel organization ID: `team_mP8CzVxXRFCXwPhkLGcvvZo0`
- Firebase project ID: `aac-ai-device`
- GitHub repository: `https://github.com/mattpac42/aac`
- GitLab mirror: `https://gitlab.yuki.lan/health-services/aac`

**No Backend Dependencies**:
- 100% client-side application with no API calls
- No database connections
- No external service integrations
- All data stored in React component state (in-memory)

## Technical Considerations

### Current Architecture

**Frontend Stack**:
- **React**: 18.3.1 (latest stable) with functional components and hooks
- **TypeScript**: Implicit via Vite + SWC (no explicit version in package.json)
- **Vite**: 6.3.5 for build tooling and development server
- **SWC**: Via @vitejs/plugin-react-swc 3.10.2 for fast compilation
- **Tailwind CSS**: Via dependencies (tailwind-merge, class-variance-authority)
- **Radix UI**: Comprehensive component library (~30 packages) for accessible UI primitives
- **Lucide React**: 0.487.0 for icon system
- **Additional UI Libraries**:
  - next-themes 0.4.6 (installed but not actively used)
  - sonner 2.0.3 for toast notifications
  - recharts 2.15.2 for potential future analytics
  - react-resizable-panels 2.1.7 for future layout features

**Component Organization**:
```
src/
├── App.tsx (main app component with state management)
├── main.tsx (React entry point)
├── components/
│   ├── CoreBoard.tsx (core 30-word vocabulary grid)
│   ├── CategoryScreen.tsx (category-specific word screens)
│   ├── MessageBar.tsx (message composition and speech controls)
│   ├── SettingsScreen.tsx (settings navigation hub)
│   ├── ResourcesScreen.tsx (educational resources library)
│   ├── CategoryButton.tsx (reusable category navigation button)
│   ├── WordButton.tsx (reusable word/action button)
│   ├── settings/
│   │   ├── EditWordsScreen.tsx (vocabulary customization)
│   │   ├── ColorThemeScreen.tsx (color customization)
│   │   ├── VoiceSettingsScreen.tsx (placeholder)
│   │   ├── VolumeSettingsScreen.tsx (placeholder)
│   │   └── GridLayoutScreen.tsx (placeholder)
│   ├── ui/ (Radix UI wrappers - 40+ components)
│   └── figma/
│       └── ImageWithFallback.tsx (image handling component)
```

**State Management**:
- Component-level state using `useState` hooks in App.tsx
- Props drilling for state distribution (no Context API or Redux)
- No persistence layer (all state lost on reload)
- Hardcoded initial data for words, categories, colors, and resources

**TypeScript Types**:
- `WordType`: Union type for word categories ('pronoun' | 'verb' | 'descriptive' | 'noun' | 'social')
- `CategoryName`: Union type for navigation screens ('People' | 'Food' | 'Places' | 'Feelings' | 'Actions' | 'School' | 'Weather' | 'Settings' | 'Resources' | 'Core')
- `Word`: Interface for core vocabulary items (text, icon, type)
- `CategoryWord`: Interface for category-specific items (text, icon)
- `WordTypeColors`: Interface for color theme customization (bg, border per type)

### Dependencies Overview

**Production Dependencies** (48 packages):
- 32 Radix UI component packages for accessible UI primitives
- UI utilities (clsx, class-variance-authority, tailwind-merge)
- React core (react, react-dom)
- Additional UI components (cmdk, embla-carousel, vaul, sonner, recharts)
- Form handling (react-hook-form)
- Theme management (next-themes)
- Icons (lucide-react)

**Development Dependencies**:
- @vitejs/plugin-react-swc for fast React compilation
- Vite 6.3.5 for build tooling
- @types/node for Node.js TypeScript definitions

### Build Configuration

**Vite Configuration** (vite.config.ts):
- React plugin with SWC for fast refresh
- Build output directory: `build/`
- No custom aliases or environment variable handling documented

**Firebase Configuration** (firebase.json):
- Hosting configuration for `build/` directory
- Project: `aac-ai-device`
- Single-page app rewrite rules for client-side routing

**Scripts** (package.json):
```json
{
  "dev": "vite",                          // Local development server
  "build": "vite build",                  // Production build
  "preview": "vite preview",              // Preview production build
  "deploy:firebase": "firebase deploy --only hosting",
  "deploy:vercel": "vercel --prod"
}
```

### Deployment Configuration

**Vercel Deployment**:
- Framework preset: Vite
- Root directory: `application/`
- Build command: `npm run build`
- Output directory: `build/`
- Automatic deployments on push to main branch via GitHub Actions
- Preview deployments for pull requests

**Firebase Hosting Deployment**:
- Hosting directory: `build/`
- Single-page app rewrites configured
- Automatic deployments on push to main branch via GitHub Actions
- Service account authentication for CI/CD

**CI/CD Automation**:
- GitHub Actions workflows for both platforms
- Dual-remote git configuration (GitLab + GitHub)
- Automated preview deployments for pull requests
- Production deployments on main branch merges

### Constraints & Limitations

**Technical Constraints**:
- **No Data Persistence**: All customizations lost on page reload (major limitation)
- **No Offline Support**: Requires internet connection to load
- **Browser Dependency**: Relies on Web Speech API (browser compatibility varies)
- **No Backend**: Cannot support cloud sync, multi-user collaboration, or analytics
- **Single-Device**: No cross-device synchronization
- **No Authentication**: Cannot support user accounts or profiles

**Performance Constraints**:
- Client-side rendering only (no SSR/SSG)
- All data loaded in memory on initial page load
- No code splitting or lazy loading implemented
- No optimization for large vocabulary sets (currently 139 total words)

**UX Constraints**:
- Fixed 5-column grid layout (not responsive to screen size)
- Flat 2-level navigation (no deep folder hierarchies)
- No search/filter functionality
- No word prediction or suggestions
- Limited customization options (colors and basic word editing only)
- No undo/redo for edits
- No import/export of custom boards

**Deployment Constraints**:
- Static site hosting only (no server-side capabilities)
- No environment-specific configurations
- No API endpoints or backend services
- No database connections

## Success Metrics

### Current Baseline Success Criteria

The baseline implementation is considered successful if:

1. **Build & Deployment**: Application builds without errors and deploys successfully to both Vercel and Firebase Hosting
2. **Core Functionality**: Users can compose messages using core and category vocabulary and hear them spoken via text-to-speech
3. **Navigation**: Users can navigate between Core Board, 7 category screens, Settings screens, and Resources screen without errors
4. **Customization**: Users can edit core words, category words, and color themes (changes persist during session only)
5. **Resources**: Users can view, add, and delete educational resources organized by category
6. **UI/UX Quality**: Interface is visually clean, touch-friendly, and follows consistent design patterns
7. **Code Quality**: TypeScript types are properly defined, components are modular and reusable, no console errors in production

### Future Success Metrics (Not Measured in Baseline)

The following metrics are defined in PRODUCT_VISION.md but cannot be measured until future features are implemented:

**User Adoption & Engagement**:
- Weekly active users (target: 100 at 3 months, 500 at 6 months, 2000 at 12 months)
- Speech pathologist adoption (target: 20 at 3 months, 100 at 6 months, 500 at 12 months)
- Average session length (target: 5 min at 3 months, 8 min at 6 months, 12 min at 12 months)
- Daily communication events per user (target: 5 at 3 months, 10 at 6 months, 15 at 12 months)

**Customization & Growth**:
- Average board vocabulary size (target: 50 words at 3 months, 150 at 6 months, 300 at 12 months)
- Percentage of users who customize boards within first week (target: 70%)
- Vocabulary growth rate per user over time
- Time to add new words (target: <30 seconds)

**User Satisfaction**:
- Net Promoter Score (NPS) from speech pathologists (target: 40+ at 3 months, 50+ at 6 months, 60+ at 12 months)
- App Store rating (target: 4.0+ at 3 months, 4.3+ at 6 months, 4.5+ at 12 months)
- User retention rate (target: 80% 30-day retention at 6 months)
- User satisfaction scores on customization capabilities

**Communication Effectiveness**:
- Users report 90% vocabulary coverage for daily needs (via survey)
- Communication speed improvement (words per minute)
- Reduction in communication frustration (user/caregiver reports)
- Percentage of users achieving independent communication goals

## Open Questions

### Baseline Documentation Questions

- [x] Are all current components and features accurately documented?
- [x] Is the technical architecture described comprehensively?
- [x] Are scope boundaries clearly defined between baseline and future phases?
- [x] Does this PRD provide sufficient foundation for future PRD development?

### Future Development Questions

- [ ] **Data Persistence**: What storage solution should be implemented first? (LocalStorage, IndexedDB, or cloud database?)
- [ ] **Authentication**: What authentication provider should be used for user accounts? (Firebase Auth, Supabase, Auth0, custom?)
- [ ] **Cloud Sync**: Should board synchronization use Firebase Realtime Database, Firestore, or another solution?
- [ ] **Offline Support**: Should we implement service workers and offline-first architecture before or after cloud sync?
- [ ] **Vocabulary Expansion**: Should unlimited vocabulary expansion use a database or continue with JSON-based storage?
- [ ] **Grid Layout Customization**: What grid size options should be supported? (3x3, 4x4, 5x5, 6x6, custom?)
- [ ] **Voice Customization**: Should we use Web Speech API voices, third-party TTS services, or voice banking?
- [ ] **Mobile Apps**: Should we build native iOS/Android apps or continue with progressive web app approach?
- [ ] **Analytics**: What analytics platform should be integrated? (Google Analytics, Mixpanel, Amplitude, custom?)
- [ ] **AI Integration**: What AI service should power word prediction? (OpenAI, Anthropic, local models?)

## Mapping to Product Vision Themes

### Theme 1: Infinite Customization & Expandability
**Current Baseline Implementation**:
- ✅ Basic word editing (add/edit/delete core and category words)
- ✅ Color theme customization per word type
- ❌ Unlimited vocabulary expansion (hardcoded limits)
- ❌ Drag-and-drop visual builder
- ❌ Folder hierarchy beyond 2 levels
- ❌ Custom photo/symbol upload
- ❌ Template library
- ❌ Import/export functionality

**Foundation for Future Development**: The Edit Words screen provides the UI pattern for vocabulary management that can be extended to support unlimited expansion, custom categories, and folder hierarchies in future phases.

### Theme 2: Collaborative Board Management
**Current Baseline Implementation**:
- ❌ No cloud sync (all local state)
- ❌ No user authentication
- ❌ No multi-user collaboration
- ❌ No remote board editing
- ❌ No role-based permissions

**Foundation for Future Development**: The component state structure (coreWords, categoryWords, wordTypeColors) is designed to be easily serialized to JSON and synced to a backend when cloud storage is implemented.

### Theme 3: Intelligent Communication Assistance
**Current Baseline Implementation**:
- ❌ No word prediction
- ❌ No phrase suggestions
- ❌ No learning models
- ❌ No usage analytics

**Foundation for Future Development**: The message composition pattern (array of words) in MessageBar.tsx provides the foundation for predictive text features to be added in future phases.

### Theme 4: Easy Navigation & Findability
**Current Baseline Implementation**:
- ✅ Basic 2-level navigation (Core → Categories)
- ✅ Visual category buttons with icons
- ✅ Color-coded word types
- ❌ No search functionality
- ❌ No favorites/quick access
- ❌ No deep folder hierarchies

**Foundation for Future Development**: The navigation pattern using `currentScreen` state can be extended to support deeper hierarchies and breadcrumb navigation in future phases.

### Theme 5: User-Friendly Experience
**Current Baseline Implementation**:
- ✅ Clean, intuitive interface with large touch targets
- ✅ Consistent visual design and navigation patterns
- ✅ Icon + text labels for clarity
- ✅ Settings organization with clear categories
- ✅ Educational resources for communication partners
- ❌ No onboarding flow
- ❌ No offline support
- ❌ No persistence (major UX gap)
- ❌ No help/tutorial system
- ❌ No motor control adaptations (placeholder UI exists)

**Foundation for Future Development**: The Resources screen establishes a pattern for in-app educational content that can be expanded into onboarding tutorials and contextual help in future phases.

## Next Steps & Recommendations

### Immediate Priorities (Foundation for Future PRDs)

1. **Data Persistence**: Implement LocalStorage or IndexedDB to save user customizations (words, colors, resources) across sessions
   - **Justification**: Without persistence, users lose all customizations on reload, severely limiting practical usability
   - **Impact**: Critical UX improvement, prerequisite for user adoption
   - **Effort**: Low-Medium (2-4 hours implementation)

2. **Offline Support**: Add service worker for offline functionality and app-like experience
   - **Justification**: AAC users need reliable access to their communication tools regardless of internet connectivity
   - **Impact**: High reliability improvement, aligns with Vision Theme 5 (User-Friendly Experience)
   - **Effort**: Medium (4-8 hours implementation)

3. **Basic Analytics**: Implement privacy-respecting usage analytics to measure success metrics
   - **Justification**: Cannot validate product-market fit or measure success without data on usage patterns
   - **Impact**: Enables data-driven decision making for future development priorities
   - **Effort**: Low-Medium (2-4 hours setup + integration)

### Future PRD Priorities (Aligned with Product Vision)

Based on PRODUCT_VISION.md strategic themes, the recommended PRD development sequence is:

**Phase 1: Enhanced Customization & Persistence (Theme 1 + Theme 5)**
- Unlimited vocabulary expansion with folder organization
- Custom photo/symbol upload
- Import/export vocabulary sets
- User preferences persistence
- Grid layout customization (implement placeholder UI)

**Phase 2: Cloud Sync & Collaboration (Theme 2)**
- User authentication system
- Cloud-based board storage and sync
- Remote board editing by speech pathologists
- Role-based permissions (user, caregiver, pathologist)
- Shared vocabulary template library

**Phase 3: Navigation & Usability Improvements (Theme 4 + Theme 5)**
- Multi-level folder hierarchy with breadcrumbs
- Search functionality across all words
- Favorites/quick access bar
- Guided onboarding flow for new users
- In-app help and tutorials
- Motor control adaptations (button size, dwell time)

**Phase 4: Intelligent Assistance (Theme 3)**
- AI-powered word prediction
- Context-aware phrase suggestions
- Personalized learning models based on usage
- Communication speed optimizations

### Documentation Recommendations

1. **Create Feature-Specific PRDs**: For each future phase, create detailed PRDs following the template and numbering system (prd-001-data-persistence.md, prd-002-cloud-sync.md, etc.)
2. **Maintain Baseline Reference**: Keep this PRD-000 as the canonical reference for "what currently exists" when scoping future work
3. **Link PRDs to Vision Themes**: Each future PRD should explicitly reference which strategic themes from PRODUCT_VISION.md it addresses
4. **Track Technical Debt**: Document technical debt items discovered during baseline review for future refactoring PRDs
5. **Update Project Status**: Regularly update `/.claude/tasks/project-status.md` to reflect PRD creation and feature implementation progress

### Technical Debt Items

While not blocking current functionality, the following technical improvements should be considered for future PRDs:

1. **State Management**: Consider Context API or state management library (Zustand, Jotai) to replace props drilling
2. **Type Safety**: Add explicit TypeScript types for all component props (some currently use `as any` for icons)
3. **Code Splitting**: Implement lazy loading for Settings and Resources screens to reduce initial bundle size
4. **Accessibility Audit**: Comprehensive WCAG 2.1 AA compliance review (keyboard navigation, screen reader support, focus management)
5. **Error Boundaries**: Add React error boundaries to gracefully handle component failures
6. **Unit Testing**: Add Jest/Vitest tests for core business logic (word management, message composition)
7. **E2E Testing**: Add Playwright/Cypress tests for critical user flows
8. **Performance Optimization**: Implement React.memo and useMemo for expensive render operations if vocabulary grows significantly

---

**Created**: 2025-12-08
**Author**: Tactical Product Manager Agent
**Status**: Approved Baseline
**PRD Number**: 000 (Baseline Foundation)
**Related Documents**:
- `/Users/mattpacione/git/health_services/AAC/PRODUCT_VISION.md` (Product Vision)
- `/Users/mattpacione/git/health_services/AAC/DEPLOY.md` (Deployment Guide)
- `/Users/mattpacione/git/health_services/AAC/.claude/tasks/project-status.md` (Project Status Tracking)
