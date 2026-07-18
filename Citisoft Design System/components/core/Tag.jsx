import React from 'react';

/** Tag / chip — for filters, categories, removable selections. */
export function Tag({ children, onRemove, active = false, icon = null, style = {}, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 28,
    padding: onRemove ? '0 7px 0 11px' : '0 12px',
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1,
    borderRadius: 'var(--radius-pill)',
    cursor: rest.onClick ? 'pointer' : 'default',
    transition: 'all var(--dur) var(--ease-out)',
    background: active ? 'var(--surface-brand-tint)' : (hover && rest.onClick ? 'var(--surface-sunken)' : 'var(--surface-card)'),
    color: active ? 'var(--accent-strong)' : 'var(--text-body)',
    border: `1px solid ${active ? 'var(--border-brand)' : 'var(--border-default)'}`,
  };
  return (
    <span
      style={{ ...base, ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(e); }}
          aria-label="Remove"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, marginLeft: 1, border: 'none', borderRadius: '50%', background: 'transparent', color: 'var(--text-faint)', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}
        >×</button>
      )}
    </span>
  );
}
