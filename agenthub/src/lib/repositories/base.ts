import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { randomUUID } from 'crypto';
import { getDatabase } from '../database/connection';

export abstract class BaseRepository {
  protected db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

  protected async getDb(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
    if (!this.db) {
      this.db = await getDatabase();
    }
    return this.db;
  }

  protected generateId(): string {
    return randomUUID();
  }

  protected serializeJson(obj: any): string {
    return JSON.stringify(obj);
  }

  protected parseJson<T>(str: string | null): T | null {
    if (!str) return null;
    try {
      return JSON.parse(str) as T;
    } catch {
      return null;
    }
  }

  protected formatDate(date: Date): string {
    return date.toISOString();
  }

  protected parseDate(dateStr: string | null): Date | null {
    if (!dateStr) return null;
    return new Date(dateStr);
  }
}