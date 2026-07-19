import React from 'react';
import { Info, Check, AlertTriangle, X } from 'lucide-react';

const TONES: Record<string, { icon: React.ReactNode; color: string }> = {
  info: { icon: <Info size={13} />, color: 'var(--accent)' },
  success: { icon: <Check size={13} />, color: 'var(--success-500)' },
  warning: { icon: <AlertTriangle size={13} />, color: 'var(--warning-500)' },
  error: { icon: <X size={13} />, color: 'var(--rose-500)' },
};

export interface ToastProps {
  tone?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children?: React.ReactNode;
  onDismiss?: () => void;
  duration?: number;
  style?: React.CSSProperties;
}

export function Toast({ tone = 'info', title, children, onDismiss, duration = 5000, style = {} }: ToastProps) {
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
      <style>{'@keyframes csToast{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){@keyframes csToast{from{opacity:1;transform:none}to{opacity:1;transform:none}}}'}</style>
      <span style={{ flexShrink: 0, width: 22, height: 22, marginTop: 1, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: t.color, color: 'var(--text-on-brand)' }}>{t.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-sm)', fontWeight: 700, color: 'var(--text-strong)', marginBottom: children ? 2 : 0 }}>{title}</div>}
        {children && <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)', lineHeight: 1.5, color: 'var(--text-muted)' }}>{children}</div>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-faint)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 2 }}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
