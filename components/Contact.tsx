'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { SITE } from '@/content/site';
import { validate, type Fields } from '@/lib/validate';
import { sendContact } from '@/app/contact-action';
import { Github, Linkedin, Mask } from './icons';

const ROWS = [
  ['Email', SITE.email, 'mailto:' + SITE.email, <Mail key="i" />],
  ['LinkedIn', 'in/fahim-faiyaz', SITE.linkedin, <Linkedin key="i" />],
  ['GitHub', '@07fahim', SITE.github, <Github key="i" />],
  ['Upwork', 'Hire me on Upwork', SITE.upwork, <Mask key="i" name="upwork" />],
  ['Fiverr', 'fahimfaiyaz325', SITE.fiverr, <Mask key="i" name="fiverr" />],
] as const;
const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dhaka', hour: 'numeric', minute: '2-digit' });

function DhakaTime() {   // a client in another time zone sees when to expect a reply
  const [t, setT] = useState('');
  useEffect(() => { const tick = () => setT(fmt.format(new Date())); tick(); const id = setInterval(tick, 30000); return () => clearInterval(id); }, []);
  return <span>{t}</span>;
}

function CopyEmail() {
  const [msg, setMsg] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = () => {
    clearTimeout(timer.current);
    if (!navigator.clipboard) { setMsg(' Select and copy the address'); return; }
    navigator.clipboard.writeText(SITE.email).then(() => { setMsg(' Copied'); timer.current = setTimeout(() => setMsg(''), 2000); }, () => setMsg(' Select and copy the address'));
  };
  return <><button className="copy" type="button" style={{ margin: 0 }} onClick={copy}>Copy email</button><span className="copied" role="status" aria-live="polite">{msg}</span></>;
}

function ContactForm() {
  const [error, setError] = useState<{ field: string; text: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null);
  const note = useRef<HTMLDivElement>(null);
  useEffect(() => { if (sent) note.current?.focus(); }, [sent]);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const form = e.currentTarget, data = Object.fromEntries(new FormData(form)) as unknown as Fields, r = validate(data);
    if (r.ok === 'drop') return;
    if (r.ok === false) { setError({ field: r.field, text: r.error }); setFailed(false); (form.elements.namedItem(r.field) as HTMLElement).focus(); return; }
    setError(null); setFailed(false); setPending(true);
    const res = await sendContact(data).catch(() => ({ ok: false, error: 'send' }) as const);
    setPending(false);
    if (res.ok) { (window as { umami?: { track: (e: string) => void } }).umami?.track('contact_submit'); setSent({ name: data.name.trim(), email: data.email.trim() }); return; }
    if ('field' in res) { setError({ field: res.field, text: res.error }); (form.elements.namedItem(res.field) as HTMLElement).focus(); return; }
    setFailed(true);   // the form keeps everything typed
  };
  // the note takes the form's place in the grid, as the prototype's outerHTML swap did
  if (sent) return <div className="sent" ref={note} tabIndex={-1}>Thanks, {sent.name}. Your message is on its way, and I’ll reply to {sent.email}.</div>;
  const bad = (f: string) => error?.field === f ? { 'aria-invalid': true, 'aria-describedby': 'ct-err' } : {};
  return (
    <form className="glass" noValidate onSubmit={submit} aria-busy={pending}>
      <label className="hp" aria-hidden="true">Leave this empty <input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div><h3>Send a message</h3><p className="sub">I’ll reply to the email you leave here.</p></div>
      <div className="two">
        <label className="f">Name <input name="name" autoComplete="name" placeholder="Your name" maxLength={100} required {...bad('name')} /></label>
        <label className="f">Email <input name="email" type="email" autoComplete="email" placeholder="you@company.com" required {...bad('email')} /></label>
      </div>
      <label className="f"><span>Subject <i>(optional)</i></span><input name="subject" maxLength={150} placeholder="e.g. a chatbot that answers from our documents" {...bad('subject')} /></label>
      <label className="f">Message <textarea name="message" placeholder="The problem, your data and the result you want." maxLength={5000} required {...bad('message')} /></label>
      <p className="err" id="ct-err" role="alert">{error?.text}{failed && <>The message didn’t send. Email me at <a href={'mailto:' + SITE.email}>{SITE.email}</a> instead.</>}</p>
      <button className="btn solid send" type="submit" disabled={pending}>{pending ? 'Sending…' : <>Send message <span aria-hidden="true">→</span></>}</button>
    </form>
  );
}

export default function Contact() {
  return (
    <section className="ct" id="contact">
      <div className="label">Contact</div>
      <h2 className="silver">LET’S TALK</h2>
      <div className="c4">
        <div className="glass">
          <div><h3>Contact information</h3><p className="sub">Tell me what you want to build. Messages come straight to my inbox.</p></div>
          <div className="quick">
            <a className="btn solid" href={SITE.whatsapp} target="_blank" rel="noopener">Message on WhatsApp <Mask name="whatsapp" /></a>
            <a className="btn" href={'mailto:' + SITE.email}>Send an email <Mail /></a>
          </div>
          <ul className="info">
            {ROWS.map(([label, value, href, icon]) => (
              <li key={label}><a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}>
                <span className="tile" aria-hidden="true">{icon}</span><span><small>{label}</small><span className="v">{value}</span></span><span className="go" aria-hidden="true">↗</span>
              </a></li>
            ))}
            <li><div className="loc"><span className="tile" aria-hidden="true"><MapPin /></span><span><small>Location</small><span className="v">Bashundhara, Dhaka</span>
              <span style={{ display: 'block', fontSize: '.84rem', color: 'var(--muted)', marginTop: 2 }}><DhakaTime /> local time (GMT+6)</span></span></div></li>
          </ul>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 16px', marginTop: 'auto' }}><span className="avail">Available for freelance work</span><CopyEmail /></div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
