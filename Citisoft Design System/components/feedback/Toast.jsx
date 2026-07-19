import React from 'react';

const TONES = {
  info: { icon: 'ℹ', color: 'var(--accent)' },
  success: { icon: '✓', color: 'var(--success-500)' },
  warning: { icon: '!', color: 'var(--warning-500)' },
  error: { icon: '×', color: 'var(--rose-500)' },
};

/** Toast notification card. Render in a fixed stack; controls its own dismiss timer. */
export function Toast({ tone = 'info', title, children, onDismiss, duration = 5000, style = {} }) {
  React.useEffect(() => {
    if (!duration || !onDismiss) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [duration, onDismiss]);
  const t = TONES[tone] || TONES.info;

  return (
    <div
      role="status"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        minWidth: 300, maxWidth: 420, padding: '14px 16px',
        background: 'var(--surface-card)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
        animation: 'csToast var(--dur-slow) var(--ease-out)', ...style,
      }}
    >
      <style>{'@keyframes csToast{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'}</style>
      <span style={{ flexShrink: 0, width: 22, height: 22, marginTop: 1, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: t.color, color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>{t.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 700, color: 'var(--text-strong)', marginBottom: children ? 2 : 0 }}>{title}</div>}
        {children && <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, lineHeight: 1.5, color: 'var(--text-muted)' }}>{children}</div>}
      </div>
      {onDismiss && <button onClick={onDismiss} aria-label="Dismiss" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 18, lineHeight: 1, padding: 2 }}>×</button>}
    </div>
  );
}
