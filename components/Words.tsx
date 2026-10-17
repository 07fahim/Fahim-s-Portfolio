import { splitWords } from '@/lib/words';

// one span per word so the scroll and open effects can light them one by one (prototype P725–731)
export default function Words({ text }: { text: string }) {
  return <>{splitWords(text).map((w, i) => /^\s+$/.test(w) ? w : <span key={i}>{w}</span>)}</>;
}
