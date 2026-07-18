import React from 'react';
import type { LineItem } from '../data/types';
import { Badge } from '../ds';
import { ConfidenceMeter } from './ConfidenceMeter';
import { Check, AlertTriangle, MinusCircle } from 'lucide-react';
import { money } from '../lib/format';

export interface MatchLineItemsProps {
  invoiceItems: LineItem[];
  poItems: LineItem[];
}

type RowStatus = 'match' | 'amount_diff' | 'invoice_only' | 'po_only';

interface MergedRow {
  sku: string;
  description: string;
  invoice?: LineItem;
  po?: LineItem;
  status: RowStatus;
  delta?: number;
}

function mergeRows(invoiceItems: LineItem[], poItems: LineItem[]): MergedRow[] {
  const rows: MergedRow[] = [];
  const poMap = new Map<string, LineItem>();
  for (const item of poItems) {
    poMap.set(item.sku, item);
  }

  const matchedPoSkus = new Set<string>();

  for (const inv of invoiceItems) {
    const po = poMap.get(inv.sku);
    if (po) {
      matchedPoSkus.add(po.sku);
      const delta = Math.round((inv.amount - po.amount) * 100) / 100;
      rows.push({
        sku: inv.sku,
        description: inv.description,
        invoice: inv,
        po,
        status: delta === 0 ? 'match' : 'amount_diff',
        delta: delta !== 0 ? delta : undefined,
      });
    } else {
      // Try description fallback
      const poByDesc = poItems.find(
        p => !matchedPoSkus.has(p.sku) && p.description.toLowerCase() === inv.description.toLowerCase()
      );
      if (poByDesc) {
        matchedPoSkus.add(poByDesc.sku);
        const delta = Math.round((inv.amount - poByDesc.amount) * 100) / 100;
        rows.push({
          sku: inv.sku,
          description: inv.description,
          invoice: inv,
          po: poByDesc,
          status: delta === 0 ? 'match' : 'amount_diff',
          delta: delta !== 0 ? delta : undefined,
        });
      } else {
        rows.push({
          sku: inv.sku,
          description: inv.description,
          invoice: inv,
          po: undefined,
          status: 'invoice_only',
        });
      }
    }
  }

  // PO items not matched by any invoice
  for (const po of poItems) {
    if (!matchedPoSkus.has(po.sku)) {
      rows.push({
        sku: po.sku,
        description: po.description,
        invoice: undefined,
        po,
        status: 'po_only',
      });
    }
  }

  return rows;
}

function computeConfidence(rows: MergedRow[]): number {
  if (rows.length === 0) return 0;
  const matched = rows.filter(r => r.status === 'match').length;
  return matched / rows.length;
}

