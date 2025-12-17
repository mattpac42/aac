/**
 * Database Module Exports
 *
 * WHY: Centralized export point for all database-related functionality
 * REASON: Simplifies imports throughout the application
 */

// Core database schema and instance
export { db, AACDatabase } from './schema';
export type { Word, Category, Settings, Resource, Metadata, WordType } from './schema';

// Data access layer
export { dataService, DataService } from './dataService';

// Database initialization and seeding
export { initDatabase } from './initDatabase';
export type { InitResult } from './initDatabase';
export { seedDatabase } from './seedData';
