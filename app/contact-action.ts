'use server';
import { SITE } from '@/content/site';
import { validate, type Fields } from '@/lib/validate';

export type SendResult = { ok: true } | { ok: false; field: 'name' | 'email' | 'subject' | 'message'; error: string } | { ok: false; error: 'send' };

// the browser's check is a courtesy; this one is the gate (spec: Contact form)
// a server action is a public POST endpoint: the Fields type isn't enforced at runtime, so anything
// that isn't a string becomes '' and fails validation instead of throwing
const str = (v: unknown) => typeof v === 'string' ? v : '';

export async function sendContact(input: Fields): Promise<SendResult> {
  const raw = (input ?? {}) as Record<string, unknown>;
  const f: Fields = { name: str(raw.name), email: str(raw.email), subject: str(raw.subject), message: str(raw.message), website: str(raw.website) };
  const r = validate(f);
  if (r.ok === 'drop') return { ok: true };   // honeypot filled: look sent, send nothing
  if (r.ok === false) return r;
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: 'send' };
  const name = f.name.trim(), email = f.email.trim(), subject = (f.subject ?? '').trim();
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Fahim Faiyaz Portfolio <contact@fahimfaiyaz.dev>',   // fahimfaiyaz.dev verified in Resend 2026-10-18
        to: [SITE.email],
        reply_to: email,
        subject: `Portfolio: ${subject || 'New message'} (from ${name})`.replace(/\s+/g, ' '),   // one line, whatever was typed
        text: `${f.message.trim()}\n\n${name} <${email}>`,
      }),
    });
    return res.ok ? { ok: true } : { ok: false, error: 'send' };
  } catch {
    return { ok: false, error: 'send' };
  }
}
