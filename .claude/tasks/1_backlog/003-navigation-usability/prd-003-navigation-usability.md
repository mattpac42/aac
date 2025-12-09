# AAC Communication Board - Navigation & Usability Enhancements (Phase 3) - Product Requirements Document

## Overview

This PRD defines enhanced navigation, search, and usability features that will transform the AAC Communication Board from a basic 2-level navigation system into an intuitive, accessible, and efficient communication platform. The focus is on implementing **Theme 4: Easy Navigation & Findability** and **Theme 5: User-Friendly Experience** from the product vision.

**Goal**: Enable users to quickly find any word or concept as vocabulary grows, provide accessible motor control adaptations, implement comprehensive onboarding, and create a truly user-friendly experience that scales from 30 words to 300+ words without increasing cognitive load or navigation time.

**Vision Reference**: This PRD implements strategic themes from `/Users/mattpacione/git/health_services/AAC/PRODUCT_VISION.md`:
- **Theme 4: Easy Navigation & Findability** - Multi-level folders, search, favorites, visual cues
- **Theme 5: User-Friendly Experience** - Onboarding, motor control adaptations, accessibility

**Current State**: The baseline (PRD-000) provides basic 2-level navigation (Core Board → Categories) with 30 core words and 7 category screens. Users cannot search, no favorites system exists, no onboarding flow, and limited accessibility adaptations are available.

## Goals

1. **Reduce Word Discovery Time**: Enable users to find any word in < 5 seconds regardless of vocabulary size (current baseline: flat search through 30 core + 109 category words)
2. **Scale Navigation Intuitively**: Support vocabulary growth from 30 to 300+ words without increasing navigation complexity or cognitive load
3. **Improve Accessibility**: Implement WCAG 2.1 AA compliant motor control adaptations (button size, dwell time, touch target minimum 44x44px)
4. **Accelerate Onboarding**: Reduce time-to-first-communication from unknown baseline to < 10 minutes for new users
5. **Personalize Quick Access**: Enable users to access 80% of daily communication needs from home screen favorites without navigation

## User Stories

### Navigation & Search

**As a nonverbal user**, I want to search for any word across all my boards so that I can find what I need quickly without navigating through multiple categories
- **Acceptance Criteria**: Search input field accessible from home screen, searches across core words + all category words + custom folders, displays results in < 1 second, highlights matching text

**As a nonverbal user**, I want to see breadcrumbs showing my current location so that I always know where I am and can navigate back easily
- **Acceptance Criteria**: Breadcrumb trail displayed at top of screen (e.g., "Home > Food > Fruits"), each breadcrumb level is tappable to jump back, updates in real-time as user navigates

**As a nonverbal user**, I want to create nested folders for my custom vocabulary so that I can organize hundreds of words logically (e.g., "Food > Breakfast > Drinks > Coffee Drinks")
- **Acceptance Criteria**: Ability to create folders within folders (unlimited depth), visual folder icon distinct from word buttons, folder navigation preserves breadcrumb history

**As a speech pathologist**, I want color-coded visual cues for different folder types so that my clients can navigate by color memory (e.g., green = food, blue = feelings)
- **Acceptance Criteria**: Folder colors customizable per folder, color applied to folder button border and icon, consistent visual language across navigation

### Favorites & Quick Access

**As a nonverbal user**, I want to pin my most-used words to a favorites bar so that I can access them instantly from any screen
- **Acceptance Criteria**: Favorites bar displayed at top/bottom of every screen, max 10-20 favorite slots, drag-to-reorder, long-press word button to add to favorites

**As a nonverbal user**, I want to customize my home screen with shortcuts to frequently used categories so that I can reach common conversations quickly
- **Acceptance Criteria**: Home screen shows 6-12 customizable shortcut tiles, shortcuts link to any category/folder/word, drag-to-reorder, visual distinction from word buttons

**As a nonverbal user**, I want the system to suggest frequently used words for quick access so that I don't have to manually configure favorites
- **Acceptance Criteria**: System tracks word usage frequency, displays "Suggested Favorites" option after 50+ word selections, user can accept/reject suggestions, non-intrusive UI

### Onboarding & Tutorials

**As a new user**, I want a guided tutorial showing me how to build my first sentence so that I can start communicating immediately without reading documentation
- **Acceptance Criteria**: Tutorial launches automatically on first app open (skippable), step-by-step overlay highlights: tap word → compose message → speak button, completes in < 3 minutes

**As a new user**, I want contextual help tooltips so that I understand each feature as I explore the app
- **Acceptance Criteria**: Help icon (?) available in top navigation, tapping shows feature-specific tooltips, dismissible without blocking functionality, "Show tips again" option in settings

**As a speech pathologist**, I want educational resources about AAC modeling integrated into onboarding so that caregivers understand how to support communication development
- **Acceptance Criteria**: Onboarding flow includes 1-2 screens with communication partner best practices, links to Resources section, optional (skippable but encouraged)

