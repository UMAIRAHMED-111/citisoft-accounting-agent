import React from 'react';

export interface SkeletonProps {
  w?: number | string;
  h?: number | string;
  radius?: number | string;
  style?: React.CSSProperties;
}

export function Skeleton({ w = '100%', h = 16, radius = 'var(--radius-sm)', style = {} }: SkeletonProps) {
  return (
    <>
      <style>{`
        @keyframes csShimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-skeleton { animation: none !important; background: var(--slate-100) !important; }
        }
      `}</style>
      <span
        className="cs-skeleton"
        style={{
          display: 'block',
          width: w,
          height: h,
          borderRadius: radius,
          background: 'linear-gradient(90deg, var(--slate-100) 25%, var(--slate-050) 50%, var(--slate-100) 75%)',
          backgroundSize: '600px 100%',
          animation: 'csShimmer 1.4s ease-in-out infinite',
          flexShrink: 0,
          ...style,
        }}
      />
    </>
  );
}
