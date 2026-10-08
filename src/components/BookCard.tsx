import { Trash2, ChevronRight } from 'lucide-react';
import type { Book, ReadingStatus } from '@/types';
import { STATUS_LABELS, STATUS_ORDER } from '@/types';

const STATUS_STYLES: Record<ReadingStatus, string> = {
  'want-to-read': 'bg-amber-50 text-amber-700 border-amber-200',
  'reading': 'bg-sky-50 text-sky-700 border-sky-200',
  'finished': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

interface Props {
  book: Book;
  onCycle: (id: string) => void;
  onSetStatus: (id: string, status: ReadingStatus) => void;
  onRemove: (id: string) => void;
}

export default function BookCard({ book, onCycle, onSetStatus, onRemove }: Props) {
  const nextLabel =
    book.status === 'want-to-read'
      ? 'Start reading'
      : book.status === 'reading'
        ? 'Mark finished'
        : 'Read again';

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-slate-800">
          {book.title}
        </h3>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[book.status]}`}
        >
          {STATUS_LABELS[book.status]}
        </span>

        {/* Quick status dropdown */}
        <div className="relative">
          <select
            value={book.status}
            onChange={(e) => onSetStatus(book.id, e.target.value as ReadingStatus)}
            className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 focus:outline-none"
            aria-label="Change status"
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <button
          onClick={() => onCycle(book.id)}
          className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 transition-colors hover:text-sky-700"
        >
          {nextLabel}
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => onRemove(book.id)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}