### Motor Control & Accessibility

**As a user with motor challenges**, I want to adjust button size and touch targets so that I can accurately select words without accidental presses
- **Acceptance Criteria**: Settings option for button size (small/medium/large/extra-large), minimum touch target 44x44px (WCAG AA), adjustable spacing between buttons

**As a user with motor challenges**, I want dwell time activation (hover to select) so that I don't need precise tap gestures
- **Acceptance Criteria**: Settings toggle for dwell mode, adjustable dwell time (0.5s - 3s), visual countdown indicator on button hover, audible/haptic feedback on selection

**As a user with visual impairments**, I want high contrast mode and screen reader support so that I can navigate the board independently
- **Acceptance Criteria**: High contrast toggle in settings (WCAG AAA 7:1 ratio), VoiceOver/TalkBack compatible labels on all buttons, focus indicators visible and high-contrast

**As a user**, I want to customize touch target safe zones to avoid accidental activations so that I can communicate accurately despite tremors or limited motor control
- **Acceptance Criteria**: Settings option for "safe zone" buffer around buttons (prevents accidental edge taps), adjustable sensitivity, preview mode to test before saving

## Functional Requirements

### Multi-Level Navigation & Breadcrumbs

1. **The system must support unlimited folder depth** with nested categories (e.g., Home > Food > Breakfast > Drinks > Coffee)
2. **The system must display visual breadcrumb navigation** at the top of the screen showing current location path
3. **Breadcrumb elements must be tappable** to jump directly to any parent level in the hierarchy
4. **Folder buttons must use distinct visual styling** (folder icon + color border) to differentiate from word buttons
5. **The system must preserve navigation history** to support back/forward navigation through folder exploration
6. **Folder creation must be accessible from any level** via "+ New Folder" button with name, icon, and color selection

### Search Functionality

7. **The system must provide a global search input field** accessible from the home screen and all navigation screens
8. **Search must index all vocabulary** including core words, category words, custom folders, and nested content
9. **Search results must display in real-time** as user types (< 1 second response time)
10. **Search results must highlight matching text** and display the full folder path for context (e.g., "apple - Food > Fruits")
11. **Tapping a search result must navigate to that word's location** with breadcrumb context
12. **Search must support partial matching** (e.g., "cof" matches "coffee") and be case-insensitive

### Favorites & Quick Access

13. **The system must display a persistent favorites bar** on all screens (configurable position: top/bottom)
14. **Users must be able to add words to favorites** via long-press gesture on any word button
15. **Favorites bar must support 10-20 favorite slots** (configurable limit in settings)
16. **Users must be able to reorder favorites** via drag-and-drop gesture
17. **Users must be able to remove favorites** via long-press menu option ("Remove from Favorites")
18. **The system must provide home screen shortcut customization** with 6-12 tiles linking to frequently used categories/folders
19. **The system must track word usage frequency** and suggest top 5 most-used words for favorites (opt-in feature)

### Visual Cues & Color Coding

20. **Folders must support custom color assignment** with color applied to folder button border, icon background, and breadcrumb element
21. **The system must provide default color palette** for folder types (food=green, feelings=blue, places=purple, etc.) with override capability
22. **Navigation UI must use consistent iconography** (Lucide React icons) for folders (folder icon), search (search icon), home (home icon)
23. **Active breadcrumb element must be visually distinct** from inactive elements (bolder text, different color)

### Guided Onboarding Flow

24. **The system must launch a guided onboarding tutorial** automatically on first app open (localStorage flag to prevent repeat)
25. **Onboarding must include 5 core steps**: (1) Welcome screen, (2) Tap word demo, (3) Build sentence demo, (4) Speak button demo, (5) Navigation overview
26. **Each onboarding step must use overlay UI** with spotlight highlighting the relevant button/area and descriptive text
27. **Onboarding must be skippable** at any step via "Skip Tutorial" button without losing progress
28. **Onboarding must include optional "Communication Partner Tips"** screen with 3-5 AAC modeling best practices and link to Resources section
29. **Users must be able to restart onboarding** via Settings > Help > "Replay Tutorial"

### Contextual Help System

30. **The system must display a Help icon (?) in the top navigation bar** on all screens
31. **Tapping Help icon must show contextual tooltips** relevant to the current screen (e.g., on Core Board: "Tap words to build sentences")
32. **Tooltips must be dismissible** via tap outside or close button without blocking functionality
33. **Settings must include "Show Tips Again"** toggle to re-enable dismissed tooltips

### Motor Control Adaptations

