import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { MODE_SCRIPT } from '@/lib/mode';
import './styles/tokens.css';
import './styles/base.css';
import './styles/header.css';
import './styles/background.css';
import './styles/hero.css';
import './styles/about.css';
import './styles/services.css';
import './styles/work.css';

// one variable font file per style; weights 400–800 and the 300 italic all come from it
const inter = Inter({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Fahim Faiyaz · AI/ML Engineer',
  description: 'I’m Fahim Faiyaz, an AI/ML engineer in Dhaka. I build AI agents, automation workflows and document AI for businesses. Message me on WhatsApp or hire me on Upwork.',
  openGraph: { type: 'website', title: 'Fahim Faiyaz · AI/ML Engineer', description: 'I build AI agents, automation workflows and document AI for businesses.' },
  twitter: { card: 'summary' },
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
};
export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#141617' }, { media: '(prefers-color-scheme: light)', color: '#F3F4F4' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} /></head>
      <body>{children}</body>
    </html>
  );
}
