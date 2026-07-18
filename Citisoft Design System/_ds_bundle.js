/* @ds-bundle: {"format":4,"namespace":"CitisoftDesignSystem_1a14bd","components":[{"name":"GradientText","sourcePath":"components/brand/GradientText.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"FeatureChip","sourcePath":"components/surfaces/FeatureChip.jsx"},{"name":"StatCard","sourcePath":"components/surfaces/StatCard.jsx"}],"sourceHashes":{"components/brand/GradientText.jsx":"3814323e9561","components/brand/Logo.jsx":"10168cb5e81b","components/core/Avatar.jsx":"a8839fefeaf4","components/core/Badge.jsx":"176f89ac99ac","components/core/Button.jsx":"41d41f9680dd","components/core/IconButton.jsx":"e366e485a86b","components/core/Tag.jsx":"bc158d78e130","components/feedback/Dialog.jsx":"958ac9adced2","components/feedback/Toast.jsx":"d81d21b08831","components/feedback/Tooltip.jsx":"51e487e624c5","components/forms/Checkbox.jsx":"7c9c4cac7180","components/forms/Input.jsx":"34f6e668f7ed","components/forms/Select.jsx":"24bdfe2f1f83","components/forms/Switch.jsx":"b287731dc074","components/navigation/Tabs.jsx":"1e5c2f908b93","components/surfaces/Card.jsx":"685e02f15377","components/surfaces/FeatureChip.jsx":"7f7664b1c197","components/surfaces/StatCard.jsx":"1bab98502f7b","ui_kits/rfq-platform/AppShell.jsx":"b76247741ea9","ui_kits/rfq-platform/Dashboard.jsx":"effaa27e4ba4","ui_kits/rfq-platform/RfqDetail.jsx":"fdb55df72c27","ui_kits/rfq-platform/data.jsx":"89aabf28e785","ui_kits/rfq-platform/icons.jsx":"d7cf02f40566","ui_kits/website/Features.jsx":"77ea7b154e2b","ui_kits/website/Hero.jsx":"1f5fff6e3459","ui_kits/website/Insights.jsx":"8c0b342b42d2","ui_kits/website/Products.jsx":"f480cfaf4eb4","ui_kits/website/SiteFooter.jsx":"bd41d95fd1bc","ui_kits/website/SiteNav.jsx":"afdefd0213b7","ui_kits/website/icons.jsx":"8fd0e07d47bd"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CitisoftDesignSystem_1a14bd = window.CitisoftDesignSystem_1a14bd || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/GradientText.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Renders its text with the signature 135° brand gradient as the fill. */
function GradientText({
  children,
  accent = 'brand',
  as = 'span',
  style = {},
  ...rest
}) {
  const grad = accent === 'rfq' ? 'var(--grad-rfq)' : 'var(--grad-brand)';
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      background: grad,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      WebkitTextFillColor: 'transparent',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { GradientText });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/GradientText.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Citisoft logo lockup. Renders the brand PNG; `variant` selects the asset.
 * Provide `basePath` pointing at the folder that holds the logo files
 * (defaults to "assets" relative to the host page).
 */
