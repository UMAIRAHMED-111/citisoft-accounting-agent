import { useState } from 'react';
import { FileText, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { IconButton } from '../ds';

export interface PdfViewerProps {
  url: string;
  title: string;
  defaultOpen?: boolean;
}

export function PdfViewer({ url, title, defaultOpen = false }: PdfViewerProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--surface-card)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: '0 var(--space-5)',
          height: 48,
          borderBottom: open ? '1px solid var(--border-subtle)' : 'none',
          background: 'var(--surface-card)',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(v => !v); }}
      >
        <FileText
          size={16}
          style={{ color: 'var(--accent)', flexShrink: 0 }}
        />
        <span
          style={{
            flex: 1,
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--text-strong)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>

        {/* Open in new tab — stop propagation so it doesn't toggle the panel */}
        <IconButton
          icon={<ExternalLink size={14} />}
          label="Open in new tab"
          variant="ghost"
          size="sm"
          onClick={e => {
            e.stopPropagation();
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
        />

        <span
          style={{
            color: 'var(--text-muted)',
            display: 'inline-flex',
            transition: 'transform var(--dur) var(--ease-out)',
            transform: open ? 'rotate(0deg)' : 'rotate(0deg)',
          }}
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>

      {/* PDF iframe */}
      {open && (
        <div
          className="cs-pdf-body"
          style={{
            animation: 'csPdfSlide var(--dur) var(--ease-out)',
          }}
        >
          <style>{`
            @keyframes csPdfSlide {
              from { opacity: 0; transform: translateY(-6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @media (prefers-reduced-motion: reduce) {
              .cs-pdf-body { animation: none !important; opacity: 1 !important; transform: none !important; }
            }
          `}</style>
          <iframe
            src={url}
            title={title}
            style={{ width: '100%', height: 520, border: 'none', display: 'block' }}
          />
        </div>
      )}
    </div>
  );
}
