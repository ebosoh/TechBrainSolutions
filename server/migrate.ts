import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './db';
import { log } from './vite';
import { users, contactForm } from '@shared/schema';

// This function will create all necessary tables in the database
export async function migrateDatabase() {
  try {
    log('Running database migrations...', 'drizzle');
    
    // Instead of using migration files, we'll directly create tables
    // based on our schema definitions
    try {
      // Create tables if they don't exist
      await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS contact_form (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          submitted_at TIMESTAMP DEFAULT NOW()
        );
      `);
      
      log('Tables created successfully!', 'drizzle');
    } catch (tableError) {
      log(`Error creating tables: ${tableError}`, 'drizzle');
      throw tableError;
    }
    
    log('Database migrations completed successfully!', 'drizzle');
    return true;
  } catch (error) {
    log(`Migration error: ${error}`, 'drizzle');
    return false;
  }
}