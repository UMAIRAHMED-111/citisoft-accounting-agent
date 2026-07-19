import * as React from 'react';

/** Square icon-only button. `variant="brand"` is the gradient icon-chip device. */
export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Icon node (e.g. a Lucide <svg>). */
  icon: React.ReactNode;
  /** Accessible label (also the title tooltip). */
  label: string;
  /** @default "secondary" */
  variant?: 'brand' | 'secondary' | 'ghost';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function IconButton(props: IconButtonProps): JSX.Element;
