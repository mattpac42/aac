# AAC Communication Board - Cloud Sync & Collaboration (PRD-002)

## Overview

This PRD defines the cloud synchronization and multi-user collaboration system for the AAC Communication Board application. Building upon the baseline foundation (PRD-000) and local persistence (PRD-001), this feature enables real-time collaboration between speech pathologists, caregivers, and users to keep communication boards current and effective across all settings.

**Goal**: Enable real-time collaborative board management with secure authentication, role-based permissions, and automatic conflict resolution to empower speech pathologists and caregivers to remotely support AAC users without device access.

**Vision Reference**: This PRD implements Theme 2 (Collaborative Board Management) from `/Users/mattpacione/git/health_services/AAC/PRODUCT_VISION.md`, which envisions "real-time collaboration between speech pathologists, caregivers, and users to keep communication boards current and effective across all settings."

## Dependencies

### Required PRDs
- **PRD-000 (Baseline Foundation)**: Provides the existing React application architecture, component structure, and core vocabulary system
- **PRD-001 (Local Persistence)**: Establishes IndexedDB data persistence layer and schema that will be synced to cloud

### Technical Prerequisites
- Firebase project: `aac-ai-device` (already created)
- Firestore database provisioned in Firebase Console
- Firebase Authentication enabled with Email, Google, and Apple providers
- Firebase Security Rules configured for role-based access

## Goals

1. **Secure Multi-Provider Authentication**: Implement Firebase Auth with Email/Password, Google Sign-In, and Apple Sign-In (App Store requirement) with account linking for users who sign in with multiple methods
2. **Role-Based Permission System**: Enable three distinct user roles (User/Owner, Caregiver, Speech Pathologist) with appropriate access controls for board management
3. **Real-Time Synchronization**: Sync vocabulary boards, settings, and resources across all user devices and collaborators in real-time using Firestore
4. **Conflict-Free Collaboration**: Leverage Firestore's built-in real-time listeners and transactions for automatic conflict resolution during simultaneous edits
5. **Presence & Activity Tracking**: Show who's currently viewing/editing boards and provide an activity feed for audit trail and change notifications

## User Stories

### Primary User Stories (This PRD)

**Authentication & Account Management**

- **As a nonverbal user**, I want to sign up with my email or social accounts so that I can access my communication boards from any device
- **As a user**, I want to link multiple sign-in methods (email, Google, Apple) to my account so that I have flexible access options
- **As a user**, I want to reset my password if I forget it so that I can regain access to my account
- **As a user**, I want to sign out securely so that my boards remain private on shared devices

**Board Ownership & Sharing**

- **As a user (board owner)**, I want to invite caregivers and speech pathologists to collaborate on my board so that they can help me expand my vocabulary
- **As a user (board owner)**, I want to revoke collaborator access so that I control who can edit my communication boards
- **As a user (board owner)**, I want to see who has access to my board so that I know who can make changes

**Collaborative Editing - Caregiver Role**

- **As a caregiver**, I want to accept an invitation to a user's board so that I can support their communication needs
- **As a caregiver**, I want to add new words to categories remotely so that the user has vocabulary for new situations without waiting for device access
- **As a caregiver**, I want to edit existing words and customize colors so that the board matches the user's preferences
- **As a caregiver**, I want to see changes other collaborators make in real-time so that I don't duplicate work or create conflicts
- **As a caregiver**, I want to view the user's current board settings so that I understand their communication setup

**Collaborative Editing - Speech Pathologist Role**

- **As a speech pathologist**, I want to manage boards for multiple clients so that I can provide remote support efficiently
- **As a speech pathologist**, I want to add therapeutic vocabulary to client boards so that I can support their communication goals between sessions
- **As a speech pathologist**, I want to view usage analytics for client boards so that I can track progress and adjust therapy plans
- **As a speech pathologist**, I want to see an activity log of board changes so that I can understand vocabulary growth patterns
- **As a speech pathologist**, I want to create board templates that I can share with multiple clients so that I can standardize evidence-based vocabulary sets

**Real-Time Synchronization**

- **As any user**, I want my board changes to sync immediately across all my devices so that I always have the latest vocabulary
- **As any user**, I want to see a presence indicator showing who else is currently viewing the board so that I'm aware of concurrent editing
- **As any user**, I want to receive notifications when collaborators make changes so that I stay informed about board updates
- **As any user**, I want automatic conflict resolution if multiple people edit simultaneously so that no changes are lost

### Future User Stories (Not Yet Implemented)

- **As a speech pathologist**, I want to create a shared vocabulary marketplace so that I can share evidence-based board templates with the community (PRD-003+)
- **As a user**, I want to export my board history so that I can create communication progress reports (PRD-003+)
- **As a user**, I want offline editing that syncs when reconnected so that I can use my board anywhere (PRD-001 + PRD-002 enhancement)

