import React from 'react';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '../ds/IconButton';

// ---------------------------------------------------------------------------
// SearchField
// ---------------------------------------------------------------------------
export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

export function SearchField({ value, onChange, placeholder = 'Search…', style }: SearchFieldProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: 36,
        padding: '0 10px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        minWidth: 200,
        ...style,
      }}
    >
      <Search size={14} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: 'var(--font-sans)',
          fontSize: 13.5,
          color: 'var(--text-strong)',
          minWidth: 0,
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 18,
            height: 18,
            border: 'none',
            borderRadius: '50%',
            background: 'var(--surface-sunken)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <X size={11} />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pager
// ---------------------------------------------------------------------------
export interface PagerProps {
  page: number;        // 0-based
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
  style?: React.CSSProperties;
}

export function Pager({ page, pageSize, total, onPage, style }: PagerProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          color: 'var(--text-muted)',
          whiteSpace: 'nowrap',
        }}
      >
        {total === 0 ? 'No results' : `Showing ${from}–${to} of ${total}`}
      </span>
      <IconButton
        icon={<ChevronLeft size={15} />}
        label="Previous page"
        variant="secondary"
        size="sm"
        disabled={page === 0}
        onClick={() => onPage(page - 1)}
      />
      <IconButton
        icon={<ChevronRight size={15} />}
        label="Next page"
        variant="secondary"
        size="sm"
        disabled={page >= totalPages - 1}
        onClick={() => onPage(page + 1)}
      />
    </div>
  );
}
