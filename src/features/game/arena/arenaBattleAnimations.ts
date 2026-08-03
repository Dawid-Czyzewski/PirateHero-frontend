import type { FighterAnim } from './arenaTypes';

export function fighterAnimClass(anim: FighterAnim, side: 'left' | 'right'): string {
  if (anim === 'attack') return side === 'left' ? 'translate-x-12 scale-110' : '-translate-x-12 scale-110';
  if (anim === 'hit') return side === 'left' ? '-translate-x-3 scale-95 brightness-150' : 'translate-x-3 scale-95 brightness-150';
  return '';
}