## Functional Requirements

### Authentication System

1. **The system must support Firebase Authentication with three sign-in methods**: Email/Password, Google Sign-In, Apple Sign-In
2. **Email/Password authentication must include**:
   - Email validation (valid format, unique in system)
   - Password requirements (minimum 8 characters, must include uppercase, lowercase, number)
   - Email verification flow (send verification email on signup)
   - Password reset flow (send password reset link, allow new password creation)
3. **Google Sign-In must**:
   - Use Firebase Google provider
   - Request email and profile scope
   - Auto-create user profile on first sign-in
4. **Apple Sign-In must**:
   - Use Firebase Apple provider (required for App Store submission)
   - Handle email-hidden flow (user can hide email from app)
   - Support both web and iOS native flows
5. **Account linking must allow users to**:
   - Link Email/Password to existing Google/Apple account
   - Link Google to existing Email/Apple account
   - Link Apple to existing Email/Google account
   - View all linked providers in account settings
   - Unlink providers while maintaining at least one active sign-in method
6. **The system must create user profile documents in Firestore** on first authentication with default role "user"
7. **The system must maintain authentication state** across page reloads using Firebase persistence
8. **The system must provide sign-out functionality** that clears local auth state and returns to sign-in screen

### User Profile & Role System

9. **The system must create a Users collection in Firestore** with documents containing:
   - `uid`: Firebase Auth UID (document ID)
   - `email`: Primary email address
   - `displayName`: User's display name
   - `role`: Enum ['user', 'caregiver', 'speech-pathologist']
   - `createdAt`: Timestamp of account creation
   - `lastSignIn`: Timestamp of most recent sign-in
   - `linkedProviders`: Array of provider IDs (password, google.com, apple.com)
10. **The system must support three user roles with distinct permissions**:
    - **User (Owner)**: Full control over their own boards, can invite collaborators, can delete account
    - **Caregiver**: Can edit vocabulary and settings, cannot delete boards or revoke owner access
    - **Speech Pathologist**: Can edit vocabulary, view analytics, manage multiple client boards
11. **Users must be able to update their profile** (displayName, email with re-authentication)
12. **The system must track user activity** (lastSignIn timestamp) for presence features

### Board Ownership & Sharing System

13. **The system must create a Boards collection in Firestore** with documents containing:
    - `boardId`: Unique board identifier (document ID)
    - `ownerId`: Firebase UID of board owner
    - `ownerEmail`: Owner's email for display
    - `boardName`: Display name for the board
    - `createdAt`: Timestamp of board creation
    - `updatedAt`: Timestamp of last modification
    - `coreWords`: Array of core vocabulary items (synced from IndexedDB)
    - `categoryWords`: Map of category name to word arrays (synced from IndexedDB)
    - `wordTypeColors`: Color theme object (synced from IndexedDB)
    - `resources`: Array of educational resources (synced from IndexedDB)
    - `settings`: User preferences object (voice, volume, grid layout)
14. **Each board must maintain a subcollection `collaborators`** with documents containing:
    - `userId`: Firebase UID of collaborator
    - `email`: Collaborator's email for display
    - `role`: Enum ['owner', 'caregiver', 'speech-pathologist']
    - `invitedBy`: UID of user who sent invitation
    - `invitedAt`: Timestamp of invitation
    - `acceptedAt`: Timestamp when invitation was accepted
    - `permissions`: Object defining edit/view capabilities
15. **The system must allow board owners to**:
    - Invite collaborators by email address
    - Assign role (caregiver or speech-pathologist) during invitation
    - View list of all current collaborators
    - Revoke collaborator access (remove from collaborators subcollection)
    - Transfer board ownership to another collaborator
    - Delete their own board entirely
16. **The system must create invitations as pending documents** in a global `invitations` collection until accepted
17. **Invitations must include**:
    - `invitationId`: Unique identifier
    - `boardId`: Board being shared
    - `boardName`: Display name of board
    - `inviterEmail`: Email of person who sent invitation
    - `inviteeEmail`: Email of person being invited
    - `role`: Role being granted (caregiver or speech-pathologist)
    - `status`: Enum ['pending', 'accepted', 'rejected', 'expired']
    - `createdAt`: Timestamp of invitation creation
    - `expiresAt`: Timestamp when invitation expires (7 days default)
18. **Invitations must be accepted explicitly** by the invitee before granting board access

### Real-Time Synchronization

19. **The system must sync all board data to Firestore** whenever local IndexedDB changes occur:
    - Core vocabulary additions/edits/deletions
    - Category vocabulary additions/edits/deletions
    - Color theme customizations
    - Resource additions/deletions
    - Settings changes