34. **Settings must include Button Size selector** with options: Small (40px height), Medium (60px, baseline), Large (80px), Extra-Large (100px)
35. **All touch targets must meet minimum 44x44px WCAG AA requirement** regardless of visual button size
36. **Settings must include adjustable button spacing** (Compact: gap-2, Normal: gap-4 [baseline], Spacious: gap-6, Extra-Spacious: gap-8)
37. **Settings must include Dwell Mode toggle** with adjustable dwell time slider (0.5s - 3.0s, default 1.5s)
38. **Dwell Mode must display visual countdown indicator** (circular progress ring) on button hover
39. **Dwell Mode activation must provide haptic feedback** (iOS haptic tap) and optional audible beep when selection confirmed
40. **Settings must include Safe Zone buffer option** with slider (0px - 20px, default 10px) to prevent accidental edge taps

### Accessibility (WCAG 2.1 AA Compliance)

41. **Settings must include High Contrast Mode toggle** with minimum 7:1 contrast ratio (WCAG AAA) for text and borders
42. **All interactive elements must have accessible labels** for VoiceOver (iOS) and TalkBack (Android) screen readers
43. **Keyboard navigation must be fully supported** with visible focus indicators (2px solid ring) on all focusable elements
44. **Focus order must follow logical reading sequence** (top-to-bottom, left-to-right) through navigation and word grids
45. **The system must support system-level font size preferences** (iOS Dynamic Type, Android Font Scaling)
46. **Color must not be the only means of conveying information** (e.g., folder types also distinguished by icons)

## Non-Goals (Out of Scope)

The following features are NOT included in this PRD but may be addressed in future phases:

### Navigation Features (Future)
- **Advanced search filters** (by word type, category, date added, usage frequency) - Too complex for MVP, defer to Phase 4
- **Recent words history** (show last 10-20 words used) - Valuable but not critical, defer to Phase 4
- **AI-powered search suggestions** (predictive search results) - Requires AI integration (Theme 3), defer to Phase 5

### Onboarding Features (Future)
- **Interactive practice mode** (simulated conversations for training) - High development effort, defer to Phase 4
- **Personalized onboarding paths** (different flows for children vs. adults vs. speech pathologists) - Requires user profiling, defer to Phase 4
- **Video tutorials** (embedded instructional videos) - High production effort, defer to Phase 5

### Accessibility Features (Future)
- **Eye-tracking input support** - Requires specialized hardware integration, defer to Phase 6
- **Switch access input** (single/dual switch navigation) - Specialized accessibility feature, defer to Phase 6
- **Voice control navigation** ("Go to Food category" via voice commands) - Requires speech recognition, defer to Phase 6
- **Multi-language support** - Out of scope for English-only MVP, defer to Phase 7

### Motor Control Features (Future)
- **Custom gesture controls** (swipe patterns for specific actions) - Complex UX design required, defer to Phase 5
- **Accidental touch undo** (auto-detect and revert unintended selections) - Requires ML/heuristics, defer to Phase 5

### Additional Out of Scope
- **Navigation analytics dashboard** (show most-used paths, bottleneck analysis) - Requires analytics infrastructure, defer to Phase 5
- **Folder templates** (pre-built folder structures for common use cases) - Requires template library system, defer to Phase 4

## Design Considerations

### Navigation Architecture

**Visual Hierarchy**:
- **Breadcrumb bar**: Top of screen (below message bar), bg-slate-100, rounded pill style, interactive elements with hover states
- **Favorites bar**: Bottom of screen (above category buttons) or top (below breadcrumbs), sticky positioning, max-height 80px, horizontal scroll if > 10 favorites
- **Folder grid**: Same 5-column layout as existing CoreBoard, folder buttons use distinct styling (folder icon + colored border instead of filled background)
- **Search input**: Top-right corner of screen (next to Help icon), expands to full-width overlay when focused, results dropdown below input

**Breadcrumb Design**:
```
[Home] > [Food] > [Breakfast] > [Drinks]
 ^^^^     ^^^^      ^^^^^^^^      ^^^^^^
tappable  tappable  tappable      current (bold)
```
- Each breadcrumb element: text + right arrow separator
- Current location: bold text, no arrow after
- Max width per element: 120px, truncate with ellipsis if longer
- Mobile: Collapse to "... > [Parent] > [Current]" if breadcrumb exceeds screen width

**Folder Button Style**:
- Icon: Lucide `Folder` icon (24px)
- Border: 3px solid [custom color]
- Background: white (not filled like word buttons)
- Text: Folder name below icon (truncate at 15 characters)
- Hover state: Background changes to slate-100

### Search Interface

**Search Input Field**:
- Position: Top-right corner (desktop), top-center (mobile)
- Collapsed state: Icon button (magnifying glass), 48px x 48px
- Expanded state: Full-width input field (max-width 600px), rounded border, shadow effect
- Placeholder text: "Search all words and folders..."

**Search Results Dropdown**:
- Display: Below search input, max-height 400px, vertical scroll if > 10 results
- Result item format: `[Word/Folder Name] - [Breadcrumb Path]`
- Highlighting: Matched text in bold
- Empty state: "No results found. Try different keywords."
- Keyboard navigation: Arrow keys to move selection, Enter to navigate

### Favorites Bar

