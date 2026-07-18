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
}

export function DataTable<R>({ columns, rows, onRowClick, emptyMessage = 'No records' }: DataTableProps<R>) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
        <thead>
          <tr style={{ background: 'var(--surface-sunken)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: col.align ?? 'left',
                  padding: '10px 16px',
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
                  fontSize: 14,
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
                      padding: '12px 16px',
                      textAlign: col.align ?? 'left',
                      fontFamily: col.mono ? 'var(--font-mono)' : 'var(--font-sans)',
                      fontSize: col.mono ? 13 : 14,
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
