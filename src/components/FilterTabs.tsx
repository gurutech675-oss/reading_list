import { BookOpen, ListFilter } from 'lucide-react';
import type { ReadingStatus } from '@/types';
import { STATUS_LABELS, STATUS_ORDER } from '@/types';

export type FilterValue = 'all' | ReadingStatus;

interface Props {
  active: FilterValue;
  counts: Record<FilterValue, number>;
  onChange: (filter: FilterValue) => void;
}

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  ...STATUS_ORDER.map((s) => ({ value: s as FilterValue, label: STATUS_LABELS[s] })),
];

export default function FilterTabs({ active, counts, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <ListFilter className="h-4 w-4 shrink-0 text-slate-400" />
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            active === f.value
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            {f.label}
            <span
              className={`rounded-full px-1.5 text-xs ${
                active === f.value ? 'bg-white/20' : 'bg-white'
              }`}
            >
              {counts[f.value] ?? 0}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

export function filterBooks(
  books: { status: ReadingStatus }[],
  filter: FilterValue
) {
  if (filter === 'all') return books;
  return books.filter((b) => b.status === filter);
}

// Re-export for icon usage
export { BookOpen };
