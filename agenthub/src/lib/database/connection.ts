import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function getDatabase(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  if (db) {
    return db;
  }

  // Create database directory if it doesn't exist
  const dbDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = path.join(dbDir, 'agenthub.db');

  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON');
    
    // Initialize schema
    await initializeSchema();
    
    console.log('Database connected successfully');
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

async function initializeSchema(): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  try {
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema by semicolons and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      await db.exec(statement);
    }
    
    console.log('Database schema initialized');
  } catch (error) {
    console.error('Schema initialization error:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
    console.log('Database connection closed');
  }
}

// Utility function to handle database errors
export function handleDatabaseError(error: any): never {
  console.error('Database operation failed:', error);
  throw new Error(`Database error: ${error.message}`);
}