**Layout Options** (configurable in Settings):
- **Bottom position** (default): Above category buttons, horizontal scrollable row, 80px height
- **Top position**: Below breadcrumbs, same styling

**Favorite Button Style**:
- Compact version of word buttons (60px x 60px)
- Same color coding as word types (pronoun, verb, noun, etc.)
- Icon + text label (text truncated at 8 characters)
- Long-press menu: "Remove from Favorites" option

**Add to Favorites Gesture**:
- Long-press any word button → Menu appears with "Add to Favorites" option
- If favorites bar is full (20 slots), show alert: "Favorites full. Remove a favorite to add new words."

### Onboarding Tutorial

**Step-by-Step Overlay Design**:
1. **Welcome Screen**: "Welcome to AAC Board! Let's learn how to communicate." [Next button]
2. **Tap Word Demo**: Spotlight on "I" pronoun button, overlay text: "Tap this word to start your sentence." [Auto-advances on tap]
3. **Build Sentence Demo**: Spotlight on "want" verb button, overlay text: "Tap another word to build your message." [Auto-advances on tap]
4. **Speak Demo**: Spotlight on Speak button, overlay text: "Now tap Speak to hear your message!" [Auto-advances on tap]
5. **Navigation Overview**: Spotlight on category buttons, overlay text: "Explore categories to find more words. Tap Categories to see all your word groups." [Finish button]

**Optional Communication Partner Tips Screen** (after Step 5):
- Title: "Tips for Communication Partners"
- Content: 3-5 bullet points about AAC modeling best practices
- Link: "Learn more in Resources section"
- Buttons: "Skip" | "Got It"

**Replay Tutorial Access**:
- Settings > Help section > "Replay Tutorial" button
- Confirmation prompt: "This will restart the onboarding tutorial. Continue?"

### Motor Control Settings UI

**Button Size Selector**:
- Radio buttons or segmented control: Small | Medium | Large | Extra-Large
- Preview: Live preview of button size below selector
- Default: Medium (60px height)

**Dwell Mode Configuration**:
- Toggle switch: "Enable Dwell Mode" (off by default)
- Slider: Dwell time (0.5s - 3.0s, step: 0.1s, default: 1.5s)
- Preview: Hover over a sample button to test dwell activation
- Haptic feedback toggle: "Enable haptic feedback on activation"

**Safe Zone Buffer**:
- Slider: Safe zone size (0px - 20px, step: 2px, default: 10px)
- Description: "Prevents accidental taps near button edges"
- Visual diagram showing safe zone area highlighted on sample button

### Accessibility Settings UI

**High Contrast Mode**:
- Toggle switch: "Enable High Contrast Mode"
- Preview: Shows before/after comparison of button styling
- Applies: Increases border thickness (2px → 4px), changes text to black, increases shadow depth

**Screen Reader Support**:
- All buttons must have aria-label attributes:
  - Word buttons: "Select word: [word text]"
  - Folder buttons: "Open folder: [folder name]"
  - Breadcrumb elements: "Navigate to [breadcrumb level]"
  - Favorites: "Favorite word: [word text]"

### Color & Theme Integration

**Folder Color Palette** (defaults):
- Food: green-500
- Feelings: blue-500
- Places: purple-500
- People: yellow-500
- Actions: red-500
- School: orange-500
- Weather: cyan-500
- Custom: slate-500 (user can override)

**Visual Consistency**:
- All navigation elements (breadcrumbs, folders, shortcuts) use consistent rounded-xl corners (0.75rem)
- Spacing: gap-4 (1rem) between all grid elements
- Shadow: shadow-md on interactive elements, shadow-lg on active/hover

## Technical Considerations

### State Management

**New State Variables Required**:
```typescript
// Navigation state
const [breadcrumbPath, setBreadcrumbPath] = useState<string[]>(['Home']);
const [folderHierarchy, setFolderHierarchy] = useState<FolderNode[]>([]);
const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

// Search state
const [searchQuery, setSearchQuery] = useState<string>('');
const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

// Favorites state
const [favorites, setFavorites] = useState<Word[]>([]);
const [favoritesPosition, setFavoritesPosition] = useState<'top' | 'bottom'>('bottom');

// Onboarding state
const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
const [onboardingStep, setOnboardingStep] = useState<number>(0);

// Settings state
const [buttonSize, setButtonSize] = useState<'small' | 'medium' | 'large' | 'extra-large'>('medium');
const [buttonSpacing, setButtonSpacing] = useState<'compact' | 'normal' | 'spacious' | 'extra-spacious'>('normal');
const [dwellModeEnabled, setDwellModeEnabled] = useState<boolean>(false);
const [dwellTime, setDwellTime] = useState<number>(1.5);
const [safeZoneBuffer, setSafeZoneBuffer] = useState<number>(10);
const [highContrastMode, setHighContrastMode] = useState<boolean>(false);
```

