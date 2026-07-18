import React from 'react';

export type TabItem = string | { value: string; label: string; count?: number };

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

export function Tabs({ tabs = [], value, defaultValue, onChange, style = {}, ...rest }: TabsProps) {
  const isControlled = value !== undefined;
  const first = defaultValue ?? (tabs[0] && (typeof tabs[0] === 'string' ? tabs[0] : tabs[0].value));
  const [internal, setInternal] = React.useState(first);
  const active = isControlled ? value : internal;

  const select = (val: string) => {
    if (!isControlled) setInternal(val);
    onChange && onChange(val);
  };

  return (
    <div role="tablist" style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-default)', ...style }} {...rest}>
      {tabs.map((t) => {
        const val = typeof t === 'string' ? t : t.value;
        const lab = typeof t === 'string' ? t : t.label;
        const count = typeof t === 'object' ? t.count : undefined;
        const on = val === active;
        return (
          <button
            key={val}
            role="tab"
            aria-selected={on}
            onClick={() => select(val)}
            style={{
              position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '11px 14px', border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: on ? 700 : 500,
              color: on ? 'var(--text-strong)' : 'var(--text-muted)',
              transition: 'color var(--dur) var(--ease-out)',
            }}
          >
            {lab}
            {count != null && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 'var(--radius-pill)', background: on ? 'var(--surface-brand-tint)' : 'var(--surface-sunken)', color: on ? 'var(--accent)' : 'var(--text-muted)' }}>{count}</span>
            )}
            <span style={{ position: 'absolute', left: 8, right: 8, bottom: -1, height: 2.5, borderRadius: 2, background: on ? 'var(--grad-brand)' : 'transparent', transition: 'background var(--dur) var(--ease-out)' }} />
          </button>
        );
      })}
    </div>
  );
}
