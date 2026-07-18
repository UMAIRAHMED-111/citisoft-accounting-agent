import * as React from 'react';

/** Dark hover/focus tooltip wrapping a single trigger child. */
export interface TooltipProps {
  label: React.ReactNode;
  /** @default "top" */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Tooltip(props: TooltipProps): JSX.Element;
