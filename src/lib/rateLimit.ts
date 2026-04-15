// Simple in-memory sliding-window rate limiter.
// Good for a single-node deployment; replace with Redis if you scale out.

interface Entry {
  timestamps: number[];
}

const store = new Map<string, Entry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;

/** Returns true if the request should be allowed, false if it should be rejected. */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  let entry = store.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(ip, entry);
  }

  // Drop timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= MAX_REQUESTS) return false;

  entry.timestamps.push(now);
  return true;
}
