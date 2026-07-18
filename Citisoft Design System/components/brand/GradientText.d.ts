import * as React from 'react';

/** Fills its text with the brand gradient. Set font size/weight via `style`. */
export interface GradientTextProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** @default "brand" */
  accent?: 'brand' | 'rfq';
  /** Element tag to render. @default "span" */
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

export function GradientText(props: GradientTextProps): JSX.Element;
