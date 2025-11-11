# PROJECT_CONTEXT.md

## Project Overview

### Basic Information
- **Project Name**: Adaptive Accountability Coach (AAC)
- **Description**: Native iOS app providing comprehensive, infinitely customizable augmentative and alternative communication (AAC) for nonverbal individuals, enabling freedom from three buttons to unlimited expression without ever switching apps
- **Repository**: /Users/mattpacione/git/AAC
- **Primary Language**: Swift 6.0+
- **Framework**: SwiftUI (native iOS declarative UI framework)
- **Last Updated**: 2025-11-11

### Architecture
- **Type**: Native iOS mobile application (iPad/iPhone)
- **Architecture Pattern**: MVVM (Model-View-ViewModel) with SwiftUI
- **Database**: SwiftData (Apple's native data persistence framework) + UserDefaults for lightweight preferences
- **Infrastructure**: Apple ecosystem (App Store distribution, CloudKit for sync, iOS runtime)
- **Key Services**:
  - Communication board management (visual builder, grid system, folder hierarchy)
  - Text-to-speech synthesis (AVSpeech framework)
  - Cloud board synchronization (CloudKit)
  - AI-powered word prediction (CoreML - future phase)
  - Real-time collaboration (CloudKit shared databases - future phase)

---

## Development Environment

### Prerequisites
- **macOS Version**: macOS 14.0+ (Sonoma or later)
- **Xcode Version**: Xcode 16.0+ (required for Swift 6.0+ and iOS 18 SDK)
- **iOS Target**: iOS 18.0+ (leverages latest SwiftUI, SwiftData, and accessibility features)
- **Package Manager**: Swift Package Manager (SPM - built into Xcode)
- **Required Tools**:
  - Xcode Command Line Tools (`xcode-select --install`)
  - Figma desktop app or Figma in browser (for Figma Make prototyping)
  - Git (for version control)
  - TestFlight (for beta distribution)
- **Environment Variables**:
  - `DEVELOPMENT_TEAM` (Apple Developer Team ID for code signing)
  - CloudKit container identifiers (will be configured in Xcode project)

### Design-to-Code Workflow

**Figma Make Integration**:
1. **Prototyping Phase**: Use Figma Make (https://www.figma.com/make) to visually design UI screens, interactions, and navigation flows
2. **Code Generation**: Figma Make generates source code from prototypes (HTML/CSS/JavaScript base)
3. **Swift Translation**: tactical-software-engineer agent translates Figma Make output to production SwiftUI code
4. **Native Implementation**: Convert design system, components, layouts, and interactions to native iOS patterns
5. **Iteration**: Refine implementation based on accessibility, performance, and iOS best practices

**Why This Workflow**:
- Rapid visual prototyping without writing code
- Quick iteration on UI/UX designs
- Easier collaboration with designers and speech pathologists for feedback
- Clear visual specifications for implementation
- Reduces ambiguity in feature requirements

**Agent Responsibilities**:
- **tactical-ux-ui-designer**: Creates Figma prototypes, defines design system, ensures accessibility
- **tactical-software-engineer**: Translates Figma Make output to SwiftUI, implements native iOS patterns, optimizes performance

### Setup Commands

```bash
# Clone repository
git clone [repository-url]
cd AAC

# Open in Xcode
open AAC.xcodeproj

# Install dependencies (SPM dependencies auto-resolve in Xcode)
# Xcode > File > Swift Packages > Update to Latest Package Versions

# Build for simulator
xcodebuild -scheme AAC -sdk iphonesimulator -configuration Debug build

# Run tests
xcodebuild test -scheme AAC -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPad Pro (12.9-inch)'

# Build for device (requires Developer Account and provisioning profile)
xcodebuild -scheme AAC -sdk iphoneos -configuration Release archive
```

### Development Workflow

1. **Design Phase**: Create UI prototypes in Figma Make
2. **Code Generation**: Export/copy code from Figma Make
3. **Translation Phase**: tactical-software-engineer converts to SwiftUI
4. **Implementation**: Add business logic, data models, accessibility features
5. **Testing**: Pragmatic testing focused on critical paths
6. **Review**: Manual testing on physical devices (iPad/iPhone)
7. **Commit**: Git commit with tests passing

---

## Project Conventions

### Code Standards

- **Linting**: SwiftLint (configuration: `.swiftlint.yml` in project root)
  - Rules: Follow Swift API Design Guidelines, enforce 120-character line limit, require documentation for public APIs
- **Testing**: XCTest framework (native iOS testing)
  - Pragmatic testing approach: Focus on critical communication paths, data persistence, accessibility
  - Test files: `Tests/` directory, mirroring main source structure
  - Naming: `[ClassUnderTest]Tests.swift`
- **Documentation**:
  - Swift DocC for public APIs and complex business logic
  - Inline comments using `REASON:`, `WHY:`, `NOTE:`, `HACK:`, `TODO:` prefixes (see Code Quality section)
- **Git Flow**:
  - **Branch Naming**: `feature/[feature-name]`, `bugfix/[issue-description]`, `refactor/[area]`
  - **Commit Patterns**: Conventional Commits format - `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
  - **Main Branch**: `main` (protected, requires PR approval)

### File Structure

```
AAC/
├── AAC/                          # Main app target
│   ├── App/                      # App lifecycle (AppDelegate, SceneDelegate, root view)
│   ├── Models/                   # SwiftData models and data structures
│   │   ├── Board.swift           # Communication board model
│   │   ├── Button.swift          # Individual button/cell model
│   │   ├── Folder.swift          # Folder/category model
│   │   └── UserPreferences.swift # Settings and preferences
│   ├── ViewModels/               # MVVM ViewModels (business logic)
│   │   ├── BoardViewModel.swift
│   │   ├── CustomizationViewModel.swift
│   │   └── SpeechViewModel.swift
│   ├── Views/                    # SwiftUI views (UI layer)
│   │   ├── Board/                # Communication board screens
│   │   ├── Customization/        # Visual board builder screens
│   │   ├── Settings/             # Settings and preferences screens
│   │   └── Onboarding/           # First-run setup flow
│   ├── Services/                 # Business services and integrations
│   │   ├── SpeechService.swift   # Text-to-speech wrapper
│   │   ├── CloudSyncService.swift # CloudKit sync logic
│   │   └── PredictionService.swift # AI word prediction (future)
│   ├── Utilities/                # Helpers, extensions, constants
│   │   ├── Accessibility/        # Accessibility utilities
│   │   ├── Extensions/           # Swift extensions
│   │   └── Constants.swift       # App-wide constants
│   └── Resources/                # Assets, localization, configs
│       ├── Assets.xcassets       # Images, colors, symbols
│       ├── Localizable.strings   # English localization (future: multi-language)
│       └── Info.plist            # App configuration
├── Tests/                        # Unit and integration tests
│   ├── ModelTests/               # Data model tests
│   ├── ViewModelTests/           # Business logic tests
│   └── ServiceTests/             # Service integration tests
├── UITests/                      # UI automation tests (optional, pragmatic approach)
├── .swiftlint.yml                # SwiftLint configuration
├── .gitignore                    # Git ignore patterns
├── README.md                     # Project documentation
├── PRODUCT_VISION.md             # Product vision and strategy
├── PROJECT_CONTEXT.md            # This file - technical context
└── .claude/                      # Claude Agent System (task management, agents, templates)
```

### Naming Conventions

- **Files**: PascalCase for Swift files (e.g., `BoardViewModel.swift`, `CustomButton.swift`)
- **Classes/Structs**: PascalCase (e.g., `Board`, `ButtonConfiguration`, `SpeechService`)
- **Functions/Methods**: lowerCamelCase (e.g., `addButton()`, `speakText()`, `syncBoardToCloud()`)
- **Variables**: lowerCamelCase (e.g., `currentBoard`, `isEditing`, `buttonSize`)
- **Constants**: lowerCamelCase for local, UPPER_SNAKE_CASE for global constants (e.g., `let maxButtonsPerRow = 8`, `static let DEFAULT_VOICE_RATE = 0.5`)
- **Protocols**: PascalCase with descriptive suffix (e.g., `BoardDelegate`, `SyncServiceProtocol`)
- **Enums**: PascalCase for type, lowerCamelCase for cases (e.g., `enum NavigationState { case viewing, editing }`)

### SwiftUI Best Practices

- **View Decomposition**: Break complex views into smaller, reusable components (max ~200 lines per view)
- **State Management**: Use `@State` for local view state, `@StateObject`/`@ObservedObject` for ViewModels, `@Environment` for shared app state
- **Performance**: Use `LazyVStack`/`LazyHStack` for large lists, avoid heavy computation in view body
- **Accessibility**: Always provide `.accessibilityLabel()`, `.accessibilityHint()`, and `.accessibilityValue()` for custom controls
- **Preview Providers**: Include Xcode preview for every view (speeds development iteration)

---

## Business Context

### Domain
- **Industry**: Assistive Technology / Healthcare / Augmentative and Alternative Communication (AAC)
- **Target Users**:
  - **Primary**: Nonverbal individuals with communication disorders (ages 3+ through adulthood)
  - **Secondary**: Speech-language pathologists (SLPs) designing customized communication boards
  - **Tertiary**: Caregivers and family members supporting nonverbal users
- **Core Business Logic**:
  - Infinite customization of communication boards (no vocabulary limits)
  - Visual drag-and-drop board builder (folders, grids, buttons)
  - Text-to-speech synthesis for communication output
  - Cloud-based board synchronization across devices
  - Real-time collaboration between users, pathologists, and caregivers
  - AI-powered word prediction to speed communication (future phase)
- **Compliance Requirements**:
  - **Accessibility**: WCAG 2.2 Level AAA compliance (critical for nonverbal users)
  - **Privacy**: HIPAA-adjacent considerations (AAC boards may contain sensitive personal information)
  - **Data Security**: Encrypted storage and transmission of user boards
  - **App Store Guidelines**: Must meet Apple's accessibility and privacy standards

### Key Features

**MVP Phase (Months 1-3)**:
- **Visual Board Builder**: Drag-and-drop interface to create, organize, and customize communication boards with unlimited grid expansion
- **Custom Buttons**: Upload symbols, photos, text labels; configure button actions (speak word, navigate to folder)
- **Text-to-Speech**: Convert button selections to synthesized speech with voice selection
- **Folder Hierarchy**: Multi-level organization to scale from simple (3 buttons) to complex (hundreds of concepts)
- **Basic Cloud Sync**: Save boards to cloud, restore on new devices (CloudKit integration)
- **Onboarding Flow**: Guided setup to create first board and teach core interactions

**Iteration Phase (Months 4-6)**:
- **Collaborative Editing**: Real-time board updates from speech pathologists and caregivers with role-based permissions
- **Template Library**: Pre-built board templates for common use cases (mealtime, emotions, requests)
- **Search Functionality**: Quick search across all boards to find vocabulary
- **Favorites Bar**: Quick access shortcuts for frequently used words/phrases
- **AI Word Prediction**: Context-aware suggestions to speed communication (CoreML integration)

**Expansion Phase (Months 7-12)**:
- **Advanced Navigation**: Visual breadcrumbs, color-coded categories, customizable home screen
- **Multi-User Collaboration**: Shared board editing sessions, change notifications, version history
- **Custom Voice Options**: Integrate third-party TTS engines for personalized voices
- **Import/Export**: Share vocabulary sets, import from other AAC systems

### Critical Paths

**User Journey: First Communication**
1. User opens app for first time
2. Onboarding guides to create simple 3-button board ("I want", "Help", "More")
3. User taps button → Text-to-speech speaks phrase
4. Success: User experiences immediate communication value within 10 minutes

**User Journey: Daily Communication**
1. User opens app to existing board
2. Navigates folder hierarchy to find desired word category (e.g., "Food" → "Lunch")
3. Taps button for specific food item → Speech output
4. Repeats to build sentence ("I want" → "Food" → "Pizza")
5. Uses favorites bar for frequently needed phrases
6. Performance target: Find and speak word in < 5 seconds

**Speech Pathologist Journey: Customize Client Board**
1. SLP logs in with professional account
2. Accesses client's board (authorized via role-based permissions)
3. Adds new vocabulary using visual builder (drag, drop, configure)
4. Uploads custom symbols/photos
5. Organizes into folders
6. Saves changes → Client's device syncs automatically via CloudKit
7. Efficiency target: Add 10 new words in < 5 minutes

**Performance-Sensitive Areas**:
- Button tap responsiveness (<200ms to visual feedback, <500ms to speech output)
- Board rendering with 100+ buttons (must remain smooth, 60fps)
- Cloud sync latency (background sync, never block user interactions)
- Search query speed (<1 second for results across 500+ vocabulary items)

---

## Technical Constraints

### Performance Requirements

- **Response Time**:
  - Button tap to visual feedback: <200ms (critical for user confidence)
  - Button tap to speech output: <500ms (communication is real-time)
  - Board load time: <1 second for boards with 100+ buttons
  - Search query: <1 second for 500+ vocabulary items
- **Throughput**:
  - Support boards with 1000+ buttons without performance degradation
  - Handle 10+ simultaneous collaborative editors on shared board (future phase)
- **Availability**:
  - Offline functionality required for core communication (speech must work without network)
  - Cloud sync in background, never block user
  - App must remain responsive even during sync/download
- **Scalability**:
  - Architecture must support growth from 3 buttons to unlimited vocabulary per user
  - Efficient data structures for folder hierarchy navigation
  - Lazy loading for large boards (render visible buttons only)

### Security Requirements

- **Authentication**:
  - Sign in with Apple (Apple ID-based authentication - privacy-first, native iOS)
  - Role-based access: User, Pathologist, Caregiver tiers
- **Authorization**:
  - Board ownership model (users own their boards, grant access to pathologists/caregivers)
  - CloudKit shared databases for collaborative editing with permission scopes
- **Data Protection**:
  - Encrypt all data at rest (SwiftData + iOS keychain for sensitive data)
  - Encrypt data in transit (HTTPS, CloudKit encryption by default)
  - PII handling: User boards may contain personal vocabulary (names, addresses, medical terms) - must be protected
- **Audit Requirements**:
  - Log board access and modifications for collaborative editing (who changed what, when)
  - Export logs for speech pathologists (track vocabulary growth, usage patterns)

### Integration Points

- **External APIs**:
  - Apple CloudKit (board sync, collaborative editing)
  - Apple AVSpeech (text-to-speech synthesis)
  - CoreML (AI word prediction - future phase)
  - Third-party TTS engines (future: custom voice options like Acapela, CereProc)
- **Internal Services**:
  - SwiftData persistence layer (local database for boards, buttons, preferences)
  - UserDefaults (lightweight settings storage)
- **Webhooks**:
  - CloudKit push notifications (notify users when board updated by collaborator)
- **Message Queues**:
  - Not applicable for MVP (may consider for future real-time collaboration features)

---

## Operational Context

### Deployment

- **Environments**:
  - **Development**: Local Xcode simulator and physical test devices
  - **Staging**: TestFlight internal testing (Apple Developer Program)
  - **Production**: App Store (public distribution)
- **CI/CD Pipeline**:
  - Git commit triggers automated build via Xcode Cloud or GitHub Actions
  - Run unit tests and SwiftLint validation
  - Generate build for TestFlight beta distribution
  - Manual approval for App Store submission
- **Infrastructure**:
  - Native iOS app runs on user devices (no server infrastructure for MVP)
  - CloudKit backend managed by Apple (no server management required)
- **Monitoring**:
  - Xcode Organizer for crash reports
  - App Store Connect analytics (downloads, crashes, user engagement)
  - CloudKit Dashboard for sync monitoring
  - Future: Third-party APM like Firebase Crashlytics or Sentry

### Team Structure

- **Team Size**: Currently 1 developer + Claude Agent System for specialized tasks
- **Roles**:
  - **Product Strategy**: strategic-product-visionary, strategic-product-manager
  - **Feature Planning**: strategic-feature-architect, tactical-product-manager (PRD creation)
  - **iOS Development**: tactical-software-engineer (Swift/SwiftUI implementation)
  - **Design**: tactical-ux-ui-designer (Figma prototypes, accessibility)
  - **Infrastructure**: tactical-platform-engineer (Xcode project setup, CI/CD, App Store deployment)
  - **Security**: tactical-cybersecurity (data encryption, privacy compliance)
  - **Testing**: tactical-sre (test automation, performance validation - pragmatic approach)
- **Communication**:
  - Task management via `.claude/tasks/` system
  - PRD workflow for feature development
  - Agent session history for audit trail
- **Decision Making**:
  - Product decisions: User (project owner) with strategic agent guidance
  - Technical decisions: Delegated to tactical-software-engineer with architectural review
  - Security/privacy decisions: Escalate to user with tactical-cybersecurity recommendations

### Known Issues

- **Technical Debt**:
  - None yet (greenfield project)
  - Future risk: CloudKit schema migrations as data model evolves
- **Performance Bottlenecks**:
  - Potential: Rendering large boards (1000+ buttons) - mitigation via lazy loading
  - Potential: Search performance on large vocabulary - mitigation via indexed search (Core Spotlight)
- **Platform Limitations**:
  - iOS only (no Android, web) - strategic trade-off for MVP speed
  - Requires iOS 18.0+ (excludes older devices) - acceptable for accessibility features
  - CloudKit requires iCloud account (user friction) - acceptable for target audience
- **External Dependencies**:
  - Apple CloudKit availability (99.9% uptime SLA)
  - AVSpeech quality (limited voice options in MVP)
  - Third-party TTS engines (future) may have licensing costs

---

## Agent-Specific Guidance

### Common Tasks

**Task: Implement New SwiftUI View**
1. Review Figma prototype or design specifications
2. Create new Swift file in appropriate `Views/` subdirectory
3. Define view struct conforming to `View` protocol
4. Implement `body` property with SwiftUI layout
5. Add accessibility labels/hints/values for all interactive elements
6. Create Xcode preview provider for development iteration
7. Wire to ViewModel if business logic required
8. Write pragmatic test for critical user interactions
9. Update `README.md` if new feature exposed to users

**Task: Add New Data Model**
1. Create Swift file in `Models/` directory
2. Define struct/class with `@Model` macro (SwiftData)
3. Add properties with appropriate types
4. Define relationships to other models (if applicable)
5. Add computed properties for business logic
6. Implement `Codable` if CloudKit sync required
7. Write unit tests for data validation and relationships
8. Update SwiftData schema migration if modifying existing models

**Task: Integrate Figma Make Output**
1. Export code from Figma Make (HTML/CSS/JavaScript)
2. Analyze layout structure, components, and interactions
3. Translate HTML structure to SwiftUI view hierarchy
4. Convert CSS styling to SwiftUI modifiers (`.font()`, `.foregroundColor()`, `.padding()`, etc.)
5. Map JavaScript interactions to SwiftUI state/bindings
6. Replace generic components with iOS native patterns (e.g., `Button`, `List`, `NavigationStack`)
7. Add accessibility features not present in web prototype
8. Optimize for iOS performance (lazy loading, state management)
9. Test on physical iPad/iPhone for touch interactions

**Task: Debug Speech Pathologist Workflow Issue**
1. Review task file in `.claude/tasks/2_active/` for context
2. Reproduce issue in simulator or device
3. Check CloudKit Dashboard for sync errors
4. Inspect SwiftData model relationships
5. Add logging to identify failure point
6. Fix issue with minimal code changes
7. Verify fix doesn't break existing functionality
8. Update task file with resolution notes

### Gotchas and Pitfalls

**SwiftUI State Management**:
- **Gotcha**: Using `@State` in ViewModel instead of `@Published` causes view not to update
- **Solution**: `@State` for view-local state only, `@Published` properties in `ObservableObject` ViewModels

**SwiftData Concurrency**:
- **Gotcha**: Accessing SwiftData models on background thread causes crashes
- **Solution**: Always use `@MainActor` for SwiftData operations or explicit `MainActor.run { }`

**CloudKit Sync Timing**:
- **Gotcha**: Assuming immediate sync after save causes race conditions in tests
- **Solution**: Use CloudKit notification callbacks, never assume sync completion timing

**AVSpeech Voice Selection**:
- **Gotcha**: Not all voices available on all devices/languages
- **Solution**: Fallback to default system voice if preferred voice unavailable

**Accessibility Testing**:
- **Gotcha**: VoiceOver behavior differs significantly from visual interaction
- **Solution**: Always test with VoiceOver enabled on physical device, not just simulator

**Figma Make Translation**:
- **Gotcha**: Web-based layouts don't translate 1:1 to iOS constraints
- **Solution**: Focus on visual hierarchy and interactions, not pixel-perfect CSS translation

**Button Tap Performance**:
- **Gotcha**: Heavy computation in button action closure blocks UI thread
- **Solution**: Move speech synthesis and data persistence to background task, show immediate visual feedback

### Success Patterns

**Proven Approaches**:
- **Incremental Development**: Build one feature at a time, test on device frequently, gather user feedback before next feature
- **Accessibility-First Design**: Design for VoiceOver/accessibility from start, not as afterthought - saves refactoring
- **Pragmatic Testing**: Focus tests on critical communication paths, data persistence, and accessibility - skip UI snapshot tests for MVP
- **Component Reusability**: Build reusable SwiftUI components for buttons, folders, navigation - reduces duplication
- **Performance Profiling**: Use Xcode Instruments early to catch performance issues before they compound

**Preferred Libraries/Tools**:
- **SwiftData**: Native data persistence - no external database dependencies
- **CloudKit**: Native cloud sync - no backend server required
- **AVSpeech**: Built-in TTS - fast MVP launch, upgrade to third-party later if needed
- **SwiftLint**: Enforce code style consistency automatically
- **Figma**: Visual prototyping and design handoff
- **TestFlight**: Beta testing with speech pathologists and users

**Effective Debugging Strategies**:
1. **Xcode Debugger**: Use breakpoints and `po` command for runtime inspection
2. **Xcode View Hierarchy**: Inspect SwiftUI view tree when layout issues occur
3. **Instruments**: Profile performance with Time Profiler, allocations, and SwiftUI performance tools
4. **CloudKit Dashboard**: Monitor sync status, check for schema errors
5. **Physical Device Testing**: Always test on real iPad/iPhone, not just simulator (especially for accessibility, speech, touch interactions)

---

## Auto-Discovery Hints

### Framework Detection

- **Package Files**: `Package.swift` (if using SPM for dependencies), `Podfile` (if CocoaPods - not recommended)
- **Config Files**:
  - `.swiftlint.yml` (code style configuration)
  - `AAC.xcodeproj/project.pbxproj` (Xcode project file)
  - `Info.plist` (app configuration, permissions)
- **Directory Patterns**:
  - Presence of `.xcodeproj` or `.xcworkspace` indicates Xcode project
  - `Sources/` or `AAC/` directory contains Swift source files
  - `Tests/` directory for unit tests
  - `UITests/` directory for UI automation tests

### Tool Integration

- **Linting Config**: `.swiftlint.yml` in project root (run `swiftlint` command)
- **Test Config**: XCTest framework built into Xcode (run `xcodebuild test` or Xcode Test Navigator)
- **Build Config**: `AAC.xcodeproj` (build via `xcodebuild` CLI or Xcode GUI)
- **CI/CD Config**: `.github/workflows/ios.yml` (GitHub Actions) or Xcode Cloud configuration

### Project Discovery Commands

```bash
# Detect Swift project
ls *.xcodeproj

# Check Swift version
swift --version

# List SPM dependencies
xcodebuild -list -project AAC.xcodeproj

# Find SwiftData models
find AAC -name "*.swift" -exec grep -l "@Model" {} \;

# Check for CloudKit integration
grep -r "CloudKit" AAC/

# Verify accessibility implementation
grep -r "accessibilityLabel" AAC/
```

---

## Development Best Practices

### Test-Driven Development (TDD) - Pragmatic Approach

**When to Use TDD**:
- Data model logic (SwiftData relationships, validation)
- Business logic in ViewModels (board management, speech synthesis)
- Critical communication paths (button tap → speech output)

**When to Skip TDD**:
- UI layout code (rely on Xcode previews and manual testing)
- Simple property accessors
- Configuration files

**TDD Workflow for AAC**:
1. Write failing test for data model or ViewModel method
2. Run test → confirm failure
3. Implement minimal code to pass
4. Run test → confirm success
5. Manual testing on device for user-facing behavior
6. Refactor if needed, re-run tests

**Testing Commands**:
```bash
# Run all unit tests
xcodebuild test -scheme AAC -destination 'platform=iOS Simulator,name=iPad Pro (12.9-inch)'

# Run specific test class
xcodebuild test -scheme AAC -destination 'platform=iOS Simulator,name=iPad Pro (12.9-inch)' -only-testing:AACTests/BoardViewModelTests

# Run tests with coverage report
xcodebuild test -scheme AAC -destination 'platform=iOS Simulator,name=iPad Pro (12.9-inch)' -enableCodeCoverage YES
```

### Code Quality and Clarity

**Comment Prefixes** (per CLAUDE.md standards):
- `REASON:` Explain why this approach was chosen (architectural decisions)
- `WHY:` Explain business logic rationale (why this communication pattern)
- `NOTE:` Important implementation details (SwiftData quirks, CloudKit limitations)
- `HACK:` Temporary workaround (technical debt to address later)
- `TODO:` Future improvement needed

**Example**:
```swift
// REASON: Using lazy loading to avoid rendering all 1000+ buttons at once
LazyVGrid(columns: gridLayout) {
    ForEach(visibleButtons) { button in
        ButtonView(button: button)
    }
}

// WHY: Speech pathologists need immediate visual feedback that button was tapped
// before speech synthesis completes (which can take 500ms)
func handleButtonTap(_ button: Board.Button) {
    // NOTE: Visual feedback MUST happen on main thread synchronously
    button.isHighlighted = true

    // Speech synthesis on background thread to avoid blocking UI
    Task {
        await speechService.speak(button.text)
        button.isHighlighted = false
    }
}
```

### Confirmation and Safety Protocols

**Never Assume**:
- Always ask questions when requirements unclear (especially accessibility needs)
- Request clarification before architectural decisions (e.g., CloudKit vs. custom backend)
- Confirm business logic understanding with user or strategic agent (e.g., "Should caregivers have full edit access or read-only?")

**File Safety**:
- Confirm file paths before deletion or overwrite (especially SwiftData model files)
- Verify view exists before editing (check `Views/` directory structure)
- Never delete user data (boards, buttons) without explicit confirmation

**Pre-Change Checklist**:
- [ ] Confirm file paths are correct
- [ ] Verify dependencies are resolved (SPM packages)
- [ ] Understand existing code structure (read files first)
- [ ] Know what to preserve (don't break existing accessibility features)
- [ ] Establish success criteria (how to validate change works)
- [ ] Determine if TDD is appropriate for this change

---

## iOS-Specific Considerations

### Accessibility (Critical for AAC)

**VoiceOver Support**:
- All interactive elements MUST have `.accessibilityLabel()` (describe button purpose)
- All buttons MUST have `.accessibilityHint()` (explain what happens when tapped)
- Communication board grid MUST support VoiceOver navigation (swipe to navigate cells)
- Folder navigation MUST announce current location (e.g., "Food folder, 15 items")

**Switch Control Support**:
- Large tap targets (min 44x44 points per Apple HIG)
- Adjustable button size for motor control needs
- Dwell time configuration (hold to select)

**Dynamic Type**:
- Support system font size adjustments
- Text labels must scale with user's preferred reading size
- Minimum font size for readability

**Color & Contrast**:
- High contrast mode support
- Never rely on color alone to convey meaning
- Customizable button colors for visual needs

**Reduced Motion**:
- Respect `accessibilityReduceMotion` setting
- Provide alternatives to animations

### SwiftUI Performance Optimization

**Lazy Loading**:
```swift
// REASON: Boards can have 1000+ buttons - only render visible cells
LazyVGrid(columns: columns) {
    ForEach(buttons) { button in
        ButtonView(button: button)
    }
}
```

**State Management**:
```swift
// WHY: Minimize view re-renders by isolating state changes
@State private var isEditing: Bool = false
@StateObject private var viewModel = BoardViewModel()
```

**Avoid Heavy Computation in Body**:
```swift
// ❌ BAD: Filtering in view body causes re-computation on every render
var body: some View {
    ForEach(allButtons.filter { $0.isVisible }) { button in
        ButtonView(button: button)
    }
}

// ✅ GOOD: Pre-filter in ViewModel, view just displays
var body: some View {
    ForEach(viewModel.visibleButtons) { button in
        ButtonView(button: button)
    }
}
```

---

## Figma Make → Swift Translation Guide

### Component Mapping

| Figma Make Output | SwiftUI Equivalent | Notes |
|------------------|-------------------|-------|
| `<div>` container | `VStack`, `HStack`, `ZStack` | Choose based on layout direction |
| `<button>` | `Button` | Use SwiftUI native button with custom styling |
| `<input>` text field | `TextField` | Native iOS text input with keyboard handling |
| `<img>` | `Image` | Use `Assets.xcassets` for images, `AsyncImage` for URLs |
| CSS Grid | `LazyVGrid`, `LazyHStack` | Use lazy containers for performance |
| Flexbox | `VStack`, `HStack` with modifiers | `.frame()`, `.padding()`, `.spacing()` |
| `onClick` handler | `Button(action:)` or `.onTapGesture()` | SwiftUI gesture recognizers |
| CSS animations | `withAnimation { }` or `.animation()` | Native SwiftUI animations |
| `display: none` | `if condition { View }` or `.opacity(0)` | Conditional view rendering |

### Styling Translation

| CSS Property | SwiftUI Modifier | Example |
|-------------|-----------------|---------|
| `font-size` | `.font(.system(size: 20))` | Or use `.font(.title)`, `.font(.body)` |
| `color` | `.foregroundColor(.blue)` | Use semantic colors |
| `background-color` | `.background(Color.blue)` | Apply to view |
| `padding` | `.padding(.all, 16)` | Or `.padding()` for default |
| `margin` | `.padding()` on parent | SwiftUI uses padding, not margin |
| `border` | `.border(Color.black, width: 2)` | Or `.overlay(RoundedRectangle(...).stroke())` |
| `border-radius` | `.cornerRadius(8)` | Or `.clipShape(RoundedRectangle(...))` |
| `width`, `height` | `.frame(width: 100, height: 50)` | Fixed or flexible sizing |
| `display: flex` | `VStack`, `HStack`, `ZStack` | Choose based on direction |
| `justify-content` | `.frame(maxWidth: .infinity, alignment: .leading)` | Use frame alignment |
| `align-items` | `.frame(maxHeight: .infinity, alignment: .top)` | Vertical alignment |

### Interaction Translation

| Figma Make Interaction | SwiftUI Implementation | Notes |
|------------------------|----------------------|-------|
| Button click | `Button(action: { ... })` | Native SwiftUI button |
| Hover state | `.onHover { isHovering in ... }` | iPad/Mac only, use tap for iOS |
| Text input | `TextField("Placeholder", text: $text)` | Binding to state variable |
| Toggle/checkbox | `Toggle("Label", isOn: $isEnabled)` | Native iOS toggle |
| Slider | `Slider(value: $value, in: 0...100)` | Native iOS slider |
| Dropdown/select | `Picker("Label", selection: $choice) { ... }` | Use menu or sheet for iOS |
| Modal/dialog | `.sheet(isPresented: $showModal) { ... }` | Native iOS modal presentation |
| Navigation | `NavigationLink(destination: ...) { ... }` | SwiftUI navigation |
| Tabs | `TabView { ... }` | Native iOS tab bar |

### Layout Translation Strategy

1. **Identify Layout Structure**: Analyze Figma Make output for container hierarchy (nested divs, flex containers)
2. **Map to SwiftUI Containers**: Convert HTML structure to `VStack`/`HStack`/`ZStack` based on layout direction
3. **Apply Styling**: Translate CSS properties to SwiftUI modifiers
4. **Extract Components**: Identify reusable UI elements and create separate SwiftUI views
5. **Add State Management**: Wire up `@State`, `@Binding`, and ViewModels for interactivity
6. **Enhance Accessibility**: Add accessibility labels/hints not present in web prototype
7. **Optimize Performance**: Use lazy loading, efficient state updates, avoid heavy computation in view body
8. **Test on Device**: Validate touch interactions, gestures, and layout on physical iPad/iPhone

---

## Next Steps for Development

### Immediate Setup Actions

1. **Create Xcode Project** (tactical-platform-engineer agent)
   - New iOS App project with SwiftUI + SwiftData
   - Configure bundle identifier, team, deployment target (iOS 18.0+)
   - Set up SwiftLint integration
   - Initialize Git repository

2. **Design First Screens in Figma Make** (tactical-ux-ui-designer agent)
   - Onboarding flow (3-button starter board)
   - Communication board grid view
   - Visual board builder (customization mode)
   - Export Figma Make code for translation

3. **Implement Core Data Models** (tactical-software-engineer agent)
   - `Board.swift` (SwiftData model)
   - `Button.swift` (communication button model)
   - `Folder.swift` (organization model)
   - Unit tests for relationships

4. **Build MVP Features** (following PRD workflow in `.claude/tasks/`)
   - Onboarding flow (first 3-button board)
   - Communication board rendering
   - Button tap → speech synthesis
   - Basic customization (add button, edit label)
   - Local persistence (SwiftData)

### PRD Workflow Integration

- Use `.claude/tasks/1_create-prd.md` workflow for each major feature
- Generate tasks using `.claude/tasks/2_generate-tasks.md`
- Follow `.claude/tasks/3_process-task-list.md` for implementation
- Maintain project status in `.claude/tasks/project-status.md`

### Success Criteria for Setup Completion

- [ ] Xcode project builds successfully on simulator
- [ ] SwiftLint runs without errors
- [ ] First SwiftData model created with passing tests
- [ ] Figma prototype created for onboarding flow
- [ ] First SwiftUI view translated from Figma Make output
- [ ] TTS synthesis working (button tap → speech output)
- [ ] PROJECT_CONTEXT.md reviewed and approved by user

---

## Document Maintenance

This `PROJECT_CONTEXT.md` should be updated when:
- New Swift frameworks or libraries are added
- Architecture patterns change (e.g., introducing Coordinator pattern)
- Major features are completed (update "Key Features" section)
- Performance requirements evolve (e.g., support 10,000+ buttons)
- New agents or workflows are introduced
- iOS version requirements change
- Figma Make workflow is refined

**Last Updated**: 2025-11-11 by Garden Guide Agent (Session: 20251111-112348-garden-guide-001)
