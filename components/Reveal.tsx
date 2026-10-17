'use client';
import { useEffect } from 'react';
import { mountReveal } from '@/lib/reveal';

export default function Reveal() {
  useEffect(() => mountReveal(), []);
  return null;
}