20. **The system must use Firestore real-time listeners** to update local state when remote changes occur
21. **Sync operations must be bidirectional**:
    - Local changes → Firestore (via `setDoc`, `updateDoc`, `deleteDoc`)
    - Firestore changes → Local IndexedDB → React state
22. **The system must handle sync failures gracefully**:
    - Retry failed operations with exponential backoff
    - Queue local changes if offline, sync when reconnected
    - Display sync status indicator (synced, syncing, offline, error)
23. **The system must use Firestore transactions** for operations requiring consistency:
    - Adding/removing collaborators
    - Transferring board ownership
    - Simultaneous word additions by multiple users
24. **The system must maintain eventual consistency** between local IndexedDB and Firestore

### Conflict Resolution

25. **The system must use Firestore's built-in conflict resolution** for real-time updates (last-write-wins with timestamps)
26. **For array operations (adding words), the system must**:
    - Use array union operations to prevent duplicates
    - Generate unique IDs for each word to enable precise updates/deletions
    - Use transactions for atomic array modifications
27. **For object updates (color themes), the system must**:
    - Use shallow merge operations to preserve unchanged fields
    - Include updatedAt timestamp to track modification order
28. **The system must detect and handle concurrent deletions**:
    - If user A deletes word X and user B edits word X simultaneously, deletion takes precedence
    - Display notification to user B that their edit was on a deleted item
29. **The system must provide activity feed** showing recent changes with:
    - User who made the change
    - Type of change (added word, deleted word, changed color, etc.)
    - Timestamp of change
    - Affected item (word text, category name, etc.)

### Presence & Activity Tracking

30. **The system must track active users** viewing each board using Firestore presence system:
    - Use `onDisconnect()` to remove user from active viewers on disconnect
    - Display avatars/names of currently active viewers at top of board
    - Show "editing" indicator when user is actively modifying board
31. **The system must create an activity log subcollection** for each board with documents containing:
    - `activityId`: Unique identifier
    - `userId`: UID of user who made change
    - `userEmail`: Email for display
    - `actionType`: Enum ['word-added', 'word-edited', 'word-deleted', 'color-changed', 'resource-added', 'resource-deleted', 'collaborator-added', 'collaborator-removed']
    - `actionDetails`: Object with specifics (word text, category, old/new values)
    - `timestamp`: When action occurred
32. **The activity log must be limited** to most recent 100 entries per board (use Firestore TTL or cleanup function)
33. **The system must send push notifications** (future enhancement - placeholder for now) when:
    - New collaborator added to board
    - Vocabulary words added by collaborator
    - Board settings changed by owner
34. **The system must display unread activity count** since user's last board view

### Permissions & Security

35. **The system must implement Firestore Security Rules** enforcing:
    - Users can only read/write their own user profile
    - Users can read/write boards they own
    - Users can read/write boards where they are collaborators
    - Caregivers can edit vocabulary and settings but cannot delete boards
    - Speech pathologists can edit vocabulary and read activity logs
    - Only owners can add/remove collaborators
    - Only owners can delete boards
36. **The system must validate all user input** before writing to Firestore:
    - Email format validation for invitations
    - Role enum validation
    - Word text length limits (max 50 characters)
    - Category name limits (max 30 characters)
37. **The system must rate-limit write operations** to prevent abuse:
    - Max 10 word additions per minute per user
    - Max 5 collaborator invitations per day per board
    - Max 3 board creations per day per user
38. **The system must sanitize user-generated content** to prevent XSS attacks:
    - Escape HTML in word text, board names, display names
    - Validate URL format for resource links

## Non-Goals (Out of Scope for This PRD)

The following features are related to cloud sync but NOT implemented in this PRD:

### Deferred to Future PRDs
- **Shared Vocabulary Marketplace**: Public template sharing requires content moderation, search, ratings (PRD-003+)
- **Board Version History**: Full change history with rollback requires significant storage architecture (PRD-003+)
- **Offline-First Sync**: Advanced offline editing with conflict resolution UI requires IndexedDB queue system (PRD-001 enhancement)
- **Real-Time Messaging**: Chat between collaborators requires messaging infrastructure (PRD-004+)
- **Advanced Analytics**: Usage metrics (word frequency, session duration) require analytics schema (PRD-005+)
- **Multi-Board Management UI**: Speech pathologist dashboard for managing many clients requires specialized UI (PRD-003+)
- **Board Templates**: Pre-built vocabulary sets require content creation and categorization (PRD-003+)
- **Export/Import Functionality**: Board backup/restore requires serialization format design (PRD-003+)

