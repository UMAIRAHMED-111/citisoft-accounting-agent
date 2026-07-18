import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

export function Input({
  label, hint, error, leadingIcon, trailingIcon,
  size = 'md', id, style = {}, containerStyle = {}, ...rest
}: InputProps) {
  const [focus, setFocus] = React.useState(false);
  const heights: Record<string, number> = { sm: 36, md: 42, lg: 48 };
  const h = heights[size] || 42;
  const fid = id || (label ? 'in-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);

  const wrap: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 8,
    height: h, padding: '0 12px',
    background: rest.disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
    border: `1px solid ${error ? 'var(--rose-500)' : focus ? 'var(--border-brand)' : 'var(--border-default)'}`,
    borderRadius: 'var(--radius-md)',
    boxShadow: focus ? 'var(--shadow-focus)' : 'none',
    transition: 'border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)',
  };
  const inputStyle: React.CSSProperties = {
    flex: 1, border: 'none', outline: 'none', background: 'transparent',
    fontFamily: 'var(--font-sans)', fontSize: size === 'sm' ? 13.5 : 15,
    color: 'var(--text-strong)', minWidth: 0, padding: 0,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && <label htmlFor={fid} style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>{label}</label>}
      <div style={wrap}>
        {leadingIcon && <span style={{ display: 'inline-flex', color: 'var(--text-faint)' }}>{leadingIcon}</span>}
        <input id={fid} style={{ ...inputStyle, ...style }} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} {...rest} />
        {trailingIcon && <span style={{ display: 'inline-flex', color: 'var(--text-faint)' }}>{trailingIcon}</span>}
      </div>
      {(hint || error) && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: error ? 'var(--rose-600)' : 'var(--text-muted)' }}>{error || hint}</span>}
    </div>
  );
}
