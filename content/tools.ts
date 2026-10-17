import { entries } from './entries';
import stack from './stack.json';

export type Tool = { name: string; logo?: string; icon?: string; letters?: string; dark: boolean };

export const TOOLS = new Map(entries<Tool>('tools').map(({ slug, ...t }) => [slug, t]));
// A row entry whose tool was deleted is skipped instead of failing the build.
export const STACK: Tool[][] = stack.rows.map(r => r.tools.flatMap(s => TOOLS.get(s) ?? []));
