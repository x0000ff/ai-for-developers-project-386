import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as schema from './schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbUrl = process.env.DATABASE_URL ?? path.join(__dirname, '../../../app.db');

export const sqlite = new Database(dbUrl);
export const db = drizzle(sqlite, { schema });
export type Db = typeof db;
