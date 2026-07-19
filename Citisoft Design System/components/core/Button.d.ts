import * as React from 'react';

/**
 * Citisoft Button — primary actions carry the signature 135° blue gradient.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  /** Visual style. `primary` = brand gradient. @default "primary" */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Gradient family for the primary variant. @default "brand" */
  accent?: 'brand' | 'rfq';
  disabled?: boolean;
  fullWidth?: boolean;
  /** Icon node placed before the label (e.g. a Lucide <svg>). */
  leadingIcon?: React.ReactNode;
  /** Icon node placed after the label. */
  trailingIcon?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
