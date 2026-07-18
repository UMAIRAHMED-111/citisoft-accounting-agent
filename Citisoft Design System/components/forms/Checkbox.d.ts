import * as React from 'react';

/** Checkbox; gradient fill when checked. Controlled (`checked`) or uncontrolled (`defaultChecked`). */
export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, e: React.SyntheticEvent) => void;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

export function Checkbox(props: CheckboxProps): JSX.Element;
