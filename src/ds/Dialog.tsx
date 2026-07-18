import React from 'react';

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
  style?: React.CSSProperties;
}

export function Dialog({ open, onClose, title, children, footer, width = 460, style = {}, ...rest }: DialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose && onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        background: 'rgba(15, 19, 25, 0.55)', backdropFilter: 'blur(var(--blur-overlay))',
        WebkitBackdropFilter: 'blur(var(--blur-overlay))',
        animation: 'csFade var(--dur) var(--ease-out)',
      }}
    >
      <style>{'@keyframes csFade{from{opacity:0}to{opacity:1}}@keyframes csPop{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}'}</style>
      <div
        role="dialog"
        aria-modal={true}
        onClick={(e) => e.stopPropagation()}
        style={{
          width, maxWidth: '100%', background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xl)', overflow: 'hidden',
          animation: 'csPop var(--dur-slow) var(--ease-out)', ...style,
        }}
        {...rest}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, color: 'var(--text-strong)', margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
            <button onClick={onClose} aria-label="Close" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 22, lineHeight: 1, padding: 4 }}>×</button>
          </div>
        )}
        <div style={{ padding: '20px 22px', fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.6, color: 'var(--text-body)' }}>{children}</div>
        {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 22px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-page)' }}>{footer}</div>}
      </div>
    </div>
  );
}
