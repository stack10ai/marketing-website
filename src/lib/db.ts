import pg from 'pg';

const { Pool } = pg;

// Single pool instance reused across requests (server-side only)
let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const raw = process.env.DATABASE_URL ?? import.meta.env.DATABASE_URL;
    if (!raw) throw new Error('DATABASE_URL env var is not set');

    // Strip sslmode from the connection string — pg v8.20+ treats sslmode=require
    // as verify-full, overriding ssl:{rejectUnauthorized:false}. We handle SSL
    // explicitly via the pool config instead.
    const parsed = new URL(raw);
    parsed.searchParams.delete('sslmode');

    pool = new Pool({
      connectionString: parsed.toString(),
      ssl: { rejectUnauthorized: false },
      max: 10,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}
