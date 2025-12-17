# IndexedDB Schema Documentation

This directory contains the IndexedDB schema definition and database access layer for the AAC Communication Board application.

## Overview

The application uses Dexie.js (a wrapper around IndexedDB) for client-side persistent storage. The schema is defined in `schema.ts` and includes 5 object stores.

## Database Structure

### Database Name
`aac-communication-board`

### Schema Version
1 (initial version)

## Object Stores

### 1. `words`

Stores individual word/symbol cards for the communication board.

**Interface**: `Word`

**Fields**:
- `id` (string, primary key): UUID v4
- `text` (string): Display text for the word
- `type` (WordType): One of 'pronoun' | 'verb' | 'descriptive' | 'noun' | 'social'
- `categoryId` (string, indexed): Foreign key to categories store
- `iconName` (string): Lucide icon name
- `customImageUrl` (string, optional): base64 data URL or Blob URL for custom images
- `order` (number, indexed): Display order within category
- `createdAt` (Date, indexed): Creation timestamp
- `modifiedAt` (Date): Last modification timestamp
- `isDefault` (boolean): True for baseline vocabulary, false for custom words

**Indexes**:
- `categoryId`: Query words by category
- `type`: Query words by type
- `order`: Sort words by display order
- `createdAt`: Sort words by creation date

### 2. `categories`

Stores organizational categories for grouping words.

**Interface**: `Category`

**Fields**:
- `id` (string, primary key): UUID v4
- `name` (string): Category display name
- `iconName` (string): Lucide icon name
- `parentId` (string, optional, indexed): For nested categories (future enhancement)
- `order` (number, indexed): Display order for categories
- `createdAt` (Date): Creation timestamp
- `modifiedAt` (Date): Last modification timestamp
- `isDefault` (boolean): True for baseline categories, false for custom

**Indexes**:
- `parentId`: Query child categories (for nested structure)
- `order`: Sort categories by display order

### 3. `settings`

Singleton store for application configuration and user preferences.

**Interface**: `Settings`

**Fields**:
- `id` (literal 'app-settings'): Singleton key
- `wordTypeColors`: Color scheme for word types
  - Each type (pronoun, verb, descriptive, noun, social) has:
    - `bg`: Background color (hex)
    - `border`: Border color (hex)
- `voiceSettings`: Text-to-speech configuration
  - `voiceURI` (string, optional): Selected voice identifier
  - `rate` (number): Speech rate (0.1 to 10)
  - `pitch` (number): Voice pitch (0 to 2)
  - `volume` (number): Volume level (0 to 1)
- `gridLayout`: Layout preferences
  - `columns` (number): Number of columns in word grid
- `uiPreferences`: UI behavior settings
  - `showOfflineIndicator` (boolean): Display offline status
  - `autoSaveEnabled` (boolean): Auto-save changes
  - `confirmDeletes` (boolean): Confirm before deletion
- `modifiedAt` (Date): Last settings update

**Default Colors** (from PRD):
```typescript
{
  pronoun: { bg: '#fef3c7', border: '#fcd34d' },    // Yellow
  verb: { bg: '#dbeafe', border: '#60a5fa' },       // Blue
  descriptive: { bg: '#dcfce7', border: '#4ade80' }, // Green
  noun: { bg: '#fce7f3', border: '#f472b6' },       // Pink
  social: { bg: '#ede9fe', border: '#a78bfa' }      // Purple
}
```

### 4. `resources`

Educational resources and help content for partners and caregivers.

**Interface**: `Resource`

**Fields**:
- `id` (string, primary key): UUID v4
- `title` (string): Resource title
- `description` (string): Brief description
- `url` (string): Link to resource
- `type` (indexed): 'article' | 'video' | 'document' | 'tip'
- `category` (indexed): 'getting-started' | 'tips-for-partners' | 'modeling-teaching' | 'research-evidence'
- `createdAt` (Date): Creation timestamp
- `isDefault` (boolean): True for pre-loaded resources

**Indexes**:
- `category`: Query resources by category
- `type`: Query resources by type

### 5. `metadata`

Singleton store for application metadata and statistics.

**Interface**: `Metadata`

**Fields**:
- `id` (literal 'app-metadata'): Singleton key
- `schemaVersion` (number): Current schema version (1)
- `appVersion` (string): Application version
- `lastModified` (Date): Last modification timestamp
- `statistics`: Usage and storage statistics
  - `totalWords` (number): Total word count
  - `customWords` (number): User-created words
  - `totalCategories` (number): Total category count
  - `customCategories` (number): User-created categories
  - `customImages` (number): Custom image count
  - `storageUsedMB` (number): Approximate storage usage in MB

## Usage

### Importing the Database

```typescript
import { db } from '@/lib/db/schema';
```

### Basic Operations

#### Query words by category
```typescript
const words = await db.words
  .where('categoryId')
  .equals('category-id')
  .toArray();
```

#### Add a new word
```typescript
await db.words.add({
  id: crypto.randomUUID(),
  text: 'hello',
  type: 'social',
  categoryId: 'greetings-id',
  iconName: 'Hand',
  order: 1,
  createdAt: new Date(),
  modifiedAt: new Date(),
  isDefault: false
});
```

#### Get/Update settings
```typescript
// Get current settings
const settings = await db.settings.get('app-settings');

// Update settings
await db.settings.put({
  ...settings,
  gridLayout: { columns: 6 },
  modifiedAt: new Date()
});
```

#### Query resources by category
```typescript
const resources = await db.resources
  .where('category')
  .equals('getting-started')
  .toArray();
```

## Testing

Tests are located in `__tests__/schema.test.ts` and verify:
- TypeScript type safety for all interfaces
- Dexie database class structure
- Schema version and index definitions
- Singleton database instance
- Basic CRUD operations

Run tests:
```bash
npm test
```

## Future Enhancements

1. **Schema Versioning**: Add migration logic for schema updates
2. **Export/Import**: Backup and restore functionality
3. **Sync**: Optional cloud sync for multi-device usage
4. **Offline-First**: Service worker integration
5. **Storage Limits**: Quota management and cleanup

## References

- [Dexie.js Documentation](https://dexie.org)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [PRD-001: AAC Communication Board](../../docs/PRD-001.md)
