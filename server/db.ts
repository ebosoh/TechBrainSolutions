import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../shared/schema';

// Use the environment variables provided by the database tool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a Drizzle instance with the schema
export const db = drizzle(pool, { schema });