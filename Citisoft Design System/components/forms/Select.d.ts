import * as React from 'react';

export type SelectOption = string | { value: string; label: string };

/** Styled native select matching Input. */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

export function Select(props: SelectProps): JSX.Element;
