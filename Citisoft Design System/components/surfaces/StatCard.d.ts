import * as React from 'react';

/** KPI/metric card with a mono value, uppercase label, and optional delta. */
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  /** The metric value (string or number; rendered in mono). */
  value: React.ReactNode;
  /** Trailing unit (e.g. "hrs", "%"). */
  unit?: string;
  /** Change indicator text (e.g. "12% vs last week"). */
  delta?: React.ReactNode;
  /** @default "up" */
  deltaDir?: 'up' | 'down';
  icon?: React.ReactNode;
  /** Gradient-fill the icon chip. @default false */
  accent?: boolean;
  style?: React.CSSProperties;
}

export function StatCard(props: StatCardProps): JSX.Element;
