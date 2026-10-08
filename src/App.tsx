import { useMemo, useState } from 'react';
import { BookOpen, Library } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import type { ReadingStatus } from '@/types';
import { STATUS_ORDER } from '@/types';
import AddBookForm from '@/components/AddBookForm';
import BookCard from '@/components/BookCard';
import Summary from '@/components/Summary';
import FilterTabs, { filterBooks, type FilterValue } from '@/components/FilterTabs';

export default function App() {
  const { books, addBook, cycleStatus, setStatus, removeBook } = useBooks();
  const [filter, setFilter] = useState<FilterValue>('all');

  const counts = useMemo(() => {
    const c: Record<FilterValue, number> = {
      all: books.length,
      'want-to-read': 0,
      'reading': 0,
      'finished': 0,
    };
    for (const b of books) c[b.status]++;
    return c;
  }, [books]);

  const visibleBooks = useMemo(
    () => filterBooks(books, filter),
    [books, filter]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white">
              <Library className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Reading List</h1>
              <p className="text-sm text-slate-500">
                {books.length === 0
                  ? 'Track books you want to read'
                  : `${books.length} ${books.length === 1 ? 'book' : 'books'} on your shelf`}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Add form */}
        <AddBookForm onAdd={addBook} />

        {/* Summary */}
        {books.length > 0 && (
          <div className="mt-6">
            <Summary
              total={books.length}
              reading={counts['reading']}
              finished={counts['finished']}
            />
          </div>
        )}

        {/* Filters */}
        {books.length > 0 && (
          <div className="mt-6">
            <FilterTabs active={filter} counts={counts} onChange={setFilter} />
          </div>
        )}

        {/* List / empty state */}
        {books.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
            <BookOpen className="h-12 w-12 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-600">
              Your reading list is empty. Add your first book.
            </p>
          </div>
        ) : visibleBooks.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
            <BookOpen className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-slate-500">
              No books in this category yet.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {visibleBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onCycle={cycleStatus}
                onSetStatus={setStatus}
                onRemove={removeBook}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-2xl px-4 pb-8 pt-4 text-center text-xs text-slate-400">
        Saved locally in your browser
      </footer>
    </div>
  );
}
