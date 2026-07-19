import React from 'react';

export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: 'color' | 'white' | 'slate';
  height?: number;
  basePath?: string;
  alt?: string;
  style?: React.CSSProperties;
}

export function Logo({ variant = 'color', height = 32, basePath = '/', alt = 'Citisoft Solutions', style = {}, ...rest }: LogoProps) {
  const file = ({
    color: 'citisoft-logo.png',
    white: 'citisoft-logo-white.png',
    slate: 'citisoft-logo-slate.png',
  } as Record<string, string>)[variant] || 'citisoft-logo.png';
  const src = `${basePath.replace(/\/$/, '')}/${file}`;
  return (
    <img
      src={src}
      alt={alt}
      style={{ height, width: 'auto', display: 'block', ...style }}
      {...rest}
    />
  );
}
