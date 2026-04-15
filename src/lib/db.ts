import pg from 'pg';

const { Pool } = pg;

// Single pool instance reused across requests (server-side only)
let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const url = import.meta.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL env var is not set');
    pool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      max: 10,
      connectionTimeoutMillis: 5000,  // fail fast if DB unreachable
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}
