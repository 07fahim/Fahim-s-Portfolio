import { collection, config, fields, singleton } from '@keystatic/core';
import { LUCIDE } from './components/icons';

import categories from './content/categories.json';

const json = { data: 'json' } as const;
const link = (label: string) => fields.url({ label, validation: { isRequired: true } });

const FILTERS = (categories as { items: { key: string; label: string }[] }).items.map(({ key, label }) => ({ label, value: key }));
const ICONS = Object.keys(LUCIDE).map(v => ({ label: v, value: v }));
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
          filter: fields.select({ label: 'VIEW PROJECTS opens this filter', options: FILTERS, defaultValue: FILTERS[0].value }),
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
    filters: singleton({
      label: 'Project filters', path: 'content/categories', format: json,
      schema: {
        items: fields.array(fields.object({
          label: text('Name', 'Shown on the filter button, for example Voice AI'),
          key: fields.text({ label: 'Code', description: 'Lowercase letters, numbers and dashes. Projects and services point to it, so never change it once used.', validation: { isRequired: true, pattern: { regex: /^[a-z0-9-]+$/, message: 'Use lowercase letters, numbers and dashes only' } } }),
        }), { label: 'Filters in button order (All always comes first)', description: 'A new filter shows up in the project and service lists after the site redeploys, about 2 minutes after saving. Before deleting a filter, remove it from every project and service that uses it.', validation: { length: { min: 1 } }, itemLabel: p => p.fields.label.value }),
      },
    }),
    stack: singleton({
      label: 'Stack rows', path: 'content/stack', format: json,
      schema: {
        rows: fields.array(fields.object({
          tools: fields.array(fields.relationship({ label: 'Tool', collection: 'tools', validation: { isRequired: true } }), { label: 'Tools', itemLabel: p => p.value ?? '' }),
        }), { label: 'Rows', validation: { length: { min: 1 } }, itemLabel: p => p.fields.tools.elements.map(e => e.value).join(', ') }),
      },
    }),
    work: singleton({
      label: 'Project order', path: 'content/work', format: json,
      schema: {
        order: fields.array(fields.relationship({ label: 'Project', collection: 'projects', validation: { isRequired: true } }), {
          label: 'Projects, top to bottom', description: 'The big cards follow this order too. A project missing here goes last.', itemLabel: p => p.value ?? '',
        }),
      },
    }),
  },
  collections: {
    projects: collection({
      label: 'Projects', path: 'content/projects/*', slugField: 'title', format: json, columns: ['title', 'type'],
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } }, slug: { label: 'Address', description: 'Used in links to this project. Changing it later breaks old links.' } }),
        type: text('Type line', 'Under the picture, for example RAG / Legal AI'),
        cats: fields.multiselect({ label: 'Filters', options: FILTERS }),
        desc: long('Description', 'Shown when the card is hovered.'),
        stack: list('Stack (the small card shows the first four)', 'Tool'),
        repo: fields.url({ label: 'GitHub link', validation: { isRequired: true } }),
        live: fields.url({ label: 'Live demo link' }),
        image: fields.image({ label: 'Picture', description: 'JPG or WebP, about 1600 px wide and under 500 KB. It is shown exactly as uploaded.', directory: 'public/pimg', publicPath: '/pimg/' }),
        stock: fields.checkbox({ label: 'Stock photo', description: 'Tinted to match the site and skipped by screen readers.' }),
        kpi: fields.text({ label: 'Big word', description: 'Shown instead of a picture when there is none.' }),
        icon: fields.select({ label: 'Icon', options: ICONS, defaultValue: 'globe' }),
        // A plain tick box, not a conditional: unticking moves the project to More projects but keeps its big-card text for later (user, 2026-10-18).
        featured: fields.checkbox({ label: 'Big card at the top of Work', description: 'Untick to move it down to More projects. The big-card text below is kept.' }),
        card: fields.object({
          tags: list('Tags', 'Tag'),
          lede: fields.text({ label: 'Intro', multiline: true }),
          number: fields.object({ value: fields.text({ label: 'Number' }), label: fields.text({ label: 'What the number means' }) }, { label: 'Headline number (leave both empty for none)' }),
          points: list('Points', 'Point'),
          stack: list('Full stack', 'Tool'),
          diagram: fields.checkbox({ label: 'Show the n8n workflow diagram instead of the picture' }),
          alt: fields.text({ label: 'Picture description for screen readers' }),
        }, { label: 'Big card text (used only while the box above is ticked)' }),
      },
    }),
    tools: collection({
      label: 'Stack tools', path: 'content/tools/*', slugField: 'name', format: json, columns: ['name'],
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } }, slug: { label: 'Address', description: 'Stack rows point to it. Changing it drops the tool from its row until you add it there again.' } }),
        logo: fields.image({ label: 'Logo (SVG or PNG)', description: 'SVG, or a small square PNG. Used first when set.', directory: 'public/logos', publicPath: '/logos/' }),
        icon: fields.select({ label: 'Built-in icon', description: 'Used when there is no logo.', options: [{ label: 'None', value: '' }, ...ICONS], defaultValue: '' }),
        letters: fields.text({ label: 'Letters', description: 'Up to 2, used when there is no logo or icon. Left empty, the first two letters of the name are shown.', validation: { length: { max: 2 } } }),
        dark: fields.checkbox({ label: 'Near-black logo', description: 'Shown white on hover in dark mode.' }),
      },
    }),
  },
});
