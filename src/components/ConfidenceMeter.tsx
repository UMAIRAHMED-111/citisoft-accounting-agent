import React from 'react';

export interface ConfidenceMeterProps {
  value: number; // 0–1
  style?: React.CSSProperties;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function ConfidenceMeter({ value, style = {} }: ConfidenceMeterProps) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);

  const trackColor =
    pct >= 90
      ? 'var(--blue-100)'
      : pct >= 60
      ? 'var(--warning-050)'
      : 'var(--rose-050)';

  const fillColor =
    pct >= 90
      ? 'var(--accent)'
      : pct >= 60
      ? 'var(--warning-500)'
      : 'var(--rose-500)';

  const labelColor =
    pct >= 90
      ? 'var(--accent)'
      : pct >= 60
      ? 'var(--warning-600)'
      : 'var(--rose-600)';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        ...style,
      }}
    >
      <div
        role="meter"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Confidence ${pct}%`}
        style={{
          flex: 1,
          height: 6,
          borderRadius: 'var(--radius-pill)',
          background: trackColor,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 'var(--radius-pill)',
            background: fillColor,
            transition: prefersReducedMotion() ? 'none' : 'width var(--dur) var(--ease-out)',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--fs-caption)',
          fontWeight: 'var(--fw-semibold)',
          color: labelColor,
          minWidth: 36,
          textAlign: 'right',
        }}
      >
        {pct}%
      </span>
    </div>
  );
}
