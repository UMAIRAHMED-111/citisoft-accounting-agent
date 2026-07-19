import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { Avatar, IconButton } from '../ds';
import { apInvoices, arInvoices, vendors, CONNECTED_ERPS } from '../data/seed';
import { buildLedger, EXCEPTION_TYPE_LABELS } from '../data/reconcile';
import { useLedgerVersion } from '../data/store';

// Normalize for case/space-insensitive matching
function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '');
}

export function Topbar() {
  const navigate = useNavigate();
  const version = useLedgerVersion();
  const exceptions = React.useMemo(() => buildLedger().exceptions, [version]);

  // ---- Search state ----
  const [query, setQuery] = React.useState('');
  const [noResults, setNoResults] = React.useState<string | null>(null);

  function runSearch() {
    const q = norm(query);
    if (!q) return;

    const apHit = apInvoices.some(inv => {
      const vendorName = vendors.find(v => v.id === inv.vendorId)?.name ?? '';
      return norm(inv.invoiceNo).includes(q) || norm(vendorName).includes(q);
    });
    if (apHit) {
      setQuery('');
      setNoResults(null);
      navigate('/inbox');
      return;
    }

    const arHit = arInvoices.some(inv =>
      norm(inv.ref).includes(q) || norm(inv.customer).includes(q)
    );
    if (arHit) {
      setQuery('');
      setNoResults(null);
      navigate('/ar-matching');
      return;
    }

    setNoResults(query.trim());
  }

  // ---- Notifications popover state ----
  const [bellOpen, setBellOpen] = React.useState(false);
  const bellWrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!bellOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setBellOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (bellWrapRef.current && !bellWrapRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [bellOpen]);

  function openException(type: string) {
    setBellOpen(false);
    navigate(type.startsWith('ap_') ? '/po-matching' : '/ar-matching');
  }

  return (
    <header style={{
      height: 62,
      flexShrink: 0,
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      padding: '0 22px',
    }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: 1, maxWidth: 420 }}>
        <span style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: 'var(--text-faint)',
          display: 'flex',
        }}>
          <Search size={16} />
        </span>
        <input
          type="search"
          aria-label="Search"
          placeholder="Search invoices, payments, vendors…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setNoResults(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
          style={{
            width: '100%',
            height: 38,
            padding: '0 12px 0 36px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            background: 'var(--surface-page)',
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            color: 'var(--text-strong)',
            transition: 'border-color var(--dur) var(--ease-out)',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--border-brand)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
        />
        {noResults && (
          <div
            role="status"
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              padding: '8px 12px',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-caption)',
              color: 'var(--text-muted)',
              zIndex: 1040,
            }}
          >
            No results for “{noResults}”
          </div>
        )}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* ERP status chip — live count, links to Connections */}
      <button
        type="button"
        onClick={() => navigate('/connections')}
        aria-label={`${CONNECTED_ERPS.length} ERPs connected — view connections`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '5px 12px',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--surface-sunken)',
          border: '1px solid var(--border-subtle)',
          flexShrink: 0,
          cursor: 'pointer',
        }}
      >
        <span style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: 'var(--success-500)',
          flexShrink: 0,
          display: 'inline-block',
        }} />
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text-body)',
          whiteSpace: 'nowrap',
        }}>
          {CONNECTED_ERPS.length} ERPs · Connected
        </span>
      </button>

      {/* Notifications */}
      <div ref={bellWrapRef} style={{ position: 'relative', flexShrink: 0 }}>
        <IconButton
          icon={<Bell size={18} />}
          label="Notifications"
          variant="ghost"
          size="sm"
          aria-expanded={bellOpen}
          onClick={() => setBellOpen(o => !o)}
        />
        {exceptions.length > 0 && (
          <span
            aria-hidden
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--rose-500)',
              border: '1.5px solid var(--surface-card)',
              pointerEvents: 'none',
            }}
          />
        )}

        {bellOpen && (
          <div
            role="menu"
            aria-label="Notifications"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: 340,
              maxHeight: 420,
              overflowY: 'auto',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 1040,
            }}
          >
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-caption)',
              fontWeight: 'var(--fw-medium)',
              color: 'var(--text-muted)',
            }}>
              Needs attention
            </div>
            {exceptions.length === 0 ? (
              <div style={{
                padding: '16px',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--fs-body-sm)',
                color: 'var(--text-muted)',
              }}>
                All caught up — nothing needs review.
              </div>
            ) : (
              exceptions.map((ex) => (
                <button
                  key={`${ex.type}-${ex.ref}`}
                  type="button"
                  role="menuitem"
                  onClick={() => openException(ex.type)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--border-subtle)',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-sunken)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{
                    display: 'block',
                    fontSize: 'var(--fs-body-sm)',
                    fontWeight: 'var(--fw-semibold)',
                    color: 'var(--text-strong)',
                  }}>
                    {EXCEPTION_TYPE_LABELS[ex.type]}
                  </span>
                  <span style={{
                    display: 'block',
                    marginTop: 2,
                    fontSize: 'var(--fs-caption)',
                    color: 'var(--text-muted)',
                    lineHeight: 'var(--lh-normal)',
                  }}>
                    {ex.description}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* User block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 4, flexShrink: 0 }}>
        <Avatar name="Amara Okafor" src="/avatars/amara.jpg" size="sm" />
        <div style={{ lineHeight: 1.25 }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-strong)',
          }}>
            Amara Okafor
          </div>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 11.5,
            color: 'var(--text-faint)',
          }}>
            Financial controller
          </div>
        </div>
      </div>
    </header>
  );
}
