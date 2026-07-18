import * as React from 'react';

/** User avatar — image with initials fallback on the brand gradient. */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Full name — used for initials + title. */
  name?: string;
  /** Image URL; falls back to initials when absent. */
  src?: string | null;
  /** @default "md" */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Rounded-square instead of circle. @default false */
  square?: boolean;
  style?: React.CSSProperties;
}

export function Avatar(props: AvatarProps): JSX.Element;
