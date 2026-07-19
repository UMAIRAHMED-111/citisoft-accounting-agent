import * as React from 'react';

/** Small status pill. Subtle by default; `solid` for filled. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  /** @default "neutral" */
  tone?: 'brand' | 'neutral' | 'success' | 'warning' | 'error' | 'rfq';
  /** Filled instead of tinted. @default false */
  solid?: boolean;
  /** Show a leading status dot. @default false */
  dot?: boolean;
  style?: React.CSSProperties;
}

export function Badge(props: BadgeProps): JSX.Element;
