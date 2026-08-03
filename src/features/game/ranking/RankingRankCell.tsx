import { Medal } from 'lucide-react';

function rankToneClass(position: number): string {
  if (position === 1) return 'text-primary';
  if (position === 2) return 'text-muted-foreground';
  if (position === 3) return 'text-amber-600';
  return 'text-foreground';
}

type Props = {
  position: number;
};

export function RankingRankCell({ position }: Props) {
  const tone = rankToneClass(position);
  if (position <= 3) {
    return <Medal className={`inline h-5 w-5 shrink-0 ${tone}`} aria-hidden />;
  }
  return <span className={`font-heading font-black ${tone}`}>{position}</span>;
}
