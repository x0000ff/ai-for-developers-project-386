import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buildApp } from '../app.js';
import { createTestDb } from './helpers/db.js';
import type Database from 'better-sqlite3';

describe('GET /health', () => {
  let sqlite: InstanceType<typeof Database>;

  beforeEach(() => {
    ({ sqlite } = createTestDb());
  });

  afterEach(() => {
    sqlite.close();
  });

  it('returns 200 with status ok', async () => {
    const { db } = createTestDb();
    const app = buildApp({ db });
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });
});