**New TypeScript Interfaces**:
```typescript
interface FolderNode {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string; // tailwind color class
  parentId: string | null;
  children: FolderNode[];
  words: Word[];
}

interface SearchResult {
  id: string;
  type: 'word' | 'folder';
  name: string;
  breadcrumbPath: string[];
  folderId: string | null;
}

interface OnboardingStep {
  stepNumber: number;
  title: string;
  description: string;
  spotlightTarget: string; // CSS selector for element to highlight
  autoAdvance: boolean;
}
```

### Data Persistence

**LocalStorage Keys** (Phase 3 assumes data persistence is implemented from Phase 1):
- `aac_breadcrumb_history`: JSON array of navigation history
- `aac_folder_hierarchy`: JSON tree structure of custom folders
- `aac_favorites`: JSON array of favorite words (max 20)
- `aac_favorites_position`: String ('top' | 'bottom')
- `aac_onboarding_completed`: Boolean flag
- `aac_button_size`: String ('small' | 'medium' | 'large' | 'extra-large')
- `aac_button_spacing`: String ('compact' | 'normal' | 'spacious' | 'extra-spacious')
- `aac_dwell_mode`: Boolean flag
- `aac_dwell_time`: Number (0.5 - 3.0)
- `aac_safe_zone`: Number (0 - 20)
- `aac_high_contrast`: Boolean flag
- `aac_word_usage_frequency`: JSON object mapping word IDs to usage counts

### Search Algorithm

**Implementation Approach**:
1. **Indexing**: Flatten folder hierarchy into searchable array on component mount
2. **Matching**: Use case-insensitive substring matching (`.toLowerCase().includes(query.toLowerCase())`)
3. **Ranking**: Prioritize exact matches > starts-with matches > contains matches
4. **Performance**: Debounce search input (300ms delay) to avoid excessive re-renders

**Example Search Logic**:
```typescript
const performSearch = (query: string): SearchResult[] => {
  const lowerQuery = query.toLowerCase();
  const allItems = flattenFolderHierarchy(folderHierarchy);

  return allItems
    .filter(item => item.name.toLowerCase().includes(lowerQuery))
    .map(item => ({
      id: item.id,
      type: item.type,
      name: item.name,
      breadcrumbPath: buildBreadcrumbPath(item.folderId),
      folderId: item.folderId
    }))
    .sort((a, b) => {
      // Prioritize exact matches
      if (a.name.toLowerCase() === lowerQuery) return -1;
      if (b.name.toLowerCase() === lowerQuery) return 1;
      // Then starts-with matches
      if (a.name.toLowerCase().startsWith(lowerQuery)) return -1;
      if (b.name.toLowerCase().startsWith(lowerQuery)) return 1;
      // Then alphabetical
      return a.name.localeCompare(b.name);
    })
    .slice(0, 50); // Limit to 50 results for performance
};
```

### Accessibility Implementation

**WCAG 2.1 AA Compliance Checklist**:
- [ ] All interactive elements have minimum 44x44px touch targets
- [ ] Color contrast ratios meet 4.5:1 for normal text, 3:1 for large text
- [ ] Keyboard navigation supported with visible focus indicators
- [ ] Screen reader labels (aria-label) on all buttons and controls
- [ ] Focus order follows logical sequence
- [ ] No information conveyed by color alone
- [ ] User can adjust text size via system preferences

**VoiceOver/TalkBack Integration**:
- Add `aria-label` attributes to all interactive elements
- Use semantic HTML (`<button>`, `<nav>`, `<input>`) instead of `<div>` with onClick
- Implement focus management for modals and overlays (trap focus, return focus on close)

### Component Organization

**New Components to Create**:
```
src/components/
├── navigation/
│   ├── BreadcrumbBar.tsx (breadcrumb trail component)
│   ├── FolderGrid.tsx (displays folders in grid layout)
│   ├── SearchBar.tsx (global search input and results)
│   └── NavigationHistory.tsx (back/forward navigation)
├── favorites/
│   ├── FavoritesBar.tsx (persistent favorites bar)
│   └── FavoriteButton.tsx (individual favorite button)
├── onboarding/
│   ├── OnboardingOverlay.tsx (tutorial overlay wrapper)
│   ├── OnboardingStep.tsx (individual tutorial step)
│   └── CommunicationPartnerTips.tsx (optional tips screen)
├── accessibility/
│   ├── DwellModeButton.tsx (button with dwell activation)
│   ├── HighContrastWrapper.tsx (applies high contrast styling)
│   └── FocusIndicator.tsx (visible focus ring component)
└── settings/
    ├── MotorControlSettings.tsx (button size, dwell mode, safe zone)
    ├── AccessibilitySettings.tsx (high contrast, screen reader options)
    └── NavigationSettings.tsx (favorites position, home screen shortcuts)
```

### Performance Considerations

