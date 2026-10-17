import { config, fields, singleton } from '@keystatic/core';

const json = { data: 'json' } as const;
const link = (label: string) => fields.url({ label, validation: { isRequired: true } });

export default config({
  // Local files under `next dev`; in production the admin signs in with GitHub and every save is a commit to main, which Vercel deploys.
  storage: process.env.NODE_ENV === 'development' ? { kind: 'local' } : { kind: 'github', repo: '07fahim/Fahim-s-Portfolio' },
  ui: { brand: { name: 'Fahim Faiyaz' } },
  singletons: {
    site: singleton({
      label: 'Contact links and CV', path: 'content/site', format: json,
      schema: {
        email: fields.text({ label: 'Email', description: 'Contact form messages are sent here.', validation: { isRequired: true, pattern: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' } } }),
        whatsapp: link('WhatsApp link'),
        upwork: link('Upwork profile'),
        fiverr: link('Fiverr profile'),
        linkedin: link('LinkedIn profile'),
        github: link('GitHub profile'),
        resume: fields.file({ label: 'CV (PDF)', description: 'Replaces the file behind every Download CV link.', directory: 'public', publicPath: '/', validation: { isRequired: true } }),
      },
    }),
    bio: singleton({
      label: 'About text', path: 'content/bio', format: json,
      schema: {
        paragraphs: fields.array(fields.text({ label: 'Paragraph', multiline: true, validation: { isRequired: true } }), {
          label: 'Paragraphs', description: 'Put **double stars** around words to make them bold.', itemLabel: p => p.value.slice(0, 80),
        }),
      },
    }),
  },
});
