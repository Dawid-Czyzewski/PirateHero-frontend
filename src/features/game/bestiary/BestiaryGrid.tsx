import { BestiaryEntryCard } from './BestiaryEntryCard';
import type { BestiaryEntryView } from './useBestiaryState';

type Props = {
  entries: BestiaryEntryView[];
  highlightEnemyId?: string | null;
  onSelect: (entry: BestiaryEntryView) => void;
};

export function BestiaryGrid({ entries, highlightEnemyId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
      {entries.map((entry) => (
        <BestiaryEntryCard
          key={entry.enemyId}
          entry={entry}
          highlighted={highlightEnemyId === entry.enemyId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
