import { entries } from './entries';
import stack from './stack.json';

export type Tool = { name: string; logo?: string; icon?: string; letters?: string; dark: boolean };

export const TOOLS = new Map(entries<Tool>('tools').map(({ slug, ...t }) => [slug, t]));
// A row entry whose tool is gone is skipped here; the content check before each deploy stops the deploy and says which entry to fix.
export const STACK: Tool[][] = (stack as { rows: { tools: string[] }[] }).rows.map(r => r.tools.flatMap(s => TOOLS.get(s) ?? []));