**Optimization Strategies**:
1. **Memoization**: Use `React.memo` for BreadcrumbBar, FavoritesBar to prevent unnecessary re-renders
2. **Lazy Loading**: Load onboarding overlay only when needed (first launch or manual trigger)
3. **Debouncing**: Debounce search input (300ms) to reduce API calls and re-renders
4. **Virtual Scrolling**: If folder hierarchy exceeds 100 items, implement virtual scrolling for search results
5. **IndexedDB**: For large vocabulary sets (1000+ words), consider IndexedDB instead of LocalStorage for search indexing

### Browser Compatibility

**Web Speech API** (existing dependency from baseline):
- Already implemented for text-to-speech
- No additional compatibility concerns for this PRD

**LocalStorage** (data persistence):
- Supported by all modern browsers (Chrome, Firefox, Safari, Edge)
- Fallback: If LocalStorage unavailable, display warning and disable persistence features

**Touch Gestures**:
- Long-press: `touchstart` + `touchend` with timer (500ms)
- Drag-to-reorder: `touchmove` events for favorites reordering
- Dwell mode: `mouseenter` + `mouseleave` (desktop), `touchstart` + timer (mobile)

## Success Metrics

### Navigation Performance Metrics

| Metric | Current Baseline | Target (3 months) | Target (6 months) | Target (12 months) |
|--------|-----------------|-------------------|-------------------|-------------------|
| Average time to find word | Unknown (no search) | < 10 seconds | < 7 seconds | < 5 seconds |
| Search usage rate | 0% (not available) | 40% of users | 60% of users | 70% of users |
| Navigation depth (avg clicks to word) | 2.0 (Core → Category) | 2.5 (with folders) | 2.3 (with search) | 2.0 (with favorites) |
| Favorites adoption rate | 0% (not available) | 50% of users | 70% of users | 85% of users |

### Usability & Accessibility Metrics

| Metric | Current Baseline | Target (3 months) | Target (6 months) | Target (12 months) |
|--------|-----------------|-------------------|-------------------|-------------------|
| Time to first communication (new users) | Unknown | < 15 minutes | < 12 minutes | < 10 minutes |
| Onboarding completion rate | 0% (no onboarding) | 60% | 75% | 85% |
| Motor control settings adoption | 0% (not available) | 20% of users | 30% of users | 40% of users |
| Accessibility compliance score | Unknown | WCAG AA (partial) | WCAG AA (full) | WCAG AAA (target) |

### User Satisfaction Metrics

| Metric | Current Baseline | Target (3 months) | Target (6 months) | Target (12 months) |
|--------|-----------------|-------------------|-------------------|-------------------|
| User satisfaction with navigation | Unknown | 70% satisfied | 80% satisfied | 85% satisfied |
| Speech pathologist NPS (navigation) | Unknown | 40+ | 50+ | 60+ |
| Reported navigation frustration | Unknown | < 30% | < 20% | < 15% |
| "Ease of use" mentions in reviews | Unknown | 40% of reviews | 50% of reviews | 60% of reviews |

### Success Criteria Validation

The navigation & usability enhancements are considered successful if:

1. **Search Adoption**: 60%+ of active users use search functionality within first month of feature release
2. **Onboarding Completion**: 75%+ of new users complete onboarding tutorial without skipping
3. **Favorites Usage**: 70%+ of active users have configured at least 5 favorite words by month 3
4. **Accessibility Compliance**: App achieves WCAG 2.1 AA compliance certification by month 6
5. **User Satisfaction**: "Ease of navigation" becomes top 3 mentioned theme in user reviews/feedback by month 6
6. **Time to Word**: Average time to find and select target word decreases to < 7 seconds by month 6 (measured via analytics)

## Open Questions

### Navigation & Search

- [ ] **Should search include message history?** (e.g., search previously composed sentences)
  - **Consideration**: Requires message history storage (not currently implemented), valuable for repeated phrases
  - **Recommendation**: Defer to Phase 4 (requires message history feature first)

- [ ] **Should folders support custom icons or only predefined Lucide icons?**
  - **Consideration**: Custom icon upload increases complexity, storage requirements
  - **Recommendation**: Predefined Lucide icons for MVP, custom icons in future phase

- [ ] **What is optimal maximum folder depth?** (e.g., limit to 5 levels to prevent over-nesting)
  - **Consideration**: Unlimited depth may create navigation confusion, but restricting limits customization freedom
  - **Recommendation**: Unlimited depth for MVP, monitor analytics for actual usage patterns, add optional depth limit in settings if needed

### Favorites & Quick Access

- [ ] **Should favorites bar support folders or only individual words?**
  - **Consideration**: Folders in favorites bar adds complexity but increases efficiency for grouped concepts
  - **Recommendation**: Words only for MVP (simpler UX), add folder favorites in Phase 4 if user feedback requests it

- [ ] **Should favorites sync across devices or remain local?**
  - **Consideration**: Requires cloud sync infrastructure (Theme 2, Phase 2)
  - **Recommendation**: Local storage for Phase 3, sync in Phase 4 (after cloud infrastructure implemented)

