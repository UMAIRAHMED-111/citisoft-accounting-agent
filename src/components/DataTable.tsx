import React from 'react';

export interface ColumnDef<R> {
  key: string;
  header: string;
  render: (row: R) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  mono?: boolean;
  /** Allow cell text to wrap (default: true for non-mono columns) */
  wrap?: boolean;
}

export interface DataTableProps<R> {
  columns: ColumnDef<R>[];
  rows: R[];
  onRowClick?: (row: R) => void;
  emptyMessage?: string;
  /** Dense mode for narrow containers (e.g. the assistant dock panel) */
  compact?: boolean;
}

export function DataTable<R>({ columns, rows, onRowClick, emptyMessage = 'No records', compact = false }: DataTableProps<R>) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const cellPadding = compact ? '8px 10px' : '12px 16px';
  const headerPadding = compact ? '7px 10px' : '10px 16px';

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', minWidth: compact ? 300 : undefined }}>
        <thead>
          <tr style={{ background: 'var(--surface-sunken)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: col.align ?? 'left',
                  padding: headerPadding,
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-faint)',
                  borderBottom: '1px solid var(--border-default)',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--fs-body-sm)',
                  color: 'var(--text-muted)',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                {...(onRowClick
                  ? {
                      role: 'button',
                      tabIndex: 0,
                      onKeyDown: (e: React.KeyboardEvent<HTMLTableRowElement>) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onRowClick(row);
                        }
                      },
                    }
                  : {})}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  background: hoveredIdx === idx ? 'var(--surface-sunken)' : 'transparent',
                  cursor: onRowClick ? 'pointer' : 'default',
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: `background var(--dur-fast) var(--ease-out)`,
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: cellPadding,
                      textAlign: col.align ?? 'left',
                      fontFamily: col.mono ? 'var(--font-mono)' : 'var(--font-sans)',
                      fontSize: compact
                        ? 'var(--fs-overline)'
                        : col.mono ? 'var(--fs-caption)' : 'var(--fs-body-sm)',
                      color: 'var(--text-body)',
                      whiteSpace: (col.wrap ?? !col.mono) ? 'normal' : 'nowrap',
                    }}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
