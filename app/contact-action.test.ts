import { afterEach, describe, expect, test, vi } from 'vitest';
import { sendContact } from './contact-action';

const good = { name: 'Ayesha', email: 'ayesha@company.com', subject: '', message: 'We need a chatbot for our policy PDFs.', website: '' };
const ok = () => new Response('{"id":"x"}', { status: 200 });

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('sendContact', () => {
  test('a valid message is sent to the inbox with reply-to set to the visitor', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test');
    const fetch = vi.fn(async () => ok()); vi.stubGlobal('fetch', fetch);
    expect(await sendContact(good)).toEqual({ ok: true });
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer re_test');
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({ to: ['faiyazfahim743@gmail.com'], reply_to: 'ayesha@company.com', from: 'Portfolio <onboarding@resend.dev>' });
    expect(body.text).toContain('We need a chatbot for our policy PDFs.');
  });
  test('a filled honeypot looks sent but sends nothing', async () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    expect(await sendContact({ ...good, website: 'spam.example' })).toEqual({ ok: true });
    expect(fetch).not.toHaveBeenCalled();
  });
  test('invalid input is rejected on the server without sending', async () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    expect(await sendContact({ ...good, email: 'ayesha@' })).toMatchObject({ ok: false, field: 'email' });
    expect(fetch).not.toHaveBeenCalled();
  });
  test('a malformed call (missing or non-string fields) is rejected without throwing or sending', async () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    expect(await sendContact({ ...good, name: 42 } as never)).toMatchObject({ ok: false, field: 'name' });
    expect(await sendContact({ email: 'a@b.co' } as never)).toMatchObject({ ok: false, field: 'name' });
    expect(await sendContact(null as never)).toMatchObject({ ok: false, field: 'name' });
    expect(fetch).not.toHaveBeenCalled();
  });
  test('the email subject stays on one line', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test');
    const fetch = vi.fn(async () => ok()); vi.stubGlobal('fetch', fetch);
    await sendContact({ ...good, subject: 'Hi\nBcc: x@y.z' });
    const init = (fetch.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect(JSON.parse(init.body as string).subject).toBe('Portfolio: Hi Bcc: x@y.z (from Ayesha)');
  });
  test('a Resend error or a missing key reports a send failure', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 422 })));
    expect(await sendContact(good)).toEqual({ ok: false, error: 'send' });
    vi.stubEnv('RESEND_API_KEY', '');
    expect(await sendContact(good)).toEqual({ ok: false, error: 'send' });
  });
});
