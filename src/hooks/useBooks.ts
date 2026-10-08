import { useState, useEffect, useCallback, useRef } from 'react';
import type { Book, ReadingStatus } from '@/types';

const STORAGE_KEY = 'reading-list-books';

const STATUS_CYCLE: Record<ReadingStatus, ReadingStatus> = {
  'want-to-read': 'reading',
  'reading': 'finished',
  'finished': 'want-to-read',
};

export const MAX_TITLE_LENGTH = 60;

export type AddResult =
  | { ok: true }
  | { ok: false; reason: 'duplicate' | 'too-long' };

function loadBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Book[];
  } catch {
    // ignore parse errors
  }
  return [];
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>(loadBooks);
  const booksRef = useRef(books);
  booksRef.current = books;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch {
      // ignore storage errors
    }
  }, [books]);

  const addBook = useCallback(
    (title: string, status: ReadingStatus): AddResult => {
      const trimmed = title.trim().replace(/\s+/g, ' ');
      if (!trimmed) return { ok: false, reason: 'too-long' };
      if (trimmed.length > MAX_TITLE_LENGTH) return { ok: false, reason: 'too-long' };

      const normalized = trimmed.toLowerCase();
      if (booksRef.current.some((b) => b.title.toLowerCase() === normalized)) {
        return { ok: false, reason: 'duplicate' };
      }

      setBooks((prev) => [
        { id: crypto.randomUUID(), title: trimmed, status, addedAt: Date.now() },
        ...prev,
      ]);
      return { ok: true };
    },
    []
  );

  const cycleStatus = useCallback((id: string) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: STATUS_CYCLE[b.status] } : b
      )
    );
  }, []);

  const setStatus = useCallback((id: string, status: ReadingStatus) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  }, []);

  const removeBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return { books, addBook, cycleStatus, setStatus, removeBook };
}
