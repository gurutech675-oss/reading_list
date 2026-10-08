import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import type { ReadingStatus } from '@/types';
import { STATUS_LABELS, STATUS_ORDER } from '@/types';
import { MAX_TITLE_LENGTH, type AddResult } from '@/hooks/useBooks';

interface Props {
  onAdd: (title: string, status: ReadingStatus) => AddResult;
}

const ERROR_MESSAGES: Record<string, string> = {
  duplicate: 'This book is already in your reading list.',
  'too-long': 'Book title must be 60 characters or fewer.',
};

export default function AddBookForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<ReadingStatus>('want-to-read');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    if (trimmed.length > MAX_TITLE_LENGTH) {
      setError(ERROR_MESSAGES['too-long']);
      return;
    }

    const result = onAdd(title, status);
    if (result.ok) {
      setTitle('');
      setStatus('want-to-read');
      setError(null);
      setOpen(false);
    } else {
      setError(ERROR_MESSAGES[result.reason]);
    }
  };

  const remaining = MAX_TITLE_LENGTH - title.length;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border-2 border-dashed border-slate-300 py-4 text-slate-500 font-medium transition-colors hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50/50"
      >
        <span className="inline-flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add a book
        </span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setError(null);
        }}
        placeholder="Book title"
        className={`w-full rounded-lg border px-3 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-slate-300 focus:border-sky-500 focus:ring-sky-200'
        }`}
      />

      {/* Character counter */}
      {title.length > 0 && (
        <div
          className={`mt-1.5 text-right text-xs ${
            remaining < 0 ? 'text-red-500' : 'text-slate-400'
          }`}
        >
          {title.length} / {MAX_TITLE_LENGTH}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              status === s
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add to list
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setTitle('');
            setStatus('want-to-read');
            setError(null);
          }}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
