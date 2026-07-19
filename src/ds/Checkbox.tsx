import React from 'react';

export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, e: React.SyntheticEvent) => void;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

export function Checkbox({ label, checked, defaultChecked, onChange, disabled = false, id, style = {}, ...rest }: CheckboxProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const fid = id || (label && typeof label === 'string' ? 'cb-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);

  const toggle = (e: React.SyntheticEvent) => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on, e);
  };

  return (
    <label htmlFor={fid} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1, fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--text-body)', userSelect: 'none', ...style }}>
      <span
        role="checkbox"
        aria-checked={on}
        id={fid}
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(e); } }}
        style={{
          width: 20, height: 20, flexShrink: 0, borderRadius: 'var(--radius-xs)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: on ? 'var(--grad-brand)' : 'var(--surface-card)',
          border: `1px solid ${on ? 'transparent' : 'var(--border-strong)'}`,
          boxShadow: on ? 'var(--shadow-xs)' : 'none',
          transition: 'all var(--dur) var(--ease-out)',
        }}
        {...rest}
      >
        {on && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
      </span>
      {label}
    </label>
  );
}