### Explicitly Out of Scope
- **Video calling for remote sessions**: Requires WebRTC infrastructure, out of scope for AAC app
- **Payment/subscription system**: No monetization in initial releases
- **Third-party integrations**: No API for external apps to access boards
- **Custom authentication backend**: Using Firebase Auth, not building custom solution

## Design Considerations

### UI/UX Design

**Authentication Screens**:
- Clean sign-in screen with three prominent buttons (Email, Google, Apple)
- Minimal friction: Google/Apple are one-click sign-in, email requires only email/password
- Password reset link clearly visible on sign-in screen
- Account linking accessible from Settings → Account screen
- Consistent branding with existing AAC app design (Tailwind slate palette)

**Collaboration Management UI**:
- Settings → Collaborators screen shows list of current collaborators with role badges
- "+ Invite Collaborator" button opens modal with email input and role selection
- Each collaborator entry has "Remove Access" button (confirmation required)
- Invitation status indicator (Pending, Active)
- Clear visual distinction between Owner, Caregiver, Speech Pathologist roles (color-coded badges)

**Presence Indicators**:
- Top bar of board shows small avatar circles for active viewers
- Hover/tap on avatar shows name and "Viewing" or "Editing" status
- Your own avatar highlighted with border
- Max 5 avatars shown, "+3 more" if additional viewers

**Activity Feed**:
- Accessible via Settings → Activity screen
- Chronological list with most recent at top
- Each entry shows: avatar, name, action description, timestamp
- Grouping of related actions (e.g., "Jordan added 5 words to Food category")
- Filter by action type (All, Words Added, Words Edited, Colors Changed, Collaborators)
- Unread badge on Settings icon when new activity since last view

**Sync Status Indicator**:
- Small icon in top corner showing sync state:
  - Green checkmark: Synced
  - Blue spinner: Syncing...
  - Gray cloud with slash: Offline (will sync when reconnected)
  - Red exclamation: Sync error (tap for details)

### Integration Points

**Firebase Services**:
- **Firebase Authentication**: User sign-in, account management, session persistence
- **Firestore Database**: Real-time NoSQL database for boards, users, collaborators, activity logs
- **Firebase Cloud Functions** (future): Server-side triggers for notifications, invitation expiry, data validation
- **Firebase Cloud Messaging** (future): Push notifications for collaborator activity

**Existing Application Integration**:
- Sync layer sits between React state and IndexedDB (from PRD-001)
- When IndexedDB writes occur, trigger Firestore write
- When Firestore listener fires, update IndexedDB and React state
- Authentication state stored in React Context, accessible throughout app

**IndexedDB to Firestore Mapping**:
```
IndexedDB Store "boards" → Firestore Collection "boards"
  - Local board object → Firestore board document
  - coreWords array → boardDoc.coreWords array
  - categoryWords object → boardDoc.categoryWords map
  - wordTypeColors object → boardDoc.wordTypeColors object
  - resources array → boardDoc.resources array
```

## Technical Considerations

### Architecture Overview

**Authentication Flow**:
1. User clicks sign-in button (Email/Google/Apple)
2. Firebase Auth handles provider-specific flow
3. On success, Firebase returns user credential with UID
4. App checks if user profile exists in Firestore `users` collection
5. If new user, create profile document with default role "user"
6. If existing user, update `lastSignIn` timestamp
7. Store auth state in React Context for app-wide access
8. Redirect to main board screen

**Board Creation Flow**:
1. On first sign-in, automatically create default board for user
2. Create Firestore document in `boards` collection with user as owner
3. Initialize board with default core/category words from baseline (PRD-000)
4. Create IndexedDB entry mirroring Firestore structure
5. Set up real-time listener for board document

**Collaboration Invitation Flow**:
1. Owner enters collaborator email and selects role (caregiver or speech-pathologist)
2. App creates document in `invitations` collection with status "pending"
3. Invitee receives email notification with link to accept invitation
4. When invitee clicks link and signs in, app shows invitation details
5. On acceptance, app adds invitee to board's `collaborators` subcollection
6. Updates invitation status to "accepted"
7. Invitee now sees board in their "Shared with Me" section

