import React from 'react';
import { Toast } from '../ds';
import type { ToastProps } from '../ds';

/**
 * ToastHost — single fixed stack for every toast in the app.
 *
 * Renders bottom-right but offset left of the assistant dock FAB
 * (right: 96) so toasts never underlap it. Call sites use
 * `useToast().push(...)` instead of rendering their own fixed wrappers.
 */

export interface ToastOptions {
  tone?: ToastProps['tone'];
  title: string;
  message?: React.ReactNode;
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  push: (opts: ToastOptions) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastHostProvider>');
  return ctx;
}

let nextToastId = 0;

export function ToastHostProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([]);

  const push = React.useCallback((opts: ToastOptions) => {
    setToasts(prev => [...prev, { ...opts, id: ++nextToastId }]);
  }, []);

  const dismiss = React.useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const value = React.useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 96,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 12,
            zIndex: 1100,
          }}
        >
          {toasts.map(t => (
            <Toast
              key={t.id}
              tone={t.tone ?? 'success'}
              title={t.title}
              duration={t.duration ?? 5000}
              onDismiss={() => dismiss(t.id)}
            >
              {t.message}
            </Toast>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
