# Intelligent Communication Assistance (On-Device AI) - Product Requirements Document

## Overview

This PRD implements Theme 3 (Intelligent Communication Assistance) from the Product Vision by adding AI-powered word prediction and context-aware suggestions to accelerate communication while maintaining complete user privacy and offline functionality. Using on-device machine learning with TensorFlow.js, the system learns from individual usage patterns to predict likely next words based on frequency, n-grams, time-of-day contexts, and category awareness—without ever sending data to external servers.

**Goal**: Speed up communication by 30-50% through intelligent word prediction while keeping all learning data on-device, respecting user privacy, and maintaining full offline functionality with adaptive performance that balances speed and accuracy based on prediction complexity.

**Vision Alignment**: This PRD directly implements:
- **Theme 3: Intelligent Communication Assistance** - AI-powered word prediction, context-aware suggestions, personalized learning
- **Theme 5: User-Friendly Experience** - Offline functionality, user control, simple defaults with advanced options

**Architectural Decision**: Privacy-first on-device ML only, with opt-in cloud sync for cross-device learning (patterns only, never raw conversations).

## Goals

1. **Accelerate Communication**: Reduce average button presses per message by 30-50% through accurate word prediction
2. **Maintain Complete Privacy**: All ML models and training data stay on-device; no conversation content ever leaves the device
3. **Ensure Offline Functionality**: Prediction models work 100% offline without internet dependency
4. **Enable Cross-Device Learning (Opt-in)**: Sync usage patterns (not conversations) to Firestore for shared learning across user's devices and speech pathologist access
5. **Deliver Adaptive Performance**: Fast predictions (<50ms) for simple frequency-based suggestions, slower but smarter predictions (100-200ms) for complex n-gram context
6. **Preserve User Autonomy**: Simple on/off toggle with sane defaults, advanced controls hidden for power users

## User Stories

### Core Word Prediction

- **As a nonverbal user**, I want the app to predict my next word based on what I've said before so that I can communicate faster with fewer button presses
- **As a nonverbal user**, I want frequently used words to appear first in suggestions so that I can access my most common phrases quickly
- **As a nonverbal user**, I want predictions based on time of day (breakfast words in morning, bedtime words at night) so that suggestions match my current context
- **As a caregiver**, I want the prediction system to learn the user's unique communication patterns so that it becomes more helpful over time

### Context-Aware Suggestions

- **As a nonverbal user**, I want the app to predict likely word sequences (like "I want" → "food", "water", "help") so that I can complete common phrases quickly
- **As a nonverbal user**, I want category-aware predictions (when in Food category, predict food words) so that suggestions stay relevant to my current context
- **As a speech pathologist**, I want predictions based on sentence structure (pronoun → verb → noun patterns) so that clients build grammatically coherent messages

### Privacy & Cross-Device Learning

- **As a privacy-conscious user**, I want all prediction data stored locally on my device so that my conversations remain completely private
- **As a user with multiple devices**, I want to opt-in to syncing my usage patterns (not conversations) across devices so that all my AAC boards benefit from the same learning
- **As a speech pathologist**, I want to view my client's aggregated prediction data (word frequencies, common phrases) so that I can understand their communication patterns and optimize their board
- **As a caregiver**, I want the user's learning to transfer when they get a new device so that they don't lose months of personalized predictions

### User Control & Customization

- **As a nonverbal user**, I want a simple on/off toggle for predictions so that I can disable them if they become distracting
- **As a power user**, I want to adjust prediction sensitivity (how many suggestions shown, minimum confidence threshold) so that I can fine-tune the experience
- **As a privacy-focused user**, I want to clear all learned patterns with one button so that I can reset if my communication needs change
- **As a user**, I want to export/import my prediction data so that I can back it up or transfer it independently from my vocabulary

### Performance & Reliability

- **As a nonverbal user**, I want simple predictions to appear instantly (<50ms) so that they don't slow down my communication flow
- **As a user**, I want to see a loading indicator for complex predictions (100-200ms) so that I know the app is thinking and not frozen
- **As a caregiver**, I want predictions to work offline so that the user can communicate anywhere without internet dependency

## Functional Requirements

### On-Device Machine Learning Foundation

1. **The system must implement TensorFlow.js for client-side ML** with models stored in IndexedDB for offline access
2. **The system must track usage data locally** including word selection frequency, n-gram sequences (2-4 words), time-of-day contexts, and category contexts
3. **The system must train ML models on-device** using background processing (Web Workers) to avoid blocking the UI
4. **The system must never send conversation content to external servers** (privacy-first architecture)
5. **The system must store all ML models and training data in IndexedDB** for persistence and offline functionality
6. **The system must implement incremental learning** where models update after each communication session (batch updates, not real-time)

### Word Frequency Prediction

