import { db } from './schema';
import { seedDatabase } from './seedData';
import { dataService } from './dataService';

/**
 * Database Initialization Result
 *
 * WHY: Provides detailed status information for app initialization flow
 */
export interface InitResult {
  initialized: boolean;
  seeded: boolean;
  error?: string;
}

/**
 * Initialize Database
 *
 * WHY: Ensures database is accessible and properly seeded on first app launch
 * REASON: Handles database setup, verification, and error recovery gracefully
 *
 * NOTE: This function is called once on app startup to prepare the database
 *
 * @returns Promise<InitResult> - Detailed initialization status
 */
export async function initDatabase(): Promise<InitResult> {
  try {
    // Set 10-second timeout for initialization
    const timeoutPromise = new Promise<InitResult>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Database initialization timeout'));
      }, 10000);
    });

    // Actual initialization logic
    const initPromise = performInitialization();

    // Race between initialization and timeout
    return await Promise.race([initPromise, timeoutPromise]);
  } catch (error) {
    // Handle timeout or other initialization errors
    console.error('Error initializing database:', error);

    return {
      initialized: false,
      seeded: false,
      error: (error as Error).message
    };
  }
}

/**
 * Perform actual database initialization
 *
 * REASON: Separated from timeout logic for clarity and testability
 */
async function performInitialization(): Promise<InitResult> {
  try {
    // Step 1: Verify database is accessible
    await db.open();

    // Step 2: Verify all object stores exist
    // NOTE: Accessing the tables will throw if they don't exist
    await Promise.all([
      db.words.count(),
      db.categories.count(),
      db.settings.count(),
      db.resources.count(),
      db.metadata.count()
    ]);

    // Step 3: Check if seeding is needed
    // WHY: We check for default categories to determine if database needs baseline data
    const categories = await dataService.getAllCategories();
    const hasDefaultCategories = categories.some(cat => cat.isDefault === true);

    // Step 4: Seed database if needed
    const seedResult = await seedDatabase();

    if (!seedResult.success) {
      console.error('Error seeding database:', seedResult.message);
      return {
        initialized: true,
        seeded: false,
        error: seedResult.message
      };
    }

    // Step 5: Return success status
    return {
      initialized: true,
      seeded: !seedResult.stats.skipped
    };
  } catch (error) {
    console.error('Error initializing database:', error);

    return {
      initialized: false,
      seeded: false,
      error: (error as Error).message
    };
  }
}
