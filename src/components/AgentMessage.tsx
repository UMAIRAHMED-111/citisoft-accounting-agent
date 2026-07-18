import React from 'react';
import type { AgentResponse, AgentBlock } from '../agent/types';
import { Card } from '../ds/Card';
import { Button } from '../ds/Button';
import { DataTable } from './DataTable';
import type { ColumnDef } from './DataTable';
import { Sparkles } from 'lucide-react';

// Detect preference for reduced motion
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ---- TextBlock: streaming reveal ----
interface TextBlockProps {
  text: string;
  animate: boolean;
}

function TextBlock({ text, animate }: TextBlockProps) {
  const [displayed, setDisplayed] = React.useState(animate && !prefersReducedMotion() ? '' : text);
  const reduced = prefersReducedMotion();

  React.useEffect(() => {
    if (!animate || reduced) {
      setDisplayed(text);
      return;
    }
    setDisplayed('');
    const dur = 600;
    const totalChars = text.length;
    const startTime = performance.now();

    let rafId: number;
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / dur, 1);
      const chars = Math.floor(progress * totalChars);
      setDisplayed(text.slice(0, chars));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDisplayed(text);
      }
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [text, animate, reduced]);

  return (
    <p
      style={{
        margin: 0,
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-body)',
        lineHeight: 'var(--lh-relaxed)',
        color: 'var(--text-body)',
      }}
    >
      {displayed}
      {animate && !reduced && displayed.length < text.length && (
        <span
          style={{
            display: 'inline-block',
            width: 2,
            height: '1.1em',
            background: 'var(--accent)',
            verticalAlign: 'text-bottom',
            marginLeft: 1,
            animation: 'cs-blink 0.7s step-end infinite',
          }}
        />
      )}
    </p>
  );
}

// ---- TableBlock ----
interface TableBlockProps {
  columns: string[];
  rows: string[][];
}

function TableBlock({ columns, rows }: TableBlockProps) {
  // Heuristic: columns that look like amounts/numbers should be mono+right-aligned
  const monoCols = new Set<number>();
  rows.forEach(row =>
    row.forEach((cell, ci) => {
      if (/^[\$\d,.\-\s]+$/.test(cell.trim()) && cell.trim().length > 0) {
        monoCols.add(ci);
      }
    })
  );

  const colDefs: ColumnDef<string[]>[] = columns.map((col, ci) => ({
    key: String(ci),
    header: col,
    render: (row: string[]) => row[ci] ?? '',
    align: monoCols.has(ci) ? 'right' : 'left',
    mono: monoCols.has(ci),
  }));

  return (
    <div
      style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        marginTop: 'var(--space-4)',
      }}
    >
      <DataTable columns={colDefs} rows={rows} />
    </div>
  );
}

// ---- ActionBlock ----
interface ActionBlockProps {
  title: string;
  detail: string;
  cta: string;
}

function ActionBlock({ title, detail, cta }: ActionBlockProps) {
  return (
    <Card
      padding={16}
      style={{
        marginTop: 'var(--space-4)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 'var(--space-5)',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--text-strong)',
          }}
        >
          {title}
        </p>
        <p
          style={{
            margin: 'var(--space-1) 0 0',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-sm)',
            color: 'var(--text-muted)',
            lineHeight: 'var(--lh-normal)',
          }}
        >
          {detail}
        </p>
      </div>
      <Button size="sm" variant="secondary" style={{ flexShrink: 0 }}>
        {cta}
      </Button>
    </Card>
  );
}

// ---- ReasoningBlock ----
interface ReasoningBlockProps {
  steps: string[];
}

function ReasoningBlock({ steps }: ReasoningBlockProps) {
  return (
    <div
      style={{
        marginTop: 'var(--space-4)',
        padding: 'var(--space-5)',
        background: 'var(--surface-sunken)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <p
        style={{
          margin: '0 0 var(--space-3)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-overline)',
          fontWeight: 'var(--fw-bold)',
          letterSpacing: 'var(--ls-overline)',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
        }}
      >
        How I worked this out
      </p>
      <ol style={{ margin: 0, padding: '0 0 0 var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {steps.map((step, i) => (
          <li
            key={i}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-body-sm)',
              lineHeight: 'var(--lh-relaxed)',
              color: 'var(--text-muted)',
            }}
          >
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---- AgentMessage ----
export interface AgentMessageProps {
  response: AgentResponse;
  animateFirst?: boolean;
}

export function AgentMessage({ response, animateFirst = false }: AgentMessageProps) {
  const blocks = response.blocks;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
      {/* Agent avatar */}
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-md)',
          background: 'var(--grad-brand)',
          boxShadow: 'var(--shadow-brand)',
          color: 'var(--white)',
        }}
      >
        <Sparkles size={17} strokeWidth={2} />
      </span>

      {/* Blocks */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {blocks.map((block: AgentBlock, i) => {
          const isFirst = i === 0;
          switch (block.type) {
            case 'text':
              return (
                <TextBlock
                  key={i}
                  text={block.text}
                  animate={animateFirst && isFirst}
                />
              );
            case 'table':
              return (
                <TableBlock
                  key={i}
                  columns={block.columns}
                  rows={block.rows}
                />
              );
            case 'action':
              return (
                <ActionBlock
                  key={i}
                  title={block.title}
                  detail={block.detail}
                  cta={block.cta}
                />
              );
            case 'reasoning':
              return <ReasoningBlock key={i} steps={block.steps} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
