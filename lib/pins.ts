export type Pins = { tops: number[]; minHeight: number; tall: boolean; unpin: boolean };

// The stacked cards' offsets. Space below the card is `room`; if a card plus 4 px edges cannot fit,
// every card holds with its bottom 16 px above the screen's bottom and the next slides over it.
// `unpin` (user, 2026-10-19): the cards scroll like normal content instead. Always on phones: a card is taller than most
// phone browsers' page, and a toolbar resize must not flip the mode mid-scroll. On desktop only when a tall card's text
// (its top plus padding `pad`) would sit under the menu bar (`header` px tall).
export function computePins({ viewport, heights, wide, header = 0, pad = 0 }: { viewport: number; heights: number[]; wide: boolean; header?: number; pad?: number }): Pins {
  const n = heights.length, H = Math.max(...heights), room = viewport - H - 16;
  const base = Math.max(Math.min(viewport * (wide ? 0.12 : 0.09), room - (n - 1) * 8), Math.min(70, room));
  const step = n > 1 ? Math.max(0, Math.min(wide ? 26 : 16, (room - base) / (n - 1))) : 0;
  const tall = room < 70 + (n - 1) * 4;
  const tops = heights.map((_, k) => tall ? room : base + k * step);
  return { tops, minHeight: H, tall, unpin: !wide || (tall && tops[0] + pad < header) };
}

// Pre-paint (layout.tsx, user 2026-10-19): marks <html data-moved> on the visitor's first wheel, touch, key or pointer press,
// from before the page's scripts load, so the stacked cards' #hash re-aim (PinnedCardsEffects) never pulls back a visitor who scrolled.
export const MOVED_SCRIPT = `['wheel','touchstart','keydown','pointerdown'].forEach(function(t){addEventListener(t,function(){document.documentElement.setAttribute('data-moved','')},{once:true,passive:true,capture:true})})`;
