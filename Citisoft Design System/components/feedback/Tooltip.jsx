import React from 'react';

/** Tooltip — dark label on hover/focus. Wraps a single trigger child. */
export function Tooltip({ label, placement = 'top', children, style = {} }) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' },
  }[placement];

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          style={{
            position: 'absolute', zIndex: 900, ...pos,
            background: 'var(--slate-800)', color: '#fff',
            fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 500,
            padding: '6px 10px', borderRadius: 'var(--radius-sm)',
            whiteSpace: 'nowrap', boxShadow: 'var(--shadow-lg)',
            pointerEvents: 'none', letterSpacing: '0.005em', ...style,
          }}
        >
          {label}
        </span>
      )}
    </span>
  );
}
