export type Pins = { tops: number[]; minHeight: number; tall: boolean };

// The stacked cards' offsets. Space below the card is `room`; if a card plus 4 px edges cannot fit,
// every card holds with its bottom 16 px above the screen's bottom and the next slides over it.
export function computePins({ viewport, heights, wide }: { viewport: number; heights: number[]; wide: boolean }): Pins {
  const n = heights.length, H = Math.max(...heights), room = viewport - H - 16;
  const base = Math.max(Math.min(viewport * (wide ? 0.12 : 0.09), room - (n - 1) * 8), Math.min(70, room));
  const step = n > 1 ? Math.max(0, Math.min(wide ? 26 : 16, (room - base) / (n - 1))) : 0;
  const tall = room < 70 + (n - 1) * 4;
  return { tops: heights.map((_, k) => tall ? room : base + k * step), minHeight: H, tall };
}
