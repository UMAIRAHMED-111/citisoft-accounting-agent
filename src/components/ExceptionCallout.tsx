import { AlertTriangle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Exception } from '../data/reconcile';

export interface ExceptionCalloutProps {
  exception: Exception;
}

export function ExceptionCallout({ exception }: ExceptionCalloutProps) {
  const isAp = exception.type.startsWith('ap_');
  const borderColor = isAp ? 'var(--rose-500)' : 'var(--warning-500)';
  const chipBg    = isAp ? 'var(--rose-050)' : 'var(--warning-050)';
  const chipColor = isAp ? 'var(--rose-500)' : 'var(--warning-500)';
  const reviewPath = isAp ? '/po-matching' : '/ar-matching';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-card)',
        transition: `box-shadow var(--dur-fast) var(--ease-out)`,
      }}
    >
      {/* Icon chip */}
      <span
        style={{
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: 'var(--radius-sm)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: chipBg,
          color: chipColor,
        }}
      >
        {isAp ? <AlertTriangle size={16} /> : <AlertCircle size={16} />}
      </span>

      {/* Description */}
      <span
        style={{
          flex: 1,
          fontFamily: 'var(--font-sans)',
          fontSize: 14,
          color: 'var(--text-body)',
          lineHeight: 'var(--lh-normal)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: isAp ? 'var(--rose-500)' : 'var(--warning-500)',
            marginRight: 6,
          }}
        >
          {exception.ref}
        </span>
        {exception.description
          .replace(new RegExp(`AP invoice ${exception.ref}:\\s*`, ''), '')
          .replace(exception.ref + ':', '')
          .replace(exception.ref, '')
          .trim()
          .replace(/^:\s*/, '')}
      </span>

      {/* Review link */}
      <Link
        to={reviewPath}
        style={{
          flexShrink: 0,
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--accent)',
          textDecoration: 'none',
          transition: `color var(--dur-fast) var(--ease-out)`,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none'; }}
      >
        Review
      </Link>
    </div>
  );
}
