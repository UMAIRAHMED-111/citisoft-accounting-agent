import React from 'react';

/** Native-select wrapper styled to match Input, with a chevron affordance. */
export function Select({ label, hint, error, options = [], size = 'md', id, style = {}, containerStyle = {}, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const heights = { sm: 36, md: 42, lg: 48 };
  const h = heights[size] || 42;
  const fid = id || (label ? 'sel-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);

  const wrap = {
    position: 'relative', display: 'flex', alignItems: 'center',
    height: h, background: 'var(--surface-card)',
    border: `1px solid ${error ? 'var(--rose-500)' : focus ? 'var(--border-brand)' : 'var(--border-default)'}`,
    borderRadius: 'var(--radius-md)',
    boxShadow: focus ? 'var(--shadow-focus)' : 'none',
    transition: 'border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)',
  };
  const sel = {
    appearance: 'none', WebkitAppearance: 'none', width: '100%', height: '100%',
    border: 'none', outline: 'none', background: 'transparent',
    fontFamily: 'var(--font-sans)', fontSize: size === 'sm' ? 13.5 : 15,
    color: 'var(--text-strong)', padding: '0 36px 0 12px', cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && <label htmlFor={fid} style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>{label}</label>}
      <div style={wrap}>
        <select id={fid} style={{ ...sel, ...style }} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} {...rest}>
          {options.map((o) => {
            const val = typeof o === 'string' ? o : o.value;
            const lab = typeof o === 'string' ? o : o.label;
            return <option key={val} value={val}>{lab}</option>;
          })}
        </select>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: 12, pointerEvents: 'none' }}><path d="m6 9 6 6 6-6" /></svg>
      </div>
      {(hint || error) && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: error ? 'var(--rose-600)' : 'var(--text-muted)' }}>{error || hint}</span>}
    </div>
  );
}
