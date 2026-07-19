import * as React from 'react';

/** Marketing feature item: gradient icon chip + title + body copy. */
export interface FeatureChipProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  /** Gradient family for the icon chip. @default "brand" */
  accent?: 'brand' | 'rfq';
  style?: React.CSSProperties;
}

export function FeatureChip(props: FeatureChipProps): JSX.Element;
