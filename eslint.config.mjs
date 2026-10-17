import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // plain <img>: the hero photo is sampled by WebGL and the ported CSS sizes every image itself
  { rules: { '@next/next/no-img-element': 'off' } },
  globalIgnores(['.next/**', 'docs/**', '.playwright-mcp/**', 'next-env.d.ts']),
]);