- [ ] **Should the system auto-suggest favorites based on usage, or require manual configuration?**
  - **Consideration**: Auto-suggestion reduces setup burden, but some users prefer manual control
  - **Recommendation**: Implement both - auto-suggest as opt-in feature, always allow manual override

### Onboarding & Tutorials

- [ ] **Should onboarding be different for different user roles?** (e.g., end users vs. speech pathologists vs. caregivers)
  - **Consideration**: Personalized onboarding improves relevance but requires user role selection upfront
  - **Recommendation**: Single onboarding flow for MVP, role-specific tutorials in Phase 4

- [ ] **Should onboarding include interactive practice exercises?** (e.g., "Build a sentence about your favorite food")
  - **Consideration**: Interactive practice increases engagement but lengthens onboarding time
  - **Recommendation**: Optional practice mode after core onboarding, not blocking first communication

- [ ] **How often should contextual help tooltips appear?** (every time vs. once per feature vs. user-triggered only)
  - **Consideration**: Too frequent = annoying, too rare = users miss helpful information
  - **Recommendation**: Show once per feature on first use, "Show tips again" toggle in settings

### Motor Control & Accessibility

- [ ] **Should dwell mode support different dwell times for different actions?** (e.g., 1s for words, 2s for delete)
  - **Consideration**: Variable dwell times reduce accidental critical actions but increase cognitive complexity
  - **Recommendation**: Single global dwell time for MVP, action-specific times in Phase 5 if requested

- [ ] **Should safe zone buffer apply to all buttons or only word buttons?**
  - **Consideration**: Applying to all buttons improves consistency, but may make small UI controls (settings toggles) harder to activate
  - **Recommendation**: Apply to word buttons and folder buttons only, exclude small UI controls (< 44px)