function Logo({
  variant = 'color',
  height = 32,
  basePath = 'assets',
  alt = 'Citisoft Solutions',
  style = {},
  ...rest
}) {
  const file = {
    color: 'citisoft-logo.png',
    white: 'citisoft-logo-white.png',
    slate: 'citisoft-logo-slate.png'
  }[variant] || 'citisoft-logo.png';
  const src = `${basePath.replace(/\/$/, '')}/${file}`;
  return /*#__PURE__*/React.createElement("img", _extends({
    src: src,
    alt: alt,
    style: {
      height,
      width: 'auto',
      display: 'block',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 52
};
function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

/** Avatar — image or initials, on the brand gradient fallback. */
function Avatar({
  name = '',
  src = null,
  size = 'md',
  square = false,
  style = {},
  ...rest
}) {
  const dim = SIZES[size] || SIZES.md;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: dim,
    height: dim,
    borderRadius: square ? 'var(--radius-md)' : '50%',
    overflow: 'hidden',
    flexShrink: 0,
    fontFamily: 'var(--font-sans)',
    fontWeight: 700,
    fontSize: dim * 0.38,
    letterSpacing: '-0.01em',
    color: '#fff',
    background: 'var(--grad-brand)',
    border: '1px solid rgba(255,255,255,0.5)',
    boxShadow: 'var(--shadow-xs)'
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...style
    },
    title: name
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials(name));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  brand: {
    bg: 'var(--blue-050)',
    fg: 'var(--blue-deep)',
    bd: 'rgba(43,121,186,0.22)'
  },
  neutral: {
    bg: 'var(--slate-100)',
    fg: 'var(--slate-700)',
    bd: 'var(--border-default)'
  },
  success: {
    bg: 'var(--success-050)',
    fg: 'var(--success-500)',
    bd: 'rgba(31,157,107,0.25)'
  },
  warning: {
    bg: 'var(--warning-050)',
    fg: '#a96a12',
    bd: 'rgba(214,138,30,0.3)'
  },
  error: {
    bg: 'var(--rose-050)',
    fg: 'var(--rose-600)',
    bd: 'rgba(214,57,79,0.25)'
  },
  rfq: {
    bg: 'rgba(138,62,93,0.10)',
    fg: 'var(--rfq-to)',
    bd: 'rgba(138,62,93,0.25)'
  }
};

/** Status badge / pill label. Solid or subtle, with optional leading dot. */
function Badge({
  children,
  tone = 'neutral',
  solid = false,
  dot = false,
  style = {},
  ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 22,
    padding: '0 9px',
    fontFamily: 'var(--font-sans)',
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: 'var(--radius-pill)',
    letterSpacing: '0.005em',
    whiteSpace: 'nowrap'
  };
  const skin = solid ? {
    background: t.fg,
    color: '#fff'
  } : {
    background: t.bg,
    color: t.fg,
    border: `1px solid ${t.bd}`
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...skin,
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: solid ? '#fff' : t.fg
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    padding: '0 14px',
    height: 34,
    fontSize: 13.5,
    gap: 6,
    radius: 'var(--radius-sm)'
  },
  md: {
    padding: '0 18px',
    height: 42,
    fontSize: 15,
    gap: 8,
    radius: 'var(--radius-md)'
  },
  lg: {
    padding: '0 24px',
    height: 52,
    fontSize: 16.5,
    gap: 10,
    radius: 'var(--radius-md)'
  }
};

/**
 * Citisoft Button. The primary variant carries the signature 135° blue gradient.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  leadingIcon = null,
  trailingIcon = null,
  accent = 'brand',
  // 'brand' | 'rfq'
  style = {},
  ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const gradient = accent === 'rfq' ? 'var(--grad-rfq)' : 'var(--grad-brand)';
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-sans)',
    fontSize: s.fontSize,
    fontWeight: 600,
    letterSpacing: '-0.005em',
    lineHeight: 1,
    borderRadius: s.radius,
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur) var(--ease-out), background var(--dur) var(--ease-out), filter var(--dur) var(--ease-out)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent'
  };
  const variants = {
    primary: {
      background: gradient,
      color: 'var(--text-on-brand)',
      boxShadow: 'var(--shadow-brand)'
    },
    secondary: {
      background: 'var(--surface-card)',
      color: 'var(--text-strong)',
      border: '1px solid var(--border-strong)',
      boxShadow: 'var(--shadow-xs)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--accent-strong)'
    },
    danger: {
      background: 'var(--rose-500)',
      color: '#fff',
      boxShadow: '0 6px 18px rgba(214,57,79,0.28)'
    }
  };
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  let dyn = {};
  if (!disabled) {
    if (variant === 'primary') {
      dyn = {
        background: hover ? 'var(--grad-brand-hover)' : gradient,
        filter: hover && accent === 'rfq' ? 'brightness(1.08)' : 'none',
        transform: active ? 'translateY(1px)' : hover ? 'translateY(-1px)' : 'none'
      };
    } else if (variant === 'secondary') {
      dyn = {
        background: hover ? 'var(--surface-sunken)' : 'var(--surface-card)',
        transform: active ? 'translateY(1px)' : 'none'
      };
    } else if (variant === 'ghost') {
      dyn = {
        background: hover ? 'var(--surface-brand-tint)' : 'transparent',
        transform: active ? 'translateY(1px)' : 'none'
      };
    } else if (variant === 'danger') {
      dyn = {
        background: hover ? 'var(--rose-600)' : 'var(--rose-500)',
        transform: active ? 'translateY(1px)' : hover ? 'translateY(-1px)' : 'none'
      };
    }
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    style: {
      ...base,
      ...variants[variant],
      ...dyn,
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false)
  }, rest), leadingIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, leadingIcon), children, trailingIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, trailingIcon));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: 32,
  md: 40,
  lg: 48
};

/**
 * Square icon-only button. Defaults to a quiet secondary look; `variant="brand"`
 * renders the gradient icon-chip device.
 */
function IconButton({
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
    WebkitTapHighlightColor: 'transparent'
  };
  const variants = {
    brand: {
      background: 'var(--grad-brand)',
      color: '#fff',
      boxShadow: hover ? 'var(--shadow-brand)' : 'var(--shadow-sm)'
    },
    secondary: {
      background: hover ? 'var(--surface-sunken)' : 'var(--surface-card)',
      color: 'var(--text-body)',
      border: '1px solid var(--border-default)'
    },
    ghost: {
      background: hover ? 'var(--surface-brand-tint)' : 'transparent',
      color: 'var(--text-muted)'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false)
  }, rest), icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Tag / chip — for filters, categories, removable selections. */
function Tag({
  children,
  onRemove,
  active = false,
  icon = null,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 28,
    padding: onRemove ? '0 7px 0 11px' : '0 12px',
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1,
    borderRadius: 'var(--radius-pill)',
    cursor: rest.onClick ? 'pointer' : 'default',
    transition: 'all var(--dur) var(--ease-out)',
    background: active ? 'var(--surface-brand-tint)' : hover && rest.onClick ? 'var(--surface-sunken)' : 'var(--surface-card)',
    color: active ? 'var(--accent-strong)' : 'var(--text-body)',
    border: `1px solid ${active ? 'var(--border-brand)' : 'var(--border-default)'}`
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, icon), children, onRemove && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    },
    "aria-label": "Remove",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      marginLeft: 1,
      border: 'none',
      borderRadius: '50%',
      background: 'transparent',
      color: 'var(--text-faint)',
      cursor: 'pointer',
      fontSize: 14,
      lineHeight: 1,
      padding: 0
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Modal dialog with a blurred charcoal scrim. Render conditionally on `open`. */
function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  width = 460,
  style = {},
  ...rest
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'rgba(15, 19, 25, 0.55)',
      backdropFilter: 'blur(var(--blur-overlay))',
      WebkitBackdropFilter: 'blur(var(--blur-overlay))',
      animation: 'csFade var(--dur) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("style", null, '@keyframes csFade{from{opacity:0}to{opacity:1}}@keyframes csPop{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}'), /*#__PURE__*/React.createElement("div", _extends({
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: '100%',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-xl)',
      overflow: 'hidden',
      animation: 'csPop var(--dur-slow) var(--ease-out)',
      ...style
    }
  }, rest), title && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 22px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      fontWeight: 700,
      color: 'var(--text-strong)',
      margin: 0,
      letterSpacing: '-0.01em'
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-faint)',
      fontSize: 22,
      lineHeight: 1,
      padding: 4
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 22px',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--text-body)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      padding: '14px 22px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-page)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const TONES = {
  info: {
    icon: 'ℹ',
    color: 'var(--accent)'
  },
  success: {
    icon: '✓',
    color: 'var(--success-500)'
  },
  warning: {
    icon: '!',
    color: 'var(--warning-500)'
  },
  error: {
    icon: '×',
    color: 'var(--rose-500)'
  }
};

/** Toast notification card. Render in a fixed stack; controls its own dismiss timer. */
function Toast({
  tone = 'info',
  title,
  children,
  onDismiss,
  duration = 5000,
  style = {}
}) {
  React.useEffect(() => {
    if (!duration || !onDismiss) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [duration, onDismiss]);
  const t = TONES[tone] || TONES.info;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      minWidth: 300,
      maxWidth: 420,
      padding: '14px 16px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      animation: 'csToast var(--dur-slow) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("style", null, '@keyframes csToast{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'), /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 22,
      height: 22,
      marginTop: 1,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: t.color,
      color: '#fff',
      fontSize: 13,
      fontWeight: 700,
      fontFamily: 'var(--font-sans)'
    }
  }, t.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      fontWeight: 700,
      color: 'var(--text-strong)',
      marginBottom: children ? 2 : 0
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.5,
      color: 'var(--text-muted)'
    }
  }, children)), onDismiss && /*#__PURE__*/React.createElement("button", {
    onClick: onDismiss,
    "aria-label": "Dismiss",
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-faint)',
      fontSize: 18,
      lineHeight: 1,
      padding: 2
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
/** Tooltip — dark label on hover/focus. Wraps a single trigger child. */
function Tooltip({
  label,
  placement = 'top',
  children,
  style = {}
}) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-8px)'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(8px)'
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(-8px)'
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(8px)'
    }
  }[placement];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      zIndex: 900,
      ...pos,
      background: 'var(--slate-800)',
      color: '#fff',
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      fontWeight: 500,
      padding: '6px 10px',
      borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-lg)',
      pointerEvents: 'none',
      letterSpacing: '0.005em',
      ...style
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Checkbox with brand-gradient fill when checked. Controlled or uncontrolled. */
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const fid = id || (label ? 'cb-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const toggle = e => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on, e);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      color: 'var(--text-body)',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", _extends({
    role: "checkbox",
    "aria-checked": on,
    id: fid,
    tabIndex: 0,
    onClick: toggle,
    onKeyDown: e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle(e);
      }
    },
    style: {
      width: 20,
      height: 20,
      flexShrink: 0,
      borderRadius: 'var(--radius-xs)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: on ? 'var(--grad-brand)' : 'var(--surface-card)',
      border: `1px solid ${on ? 'transparent' : 'var(--border-strong)'}`,
      boxShadow: on ? 'var(--shadow-xs)' : 'none',
      transition: 'all var(--dur) var(--ease-out)'
    }
  }, rest), on && /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Text input with optional label, leading icon, and error state. */