**Real-Time Sync Flow**:
1. User makes local change (e.g., adds word to core vocabulary)
2. App updates React state immediately (optimistic update)
3. App writes to IndexedDB for local persistence
4. App writes to Firestore board document using `updateDoc`
5. Firestore broadcasts change to all listeners (including user's other devices)
6. Other collaborators' apps receive change via Firestore listener
7. Listener callback updates their IndexedDB and React state
8. UI reflects change in real-time

### Data Schema

**Firestore Collections Structure**:

```typescript
// Users Collection
interface User {
  uid: string;                    // Firebase Auth UID (document ID)
  email: string;                  // Primary email
  displayName: string;            // User's display name
  role: 'user' | 'caregiver' | 'speech-pathologist';
  createdAt: Timestamp;           // Account creation
  lastSignIn: Timestamp;          // Most recent sign-in
  linkedProviders: string[];      // ['password', 'google.com', 'apple.com']
  photoURL?: string;              // Profile photo URL (from provider)
}

// Boards Collection
interface Board {
  boardId: string;                // Document ID
  ownerId: string;                // Firebase UID of owner
  ownerEmail: string;             // Owner's email for display
  boardName: string;              // Display name
  createdAt: Timestamp;           // Board creation
  updatedAt: Timestamp;           // Last modification
  coreWords: Word[];              // Core vocabulary (from PRD-000)
  categoryWords: {                // Category-specific vocabulary
    [category: string]: CategoryWord[];
  };
  wordTypeColors: WordTypeColors; // Color theme (from PRD-000)
  resources: Resource[];          // Educational resources (from PRD-000)
  settings: {                     // User preferences
    voice: string;
    volume: number;
    rate: number;
    pitch: number;
    gridSize: string;
  };
}

// Boards/{boardId}/collaborators Subcollection
interface Collaborator {
  userId: string;                 // Firebase UID (document ID)
  email: string;                  // Collaborator's email
  role: 'owner' | 'caregiver' | 'speech-pathologist';
  invitedBy: string;              // UID of inviter
  invitedAt: Timestamp;           // Invitation timestamp
  acceptedAt: Timestamp;          // Acceptance timestamp
  permissions: {
    canEditVocabulary: boolean;
    canEditSettings: boolean;
    canViewAnalytics: boolean;
    canDeleteBoard: boolean;
    canManageCollaborators: boolean;
  };
}

// Invitations Collection
interface Invitation {
  invitationId: string;           // Document ID
  boardId: string;                // Board being shared
  boardName: string;              // Display name
  inviterEmail: string;           // Inviter's email
  inviteeEmail: string;           // Invitee's email
  role: 'caregiver' | 'speech-pathologist';
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Timestamp;           // Creation timestamp
  expiresAt: Timestamp;           // Expiry (7 days default)
}

// Boards/{boardId}/activity Subcollection
interface Activity {
  activityId: string;             // Document ID
  userId: string;                 // User who made change
  userEmail: string;              // For display
  actionType: 'word-added' | 'word-edited' | 'word-deleted' |
              'color-changed' | 'resource-added' | 'resource-deleted' |
              'collaborator-added' | 'collaborator-removed';
  actionDetails: {                // Action-specific data
    wordText?: string;
    category?: string;
    oldValue?: any;
    newValue?: any;
  };
  timestamp: Timestamp;           // When action occurred
}

// Boards/{boardId}/presence Subcollection
interface Presence {
  userId: string;                 // User currently viewing (document ID)
  userEmail: string;              // For display
  status: 'viewing' | 'editing';  // Current activity
  lastActive: Timestamp;          // Last activity timestamp
}
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isBoardOwner(boardId) {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/boards/$(boardId)).data.ownerId == request.auth.uid;
    }

    function isCollaborator(boardId) {
      return isAuthenticated() &&
             exists(/databases/$(database)/documents/boards/$(boardId)/collaborators/$(request.auth.uid));
    }

    function hasRole(boardId, role) {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/boards/$(boardId)/collaborators/$(request.auth.uid)).data.role == role;
    }

    // Users collection - users can only read/write their own profile
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if isOwner(userId);
    }

    // Boards collection
    match /boards/{boardId} {
      // Owners and collaborators can read
      allow read: if isBoardOwner(boardId) || isCollaborator(boardId);

      // Only authenticated users can create their own boards
      allow create: if isAuthenticated() && request.resource.data.ownerId == request.auth.uid;

      // Owners can update and delete
      allow update: if isBoardOwner(boardId);
      allow delete: if isBoardOwner(boardId);

      // Collaborators subcollection
      match /collaborators/{collaboratorId} {
        // Anyone on the board can read collaborator list
        allow read: if isBoardOwner(boardId) || isCollaborator(boardId);

        // Only owner can add/remove collaborators
        allow create, delete: if isBoardOwner(boardId);

        // Owner can update collaborator permissions
        allow update: if isBoardOwner(boardId);
      }

      // Activity subcollection
      match /activity/{activityId} {
        // Anyone on the board can read activity
        allow read: if isBoardOwner(boardId) || isCollaborator(boardId);

        // System creates activity logs (via Cloud Functions)
        allow create: if isAuthenticated();

        // No one can update or delete activity logs (audit trail)
        allow update, delete: if false;
      }

      // Presence subcollection
      match /presence/{userId} {
        // Anyone on the board can read presence
        allow read: if isBoardOwner(boardId) || isCollaborator(boardId);

        // Users can update their own presence
        allow create, update: if isOwner(userId);
        allow delete: if isOwner(userId);
      }
    }

    // Invitations collection
    match /invitations/{invitationId} {
      // Inviter and invitee can read invitation
      allow read: if isAuthenticated() &&
                     (request.auth.token.email == resource.data.inviterEmail ||
                      request.auth.token.email == resource.data.inviteeEmail);

      // Board owners can create invitations
      allow create: if isAuthenticated();

      // Invitees can update to accept/reject
      allow update: if isAuthenticated() &&
                       request.auth.token.email == resource.data.inviteeEmail;

      // Inviters can delete pending invitations
      allow delete: if isAuthenticated() &&
                       request.auth.token.email == resource.data.inviterEmail;
    }
  }
}
```

### Sync Strategy

**Optimistic Updates**:
- All local changes update React state immediately for instant UI feedback
- Write to IndexedDB synchronously (fast, local operation)
- Write to Firestore asynchronously (may take 200-500ms)
- If Firestore write fails, rollback React state and show error

**Conflict Resolution Strategy**:
- **Last-write-wins** for scalar values (board name, settings)
- **Array union** for adding items (words, resources)
- **Transactions** for array item updates/deletions to prevent race conditions
- **Timestamps** to determine write order (`updatedAt` field)

**Offline Handling**:
- Firestore SDK automatically queues writes when offline
- When reconnected, queued writes execute in order
- Optimistic updates remain in UI until confirmed
- Show "Offline" indicator in sync status
- Conflicts resolved server-side using timestamps

### Implementation Phases

**Phase 1: Authentication (Week 1-2)**
- Implement Firebase Auth with Email/Password provider
- Build sign-in, sign-up, password reset screens
- Create user profile creation flow
- Add authentication state management with React Context
- Implement sign-out functionality

**Phase 2: Google & Apple Sign-In (Week 2-3)**
- Add Google Sign-In provider configuration
- Add Apple Sign-In provider configuration (iOS and web)
- Implement account linking UI in Settings
- Handle edge cases (email-hidden Apple accounts)
- Test all provider combinations

**Phase 3: Board Ownership (Week 3-4)**
- Create Firestore boards collection schema
- Implement automatic board creation on first sign-in
- Sync local IndexedDB data to Firestore on board creation
- Set up real-time listener for board document
- Implement bidirectional sync (local ↔ Firestore)

**Phase 4: Collaboration System (Week 4-6)**
- Build invitation creation flow (UI + Firestore writes)
- Implement invitation acceptance flow
- Create collaborators subcollection management
- Build collaborators list UI in Settings
- Implement role-based permission checks in UI

**Phase 5: Real-Time Sync (Week 6-7)**
- Implement Firestore listeners for all board data
- Add sync status indicator UI
- Handle conflict resolution for array operations
- Implement retry logic for failed writes
- Add error handling and user feedback

**Phase 6: Presence & Activity (Week 7-8)**
- Implement presence tracking with onDisconnect
- Build presence indicator UI (active viewer avatars)
- Create activity logging for all board changes
- Build activity feed UI in Settings
- Add unread activity badge

**Phase 7: Security & Testing (Week 8-9)**
- Implement Firestore Security Rules
- Add input validation and sanitization
- Implement rate limiting
- Comprehensive testing of all collaboration scenarios
- Edge case testing (offline, conflicts, errors)

### Constraints & Limitations

**Technical Constraints**:
- **Firestore Limits**: Max document size 1MB (boards with 1000+ words may approach limit)
- **Write Rate Limits**: Max 1 write/second per document (concurrent edits may be throttled)
- **Offline Storage**: Firestore offline cache limited to 40MB by default
- **Authentication Providers**: Apple Sign-In requires enrollment in Apple Developer Program

**Performance Constraints**:
- Real-time listener latency: 100-500ms for remote updates
- Firestore write latency: 200-1000ms depending on network
- Presence updates: ~1 second delay for showing active viewers
- Activity log query: Limited to 100 most recent entries to prevent slow queries

**UX Constraints**:
- Invitation acceptance requires invitee to have account (or create one)
- Collaborators must accept invitations explicitly (can't auto-add to boards)
- Activity feed may not capture every granular change (batch related changes)
- Presence indicators limited to 5 visible avatars to prevent UI clutter

**Business Constraints**:
- Free Firebase tier limits: 50K reads/day, 20K writes/day (may require paid plan for production)
- Apple Sign-In required for App Store, but may not be available on Android/web initially

## Success Metrics

### Primary Success Criteria

This PRD is considered successful if:

1. **Authentication Success Rate**: 95%+ of sign-up/sign-in attempts succeed on first try
2. **Account Linking Adoption**: 30%+ of users link at least 2 sign-in providers within first month
3. **Collaboration Adoption**: 50%+ of users invite at least 1 collaborator within first 2 weeks
4. **Real-Time Sync Reliability**: 99%+ of local changes sync to Firestore successfully within 5 seconds
5. **Conflict Resolution**: Zero data loss in concurrent editing scenarios (verified via testing)
6. **Speech Pathologist Engagement**: 70%+ of speech pathologists manage 2+ client boards within first month

### Key Performance Indicators (KPIs)

| KPI | Target (3 months) | Target (6 months) | Measurement Method |
|-----|------------------|-------------------|-------------------|
| Active Collaborators per Board | 1.5 avg | 2.5 avg | Firestore query on collaborators subcollection |
| Sync Latency (p95) | < 1 second | < 500ms | Client-side performance monitoring |
| Invitation Acceptance Rate | 70% | 80% | Invitations accepted / invitations sent |
| Active Multi-Device Users | 30% | 50% | Users signing in from 2+ devices |
| Collaborative Edit Sessions/Week | 5 per board | 10 per board | Activity log analysis |
| Activity Feed Engagement | 40% view weekly | 60% view weekly | Analytics on Activity screen views |

### User Satisfaction Metrics

- **Speech Pathologist NPS**: Target 60+ by month 6 (from survey on collaboration features)
- **Collaboration Ease Score**: Target 4.5/5 from caregivers on "How easy is it to edit client boards remotely?"
- **Sync Reliability Score**: Target 4.7/5 from users on "Do your changes sync reliably across devices?"
- **Time Saved**: Target 2 hours/week saved by speech pathologists using remote board management (vs. in-person updates)

### Technical Performance Metrics

- **Firestore Write Success Rate**: 99.5%+ (failed writes require retry)
- **Authentication Uptime**: 99.9%+ (Firebase Auth SLA)
- **Sync Conflict Rate**: < 0.1% of all edits result in conflicts requiring resolution
- **Presence Update Latency**: 90% of presence changes visible within 2 seconds

## Open Questions

### Authentication & Security

- [ ] **Account Deletion**: What happens to boards when owner deletes account? Auto-transfer to collaborator or delete entirely?
- [ ] **Email Change**: Should changing email require re-verification? How to handle in collaborator lists?
- [ ] **Session Timeout**: What inactivity period should trigger re-authentication? (24 hours? 7 days? Never?)
- [ ] **Two-Factor Authentication**: Should we implement 2FA for speech pathologists managing sensitive client data?

### Collaboration Mechanics

- [ ] **Collaborator Limits**: What's the max number of collaborators per board? (5? 10? Unlimited?)
- [ ] **Invitation Expiry**: Should invitations expire? If so, after how long? (7 days default, configurable?)
- [ ] **Role Permissions**: Should caregivers be able to view activity logs, or only speech pathologists?
- [ ] **Notification Preferences**: What activity should trigger notifications? (All changes? Only major changes? User-configurable?)

### Sync & Conflict Resolution

- [ ] **Large Boards**: How to handle boards approaching 1MB Firestore document limit? (Shard into multiple documents?)
- [ ] **Sync Frequency**: Should we batch rapid changes (e.g., wait 500ms after last edit) or sync every change immediately?
- [ ] **Offline Editing**: Should offline edits be allowed, or block editing when offline and show read-only mode?
- [ ] **Merge Conflicts**: If last-write-wins fails (e.g., simultaneous category deletion), show conflict UI or auto-resolve?

### Analytics & Activity

- [ ] **Activity Log Retention**: Keep last 100 entries, or time-based (last 30 days)?
- [ ] **Usage Analytics**: Should speech pathologists see word frequency, session duration, etc.? (Privacy implications)
- [ ] **Export Activity**: Should users be able to export activity logs for progress reports?

## Mapping to Product Vision Themes

### Theme 2: Collaborative Board Management (PRIMARY FOCUS)

**Vision Statement**: "Enable real-time collaboration between speech pathologists, caregivers, and users to keep communication boards current and effective across all settings."

**This PRD Implements**:
- ✅ Cloud-based board synchronization across devices
- ✅ User authentication system (Email, Google, Apple)
- ✅ Remote board editing by speech pathologists and caregivers
- ✅ Role-based permissions (user, caregiver, speech-pathologist)
- ✅ Real-time multi-user collaboration with Firestore
- ✅ Change notifications via activity feed
- ✅ Board version tracking (via activity log)
- ❌ Shared vocabulary library and template marketplace (deferred to PRD-003+)

**Vision Alignment**: This PRD fully delivers the core collaborative board management features, enabling speech pathologists to update client boards remotely and caregivers to add vocabulary on-the-fly. The deferred features (template marketplace) are valuable but not critical for MVP collaboration.

### Theme 5: User-Friendly Experience (SUPPORTING FOCUS)

**Vision Statement**: "Create an interface so intuitive that speech pathologists, users, and families can learn it quickly and use it confidently."

**This PRD Supports**:
- ✅ One-click Google/Apple Sign-In for minimal friction
- ✅ Clear presence indicators showing who's collaborating
- ✅ Real-time sync status indicator for user confidence
- ✅ Activity feed for transparency and change awareness
- ✅ Simple invitation flow (email + role selection)

**Vision Alignment**: Authentication and collaboration UI designed to be intuitive and low-friction, aligning with ease-of-use principle.

## Next Steps & Recommendations

### Immediate Actions (Before Development)

1. **Firebase Project Configuration** (Owner: Platform Engineer, Due: Week 1 Day 1)
   - Enable Firestore in Firebase Console for `aac-ai-device` project
   - Enable Firebase Authentication with Email, Google, Apple providers
   - Configure OAuth consent screens for Google/Apple
   - Set up Firebase Admin SDK for local development

2. **Apple Developer Enrollment** (Owner: Product Team, Due: Week 1)
   - Enroll in Apple Developer Program (required for Apple Sign-In)
   - Configure Apple Sign-In capability in App ID
   - Generate Apple Sign-In key for Firebase

3. **Security Rules Review** (Owner: Security Engineer, Due: Week 2)
   - Review proposed Firestore Security Rules for vulnerabilities
   - Add additional validation rules for edge cases
   - Test rules with Firebase Emulator Suite

4. **Design Mockups** (Owner: UX Designer, Due: Week 2)
   - Create high-fidelity mockups for authentication screens
   - Design collaborator management UI
   - Design presence indicators and activity feed
   - Get user feedback from speech pathologist advisory group

### Implementation Sequence

**Sprint 1-2 (Weeks 1-4): Authentication & Board Ownership**
- Implement Email/Password authentication
- Add Google and Apple Sign-In
- Build user profile system
- Create automatic board creation on first sign-in
- Set up basic Firestore sync

**Sprint 3-4 (Weeks 5-8): Collaboration System**
- Build invitation creation and acceptance flows
- Implement role-based permissions
- Create collaborator management UI
- Add real-time sync for vocabulary changes
- Implement presence tracking

**Sprint 5 (Weeks 9-10): Activity & Polish**
- Build activity log system
- Create activity feed UI
- Add sync status indicators
- Implement error handling and retry logic
- Comprehensive testing and bug fixes

### Future Enhancements (Post-MVP)

**PRD-003: Shared Vocabulary Marketplace**
- Public board template sharing
- Template search and discovery
- Rating and review system
- Content moderation

**PRD-004: Advanced Analytics**
- Word frequency tracking
- Session duration metrics
- Communication growth reports
- Speech pathologist dashboard

**PRD-005: Offline-First Architecture**
- Enhanced offline editing with conflict UI
- Smart sync batching
- Background sync workers
- Offline indicator improvements

### Testing Requirements

**Unit Tests** (TDD - Write tests first):
- Authentication flows (sign-up, sign-in, sign-out, password reset)
- Account linking logic
- Invitation creation and acceptance
- Permission validation
- Sync conflict resolution

**Integration Tests**:
- End-to-end collaboration scenario (invite → accept → edit → sync)
- Multi-device sync (simulate 2 devices editing simultaneously)
- Offline editing and reconnection
- Firestore Security Rules enforcement

**User Acceptance Testing**:
- Speech pathologist beta testers create and manage client boards
- Caregivers accept invitations and add vocabulary remotely
- Users observe real-time sync across devices
- Validate presence indicators and activity feed accuracy

---

**Created**: 2025-12-08
**Author**: Tactical Product Manager Agent
**Status**: Draft - Awaiting Approval
**PRD Number**: 002 (Cloud Sync & Collaboration)
**Related Documents**:
- `/Users/mattpacione/git/health_services/AAC/PRODUCT_VISION.md` (Product Vision - Theme 2)
- `/.claude/tasks/1_backlog/000-baseline-foundation/prd-000-baseline-foundation.md` (Baseline Foundation)
- `/.claude/tasks/1_backlog/001-local-persistence/prd-001-local-persistence.md` (Local Persistence - Dependency)
- `/.claude/tasks/project-status.md` (Project Status Tracking)