7. **The system must track word selection frequency** with decay over time (recent usage weighted higher than old usage)
8. **The system must surface frequently used words first** in prediction UI (top 3-5 most likely words)
9. **The system must provide frequency-based predictions within 50ms** (simple lookup, no complex computation)
10. **The system must normalize frequency by word type** (compare verb frequency among verbs, noun frequency among nouns)
11. **The system must implement cold-start handling** for new users (fall back to baseline frequency from all users if opted-in to anonymized data)

### N-Gram Context Prediction

12. **The system must track 2-gram, 3-gram, and 4-gram sequences** (e.g., "I want" → "food", "I want food" → specific items)
13. **The system must predict next word based on previous 1-3 words** in current message composition
14. **The system must provide n-gram predictions within 100-200ms** (more complex than frequency lookup)
15. **The system must display visual loading indicator** (subtle spinner) for predictions taking >50ms
16. **The system must fall back to frequency-based prediction** if no n-gram matches found
17. **The system must limit n-gram storage** to top 500 most common sequences (storage efficiency)

### Time-of-Day Context Awareness

18. **The system must associate words with time-of-day contexts** (morning: 6-11am, afternoon: 11am-5pm, evening: 5-10pm, night: 10pm-6am)
19. **The system must boost predictions for time-appropriate words** (breakfast words in morning, bedtime words at night)
20. **The system must require minimum 10 occurrences** of word in time slot before applying time-based boosting (avoid false patterns)
21. **The system must combine time context with frequency/n-gram predictions** (weighted ensemble model)

### Category Context Awareness

22. **The system must track which categories user is in** when selecting words
23. **The system must boost predictions for words in current category** (when in Food category, predict food words higher)
24. **The system must learn cross-category patterns** (e.g., "I want" often followed by switch to Food category)
25. **The system must surface "frequently paired" words** from different categories (e.g., "help" pronoun often followed by "bathroom" from Places)

### Prediction UI Integration

26. **The system must display top 3-5 predicted words** in a dedicated prediction bar above the message composition area
27. **The system must visually distinguish predicted words** from manually selected words (subtle styling, e.g., dotted underline or icon)
28. **The system must allow users to tap predicted words** to add them to the message (same as manual selection)
29. **The system must update predictions in real-time** as user composes message (after each word added)
30. **The system must display prediction confidence** (optional, in advanced settings) with visual indicator (1-3 stars, or percentage)
31. **The system must show loading state** (shimmer effect or spinner) when complex predictions take >50ms

### Cross-Device Learning (Opt-In Cloud Sync)

32. **The system must provide opt-in cloud sync** for usage patterns (not conversation content) via Firebase Firestore
33. **The system must sync aggregated data only**: word frequencies, n-gram counts, time-of-day associations, category associations (never full messages or conversations)
34. **The system must encrypt synced data** using Firebase Auth user-specific encryption keys
35. **The system must support multi-device learning** where patterns from all user's devices merge into unified model
36. **The system must enable speech pathologist access** to aggregated prediction data (read-only, anonymized patterns) with explicit user consent
37. **The system must implement sync conflict resolution** (merge strategies: union of n-grams, average frequencies, most recent time associations)
38. **The system must allow users to disable cloud sync** and delete all synced data at any time (with confirmation)

### User Control & Settings

39. **The system must provide simple on/off toggle** for predictions (default: ON) on main Settings screen
40. **The system must hide advanced controls** in "Advanced Prediction Settings" sub-menu (not visible by default)
41. **Advanced settings must include**:
    - Prediction sensitivity slider (1-5 scale: fewer conservative predictions ↔ more aggressive predictions)
    - Minimum confidence threshold (0-100%, only show predictions above threshold)
    - Number of predictions shown (1-10, default: 5)
    - Enable/disable time-of-day context (toggle)
    - Enable/disable category context (toggle)
    - Learning rate adjustment (slow ↔ fast, affects how quickly model adapts)
42. **The system must provide "Clear All Learning Data"** button with confirmation prompt (irreversible action warning)
43. **The system must support export/import of prediction data** separately from vocabulary export (`.aac-ml.json` file format)
44. **The system must display learning statistics** in advanced settings (total words tracked, n-grams learned, storage used, last training date)

### Privacy & Security

45. **The system must never log or transmit full messages/conversations** (only aggregated statistics if cloud sync enabled)
46. **The system must anonymize synced data** (no personally identifiable information in cloud storage)
47. **The system must implement user-specific encryption** for all synced prediction data (Firebase Auth UID as encryption key)
48. **The system must provide clear privacy policy** explaining what data is stored locally vs. synced (if opted-in)
49. **The system must require explicit consent** for cloud sync with detailed explanation of what is synced
50. **The system must allow data deletion** (local and cloud) with single-click "Delete All My Data" option

### Performance Requirements