function Input({
  label,
  hint,
  error,
  leadingIcon,
  trailingIcon,
  size = 'md',
  id,
  style = {},
  containerStyle = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const heights = {
    sm: 36,
    md: 42,
    lg: 48
  };
  const h = heights[size] || 42;
  const fid = id || (label ? 'in-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const wrap = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    height: h,
    padding: '0 12px',
    background: rest.disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
    border: `1px solid ${error ? 'var(--rose-500)' : focus ? 'var(--border-brand)' : 'var(--border-default)'}`,
    borderRadius: 'var(--radius-md)',
    boxShadow: focus ? 'var(--shadow-focus)' : 'none',
    transition: 'border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)'
  };
  const input = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: 'var(--font-sans)',
    fontSize: size === 'sm' ? 13.5 : 15,
    color: 'var(--text-strong)',
    minWidth: 0,
    padding: 0
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, leadingIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--text-faint)'
    }
  }, leadingIcon), /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    style: {
      ...input,
      ...style
    },
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest)), trailingIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--text-faint)'
    }
  }, trailingIcon)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      color: error ? 'var(--rose-600)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Native-select wrapper styled to match Input, with a chevron affordance. */
function Select({
  label,
  hint,
  error,
  options = [],
  size = 'md',
  id,
  style = {},
  containerStyle = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const heights = {
    sm: 36,
    md: 42,
    lg: 48
  };
  const h = heights[size] || 42;
  const fid = id || (label ? 'sel-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const wrap = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: h,
    background: 'var(--surface-card)',
    border: `1px solid ${error ? 'var(--rose-500)' : focus ? 'var(--border-brand)' : 'var(--border-default)'}`,
    borderRadius: 'var(--radius-md)',
    boxShadow: focus ? 'var(--shadow-focus)' : 'none',
    transition: 'border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)'
  };
  const sel = {
    appearance: 'none',
    WebkitAppearance: 'none',
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: 'var(--font-sans)',
    fontSize: size === 'sm' ? 13.5 : 15,
    color: 'var(--text-strong)',
    padding: '0 36px 0 12px',
    cursor: 'pointer'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fid,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fid,
    style: {
      ...sel,
      ...style
    },
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest), options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lab = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lab);
  })), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-faint)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: 'absolute',
      right: 12,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      color: error ? 'var(--rose-600)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Toggle switch; gradient track when on. Controlled or uncontrolled. */
function Switch({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  size = 'md',
  style = {},
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const dims = size === 'sm' ? {
    w: 36,
    h: 20,
    k: 14
  } : {
    w: 44,
    h: 24,
    k: 18
  };
  const toggle = e => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on, e);
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      color: 'var(--text-body)',
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", _extends({
    role: "switch",
    "aria-checked": on,
    tabIndex: 0,
    onClick: toggle,
    onKeyDown: e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle(e);
      }
    },
    style: {
      position: 'relative',
      width: dims.w,
      height: dims.h,
      flexShrink: 0,
      borderRadius: 'var(--radius-pill)',
      background: on ? 'var(--grad-brand)' : 'var(--slate-300)',
      transition: 'background var(--dur) var(--ease-out)',
      boxShadow: on ? 'var(--shadow-xs)' : 'inset 0 1px 2px rgba(0,0,0,0.08)'
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: (dims.h - dims.k) / 2,
      left: on ? dims.w - dims.k - (dims.h - dims.k) / 2 : (dims.h - dims.k) / 2,
      width: dims.k,
      height: dims.k,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
      transition: 'left var(--dur) var(--ease-out)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Tabs — underline style with a gradient active indicator. Controlled or uncontrolled. */
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  style = {},
  ...rest
}) {
  const isControlled = value !== undefined;
  const first = defaultValue ?? (tabs[0] && (typeof tabs[0] === 'string' ? tabs[0] : tabs[0].value));
  const [internal, setInternal] = React.useState(first);
  const active = isControlled ? value : internal;
  const select = val => {
    if (!isControlled) setInternal(val);
    onChange && onChange(val);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--border-default)',
      ...style
    }
  }, rest), tabs.map(t => {
    const val = typeof t === 'string' ? t : t.value;
    const lab = typeof t === 'string' ? t : t.label;
    const count = typeof t === 'object' ? t.count : undefined;
    const on = val === active;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      role: "tab",
      "aria-selected": on,
      onClick: () => select(val),
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '11px 14px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 14.5,
        fontWeight: on ? 700 : 500,
        color: on ? 'var(--text-strong)' : 'var(--text-muted)',
        transition: 'color var(--dur) var(--ease-out)'
      }
    }, lab, count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 600,
        padding: '1px 6px',
        borderRadius: 'var(--radius-pill)',
        background: on ? 'var(--surface-brand-tint)' : 'var(--surface-sunken)',
        color: on ? 'var(--accent)' : 'var(--text-muted)'
      }
    }, count), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 8,
        right: 8,
        bottom: -1,
        height: 2.5,
        borderRadius: 2,
        background: on ? 'var(--grad-brand)' : 'transparent',
        transition: 'background var(--dur) var(--ease-out)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Base surface card — white, hairline border, soft shadow. Optional hover lift. */
function Card({
  children,
  padding = 20,
  interactive = false,
  elevated = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const base = {
    background: 'var(--surface-card)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: elevated ? 'var(--shadow-md)' : 'var(--shadow-sm)',
    padding,
    transition: 'transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)',
    ...(interactive && hover ? {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-lg)',
      borderColor: 'var(--border-strong)',
      cursor: 'pointer'
    } : {})
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...base,
      ...style
    },
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false)
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/FeatureChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Feature item — gradient icon chip + title + body. The brand's recurring marketing device. */
function FeatureChip({
  icon,
  title,
  children,
  accent = 'brand',
  style = {},
  ...rest
}) {
  const grad = accent === 'rfq' ? 'var(--grad-rfq)' : 'var(--grad-brand)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 46,
      height: 46,
      borderRadius: 'var(--radius-md)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: grad,
      color: '#fff',
      boxShadow: 'var(--shadow-brand)'
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      fontWeight: 700,
      color: 'var(--text-strong)',
      margin: 0,
      letterSpacing: '-0.01em'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      lineHeight: 1.55,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, children)));
}
Object.assign(__ds_scope, { FeatureChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/FeatureChip.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Metric readout — big mono value, label, optional delta. Used across dashboards. */
function StatCard({
  label,
  value,
  unit,
  delta,
  deltaDir = 'up',
  icon,
  accent = false,
  style = {},
  ...rest
}) {
  const deltaColor = deltaDir === 'down' ? 'var(--rose-600)' : 'var(--success-500)';
  return /*#__PURE__*/React.createElement(__ds_scope.Card, _extends({
    padding: 18,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 'var(--radius-sm)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: accent ? 'var(--grad-brand)' : 'var(--surface-brand-tint)',
      color: accent ? '#fff' : 'var(--accent)'
    }
  }, icon)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 30,
      fontWeight: 700,
      color: 'var(--text-strong)',
      letterSpacing: '-0.02em',
      lineHeight: 1
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, unit)), delta != null && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      color: deltaColor
    }
  }, /*#__PURE__*/React.createElement("span", null, deltaDir === 'down' ? '↓' : '↑'), delta));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/StatCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/rfq-platform/AppShell.jsx
