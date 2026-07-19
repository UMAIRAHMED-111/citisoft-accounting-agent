import React from 'react';

/**
 * Citisoft logo lockup. Renders the brand PNG; `variant` selects the asset.
 * Provide `basePath` pointing at the folder that holds the logo files
 * (defaults to "assets" relative to the host page).
 */
export function Logo({ variant = 'color', height = 32, basePath = 'assets', alt = 'Citisoft Solutions', style = {}, ...rest }) {
  const file = {
    color: 'citisoft-logo.png',
    white: 'citisoft-logo-white.png',
    slate: 'citisoft-logo-slate.png',
  }[variant] || 'citisoft-logo.png';
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
