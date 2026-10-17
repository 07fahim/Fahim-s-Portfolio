export const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