try { (() => {
const {
  Logo,
  Avatar,
  IconButton,
  Input,
  Badge
} = window.CitisoftDesignSystem_1a14bd;
function Sidebar({
  active,
  onNav
}) {
  const nav = [{
    id: 'dashboard',
    icon: 'grid',
    label: 'Dashboard'
  }, {
    id: 'rfqs',
    icon: 'file',
    label: 'RFQs',
    count: 27
  }, {
    id: 'suppliers',
    icon: 'users',
    label: 'Suppliers'
  }, {
    id: 'insights',
    icon: 'chart',
    label: 'Spend insights'
  }, {
    id: 'logistics',
    icon: 'truck',
    label: 'Logistics'
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 232,
      flexShrink: 0,
      background: 'var(--surface-card)',
      borderRight: '1px solid var(--border-default)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px 14px'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    height: 24,
    basePath: "../../assets"
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      padding: '6px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      flex: 1
    }
  }, nav.map(n => {
    const on = active === n.id || active === 'detail' && n.id === 'rfqs';
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => onNav(n.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '9px 12px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        background: on ? 'rgba(168,70,111,0.10)' : 'transparent',
        color: on ? 'var(--rfq-to)' : 'var(--text-body)',
        fontFamily: 'var(--font-sans)',
        fontSize: 14.5,
        fontWeight: on ? 600 : 500,
        transition: 'background var(--dur) var(--ease-out)'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = 'var(--surface-sunken)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement(RIcon, {
      name: n.icon,
      size: 18,
      color: on ? 'var(--rfq-to)' : 'var(--text-muted)'
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, n.label), n.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 600,
        padding: '1px 7px',
        borderRadius: 'var(--radius-pill)',
        background: on ? 'rgba(168,70,111,0.16)' : 'var(--surface-sunken)',
        color: on ? 'var(--rfq-to)' : 'var(--text-muted)'
      }
    }, n.count));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('settings'),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '9px 12px',
      width: '100%',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      fontWeight: 500,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(RIcon, {
    name: "settings",
    size: 18,
    color: "var(--text-muted)"
  }), "Settings")));
}
function Topbar({
  onNew
}) {
  const {
    Button
  } = window.CitisoftDesignSystem_1a14bd;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 62,
      flexShrink: 0,
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '0 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1,
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(RIcon, {
    name: "search",
    size: 17,
    color: "var(--text-faint)"
  })), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search RFQs, suppliers, parts\u2026",
    style: {
      width: '100%',
      height: 40,
      padding: '0 12px 0 36px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-page)',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-strong)',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    accent: "rfq",
    size: "sm",
    onClick: onNew,
    leadingIcon: /*#__PURE__*/React.createElement(RIcon, {
      name: "plus",
      size: 17,
      color: "#fff"
    })
  }, "New RFQ"), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    icon: /*#__PURE__*/React.createElement(RIcon, {
      name: "bell",
      size: 19
    }),
    label: "Notifications"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      paddingLeft: 6
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Dana Ruiz",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, "Dana Ruiz"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 11.5,
      color: 'var(--text-faint)'
    }
  }, "Procurement"))));
}
window.Sidebar = Sidebar;
window.Topbar = Topbar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/rfq-platform/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/rfq-platform/Dashboard.jsx
try { (() => {
const {
  StatCard,
  Card,
  Badge,
  Tabs,
  Tag
} = window.CitisoftDesignSystem_1a14bd;
function Dashboard({
  onOpenRfq,
  onNew
}) {
  const [tab, setTab] = React.useState('open');
  const rows = RFQ_DATA.filter(r => {
    if (tab === 'all') return true;
    if (tab === 'open') return r.status === 'open' || r.status === 'reviewing';
    if (tab === 'awarded') return r.status === 'awarded';
    if (tab === 'draft') return r.status === 'draft';
    return true;
  });
  const counts = {
    open: RFQ_DATA.filter(r => r.status === 'open' || r.status === 'reviewing').length,
    awarded: RFQ_DATA.filter(r => r.status === 'awarded').length,
    draft: RFQ_DATA.filter(r => r.status === 'draft').length
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '26px 28px',
      maxWidth: 1180,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 27,
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "Good morning, Dana"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      color: 'var(--text-muted)',
      margin: '5px 0 0'
    }
  }, "You have ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--rfq-to)'
    }
  }, "4 RFQs"), " awaiting your review."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 14,
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Open RFQs",
    value: "27",
    delta: "3 vs last week",
    icon: /*#__PURE__*/React.createElement(RIcon, {
      name: "file",
      size: 18,
      color: "#fff"
    }),
    accent: true
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Avg. turnaround",
    value: "4.2",
    unit: "hrs",
    delta: "38% faster",
    deltaDir: "up",
    icon: /*#__PURE__*/React.createElement(RIcon, {
      name: "clock",
      size: 18
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Award rate",
    value: "92",
    unit: "%",
    delta: "5 pts",
    icon: /*#__PURE__*/React.createElement(RIcon, {
      name: "check",
      size: 18
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Sourced YTD",
    value: "$3.1",
    unit: "M",
    delta: "On budget",
    icon: /*#__PURE__*/React.createElement(RIcon, {
      name: "dollar",
      size: 18
    })
  })), /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 18px 0'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      value: 'open',
      label: 'Active',
      count: counts.open
    }, {
      value: 'awarded',
      label: 'Awarded',
      count: counts.awarded
    }, {
      value: 'draft',
      label: 'Drafts',
      count: counts.draft
    }, {
      value: 'all',
      label: 'All'
    }],
    style: {
      border: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      paddingBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    icon: /*#__PURE__*/React.createElement(RIcon, {
      name: "filter",
      size: 14
    })
  }, "Filter"))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--surface-page)'
    }
  }, ['RFQ', 'Part', 'Category', 'Qty', 'Quotes', 'Best price', 'Status', ''].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      textAlign: i >= 3 && i <= 5 ? 'right' : 'left',
      padding: '10px 16px',
      fontFamily: 'var(--font-sans)',
      fontSize: 11.5,
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id,
    onClick: () => onOpenRfq(r),
    style: {
      cursor: 'pointer',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'background var(--dur) var(--ease-out)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--surface-page)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '13px 16px',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--rfq-to)',
      fontWeight: 600
    }
  }, r.id), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '13px 16px',
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, r.part), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '13px 16px',
      fontSize: 13.5,
      color: 'var(--text-muted)'
    }
  }, r.cat), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '13px 16px',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-body)',
      textAlign: 'right'
    }
  }, r.qty), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '13px 16px',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-body)',
      textAlign: 'right'
    }
  }, r.quotes || '—'), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '13px 16px',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--text-strong)',
      textAlign: 'right'
    }
  }, r.best), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '13px 16px'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: STATUS_TONE[r.status],
    dot: r.status === 'awarded'
  }, r.sLabel)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '13px 16px',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(RIcon, {
    name: "arrowRight",
    size: 16,
    color: "var(--text-faint)"
  })))))))));
}
window.Dashboard = Dashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/rfq-platform/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/rfq-platform/RfqDetail.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  Avatar,
  Tag
} = window.CitisoftDesignSystem_1a14bd;
function RfqDetail({
  rfq,
  onBack,
  onAward
}) {
  const r = rfq || RFQ_DATA[0];
  const [awarded, setAwarded] = React.useState(null);
  const award = sup => {
    setAwarded(sup);
    onAward && onAward(sup);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 28px',
      maxWidth: 1180,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--text-muted)',
      padding: '4px 0',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(RIcon, {
    name: "arrowLeft",
    size: 16,
    color: "var(--text-muted)"
  }), " Back to RFQs"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 20,
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 14,
      color: 'var(--rfq-to)',
      fontWeight: 600
    }
  }, r.id), /*#__PURE__*/React.createElement(Badge, {
    tone: STATUS_TONE[r.status],
    dot: r.status === 'awarded' || !!awarded
  }, awarded ? 'Awarded' : r.sLabel)), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, r.part)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    leadingIcon: /*#__PURE__*/React.createElement(RIcon, {
      name: "download",
      size: 16
    })
  }, "Export"), /*#__PURE__*/React.createElement(Button, {
    accent: "rfq",
    size: "sm"
  }, "Message suppliers"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 280px',
      gap: 20,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '15px 18px',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      fontWeight: 700,
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "Quotes (", RFQ_QUOTES.length, ")"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      color: 'var(--text-faint)'
    }
  }, "Ranked by price & lead time")), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--surface-page)'
    }
  }, ['Supplier', 'Rating', 'Price', 'Lead time', 'Terms', ''].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      textAlign: i === 2 || i === 3 ? 'right' : 'left',
      padding: '9px 16px',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, RFQ_QUOTES.map(q => {
    const isAwarded = awarded === q.sup;
    const highlight = isAwarded || !awarded && q.best;
    return /*#__PURE__*/React.createElement("tr", {
      key: q.sup,
      style: {
        borderBottom: '1px solid var(--border-subtle)',
        background: highlight ? 'rgba(168,70,111,0.06)' : 'transparent'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '13px 16px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: q.sup,
      size: "xs",
      square: true
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--text-strong)'
      }
    }, q.sup), highlight && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 10,
        fontWeight: 700,
        color: 'var(--rfq-to)',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        padding: '2px 6px',
        background: 'rgba(168,70,111,0.12)',
        borderRadius: 'var(--radius-pill)'
      }
    }, isAwarded ? 'Awarded' : 'Best'))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '13px 16px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(RIcon, {
      name: "star",
      size: 13,
      color: "var(--warning-500)"
    }), q.rating)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '13px 16px',
        fontFamily: 'var(--font-mono)',
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--text-strong)',
        textAlign: 'right'
      }
    }, q.price), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '13px 16px',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--text-body)',
        textAlign: 'right'
      }
    }, q.lead), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '13px 16px',
        fontSize: 13,
        color: 'var(--text-muted)'
      }
    }, q.terms), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '13px 16px',
        textAlign: 'right'
      }
    }, awarded ? isAwarded ? /*#__PURE__*/React.createElement(RIcon, {
      name: "check",
      size: 18,
      color: "var(--success-500)"
    }) : null : /*#__PURE__*/React.createElement(Button, {
      accent: "rfq",
      size: "sm",
      onClick: () => award(q.sup)
    }, "Award")));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)',
      margin: '0 0 12px'
    }
  }, "Specification"), [['Category', r.cat], ['Quantity', r.qty], ['Need-by', r.due], ['Incoterm', 'DAP — Houston, TX'], ['Material cert', 'EN 10204 3.1']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '7px 0',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    icon: /*#__PURE__*/React.createElement(RIcon, {
      name: "paperclip",
      size: 13
    })
  }, "drawing-v3.pdf"), /*#__PURE__*/React.createElement(Tag, {
    icon: /*#__PURE__*/React.createElement(RIcon, {
      name: "box",
      size: 13
    })
  }, "spec.xlsx"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)',
      margin: '0 0 12px'
    }
  }, "Activity"), [['Quote received', 'Acme Steel · 2h ago'], ['Quote received', 'Northgate · 5h ago'], ['RFQ published', 'You · yesterday']].map(([t, s], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 10,
      padding: '7px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--rfq-accent)',
      marginTop: 6,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, s))))))));
}
window.RfqDetail = RfqDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/rfq-platform/RfqDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/rfq-platform/data.jsx
try { (() => {
// Shared sample data for the RFQ platform kit.
const RFQ_DATA = [{
  id: 'RFQ-10428',
  part: 'Flanged ball valve, 3"',
  cat: 'Valves & fittings',
  qty: '500',
  quotes: 7,
  status: 'reviewing',
  sLabel: 'Reviewing',
  due: '2026-07-02',
  best: '$48,250'
}, {
  id: 'RFQ-10427',
  part: 'Carbon steel plate, A36',
  cat: 'Steel & metals',
  qty: '12 t',
  quotes: 4,
  status: 'open',
  sLabel: 'Open · 2h left',
  due: '2026-06-27',
  best: '$31,900'
}, {
  id: 'RFQ-10425',
  part: 'Hex bolts, M12×40 cl.8.8',
  cat: 'Fasteners',
  qty: '20,000',
  quotes: 9,
  status: 'open',
  sLabel: 'Open',
  due: '2026-06-29',
  best: '$4,120'
}, {
  id: 'RFQ-10422',
  part: 'PTFE gasket sheet, 1.5mm',
  cat: 'Polymers',
  qty: '40 m²',
  quotes: 6,
  status: 'awarded',
  sLabel: 'Awarded',
  due: '2026-06-24',
  best: '$9,840'
}, {
  id: 'RFQ-10419',
  part: 'Stainless tube, 316L 2"',
  cat: 'Steel & metals',
  qty: '300 m',
  quotes: 5,
  status: 'awarded',
  sLabel: 'Awarded',
  due: '2026-06-20',
  best: '$22,500'
}, {
  id: 'RFQ-10417',
  part: 'Pneumatic actuator, DA',
  cat: 'Valves & fittings',
  qty: '120',
  quotes: 3,
  status: 'draft',
  sLabel: 'Draft',
  due: '—',
  best: '—'
}];
const RFQ_QUOTES = [{
  sup: 'Acme Steel Co.',
  rating: 4.8,
  price: '$48,250',
  lead: '12 days',
  terms: 'Net 30',
  best: true
}, {
  sup: 'Northgate Mfg.',
  rating: 4.6,
  price: '$51,900',
  lead: '9 days',
  terms: 'Net 45',
  best: false
}, {
  sup: 'Vertex Alloys',
  rating: 4.4,
  price: '$53,400',
  lead: '15 days',
  terms: 'Net 30',
  best: false
}, {
  sup: 'Brightline Industrial',
  rating: 4.2,
  price: '$54,100',
  lead: '8 days',
  terms: 'Net 60',
  best: false
}];
const STATUS_TONE = {
  reviewing: 'brand',
  open: 'warning',
  awarded: 'success',
  draft: 'neutral'
};
window.RFQ_DATA = RFQ_DATA;
window.RFQ_QUOTES = RFQ_QUOTES;
window.STATUS_TONE = STATUS_TONE;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/rfq-platform/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/rfq-platform/icons.jsx
try { (() => {
// Inline Lucide-path icon set for the Citisoft RFQ platform kit.
const RFQ_ICON_PATHS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  chart: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
  truck: '<rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  paperclip: '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  dollar: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>'
};
function RIcon({
  name,
  size = 20,
  stroke = 1.75,
  color = 'currentColor',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: style,
    dangerouslySetInnerHTML: {
      __html: RFQ_ICON_PATHS[name] || ''
    }
  });
}
window.RIcon = RIcon;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/rfq-platform/icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Features.jsx
try { (() => {
const {
  FeatureChip
} = window.CitisoftDesignSystem_1a14bd;
function Features() {
  const items = [{
    icon: 'branch',
    title: 'One auditable workflow',
    body: 'Every request, quote, and award tracked on a single timeline your whole team can see.'
  }, {
    icon: 'shield',
    title: 'Certified suppliers only',
    body: 'Route requests to pre-qualified, compliance-checked vendors — no cold outreach.'
  }, {
    icon: 'zap',
    title: 'Instant multi-quote',
    body: 'Send one RFQ and collect competing quotes in parallel, ranked automatically.'
  }, {
    icon: 'layers',
    title: 'Built for catalogs',
    body: 'Import SKUs, drawings, and tolerances. Suppliers quote against exact specs.'
  }, {
    icon: 'lock',
    title: 'Enterprise controls',
    body: 'SSO, role-based approvals, and a full export-ready audit log on every action.'
  }, {
    icon: 'trending',
    title: 'Spend intelligence',
    body: 'See price trends across suppliers and categories to negotiate from data.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '92px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640,
      marginBottom: 52
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-overline"
  }, "Why Citisoft"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 40,
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)',
      margin: '14px 0 14px',
      lineHeight: 1.1
    }
  }, "The sourcing stack for industrial teams"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 18.5,
      lineHeight: 1.55,
      color: 'var(--text-muted)'
    }
  }, "Replace email threads and spreadsheets with a single system that takes a part from request to purchase order.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '38px 44px'
    }
  }, items.map(it => /*#__PURE__*/React.createElement(FeatureChip, {
    key: it.title,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 22,
      color: "#fff"
    }),
    title: it.title
  }, it.body))));
}
window.Features = Features;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Features.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
const {
  Button,
  Badge,
  GradientText,
  StatCard
} = window.CitisoftDesignSystem_1a14bd;
function Hero({
  onStart
}) {
  return /*#__PURE__*/React.createElement("section", {
    "data-theme": "dark",
    style: {
      position: 'relative',
      background: 'var(--slate-900)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -160,
      right: -120,
      width: 620,
      height: 620,
      background: 'radial-gradient(circle, rgba(43,159,212,0.32), rgba(37,91,156,0) 62%)',
      filter: 'blur(8px)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, #000, transparent)',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, #000, transparent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--container-wide)',
      margin: '0 auto',
      padding: '92px 28px 96px',
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "cs-overline",
    style: {
      display: 'inline-block',
      marginBottom: 18
    }
  }, "Industrial procurement, reinvented"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 62,
      fontWeight: 800,
      lineHeight: 1.02,
      letterSpacing: '-0.025em',
      color: '#f4f7fa',
      margin: 0
    }
  }, "Quote industrial parts in ", /*#__PURE__*/React.createElement(GradientText, null, "hours,"), " not weeks."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 20,
      lineHeight: 1.55,
      color: '#c8d0db',
      margin: '22px 0 0',
      maxWidth: 520
    }
  }, "Citisoft connects buyers and suppliers on one auditable workflow \u2014 from request to award. Send a single RFQ; we route it to every qualified supplier."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: onStart
  }, "Start an RFQ"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    style: {
      background: 'transparent',
      color: '#f4f7fa',
      borderColor: 'rgba(255,255,255,0.22)'
    }
  }, "Talk to sales")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 26,
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(Trust, {
    v: "4.2 hrs",
    l: "Avg. quote turnaround"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'rgba(255,255,255,0.12)'
    }
  }), /*#__PURE__*/React.createElement(Trust, {
    v: "12,400+",
    l: "Qualified suppliers"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'rgba(255,255,255,0.12)'
    }
  }), /*#__PURE__*/React.createElement(Trust, {
    v: "$3.1B",
    l: "Sourced in 2025"
  }))), /*#__PURE__*/React.createElement(HeroPanel, null)));
}
function Trust({
  v,
  l
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 24,
      fontWeight: 700,
      color: '#f4f7fa',
      letterSpacing: '-0.02em'
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      color: '#8b97a6',
      marginTop: 3
    }
  }, l));
}

