'use client';

import { memo, useCallback } from 'react';
import { Check, Save, Pen } from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────

interface NotesPanelProps {
  contextLabel: string | null;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  isSaved: boolean;
  justSaved: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NotesPanel = memo(function NotesPanel({
  contextLabel,
  value,
  onChange,
  onSave,
  isSaved,
  justSaved,
}: NotesPanelProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value),
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSave();
      }
    },
    [onSave],
  );

  const hasContext = contextLabel !== null;

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-3">
        <Pen className="w-3 h-3 text-muted-foreground/60" />
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Notes
        </h3>
        {hasContext && (
          <>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-[10px] text-muted-foreground/70 truncate font-medium">
              {contextLabel}
            </span>
          </>
        )}
      </div>

      {/* ── Textarea ──────────────────────────────────── */}
      <textarea
        id="notes-textarea"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={
          hasContext
            ? 'Write something…'
            : 'Select a date first'
        }
        disabled={!hasContext}
        aria-label="Notes"
        className="
          flex-1 w-full min-h-[8rem] p-3
          text-[13px] font-light leading-6
          bg-background/60 border border-border/60 rounded-lg
          placeholder:text-muted-foreground/50
          focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/15
          focus:bg-background
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-all duration-200 ease-out
          resize-none
        "
        style={{
          backgroundImage: hasContext
            ? 'repeating-linear-gradient(transparent, transparent 23px, color-mix(in oklch, var(--border) 30%, transparent) 23px, color-mix(in oklch, var(--border) 30%, transparent) 24px)'
            : 'none',
          paddingTop: '8px',
          lineHeight: '24px',
        }}
      />

      {/* ── Footer ────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 mt-2">
        <span className="text-[10px] text-muted-foreground/50 tabular-nums tracking-wide">
          {value.length > 0 ? `${value.length} chars` : ''}
        </span>

        <button
          type="button"
          onClick={onSave}
          disabled={!hasContext || isSaved}
          aria-label="Save notes"
          className="
            flex items-center gap-1 px-2.5 py-1
            text-[10px] font-bold uppercase tracking-wider rounded-md
            transition-all duration-200
            disabled:opacity-30 disabled:cursor-not-allowed
            bg-primary/8 text-primary
            hover:bg-primary/15 active:scale-95
          "
        >
          {justSaved ? (
            <>
              <Check className="w-2.5 h-2.5" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-2.5 h-2.5" />
              Save
            </>
          )}
        </button>
      </div>
    </div>
  );
});
