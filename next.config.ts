import type { NextConfig } from 'next';

// Strict mode is off: the ported engines (hero, Silk, game) drive the DOM directly, and a
// development double mount would run two openings at once. Every engine still cleans up on unmount.
const config: NextConfig = { reactStrictMode: false };
export default config;
