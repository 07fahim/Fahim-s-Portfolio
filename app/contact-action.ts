'use server';
import { SITE } from '@/content/site';
import { validate, type Fields } from '@/lib/validate';

export type SendResult = { ok: true } | { ok: false; field: 'name' | 'email' | 'subject' | 'message'; error: string } | { ok: false; error: 'send' };

// the browser's check is a courtesy; this one is the gate (spec: Contact form)
export async function sendContact(f: Fields): Promise<SendResult> {
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
        from: 'Portfolio <onboarding@resend.dev>',   // switch to a fahimfaiyaz.dev address once the domain is verified (step 5)
        to: [SITE.email],
        reply_to: email,
        subject: `Portfolio: ${subject || 'New message'} (from ${name})`,
        text: `${f.message.trim()}\n\n${name} <${email}>`,
      }),
    });
    return res.ok ? { ok: true } : { ok: false, error: 'send' };
  } catch {
    return { ok: false, error: 'send' };
  }
}
