import type { APIRoute } from 'astro';
import crypto from 'crypto';
import { contactSchema } from '../../lib/contactSchema';
import { checkRateLimit } from '../../lib/rateLimit';
import { getPool } from '../../lib/db';
import { fireWebhook } from '../../lib/webhook';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const json = (body: object, status: number) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  // ── Rate limit ─────────────────────────────────────────────────
  if (!checkRateLimit(clientAddress)) {
    return json({ error: 'Too many requests. Please try again later.' }, 429);
  }

  // ── Parse body ─────────────────────────────────────────────────
  let raw: Record<string, unknown>;
  const contentType = request.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      raw = await request.json();
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const fd = await request.formData();
      raw = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]));
    } else {
      return json({ error: 'Unsupported content type' }, 400);
    }
  } catch {
    return json({ error: 'Failed to parse request body' }, 400);
  }

  // ── Honeypot check (bots fill hidden fields, humans don't) ────
  if ((raw as Record<string, unknown>).website) {
    // Silently succeed — never tell the bot it was caught
    return json({ ok: true }, 200);
  }

  // ── Validate with Zod ──────────────────────────────────────────
  const result = contactSchema.safeParse(raw);
  if (!result.success) {
    return json(
      { error: 'Validation failed', fields: result.error.flatten().fieldErrors },
      422
    );
  }

  const data = result.data;

  // ── Persist to database ────────────────────────────────────────
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();

  const dbTimeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('DB query timeout')), 5000)
  );
  try {
    const pool = getPool();
    await Promise.race([
      pool.query(
        `INSERT INTO website_leads
           (id, created_at, name, company, role, email, phone, revenue, intent, message, source,
            ip_address, user_agent)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          id,
          created_at,
          data.name,
          data.company,
          data.role ?? null,
          data.email,
          data.phone ?? null,
          data.revenue ?? null,
          data.intent,
          data.message,
          data.source ?? null,
          clientAddress ?? null,
          request.headers.get('user-agent')?.slice(0, 500) ?? null,
        ]
      ),
      dbTimeout,
    ]);
  } catch (err) {
    // DB unavailable (e.g. no DATABASE_URL in local dev) — log and continue.
    // The webhook below is the primary lead capture; don't fail the user.
    console.error('[contact] DB insert failed:', err);
  }

  // ── Fire webhook (non-blocking — does not delay the response) ──
  fireWebhook({
    id,
    created_at,
    name: data.name,
    company: data.company,
    role: data.role ?? null,
    email: data.email,
    phone: data.phone ?? null,
    revenue: data.revenue ?? null,
    intent: data.intent,
    message: data.message,
    source: data.source ?? null,
  }).catch((e) => console.error('[contact] webhook error:', e));

  return json({ ok: true }, 200);
};
