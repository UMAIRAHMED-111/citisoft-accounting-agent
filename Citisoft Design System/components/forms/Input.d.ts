import * as React from 'react';

/** Labelled text input with hint/error and optional icons. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  /** Error message — also turns the field rose. */
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

export function Input(props: InputProps): JSX.Element;
