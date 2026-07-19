import React from 'react';

export interface SwitchProps {
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, e: React.SyntheticEvent) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export function Switch({ label, checked, defaultChecked, onChange, disabled = false, size = 'md', style = {}, ...rest }: SwitchProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const dims = size === 'sm' ? { w: 36, h: 20, k: 14 } : { w: 44, h: 24, k: 18 };

  const toggle = (e: React.SyntheticEvent) => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on, e);
  };

  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1, fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--text-body)', userSelect: 'none', ...style }}>
      <span
        role="switch"
        aria-checked={on}
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(e); } }}
        style={{
          position: 'relative', width: dims.w, height: dims.h, flexShrink: 0,
          borderRadius: 'var(--radius-pill)',
          background: on ? 'var(--grad-brand)' : 'var(--slate-300)',
          transition: 'background var(--dur) var(--ease-out)',
          boxShadow: on ? 'var(--shadow-xs)' : 'inset 0 1px 2px rgba(0,0,0,0.08)',
        }}
        {...rest}
      >
        <span style={{
          position: 'absolute', top: (dims.h - dims.k) / 2,
          left: on ? dims.w - dims.k - (dims.h - dims.k) / 2 : (dims.h - dims.k) / 2,
          width: dims.k, height: dims.k, borderRadius: '50%', background: 'var(--white)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          transition: 'left var(--dur) var(--ease-out)',
        }} />
      </span>
      {label}
    </label>
  );
}