- [ ] **What is minimum supported screen size for accessibility features?** (e.g., iPhone SE 4.7" vs. iPad 12.9")
  - **Consideration**: Smaller screens may not accommodate extra-large button sizes and spacious spacing
  - **Recommendation**: Target iPad as primary device (9.7"+), support iPhone 6.1"+ with responsive adjustments (reduce max button size if needed)

### Technical Implementation

- [ ] **Should folder hierarchy use flat structure with parent pointers or nested tree structure?**
  - **Consideration**: Flat structure easier to search, nested structure more intuitive for navigation
  - **Recommendation**: Nested tree structure for UI state, flatten on-demand for search indexing

- [ ] **Should search indexing happen on every keystroke or be debounced?**
  - **Consideration**: Real-time feels responsive but may cause performance issues with large vocabularies
  - **Recommendation**: Debounce 300ms for MVP, optimize to real-time if performance allows

- [ ] **Should onboarding state be stored in LocalStorage or component state?**
  - **Consideration**: LocalStorage persists across sessions, component state resets on refresh
  - **Recommendation**: LocalStorage (users should not see onboarding multiple times unless manually triggered)

## Next Steps & Recommendations

### Immediate Priorities (Phase 3 MVP)

1. **Multi-Level Navigation & Breadcrumbs** → Foundational requirement for folder organization and word growth
   - **Justification**: Users cannot scale vocabulary beyond 30-50 words without nested folders and clear navigation
   - **Impact**: Enables vocabulary growth from 30 to 300+ words without navigation breakdown
   - **Effort**: Medium-High (8-12 hours implementation + 4 hours testing)

2. **Global Search Functionality** → Critical for quick word discovery as vocabulary grows
   - **Justification**: Finding words manually becomes impractical with 100+ vocabulary items
   - **Impact**: Reduces time to find word from 10-15 seconds (manual navigation) to < 5 seconds (search)
   - **Effort**: Medium (6-8 hours implementation + 2 hours testing)

3. **Guided Onboarding Flow** → Reduces time-to-first-communication for new users
   - **Justification**: New users currently have no guidance, may not discover core features (speak button, categories)
   - **Impact**: Improves onboarding completion rate and reduces support requests
   - **Effort**: Medium (8-10 hours implementation + 4 hours testing)

4. **Motor Control Adaptations** → Critical accessibility requirement for users with motor challenges
   - **Justification**: Current baseline has no motor control accommodations, limiting usability for primary persona (Alex)
   - **Impact**: Expands user base to include individuals with tremors, limited dexterity, or motor impairments
   - **Effort**: Medium (6-8 hours implementation + 4 hours accessibility testing)

### Secondary Priorities (Phase 3 Enhancements)

5. **Favorites Bar & Quick Access** → Efficiency improvement for frequent users
   - **Justification**: 80% of communication typically uses 20% of vocabulary (Pareto principle)
   - **Impact**: Reduces navigation clicks for common words from 2-3 to 0 (instant access)
   - **Effort**: Low-Medium (4-6 hours implementation + 2 hours testing)

6. **WCAG 2.1 AA Compliance** → Legal requirement and usability improvement
   - **Justification**: Accessibility compliance is both ethical imperative and potential legal requirement
   - **Impact**: Ensures app is usable by widest possible range of users (visual impairments, screen readers, keyboard navigation)
   - **Effort**: Medium (6-8 hours implementation + 4 hours compliance audit)

### Future Enhancements (Phase 4+)

- **Advanced search filters** (by word type, usage frequency, date added)
- **Recent words history** (quick access to last 10-20 words used)
- **Interactive onboarding practice mode** (guided sentence-building exercises)
- **Folder templates** (pre-built folder structures for common use cases: school, restaurant, medical)
- **Usage analytics dashboard** (show most-used words, navigation patterns, optimization suggestions)

### Implementation Sequence Recommendation

**Sprint 1 (2 weeks)**: Multi-Level Navigation + Breadcrumbs
- Implement FolderNode data structure and state management
- Create BreadcrumbBar component with navigation logic
- Build FolderGrid component with folder creation UI
- Test nested folder navigation (3+ levels deep)

**Sprint 2 (2 weeks)**: Global Search + Favorites Bar
- Implement search indexing and matching algorithm
- Create SearchBar component with results dropdown
- Build FavoritesBar component with add/remove/reorder functionality
- Test search performance with 200+ vocabulary items

**Sprint 3 (2 weeks)**: Motor Control Adaptations + Accessibility
- Implement button size, spacing, safe zone settings
- Create DwellModeButton component with countdown indicator
- Build HighContrastMode styling and toggle
- Conduct WCAG 2.1 AA compliance audit and remediation

**Sprint 4 (1 week)**: Guided Onboarding Flow
- Create OnboardingOverlay component with step system
- Build 5-step tutorial sequence with spotlight UI
- Implement "Replay Tutorial" functionality in Settings
- User testing with 5-10 new users to validate effectiveness

**Sprint 5 (1 week)**: Polish, Testing, Documentation
- Integration testing across all new features
- Accessibility testing with screen readers (VoiceOver, TalkBack)
- Performance optimization (search debouncing, memoization)
- Update user documentation and in-app help content

## Mapping to Product Vision Themes

### Theme 4: Easy Navigation & Findability

**Current PRD Implementation**:
- ✅ Multi-level folder hierarchy with visual breadcrumbs (Req 1-6)
- ✅ Search functionality across all boards (Req 7-12)
- ✅ Favorites/quick access bar for common words (Req 13-19)
- ✅ Customizable home screen shortcuts (Req 18)
- ✅ Visual cues and color coding for navigation (Req 20-23)

**Alignment with Vision**: This PRD fully implements Theme 4, providing all core navigation and findability features needed to scale from 30 words to 300+ words without increasing cognitive load.

### Theme 5: User-Friendly Experience

**Current PRD Implementation**:
- ✅ Guided onboarding flow for new users (Req 24-29)
- ✅ Built-in help/tutorial system (Req 30-33)
- ✅ Settings for motor control adaptations (Req 34-40)
- ✅ WCAG 2.1 AA accessibility compliance (Req 41-46)
- ❌ Offline functionality (not in scope - requires service workers, defer to Phase 2)
- ❌ Data persistence (prerequisite - assumes Phase 1 implementation completed)

**Alignment with Vision**: This PRD implements majority of Theme 5 user-friendly features, with offline support and data persistence handled by other phases.

### Dependencies on Other Themes

**Theme 1: Infinite Customization** (Phase 1 - Prerequisite):
- This PRD assumes unlimited vocabulary expansion and custom folder creation capabilities from Phase 1
- Navigation features scale with vocabulary size enabled by Phase 1

**Theme 2: Collaborative Board Management** (Phase 2 - Future Integration):
- Folder hierarchy and favorites must sync across devices when cloud sync is implemented
- Search indexing must update when remote board changes occur

**Theme 3: Intelligent Communication Assistance** (Phase 4+ - Future Enhancement):
- AI-powered search suggestions can enhance search functionality
- Usage frequency tracking (Req 19) provides data for future AI word prediction features

---

**Created**: 2025-12-08
**Author**: Tactical Product Manager Agent
**Status**: Draft - Pending Approval
**PRD Number**: 003 (Navigation & Usability Enhancements)
**Phase**: Phase 3
**Related Documents**:
- `/Users/mattpacione/git/health_services/AAC/PRODUCT_VISION.md` (Product Vision - Themes 4 & 5)
- `/.claude/tasks/1_backlog/000-baseline-foundation/prd-000-baseline-foundation.md` (Current Baseline)
- `/.claude/tasks/project-status.md` (Project Status Tracking)

**Dependencies**:
- Phase 1 (Data Persistence & Unlimited Vocabulary) must be completed first
- Assumes LocalStorage or IndexedDB implementation for settings/favorites persistence

**Estimated Effort**: 40-50 hours implementation + 15-20 hours testing = 55-70 hours total (7-9 weeks at 1 developer)