// A small product-UI mock floating in the hero (shows the RFQ app).
function HeroPanel() {
  const rows = [{
    id: 'RFQ-10428',
    part: 'Flanged ball valve, 3"',
    sup: '7 quotes',
    status: 'success',
    s: 'Awarded'
  }, {
    id: 'RFQ-10427',
    part: 'Carbon steel plate',
    sup: '4 quotes',
    status: 'warning',
    s: 'Open · 2h left'
  }, {
    id: 'RFQ-10425',
    part: 'Hex bolts, M12×40',
    sup: '9 quotes',
    status: 'brand',
    s: 'Reviewing'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#1b212b',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '13px 16px',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: '#ff5f57'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: '#febc2e'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: '#28c840'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 10,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: '#8b97a6'
    }
  }, "app.citisoft.com / rfqs")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(MiniStat, {
    v: "27",
    l: "Open RFQs"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    v: "92%",
    l: "Award rate"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    v: "4.2h",
    l: "Turnaround"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '11px 12px',
      background: '#11151b',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(255,255,255,0.05)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      color: 'var(--blue-azure)',
      width: 78
    }
  }, r.id), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: '#e4e9f0',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, r.part), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: '#8b97a6',
      width: 64
    }
  }, r.sup), /*#__PURE__*/React.createElement(Badge, {
    tone: r.status,
    dot: r.status === 'success'
  }, r.s))))));
}
function MiniStat({
  v,
  l
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '10px 12px',
      background: '#11151b',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(255,255,255,0.05)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 19,
      fontWeight: 700,
      color: '#f4f7fa'
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 11,
      color: '#8b97a6',
      marginTop: 2
    }
  }, l));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Insights.jsx
