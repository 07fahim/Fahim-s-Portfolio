// Keystatic writes no key for '' or null and keeps false, [] and numbers; migrations and the round-trip test use the same rule.
export const prune = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(prune)
    : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([, x]) => x !== '' && x !== null).map(([k, x]) => [k, prune(x)]))
      : v;