51. **Frequency-based predictions must complete in <50ms** (simple lookup, no noticeable delay)
52. **N-gram predictions must complete in <200ms** (acceptable with loading indicator)
53. **Prediction UI must update without blocking message composition** (non-blocking async operations)
54. **Model training must run in background** (Web Workers) without UI freezes
55. **Model training must trigger after communication session ends** (batch updates, e.g., after 1 minute of inactivity or app close)
56. **Storage overhead must stay under 5MB** for typical user (500 tracked words, 500 n-grams, time/category associations)

### Cold Start & Bootstrapping

57. **The system must handle new users gracefully** (no predictions until minimum 20 word selections made)
58. **The system must support optional baseline model** (aggregated anonymized patterns from all users who opt-in) for cold-start improvement
59. **The system must allow users to opt-in to contributing** their anonymized patterns to baseline model (help improve cold-start for new users)
60. **The system must display "Learning..." message** during first 20 word selections (educate user that predictions will improve)

## Non-Goals (Out of Scope)

### Phase 1 Exclusions (Future PRDs)

- **Server-side ML models or cloud-based prediction APIs** - Maintaining privacy-first on-device approach (no OpenAI, Anthropic, etc.)
- **Natural language generation (NLG) for full sentence composition** - Complex AI feature beyond word prediction (6-12 months)
- **Multi-language prediction models** - Start with English, expand later (12+ months)
- **Speech-to-text input for training** - Voice input is separate feature (PRD-006: Voice Input)
- **Shared community prediction models** (marketplace) - Requires platform maturity (12+ months)
- **Real-time collaborative learning** between users - Privacy concerns and complexity (12+ months)
- **Emotion/sentiment-aware predictions** - Advanced NLP feature (12+ months)
- **Personalized phrase templates** based on ML - Requires more sophisticated NLG (6-12 months)

### Explicitly Out of Scope