try { (() => {
const {
  Tabs,
  Card,
  Badge,
  Button
} = window.CitisoftDesignSystem_1a14bd;
const CS_INSIGHTS = {
  All: [{
    tag: 'Guide',
    mins: '8 min',
    title: 'How to write an RFQ suppliers actually quote',
    tone: 'brand'
  }, {
    tag: 'Report',
    mins: '12 min',
    title: '2026 industrial sourcing benchmark',
    tone: 'neutral'
  }, {
    tag: 'Story',
    mins: '5 min',
    title: 'How Northgate cut quote time 71%',
    tone: 'success'
  }],
  Guides: [{
    tag: 'Guide',
    mins: '8 min',
    title: 'How to write an RFQ suppliers actually quote',
    tone: 'brand'
  }, {
    tag: 'Guide',
    mins: '6 min',
    title: 'Setting supplier qualification rules',
    tone: 'brand'
  }, {
    tag: 'Guide',
    mins: '9 min',
    title: 'Approvals & audit trails for procurement',
    tone: 'brand'
  }],
  Reports: [{
    tag: 'Report',
    mins: '12 min',
    title: '2026 industrial sourcing benchmark',
    tone: 'neutral'
  }, {
    tag: 'Report',
    mins: '10 min',
    title: 'Lead-time volatility by category',
    tone: 'neutral'
  }, {
    tag: 'Report',
    mins: '7 min',
    title: 'The state of supplier diversity',
    tone: 'neutral'
  }],
  Customers: [{
    tag: 'Story',
    mins: '5 min',
    title: 'How Northgate cut quote time 71%',
    tone: 'success'
  }, {
    tag: 'Story',
    mins: '6 min',
    title: 'Vertex Alloys scales to 400 suppliers',
    tone: 'success'
  }, {
    tag: 'Story',
    mins: '4 min',
    title: 'Why Brightline standardised on Citisoft',
    tone: 'success'
  }]
};
function Insights() {
  const [tab, setTab] = React.useState('All');
  const posts = CS_INSIGHTS[tab] || CS_INSIGHTS.All;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-card)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '88px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "cs-overline"
  }, "Insights"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 36,
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)',
      margin: '12px 0 0'
    }
  }, "Sharper sourcing, every week")), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    trailingIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrowRight",
      size: 17
    })
  }, "View all")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 28,
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    tabs: ['All', 'Guides', 'Reports', 'Customers']
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20
    }
  }, posts.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.title,
    interactive: true,
    padding: 0,
    style: {
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 132,
      background: p.tone === 'success' ? 'linear-gradient(135deg,#1f9d6b,#14181f)' : 'var(--grad-brand)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.12) 1px,transparent 1px)',
      backgroundSize: '26px 26px',
      opacity: 0.5
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: p.tone
  }, p.tag), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11.5,
      color: 'var(--text-faint)'
    }
  }, p.mins)), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, p.title)))))));
}
window.Insights = Insights;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Insights.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Products.jsx
try { (() => {
const {
  Button,
  Badge
} = window.CitisoftDesignSystem_1a14bd;

// Dark "Products" section spotlighting the RFQ / Sales platform (magenta accent).
function Products({
  onStart
}) {
  return /*#__PURE__*/React.createElement("section", {
    "data-theme": "dark",
    style: {
      background: 'var(--slate-900)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: -180,
      left: -120,
      width: 560,
      height: 560,
      background: 'radial-gradient(circle, rgba(138,62,93,0.34), rgba(74,30,61,0) 60%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '92px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      maxWidth: 600,
      margin: '0 auto 56px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-overline",
    style: {
      color: 'var(--rfq-accent)'
    }
  }, "The Citisoft product family"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 40,
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: '#f4f7fa',
      margin: '14px 0 0',
      lineHeight: 1.1
    }
  }, "Purpose-built tools, one platform")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 44,
      alignItems: 'center',
      background: 'linear-gradient(135deg, rgba(74,30,61,0.55), rgba(27,33,43,0.4))',
      border: '1px solid rgba(168,70,111,0.3)',
      borderRadius: 'var(--radius-2xl)',
      padding: 40,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-md)',
      background: 'var(--grad-rfq)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file",
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 18,
      color: '#fff'
    }
  }, "RFQ Platform"), /*#__PURE__*/React.createElement(Badge, {
    tone: "rfq",
    style: {
      background: 'rgba(168,70,111,0.2)',
      color: '#e9b8cc',
      border: '1px solid rgba(168,70,111,0.4)'
    }
  }, "Flagship")), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: '-0.015em',
      color: '#f4f7fa',
      margin: '0 0 12px',
      lineHeight: 1.15
    }
  }, "Request, compare, and award quotes in one place"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      lineHeight: 1.6,
      color: '#c8d0db',
      margin: '0 0 22px'
    }
  }, "Buyers publish a spec; qualified suppliers respond with priced, dated quotes. Citisoft ranks them on price, lead time, and rating \u2014 so you award with confidence."), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: '0 0 26px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, ['Parallel multi-supplier quoting', 'Auto-ranked by price & lead time', 'PO generation on award'].map(f => /*#__PURE__*/React.createElement("li", {
    key: f,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      color: '#e4e9f0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: 'rgba(168,70,111,0.25)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 13,
    color: "#e9b8cc"
  })), f))), /*#__PURE__*/React.createElement(Button, {
    accent: "rfq",
    onClick: onStart,
    trailingIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrowRight",
      size: 17,
      color: "#fff"
    })
  }, "Explore the RFQ Platform")), /*#__PURE__*/React.createElement(RfqMock, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(ProductCard, {
    icon: "users",
    name: "Supplier Network",
    body: "A vetted directory of 12,400+ certified industrial suppliers."
  }), /*#__PURE__*/React.createElement(ProductCard, {
    icon: "trending",
    name: "Spend Insights",
    body: "Category and price analytics across your sourcing history."
  }), /*#__PURE__*/React.createElement(ProductCard, {
    icon: "globe",
    name: "Logistics",
    body: "Track shipments and lead times from award to delivery."
  }))));
}
function ProductCard({
  icon,
  name,
  body
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: '#1b212b',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 'var(--radius-lg)',
      padding: 22,
      transition: 'transform var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)',
      transform: h ? 'translateY(-3px)' : 'none',
      borderColor: h ? 'rgba(43,159,212,0.4)' : 'rgba(255,255,255,0.10)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-md)',
      background: 'rgba(43,159,212,0.14)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 20,
    color: "var(--blue-azure)"
  })), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16.5,
      fontWeight: 700,
      color: '#f4f7fa',
      margin: '0 0 6px'
    }
  }, name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.5,
      color: '#8b97a6',
      margin: 0
    }
  }, body));
}
function RfqMock() {
  const quotes = [{
    sup: 'Acme Steel Co.',
    price: '$48,250',
    lead: '12 days',
    best: true
  }, {
    sup: 'Northgate Mfg.',
    price: '$51,900',
    lead: '9 days',
    best: false
  }, {
    sup: 'Vertex Alloys',
    price: '$53,400',
    lead: '15 days',
    best: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#14181f',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 'var(--radius-lg)',
      padding: 18,
      boxShadow: '0 24px 60px rgba(0,0,0,0.45)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      color: 'var(--rfq-accent)'
    }
  }, "RFQ-10428"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      fontWeight: 600,
      color: '#f4f7fa',
      marginTop: 2
    }
  }, "Flanged ball valve, 3\"")), /*#__PURE__*/React.createElement(Badge, {
    tone: "rfq",
    style: {
      background: 'rgba(168,70,111,0.2)',
      color: '#e9b8cc',
      border: '1px solid rgba(168,70,111,0.4)'
    }
  }, "3 quotes")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, quotes.map(q => /*#__PURE__*/React.createElement("div", {
    key: q.sup,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '11px 12px',
      background: q.best ? 'rgba(168,70,111,0.14)' : '#1b212b',
      border: `1px solid ${q.best ? 'rgba(168,70,111,0.45)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: '#e4e9f0'
    }
  }, q.sup), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13.5,
      fontWeight: 700,
      color: '#f4f7fa'
    }
  }, q.price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: '#8b97a6',
      width: 56,
      textAlign: 'right'
    }
  }, q.lead), q.best && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 10.5,
      fontWeight: 700,
      color: '#e9b8cc',
      textTransform: 'uppercase',
      letterSpacing: '0.08em'
    }
  }, "Best")))));
}
window.Products = Products;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Products.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteFooter.jsx
try { (() => {
const {
  Button,
  Logo
} = window.CitisoftDesignSystem_1a14bd;
function CTASection({
  onStart
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 28px 92px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--grad-brand)',
      borderRadius: 'var(--radius-2xl)',
      padding: '64px 56px',
      textAlign: 'center',
      boxShadow: 'var(--shadow-brand)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.10) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.10) 1px,transparent 1px)',
      backgroundSize: '40px 40px',
      maskImage: 'radial-gradient(ellipse 70% 100% at 50% 0%, #000, transparent)',
      WebkitMaskImage: 'radial-gradient(ellipse 70% 100% at 50% 0%, #000, transparent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 42,
      fontWeight: 800,
      letterSpacing: '-0.025em',
      color: '#fff',
      margin: '0 0 14px',
      lineHeight: 1.08
    }
  }, "Send your first RFQ today"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 19,
      color: 'rgba(255,255,255,0.9)',
      margin: '0 auto 30px',
      maxWidth: 520,
      lineHeight: 1.5
    }
  }, "Set up in minutes. No supplier outreach, no spreadsheets \u2014 just quotes."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: onStart,
    style: {
      background: '#fff',
      color: 'var(--blue-deep)',
      borderColor: '#fff'
    }
  }, "Start an RFQ"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "ghost",
    style: {
      color: '#fff',
      background: 'rgba(255,255,255,0.12)'
    }
  }, "Book a demo")))));
}
function SiteFooter() {
  const cols = [{
    h: 'Product',
    links: ['RFQ Platform', 'Supplier Network', 'Spend Insights', 'Logistics', 'Pricing']
  }, {
    h: 'Solutions',
    links: ['Manufacturing', 'Energy', 'Construction', 'Public sector']
  }, {
    h: 'Resources',
    links: ['Insights', 'Guides', 'Benchmark report', 'Help center', 'API docs']
  }, {
    h: 'Company',
    links: ['About', 'Careers', 'Security', 'Contact']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    "data-theme": "dark",
    style: {
      background: 'var(--slate-900)',
      borderTop: '1px solid rgba(255,255,255,0.08)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-wide)',
      margin: '0 auto',
      padding: '60px 28px 36px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr repeat(4, 1fr)',
      gap: 36
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    height: 28,
    basePath: "../../assets"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      lineHeight: 1.6,
      color: '#8b97a6',
      margin: '16px 0 0',
      maxWidth: 260
    }
  }, "The sourcing platform for industrial teams \u2014 from request to award on one auditable workflow.")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#66707e',
      marginBottom: 14
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, c.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: '#c8d0db',
      textDecoration: 'none'
    }
  }, l))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 48,
      paddingTop: 24,
      borderTop: '1px solid rgba(255,255,255,0.08)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      color: '#66707e'
    }
  }, "\xA9 2026 Citisoft Solutions, Inc. All rights reserved."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20
    }
  }, ['Privacy', 'Terms', 'Security', 'Status'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      color: '#8b97a6',
      textDecoration: 'none'
    }
  }, l))))));
}
window.CTASection = CTASection;
window.SiteFooter = SiteFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteNav.jsx
try { (() => {
const {
  Logo,
  Button
} = window.CitisoftDesignSystem_1a14bd;
function SiteNav({
  onStart
}) {
  const [open, setOpen] = React.useState(false);
  const links = ['Products', 'Solutions', 'Insights', 'Pricing', 'Company'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255,255,255,0.86)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-wide)',
      margin: '0 auto',
      padding: '0 28px',
      height: 68,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    height: 28,
    basePath: "../../assets"
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 4
    },
    className: "cs-navlinks"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      fontWeight: 500,
      color: 'var(--text-body)',
      padding: '8px 12px',
      borderRadius: 'var(--radius-sm)',
      textDecoration: 'none'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--surface-sunken)';
      e.currentTarget.style.color = 'var(--text-strong)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = 'var(--text-body)';
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      fontWeight: 600,
      color: 'var(--text-strong)',
      textDecoration: 'none',
      padding: '0 8px'
    }
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: onStart
  }, "Start an RFQ"))));
}
window.SiteNav = SiteNav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/icons.jsx
try { (() => {
// Lightweight Lucide-path icon set for the Citisoft website kit.
// Renders inline SVG so it survives React re-renders (unlike lucide.createIcons()).
const CS_ICON_PATHS = {
  menu: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  branch: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  trending: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'
};
function Icon({
  name,
  size = 20,
  stroke = 1.75,
  color = 'currentColor',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: style,
    dangerouslySetInnerHTML: {
      __html: CS_ICON_PATHS[name] || ''
    }
  });
}
window.Icon = Icon;
window.CS_ICON_PATHS = CS_ICON_PATHS;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.GradientText = __ds_scope.GradientText;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.FeatureChip = __ds_scope.FeatureChip;

__ds_ns.StatCard = __ds_scope.StatCard;

})();
