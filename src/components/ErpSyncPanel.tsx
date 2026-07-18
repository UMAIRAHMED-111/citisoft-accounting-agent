import { useState } from 'react';
import type { Invoice } from '../data/types';
import { vendors } from '../data/seed';
import { Badge, Button } from '../ds';
import { useToast } from './ToastHost';
import { Building2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export interface ErpSyncPanelProps {
  invoice: Invoice;
}

function randomBillNo(): string {
  return 'BILL-' + (10500 + Math.floor(Math.random() * 500)).toString();
}

export function ErpSyncPanel({ invoice }: ErpSyncPanelProps) {
  const vendor = vendors.find(v => v.id === invoice.vendorId);
  const erpName = vendor?.erp ?? 'ERP';

  const [localStatus, setLocalStatus] = useState(invoice.erpStatus);
  const [localDocNo, setLocalDocNo] = useState(invoice.erpDocNo ?? null);
  const [posting, setPosting] = useState(false);
  const toast = useToast();

  async function handlePost() {
    if (posting || localStatus !== 'ready') return;
    setPosting(true);
    await new Promise(r => setTimeout(r, 1100));
    const docNo = randomBillNo();
    setLocalStatus('posted');
    setLocalDocNo(docNo);
    setPosting(false);
    toast.push({
      tone: 'success',
      title: `Posted to ${erpName}`,
      message: (
        <>
          Bill record <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{docNo}</span> created in {erpName}.
        </>
      ),
    });
  }

  const ERP_LOGOS: Record<string, string> = {
    Xero: '/logos/xero.svg',
    NetSuite: '/logos/netsuite.svg',
    Dynamics: '/logos/dynamics365.svg',
    QuickBooks: '/logos/quickbooks.svg',
  };
  const erpLogo = ERP_LOGOS[erpName] ?? '/logos/xero.svg';

  const statusBadge =
    localStatus === 'posted' ? (
      <Badge tone="success" dot>
        Posted · <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--fw-semibold)' }}>{localDocNo}</span>
      </Badge>
    ) : localStatus === 'ready' ? (
      <Badge tone="brand" dot>Ready to post</Badge>
    ) : (
      <Badge tone="warning" dot>Held for review</Badge>
    );

  const statusIcon =
    localStatus === 'posted' ? (
      <CheckCircle2 size={16} style={{ color: 'var(--success-500)' }} />
    ) : localStatus === 'ready' ? (
      <Clock size={16} style={{ color: 'var(--accent)' }} />
    ) : (
      <AlertCircle size={16} style={{ color: 'var(--warning-500)' }} />
    );

  const copyText =
    localStatus === 'posted'
      ? null
      : localStatus === 'ready'
      ? `This invoice has been verified and is ready to post to ${erpName}. Click below to create a bill record.`
      : `This invoice is held pending exception resolution. Resolve all flagged items before posting to ${erpName}.`;

  return (
    <div
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <Building2 size={16} style={{ color: 'var(--text-muted)' }} />
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-body-sm)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--text-strong)',
            }}
          >
            ERP write-back
          </span>
        </div>
        {statusBadge}
      </div>

      {/* ERP tile + details */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-5)',
          padding: 'var(--space-4) var(--space-5)',
          background: 'var(--surface-sunken)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-5)',
        }}
      >
        {/* ERP brand logo */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <img src={erpLogo} alt={`${erpName} logo`} style={{ width: 26, height: 26, objectFit: 'contain' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-body-sm)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--text-strong)',
              marginBottom: 2,
            }}
          >
            {erpName}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-caption)',
              color: 'var(--text-muted)',
            }}
          >
            {statusIcon}
            <span>
              {localStatus === 'posted'
                ? `Document ${localDocNo} · posted`
                : localStatus === 'ready'
                ? 'Verified and ready'
                : 'Held — exceptions pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Explanatory copy */}
      {copyText && (
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            color: 'var(--text-muted)',
            lineHeight: 'var(--lh-relaxed)',
            marginBottom: 'var(--space-5)',
          }}
        >
          {copyText}
        </p>
      )}

      {/* Action button */}
      {localStatus !== 'posted' && (
        <Button
          variant={localStatus === 'ready' ? 'primary' : 'secondary'}
          size="sm"
          disabled={localStatus !== 'ready' || posting}
          onClick={handlePost}
          style={localStatus !== 'ready' ? { opacity: 0.6 } : {}}
        >
          {posting ? 'Posting…' : `Post to ${erpName}`}
        </Button>
      )}

      {localStatus === 'posted' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            color: 'var(--success-500)',
          }}
        >
          <CheckCircle2 size={15} />
          <span>Bill record created in {erpName}</span>
        </div>
      )}
    </div>
  );
}
