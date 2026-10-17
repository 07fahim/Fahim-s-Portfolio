import { describe, expect, test } from 'vitest';
import { validate } from './validate';

const good = { name: 'Ayesha', email: 'ayesha@company.com', message: 'We need a chatbot for our policy PDFs.' };

describe('contact validation', () => {
  test('valid input passes', () => expect(validate(good)).toEqual({ ok: true }));
  test('name is required and at most 100 characters', () => {
    expect(validate({ ...good, name: '  ' })).toMatchObject({ ok: false, field: 'name' });
    expect(validate({ ...good, name: 'x'.repeat(101) })).toMatchObject({ ok: false, field: 'name' });
  });
  test('email must look like an address', () => expect(validate({ ...good, email: 'ayesha@' })).toMatchObject({ ok: false, field: 'email' }));
  test('subject is optional and at most 150 characters', () => {
    expect(validate({ ...good, subject: '' })).toEqual({ ok: true });
    expect(validate({ ...good, subject: 'x'.repeat(151) })).toMatchObject({ ok: false, field: 'subject' });
  });
  test('message is 10 to 5000 characters', () => {
    expect(validate({ ...good, message: 'Too short' })).toMatchObject({ ok: false, field: 'message' });
    expect(validate({ ...good, message: 'x'.repeat(5001) })).toMatchObject({ ok: false, field: 'message' });
  });
  test('a filled honeypot is dropped silently', () => expect(validate({ ...good, website: 'spam.example' })).toEqual({ ok: 'drop' }));
});
