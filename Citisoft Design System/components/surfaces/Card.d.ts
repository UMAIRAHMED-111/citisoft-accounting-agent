import * as React from 'react';

/** Base surface container: white, hairline border, soft shadow. */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Inner padding in px. @default 20 */
  padding?: number;
  /** Hover lift + cursor pointer. @default false */
  interactive?: boolean;
  /** Use the medium shadow at rest. @default false */
  elevated?: boolean;
  style?: React.CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
