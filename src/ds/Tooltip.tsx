import React from 'react';

export interface TooltipProps {
  label: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Tooltip({ label, placement = 'top', children, style = {} }: TooltipProps) {
  const [show, setShow] = React.useState(false);
  const pos: Record<string, React.CSSProperties> = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' },
  };

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
            position: 'absolute', zIndex: 900, ...pos[placement],
            background: 'var(--slate-800)', color: 'var(--text-on-brand)',
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
