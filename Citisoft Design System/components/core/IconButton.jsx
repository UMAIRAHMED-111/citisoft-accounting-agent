import React from 'react';

const SIZES = { sm: 32, md: 40, lg: 48 };

/**
 * Square icon-only button. Defaults to a quiet secondary look; `variant="brand"`
 * renders the gradient icon-chip device.
 */
export function IconButton({
  icon,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  label,
  style = {},
  ...rest
}) {
  const dim = SIZES[size] || SIZES.md;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: dim,
    height: dim,
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all var(--dur) var(--ease-out)',
    transform: active ? 'translateY(1px)' : 'none',
    WebkitTapHighlightColor: 'transparent',
  };

  const variants = {
    brand: { background: 'var(--grad-brand)', color: '#fff', boxShadow: hover ? 'var(--shadow-brand)' : 'var(--shadow-sm)' },
    secondary: { background: hover ? 'var(--surface-sunken)' : 'var(--surface-card)', color: 'var(--text-body)', border: '1px solid var(--border-default)' },
    ghost: { background: hover ? 'var(--surface-brand-tint)' : 'transparent', color: 'var(--text-muted)' },
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      {...rest}
    >
      {icon}
    </button>
  );
}
