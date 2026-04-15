import type { APIRoute } from 'astro';
import { getPool } from '../../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  // ── Auth: Bearer token ─────────────────────────────────────────────────────
  const apiKey = import.meta.env.LEADS_API_KEY;
  const auth   = request.headers.get('authorization') ?? '';
  const token  = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';

  if (!apiKey || token !== apiKey) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'WWW-Authenticate': 'Bearer' },
    });
  }

  // ── Pagination ─────────────────────────────────────────────────────────────
  const url    = new URL(request.url);
  const limit  = Math.min(Math.max(parseInt(url.searchParams.get('limit')  ?? '100'), 1), 500);
  const offset = Math.max(parseInt(url.searchParams.get('offset') ?? '0'),  0);

  // ── Optional filters ───────────────────────────────────────────────────────
  const intent = url.searchParams.get('intent');
  const since  = url.searchParams.get('since'); // ISO date string

  const conditions: string[] = [];
  const params: (string | number)[] = [];
  let idx = 1;

  if (intent) { conditions.push(`intent = $${idx++}`); params.push(intent); }
  if (since)  { conditions.push(`created_at >= $${idx++}`); params.push(since); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  params.push(limit, offset);

  // ── Query ──────────────────────────────────────────────────────────────────
  const pool = getPool();
  try {
    const [rows, count] = await Promise.all([
      pool.query(
        `SELECT id, created_at, name, company, role, email, phone, revenue, intent, message, source, webhook_status
         FROM website_leads
         ${where}
         ORDER BY created_at DESC
         LIMIT $${idx++} OFFSET $${idx}`,
        params,
      ),
      pool.query(`SELECT COUNT(*) FROM website_leads ${where}`, params.slice(0, -2)),
    ]);

    return new Response(
      JSON.stringify({
        total: parseInt(count.rows[0].count, 10),
        limit,
        offset,
        leads: rows.rows,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[leads] DB query error:', err);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
