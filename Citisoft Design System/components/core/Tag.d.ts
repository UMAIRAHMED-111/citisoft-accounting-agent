import * as React from 'react';

/** Filter / selection chip; optionally removable or toggleable. */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  /** Selected/active styling (brand tint + border). @default false */
  active?: boolean;
  /** Leading icon node. */
  icon?: React.ReactNode;
  /** When provided, renders a × remove control. */
  onRemove?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function Tag(props: TagProps): JSX.Element;
