export type Fields = { name: string; email: string; subject?: string; message: string; website?: string };
export type Check = { ok: true } | { ok: false; field: 'name' | 'email' | 'subject' | 'message'; error: string } | { ok: 'drop' };

// the spec's rules: name 1–100, a valid email, subject up to 150, message 10–5000, honeypot empty (prototype P1584–1592)
export function validate(f: Fields): Check {
  const name = f.name.trim(), email = f.email.trim(), subject = (f.subject ?? '').trim(), message = f.message.trim();
  if ((f.website ?? '').trim()) return { ok: 'drop' };
  if (!name) return { ok: false, field: 'name', error: 'Add your name.' };
  if (name.length > 100) return { ok: false, field: 'name', error: 'Keep your name under 100 characters.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, field: 'email', error: 'Add an email address I can reply to.' };
  if (subject.length > 150) return { ok: false, field: 'subject', error: 'Keep the subject under 150 characters.' };
  if (message.length < 10) return { ok: false, field: 'message', error: 'Tell me a little more about the project (at least 10 characters).' };
  if (message.length > 5000) return { ok: false, field: 'message', error: 'Keep the message under 5000 characters.' };
  return { ok: true };
}
