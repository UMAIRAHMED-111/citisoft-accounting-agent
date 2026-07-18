import * as React from 'react';

/** Toast notification card; auto-dismisses after `duration` ms. */
export interface ToastProps {
  /** @default "info" */
  tone?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children?: React.ReactNode;
  /** Called on timeout or × click. */
  onDismiss?: () => void;
  /** Auto-dismiss delay in ms (0 disables). @default 5000 */
  duration?: number;
  style?: React.CSSProperties;
}

export function Toast(props: ToastProps): JSX.Element;
