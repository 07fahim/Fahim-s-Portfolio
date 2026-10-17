'use client';
import { useEffect, useRef } from 'react';
import { mountSilk } from '@/lib/silk';

export default function Background() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => mountSilk(host.current!), []);
  return <div id="bg" ref={host} aria-hidden="true"><canvas /></div>;
}