export function MatchLineItems({ invoiceItems, poItems }: MatchLineItemsProps) {
  const rows = mergeRows(invoiceItems, poItems);
  const confidence = computeConfidence(rows);
  const matchCount = rows.filter(r => r.status === 'match').length;
  const totalRows = rows.length;

  const overallTone: 'success' | 'warning' | 'error' =
    confidence >= 0.9 ? 'success' : confidence >= 0.5 ? 'warning' : 'error';

  const overallLabel =
    confidence >= 0.9
      ? `${matchCount}/${totalRows} lines matched`
      : confidence >= 0.5
      ? `${matchCount}/${totalRows} lines matched — review`
      : `${matchCount}/${totalRows} lines matched — exception`;

  // Column width
  const col: React.CSSProperties = { flex: 1, minWidth: 0 };
  const monoStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--fs-caption)',
  };

  return (
    <div>
      {/* Header: confidence + match badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-5)',
          marginBottom: 'var(--space-5)',
        }}
      >
        <div style={{ flex: 1 }}>
          <ConfidenceMeter value={confidence} />
        </div>
        <Badge tone={overallTone}>{overallLabel}</Badge>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-3)',
          padding: '0 var(--space-3)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-overline)',
            fontWeight: 'var(--fw-bold)',
            letterSpacing: 'var(--ls-overline)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          Invoice — extracted
        </span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-overline)',
            fontWeight: 'var(--fw-bold)',
            letterSpacing: 'var(--ls-overline)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          Purchase order
        </span>
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {rows.map((row, i) => {
          const rowBg =
            row.status === 'match'
              ? 'var(--success-050)'
              : row.status === 'amount_diff'
              ? 'var(--warning-050)'
              : row.status === 'invoice_only' || row.status === 'po_only'
              ? 'var(--rose-050)'
              : 'var(--surface-card)';

          const rowBorder =
            row.status === 'match'
              ? 'rgba(31,157,107,0.2)'
              : row.status === 'amount_diff'
              ? 'rgba(214,138,30,0.25)'
              : 'rgba(214,57,79,0.2)';

          return (
            <div
              key={`${row.sku}-${i}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-4)',
                background: rowBg,
                border: `1px solid ${rowBorder}`,
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-3) var(--space-4)',
                alignItems: 'start',
              }}
            >
              {/* Invoice side */}
              <div style={{ ...col, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {row.invoice ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                      <span style={{ ...monoStyle, color: 'var(--text-muted)' }}>{row.invoice.sku}</span>
                      {row.status === 'match' && (
                        <Check size={13} style={{ color: 'var(--success-500)', flexShrink: 0 }} />
                      )}
                      {row.status === 'amount_diff' && (
                        <AlertTriangle size={13} style={{ color: 'var(--warning-500)', flexShrink: 0 }} />
                      )}
                      {row.status === 'invoice_only' && (
                        <Badge tone="error" style={{ fontSize: 11, height: 18 }}>Invoice only</Badge>
                      )}
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--fs-caption)',
                        color: 'var(--text-body)',
                        lineHeight: 'var(--lh-snug)',
                      }}
                    >
                      {row.invoice.description}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
                      <span style={{ ...monoStyle, color: 'var(--text-strong)', fontWeight: 'var(--fw-semibold)' }}>
                        {money(row.invoice.amount)}
                      </span>
                      <span style={{ ...monoStyle, color: 'var(--text-muted)' }}>
                        {row.invoice.qty} × {money(row.invoice.unitPrice)}
                      </span>
                    </div>
                    {row.status === 'amount_diff' && row.delta !== undefined && (
                      <span
                        style={{
                          ...monoStyle,
                          color: row.delta > 0 ? 'var(--rose-600)' : 'var(--success-500)',
                          fontSize: 12,
                          marginTop: 'var(--space-1)',
                        }}
                      >
                        {row.delta > 0 ? '+' : ''}{money(row.delta)} vs PO
                      </span>
                    )}
                  </>
                ) : (
                  <UnmatchedPlaceholder label="Not on invoice" />
                )}
              </div>

              {/* PO side */}
              <div style={{ ...col, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {row.po ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                      <span style={{ ...monoStyle, color: 'var(--text-muted)' }}>{row.po.sku}</span>
                      {row.status === 'po_only' && (
                        <Badge tone="error" style={{ fontSize: 11, height: 18 }}>PO only</Badge>
                      )}
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--fs-caption)',
                        color: 'var(--text-body)',
                        lineHeight: 'var(--lh-snug)',
                      }}
                    >
                      {row.po.description}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
                      <span style={{ ...monoStyle, color: 'var(--text-strong)', fontWeight: 'var(--fw-semibold)' }}>
                        {money(row.po.amount)}
                      </span>
                      <span style={{ ...monoStyle, color: 'var(--text-muted)' }}>
                        {row.po.qty} × {money(row.po.unitPrice)}
                      </span>
                    </div>
                  </>
                ) : (
                  <UnmatchedPlaceholder label="Not on PO" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UnmatchedPlaceholder({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) 0',
      }}
    >
      <MinusCircle size={14} style={{ color: 'var(--rose-500)', flexShrink: 0 }} />
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-caption)',
          color: 'var(--rose-600)',
        }}
      >
        {label}
      </span>
    </div>
  );
}
