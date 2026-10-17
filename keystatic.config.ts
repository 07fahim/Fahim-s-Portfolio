import { config, fields, singleton } from '@keystatic/core';

import categories from './content/categories.json';

const json = { data: 'json' } as const;
const link = (label: string) => fields.url({ label, validation: { isRequired: true } });

const FILTERS = (categories as [string, string][]).filter(([k]) => k !== 'all').map(([value, label]) => ({ label, value }));
const text = (label: string, description?: string) => fields.text({ label, description, validation: { isRequired: true } });
const long = (label: string, description?: string) => fields.text({ label, description, multiline: true, validation: { isRequired: true } });
const list = (label: string, item: string) => fields.array(fields.text({ label: item, validation: { isRequired: true } }), { label, itemLabel: p => p.value });

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
    services: singleton({
      label: 'Services', path: 'content/services', format: json,
      schema: {
        items: fields.array(fields.object({
          title: text('Title'),
          items: list('Bullet points', 'Point'),
          desc: long('Description'),
          filter: fields.select({ label: 'VIEW PROJECTS opens this filter', options: FILTERS, defaultValue: 'rag' }),
        }), { label: 'Services', itemLabel: p => p.fields.title.value }),
      },
    }),
    timeline: singleton({
      label: 'Timeline', path: 'content/timeline', format: json,
      schema: {
        entries: fields.array(fields.object({
          now: fields.checkbox({ label: 'Current (shows Now)' }),
          date: text('Dates'),
          role: text('Title'),
          org: text('Organisation'),
          where: fields.text({ label: 'Place' }),
          text: long('Text', 'A new line starts a new paragraph.'),
          tags: list('Tags', 'Tag'),
          more: fields.text({ label: 'Link to Papers and courses (optional)' }),
        }), { label: 'Entries, newest first', itemLabel: p => p.fields.role.value }),
      },
    }),
    achievements: singleton({
      label: 'Papers and courses', path: 'content/achievements', format: json,
      schema: {
        papers: fields.array(fields.object({
          title: text('Title'),
          venue: text('Venue'),
          year: fields.integer({ label: 'Year', validation: { isRequired: true } }),
          author: fields.integer({ label: 'Author position (1 = first author)', validation: { isRequired: true, min: 1 } }),
          topic: text('Topic'),
          doi: text('DOI', 'For example 10.1109/ICCIT68739.2025.11491547'),
        }), { label: 'Papers', itemLabel: p => p.fields.title.value }),
        courses: fields.array(fields.object({
          title: text('Title'),
          school: text('School'),
          year: fields.integer({ label: 'Year', validation: { isRequired: true } }),
          desc: long('Description'),
        }), { label: 'Courses', itemLabel: p => p.fields.title.value }),
      },
    }),
  },
});
