import crypto from 'crypto';

export interface LeadPayload {
  id: string;
  created_at: string;
  name: string;
  company: string;
  role: string | null;
  email: string;
  phone: string | null;
  revenue: string | null;
  intent: string;
  message: string;
  source: string | null;
}

/** Fires a signed POST to WEBHOOK_URL if configured. Updates the DB row with delivery status. */
export async function fireWebhook(payload: LeadPayload): Promise<{ sent: boolean; status: string }> {
  const url = import.meta.env.WEBHOOK_URL;
  if (!url) return { sent: false, status: 'no_url' };

  const body = JSON.stringify(payload);
  const secret = import.meta.env.WEBHOOK_SECRET ?? '';

  const signature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Stack10-Signature': `sha256=${signature}`,
      },
      body,
      signal: AbortSignal.timeout(8000),
    });

    return { sent: true, status: res.ok ? `${res.status}` : `error_${res.status}` };
  } catch (err) {
    return { sent: true, status: `exception_${(err as Error).message.slice(0, 80)}` };
  }
}
