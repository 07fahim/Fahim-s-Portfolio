import type { NextConfig } from 'next';

// Strict mode is off: the ported engines (hero, Silk, game) drive the DOM directly, and a
// development double mount would run two openings at once. Every engine still cleans up on unmount.
// globalNotFound: the site and the admin are separate root layouts, so app/global-not-found.tsx renders the 404.
const config: NextConfig = { reactStrictMode: false, experimental: { globalNotFound: true } };
export default config;
