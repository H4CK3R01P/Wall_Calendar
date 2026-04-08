'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseNotesReturn {
  /** Current textarea value (controlled). */
  value: string;
  /** Update the textarea value (does NOT auto-save). */
  setValue: (v: string) => void;
  /** Persist the current value to localStorage. */
  save: () => void;
  /** Whether the saved value matches the current value. */
  isSaved: boolean;
  /** True while the "Saved ✓" flash is showing. */
  justSaved: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Manages per-key notes backed by localStorage.
 *
 * - When `storageKey` changes (e.g. user selects a different date/range),
 *   the textarea immediately loads the stored value for that key.
 * - `save()` writes the current value and triggers the "Saved ✓" flash.
 * - `isSaved` is true when value === last persisted value.
 */
export function useNotes(storageKey: string | null): UseNotesReturn {
  const [value, setValue] = useState('');
  const [savedValue, setSavedValue] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage whenever the key changes
  useEffect(() => {
    if (!storageKey) {
      setValue('');
      setSavedValue('');
      return;
    }
    try {
      const stored = localStorage.getItem(storageKey) ?? '';
      setValue(stored);
      setSavedValue(stored);
    } catch {
      // localStorage unavailable (SSR / private mode)
      setValue('');
      setSavedValue('');
    }
  }, [storageKey]);

  const save = useCallback(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, value);
      setSavedValue(value);
      setJustSaved(true);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setJustSaved(false), 1800);
    } catch {
      // ignore write errors
    }
  }, [storageKey, value]);

  return {
    value,
    setValue,
    save,
    isSaved: value === savedValue,
    justSaved,
  };
}