- **Predictive text for general writing** (this is AAC-specific, not a keyboard replacement)
- **Grammar correction or autocorrect** (preserve user's authentic voice)
- **Sentence structure enforcement** (users control their own communication style)
- **Content filtering or censorship** (users have right to express anything)
- **Conversation logging or analytics dashboards** (privacy-first, no surveillance features)
- **Integration with third-party ML services** (all models on-device)

## Design Considerations

### UI/UX Requirements

**Prediction Bar Design**:
- Horizontal scrollable bar above message composition area
- 5 prediction slots (configurable in advanced settings: 1-10)
- Each prediction shows: word text + small confidence indicator (1-3 dots or stars)
- Subtle styling to distinguish from main word buttons (lighter background, smaller size)
- Loading state: shimmer effect for slots while computing predictions
- Empty state (no predictions): hide bar entirely (don't show empty slots)

**Visual Distinction for Predicted Words**:
- Words added from predictions: subtle dotted underline in message bar
- Words manually selected: no underline (default)
- Optional setting to disable distinction (treat all words the same)

**Settings UI Hierarchy**:
```
Settings Screen
├── Predictions (toggle: ON/OFF) ← Main settings
│   └── [When ON] Shows: "Predictions enabled. Tap to configure."
│
└── Advanced Prediction Settings (sub-screen) ← Hidden by default
    ├── Sensitivity Slider (1-5 scale)
    ├── Minimum Confidence (0-100%)
    ├── Number of Predictions (1-10)
    ├── Time-of-Day Context (toggle)
    ├── Category Context (toggle)
    ├── Learning Rate (slow ↔ fast slider)
    ├── Learning Statistics (read-only display)
    │   ├── Words tracked: 347
    │   ├── Patterns learned: 523 n-grams
    │   ├── Storage used: 2.3 MB
    │   └── Last training: 2 hours ago
    ├── Export Learning Data (button → download .aac-ml.json)
    ├── Import Learning Data (button → file picker)
    ├── Clear All Learning Data (button → confirmation dialog)
    └── Privacy & Cloud Sync
        ├── Enable Cloud Sync (toggle: OFF by default)
        ├── [When ON] Sync Status: "Last synced 5 min ago"
        ├── [When ON] View Synced Data (read-only summary)
        └── [When ON] Delete Cloud Data (button → confirmation)
```

**Cold Start UX**:
- First 20 word selections: Show banner "Learning your patterns... (12/20)"
- After 20 selections: Banner changes to "Predictions ready! Enable in Settings."
- Auto-enable predictions after training complete? (User testing needed)

**Loading Indicators**:
- <50ms predictions: No indicator (instant)
- 50-200ms predictions: Subtle shimmer effect in prediction bar
- >200ms predictions: Spinner icon + "Thinking..." text (rare, indicates performance issue)

**Privacy Consent UI** (for cloud sync opt-in):
```
[Dialog: Enable Cloud Sync?]

Sync your learning patterns across devices and share with your speech pathologist.

What's synced:
✓ Word frequency data (how often you use each word)
✓ Common word sequences (e.g., "I want" → "food")
✓ Time-of-day patterns (breakfast words in morning)

What's NOT synced:
✗ Your actual messages or conversations
✗ Personal information
✗ Device identifiers

Your data is encrypted and only accessible by you (and your speech pathologist if you grant access).

[Enable Cloud Sync]  [Keep Local Only]

Privacy Policy: [Learn More]
```

### Integration Points

**Existing Components (PRD-000, PRD-001)**:
- `App.tsx` - Add ML service initialization, prediction state management
- `MessageBar.tsx` - Integrate prediction bar above message composition
- `WordButton.tsx` - Track word selections for ML training
- `CategoryScreen.tsx` - Track category context for ML
- `SettingsScreen.tsx` - Add "Predictions" toggle and "Advanced Prediction Settings" link

**New Components Required**:
- `PredictionBar.tsx` - Horizontal scrollable prediction display (5 slots)
- `PredictionService.ts` - ML model management, training, inference
- `UsageTracker.ts` - Track word selections, n-grams, contexts
- `TensorFlowManager.ts` - TensorFlow.js wrapper for model ops
- `CloudSyncService.ts` - Firebase Firestore sync for usage patterns (opt-in)
- `PredictionSettingsScreen.tsx` - Advanced configuration UI
- `PrivacyConsentDialog.tsx` - Cloud sync opt-in UI

**External Dependencies**:
- **TensorFlow.js** (`@tensorflow/tfjs`) - Core ML library for in-browser training/inference
- **TensorFlow.js Layers API** (`@tensorflow/tfjs-layers`) - High-level neural network API
- **IndexedDB (Dexie.js)** - Store ML models, training data, usage patterns (already in PRD-001)
- **Web Workers API** - Background model training without blocking UI
- **Firebase Firestore** (optional, for cloud sync) - Store encrypted usage patterns

**Data Flow**:
```
User selects word
  → UsageTracker records (word, context, time, category)
  → Queued for batch training

After session ends (1 min inactivity)
  → Web Worker: PredictionService.trainModel()
  → Updated model saved to IndexedDB
  → (If cloud sync ON) CloudSyncService.syncPatterns()

User starts composing message
  → PredictionService.getPredictions(currentMessage)
  → <50ms: Frequency-based predictions
  → 50-200ms: N-gram + context predictions
  → PredictionBar updates with top 5 predictions

User taps prediction
  → Word added to message (same as manual selection)
  → UsageTracker records (word, isPredicted: true)
  → Real-time prediction update for next word
```

### ML Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      PREDICTION ENGINE                       │
│                     (PredictionService.ts)                   │
└───────────────────┬─────────────────────────────────────────┘
                    │
      ┌─────────────┼─────────────┐
      ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│Frequency │  │ N-Gram   │  │ Context  │
│  Model   │  │  Model   │  │  Model   │
│ (Lookup) │  │(TF.js NN)│  │(Time/Cat)│
└──────────┘  └──────────┘  └──────────┘
  <50ms         100-200ms      50-100ms
     │              │              │
     └──────────────┴──────────────┘
                    │
          ┌─────────▼─────────┐
          │   Ensemble Model  │
          │  (Weighted Merge) │
          └─────────┬─────────┘
                    │
            ┌───────▼────────┐
            │  Top 5 Words   │
            │  (Predictions) │
            └────────────────┘

TRAINING PIPELINE (Background Web Worker)

User Actions → UsageTracker → Batch Queue
                                    │
                          (After 1 min idle)
                                    │
                                    ▼
                        ┌───────────────────┐
                        │   Web Worker:     │
                        │  trainModels()    │
                        │                   │
                        │ • Update freq map │
                        │ • Train n-gram NN │
                        │ • Update contexts │
                        └─────────┬─────────┘
                                  │
                      ┌───────────┴───────────┐
                      ▼                       ▼
              ┌──────────────┐        ┌─────────────┐
              │  IndexedDB   │        │  Firestore  │
              │ (Local Save) │        │(Cloud Sync) │
              └──────────────┘        └─────────────┘
                 ALWAYS ON            OPT-IN ONLY
```

## Technical Considerations

### Architecture Requirements

**Technology Stack**:
- **TensorFlow.js 4.x** - Client-side ML library (CPU/WebGL backends)
- **TensorFlow.js Layers API** - High-level neural network construction
- **Dexie.js** (from PRD-001) - IndexedDB wrapper for model/data storage
- **Web Workers API** - Background model training (avoid UI blocking)
- **Firebase Firestore** (optional) - Cloud sync for usage patterns
- **React 18.3.1** - Existing UI framework (no changes)

**ML Model Design**:

**1. Frequency Model** (Simple Lookup):
```typescript
interface FrequencyMap {
  [wordId: string]: {
    count: number;
    lastUsed: Date;
    decayedCount: number; // count * decay(lastUsed)
  }
}
// Prediction: Sort by decayedCount, return top 5
// Time complexity: O(n log n) where n = vocab size
```

**2. N-Gram Model** (Neural Network):
```typescript
// Input: One-hot encoded previous 1-3 words
// Architecture: Embedding layer (50 dim) → LSTM (128 units) → Dense (vocab_size)
// Output: Probability distribution over next word
// Training: Categorical cross-entropy loss, Adam optimizer
// Dataset: Sliding window over all user's message history

const ngramModel = tf.sequential({
  layers: [
    tf.layers.embedding({ inputDim: vocabSize, outputDim: 50 }),
    tf.layers.lstm({ units: 128 }),
    tf.layers.dense({ units: vocabSize, activation: 'softmax' })
  ]
});
```

**3. Context Model** (Boosting):
```typescript
interface ContextBoosts {
  timeOfDay: {
    [wordId: string]: {
      morning: number;   // boost multiplier (1.0 = neutral, >1.0 = boost)
      afternoon: number;
      evening: number;
      night: number;
    }
  };
  category: {
    [wordId: string]: {
      [categoryId: string]: number; // boost multiplier
    }
  };
}
// Prediction: Multiply base probability by context boosts
```

**4. Ensemble Model** (Weighted Merge):
```typescript
interface PredictionScore {
  wordId: string;
  frequencyScore: number;  // 0-1 (normalized)
  ngramScore: number;      // 0-1 (from softmax)
  contextBoost: number;    // 1.0-2.0 (multiplier)
  finalScore: number;      // weighted combination
}

// Weights (tunable in advanced settings):
const weights = {
  frequency: 0.4,
  ngram: 0.5,
  context: 0.1
};

finalScore = (freq * 0.4) + (ngram * 0.5) + (context * 0.1) * contextBoost;
```

### Dependencies

**New NPM Packages**:
- `@tensorflow/tfjs@^4.17.0` - Core TensorFlow.js library
- `@tensorflow/tfjs-backend-webgl@^4.17.0` - GPU acceleration (optional but recommended)
- `compromise@^14.10.0` - Lightweight NLP for grammar pattern detection (optional)
- `date-fns@^3.0.0` - Time-of-day calculations (already installed in most projects)

**Existing Dependencies (No Changes)**:
- `dexie@^3.2.4` (from PRD-001) - IndexedDB storage
- `react@18.3.1` - UI framework
- `firebase@^10.x` (if cloud sync enabled) - Firestore backend

**Optional Optimizations**:
- `@tensorflow/tfjs-backend-wasm@^4.17.0` - WASM backend for better CPU performance (vs. WebGL on low-end devices)
- `comlink@^4.4.1` - Simplify Web Worker communication

### Technical Constraints

**Browser Compatibility**:
- TensorFlow.js: Chrome 57+, Firefox 52+, Safari 11+, Edge 79+
- Web Workers: Universal modern browser support
- IndexedDB: Universal modern browser support
- **Target**: Support last 2 versions of Chrome, Firefox, Safari, Edge (>95% coverage)

**Performance Constraints**:
- **Model Size**: Keep n-gram model under 2MB (small vocabulary, compact architecture)
- **Training Time**: Incremental training should complete in <10 seconds for typical session (20-50 word selections)
- **Inference Time**:
  - Frequency model: <50ms (simple lookup)
  - N-gram model: <200ms (forward pass through LSTM)
  - Ensemble model: <200ms total (parallel execution)
- **Memory Usage**: ML models + training data should stay under 10MB RAM during active use
- **Battery Impact**: Training in Web Worker should not drain battery excessively on mobile devices

**Storage Constraints**:
- **ML Models**: ~2MB for n-gram model (weights + architecture)
- **Training Data**: ~3MB for typical user (500 words × frequency data, 500 n-grams × counts, context associations)
- **Total ML Storage**: ~5MB (part of PRD-001's 50MB IndexedDB target)
- **Cloud Sync Payload**: <1MB per sync (aggregated patterns, no raw messages)

**Privacy & Security Constraints**:
- **Local-Only by Default**: No data leaves device unless user explicitly opts-in to cloud sync
- **Encryption at Rest**: Consider encrypting IndexedDB data for sensitive users (advanced setting)
- **Encryption in Transit**: All Firestore sync uses HTTPS + Firebase Auth encryption
- **Data Minimization**: Never sync full messages, only aggregated statistics (frequencies, n-gram counts)
- **User Deletion**: Implement immediate local + cloud data deletion (GDPR compliance)

**Adaptive Performance Thresholds**:
```typescript
const PERFORMANCE_THRESHOLDS = {
  INSTANT: 50,        // <50ms: No loading indicator
  ACCEPTABLE: 200,    // 50-200ms: Shimmer effect
  SLOW: 500,          // 200-500ms: Spinner + "Thinking..."
  TIMEOUT: 1000       // >1000ms: Cancel prediction, log error
};

// Adaptive strategy:
// If n-gram model consistently exceeds 200ms → Fall back to frequency-only
// If device is low-end (detect via TensorFlow.js benchmarking) → Use simpler model architecture
```

### Data Schema Design (IndexedDB)

**New Object Store: `ml_models`**
```typescript
interface MLModel {
  id: 'frequency' | 'ngram' | 'context';
  version: number;              // Schema version for migrations
  modelData: ArrayBuffer;       // Serialized TensorFlow.js model
  metadata: {
    vocabSize: number;
    trainingSamples: number;
    lastTrained: Date;
    accuracy?: number;          // Validation accuracy (if available)
  };
  createdAt: Date;
  modifiedAt: Date;
}
```

**New Object Store: `usage_patterns`**
```typescript
interface UsagePattern {
  id: string;                   // UUID v4
  wordId: string;               // Foreign key to words.id
  frequency: number;            // Total selection count
  lastUsed: Date;               // Most recent selection
  timeOfDayStats: {
    morning: number;            // Count in morning time slot
    afternoon: number;
    evening: number;
    night: number;
  };
  categoryStats: {
    [categoryId: string]: number; // Count per category
  };
  decayedFrequency: number;     // frequency * decay(lastUsed)
  createdAt: Date;
  modifiedAt: Date;
}
// Indexes: wordId, frequency (desc), lastUsed
```

**New Object Store: `ngrams`**
```typescript
interface NGram {
  id: string;                   // UUID v4
  sequence: string[];           // Array of wordIds (length 2-4)
  nextWordId: string;           // Predicted next word
  count: number;                // Occurrences of this n-gram
  lastUsed: Date;
  confidence: number;           // 0-1 (based on count / total sequences)
  createdAt: Date;
  modifiedAt: Date;
}
// Indexes: compound(sequence), count (desc), lastUsed
// Limit: Store top 500 n-grams only (prune lowest count periodically)
```

**New Object Store: `ml_settings`**
```typescript
interface MLSettings {
  id: 'ml-settings';            // Singleton key
  enabled: boolean;             // Master predictions on/off
  sensitivity: number;          // 1-5 scale (affects ensemble weights)
  minConfidence: number;        // 0-100% (filter low-confidence predictions)
  numPredictions: number;       // 1-10 (how many to show)
  timeContextEnabled: boolean;
  categoryContextEnabled: boolean;
  learningRate: number;         // 0.1-1.0 (training speed)
  cloudSyncEnabled: boolean;    // Opt-in cloud sync
  cloudSyncConsent: Date | null; // When user consented
  lastTrainingRun: Date | null;
  statistics: {
    totalPredictions: number;   // Predictions generated
    predictionsUsed: number;    // Predictions actually selected
    accuracyRate: number;       // predictionsUsed / totalPredictions
  };
  modifiedAt: Date;
}
```

**Cloud Sync Schema (Firestore)**
```typescript
// Collection: /users/{userId}/ml_patterns
interface CloudMLPattern {
  userId: string;               // Firebase Auth UID
  deviceId: string;             // Device identifier (for multi-device)
  lastSyncedAt: Date;
  encryptedData: string;        // AES-256 encrypted JSON of usage_patterns + ngrams
  metadata: {
    totalWords: number;
    totalNGrams: number;
    dataVersion: number;
  };
}
// Encryption key: Derived from Firebase Auth UID + user-specific salt
```

### Implementation Approach

**Phased Development** (recommended sequence):

**Phase 1A: Usage Tracking Foundation** (Week 1)
- Implement UsageTracker to log word selections (word, time, category, context)
- Store usage data in IndexedDB (`usage_patterns` object store)
- Build data visualization for debugging (show tracked patterns in dev tools)
- Test: Verify 1000+ word selections tracked without performance degradation

**Phase 1B: Frequency-Based Prediction** (Week 1-2)
- Implement simple frequency model (sort by decayedFrequency)
- Build PredictionBar component (5 slots, horizontal scroll)
- Integrate PredictionBar in MessageBar.tsx (above message composition)
- Test: Verify <50ms prediction time, validate decay algorithm

**Phase 1C: N-Gram Model Training** (Week 2-3)
- Set up TensorFlow.js and define n-gram neural network architecture
- Implement training pipeline in Web Worker (background processing)
- Train model after 1 min inactivity (batch updates, not real-time)
- Store trained model in IndexedDB (`ml_models` object store)
- Test: Train on 500+ word sequences, verify <10s training time

**Phase 1D: N-Gram Prediction Inference** (Week 3)
- Implement n-gram model inference (forward pass through LSTM)
- Merge frequency + n-gram predictions (ensemble model)
- Add loading indicators for >50ms predictions (shimmer effect)
- Test: Verify 100-200ms inference time, validate prediction quality

**Phase 1E: Context-Aware Boosting** (Week 3-4)
- Implement time-of-day tracking and boosting
- Implement category context tracking and boosting
- Tune ensemble weights (frequency 0.4, n-gram 0.5, context 0.1)
- Test: Verify context boosts improve prediction relevance (user testing)

**Phase 1F: User Controls & Settings** (Week 4)
- Build PredictionSettingsScreen with all advanced controls
- Implement simple on/off toggle on main Settings screen
- Add "Clear Learning Data" functionality
- Implement export/import of ML data (`.aac-ml.json` format)
- Test: Verify all settings work, data export/import round-trip

**Phase 1G: Cloud Sync (Opt-In)** (Week 5)
- Implement CloudSyncService with Firestore integration
- Build privacy consent UI (PrivacyConsentDialog.tsx)
- Encrypt usage patterns before syncing (AES-256 encryption)
- Implement sync conflict resolution (merge strategies)
- Test: Multi-device sync, speech pathologist read-only access

**Phase 1H: Performance Optimization & Polish** (Week 5-6)
- Optimize TensorFlow.js backend selection (WebGL vs. WASM vs. CPU)
- Implement adaptive performance (fall back to frequency-only on slow devices)
- Add cold-start handling (baseline model for new users)
- Performance testing: 1000+ word vocabularies, low-end devices
- Accessibility audit: Screen reader support, keyboard navigation

**Phase 1I: User Testing & Iteration** (Week 6)
- Beta testing with speech pathologist advisory group (5-10 professionals)
- A/B testing: Predictions on vs. off (measure communication speed improvement)
- Usability testing: Settings UI, privacy consent clarity
- Iterate based on feedback (tune ensemble weights, UI refinements)

## Success Metrics

### Immediate Success Criteria (Launch Week)

- **Prediction Accuracy**: 40%+ of predictions actually selected by users (top-5 accuracy)
- **Performance**: 90%+ of predictions generated in <200ms (acceptable latency)
- **Privacy**: Zero conversation content transmitted to servers (local-only by default)
- **Offline Functionality**: Predictions work 100% offline after initial training
- **Storage Efficiency**: ML models + data under 5MB per user

### 30-Day Success Metrics (Post-Launch)

- **Communication Speed Improvement**: 30%+ reduction in button presses per message (vs. no predictions)
- **Adoption Rate**: 60%+ of users keep predictions enabled after trying them
- **Prediction Usage**: 50%+ of words selected from predictions (vs. manual browsing)
- **Cloud Sync Opt-In**: 20%+ of users enable cloud sync (indicates trust in privacy)
- **User Satisfaction**: "Predictions" mentioned positively in 70%+ of user feedback
- **Zero Privacy Incidents**: No reports of unwanted data sharing or privacy breaches

### 90-Day Success Metrics (Product-Market Fit Validation)

- **Speed Improvement**: 50%+ reduction in button presses per message (mature model)
- **Prediction Accuracy**: 60%+ top-5 accuracy (model learns user patterns)
- **Power User Adoption**: 30%+ of users explore advanced settings (indicates engagement)
- **Cross-Device Usage**: 40%+ of cloud sync users actively use on 2+ devices
- **Speech Pathologist Value**: 50%+ of pathologists use prediction data to optimize client boards
- **Retention Impact**: Users with predictions ON have 20%+ higher 30-day retention

### Alignment with Product Vision Metrics (PRODUCT_VISION.md)

- **Communication Speed**: Contribute to 12 min average session length at 12 months (faster communication = longer, richer sessions)
- **User Satisfaction**: Contribute to 60+ NPS at 12 months (predictions are "wow" feature)
- **Daily Communication Events**: Enable 15 events/day at 12 months (faster = more communication)
- **App Store Rating**: Contribute to 4.5+ rating (differentiated feature vs. competitors)

### Key Performance Indicators (KPIs)

| Metric | Baseline (No Predictions) | Week 1 Target | 30-Day Target | 90-Day Target |
|--------|--------------------------|---------------|---------------|---------------|
| Button Presses per Message | 8-12 (manual) | 6-10 (25% reduction) | 5-8 (30-50% reduction) | 4-6 (50%+ reduction) |
| Prediction Accuracy (Top-5) | N/A | 30% | 40% | 60% |
| Predictions Enabled % | 0% | 50% (initial try) | 60% (kept on) | 70% (sticky) |
| Cloud Sync Opt-In % | 0% | 10% | 20% | 40% |
| Avg Inference Time | N/A | <200ms (90%) | <150ms (95%) | <100ms (98%) |
| ML Storage per User | 0MB | 2-3MB | 3-4MB | 4-5MB |

## Open Questions

### Technical Decisions

- [x] **ML Library**: TensorFlow.js (on-device) vs. cloud API (OpenAI, Anthropic)? **Decision: TensorFlow.js** (privacy-first, offline)
- [x] **Privacy Model**: Local-only vs. opt-in cloud sync? **Decision: Local-only default, opt-in cloud sync for cross-device learning**
- [ ] **Model Architecture**: LSTM vs. GRU vs. Transformer for n-gram model? **Recommendation: LSTM** (good balance of accuracy and performance)
- [ ] **Ensemble Weights**: Frequency 0.4, N-gram 0.5, Context 0.1 - are these optimal? (User testing and A/B testing needed)
- [ ] **Training Frequency**: After 1 min idle (as specified) or more aggressive (after each message)? **Recommendation: 1 min idle** (avoid excessive training)
- [ ] **Cold Start Baseline**: Offer anonymized baseline model for new users? Requires opt-in data contribution from existing users
- [ ] **N-Gram Storage Limit**: 500 n-grams (as specified) or dynamic based on storage availability?

### UX/Product Decisions

- [ ] **Auto-Enable Predictions**: After 20 word selections, automatically enable predictions or require user to manually turn on?
- [ ] **Prediction Bar Placement**: Above message bar (as specified) or below word grid (less visual clutter)?
- [ ] **Confidence Display**: Show confidence indicators (1-3 stars) by default or only in advanced settings?
- [ ] **Cloud Sync Default**: Disabled by default (as specified) or prompt user on first launch to opt-in?
- [ ] **Speech Pathologist Access**: How much detail should pathologists see? (Aggregated stats only or full n-gram list?)
- [ ] **Learning Data Export**: Separate `.aac-ml.json` file or include in main vocabulary export?

### User Testing & Validation

- [ ] **Ensemble Weights**: What weights provide best accuracy/performance trade-off? (A/B testing needed)
- [ ] **Sensitivity Slider**: How do users expect 1-5 sensitivity scale to affect predictions? (User testing needed)
- [ ] **Prediction Count**: Is 5 predictions optimal or do users prefer 3 (less choice) or 7-10 (more options)? (User testing needed)
- [ ] **Time-of-Day Granularity**: 4 time slots (morning/afternoon/evening/night) or more granular (hourly)? (User testing needed)
- [ ] **Privacy Consent Clarity**: Is the privacy consent dialog clear enough? Do users understand what's synced? (User testing needed)

### Future PRD Coordination

- [ ] **Voice Input Integration** (PRD-006): Should voice-to-text selections also train the ML model? (Consider privacy implications)
- [ ] **Collaboration Conflicts** (PRD-002): How does real-time collaboration affect ML training? (If pathologist edits board, should user's predictions reset?)
- [ ] **Analytics Events** (PRD-005): What prediction events should be tracked? (Predictions shown, predictions selected, prediction accuracy, etc.)
- [ ] **Multi-Language Support**: How will ML models adapt to multi-language vocabularies? (Separate models per language or unified?)

---

## Related Documents

**Dependencies**:
- `/Users/mattpacione/git/health_services/AAC/.claude/tasks/1_backlog/000-baseline-foundation/prd-000-baseline-foundation.md` - Baseline functionality
- `/Users/mattpacione/git/health_services/AAC/.claude/tasks/1_backlog/001-data-persistence/prd-001-data-persistence.md` - IndexedDB storage foundation (required for ML model persistence)
- `/Users/mattpacione/git/health_services/AAC/PRODUCT_VISION.md` - Strategic vision (Theme 3: Intelligent Communication Assistance)

**Related Future PRDs**:
- PRD-002: Cloud Sync & Collaboration (Theme 2) - Speech pathologist access to prediction data, cross-device sync infrastructure
- PRD-005: Analytics & Insights - Track prediction usage, measure communication speed improvements
- PRD-006: Voice Input - Voice-to-text selections could train ML models (privacy considerations)

**Project Context**:
- `/Users/mattpacione/git/health_services/AAC/PROJECT_CONTEXT.md` - Technical stack and architecture overview
- `/Users/mattpacione/git/health_services/AAC/.claude/tasks/project-status.md` - Project status tracking

---

**Created**: 2025-12-08
**Author**: Tactical Product Manager Agent
**Status**: Draft - Ready for Review
**PRD Number**: 004
**Vision Theme**: Theme 3 (Intelligent Communication Assistance), Theme 5 (User-Friendly Experience)
**Estimated Effort**: 6 weeks (1.5 sprints) - Phased implementation as outlined above
**Priority**: High - Key differentiator vs. competitors, significant user value (30-50% communication speed improvement)
**Dependencies**: PRD-001 (Data Persistence) must be completed first for IndexedDB foundation
