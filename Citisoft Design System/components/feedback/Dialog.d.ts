import * as React from 'react';

/** Centered modal dialog with blurred scrim. Closes on Escape, scrim click, or ×. */
export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  /** Footer node — typically the action Buttons. */
  footer?: React.ReactNode;
  /** Width in px. @default 460 */
  width?: number;
  style?: React.CSSProperties;
}

export function Dialog(props: DialogProps): JSX.Element | null;
