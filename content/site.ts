import data from './site.json';

// The links and the CV are edited in the admin (content/site.json); the rest is set in code.
const { resume, ...links } = data;
export const SITE = {
  name: 'Fahim Faiyaz',
  ...links,
  githubBase: 'https://github.com/07fahim/',
  cv: resume,
  umami: '6d1ee970-13a2-4a90-9443-2e52643b3d40',
} as const;
