import * as React from 'react';

/** Citisoft logo image lockup. */
export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** color = full gradient (light bg), white = on dark, slate = mono. @default "color" */
  variant?: 'color' | 'white' | 'slate';
  /** Rendered height in px. @default 32 */
  height?: number;
  /** Folder holding the logo PNGs, relative to the page. @default "assets" */
  basePath?: string;
  alt?: string;
  style?: React.CSSProperties;
}

export function Logo(props: LogoProps): JSX.Element;
