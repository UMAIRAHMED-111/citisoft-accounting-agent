import React from 'react';
import { X, Send, Maximize2, Minimize2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAgent } from '../agent/AgentProvider';
import type { AgentResponse } from '../agent/types';
import { AgentMessage } from './AgentMessage';
import { Input, Button, GradientText } from '../ds';

// ---- Types ----
interface UserMessage {
  kind: 'user';
  id: number;
  text: string;
}

interface AgentMsg {
  kind: 'agent';
  id: number;
  response: AgentResponse;
  animateFirst: boolean;
}

interface ThinkingMsg {
  kind: 'thinking';
  id: number;
}

type Message = UserMessage | AgentMsg | ThinkingMsg;

// ---- Context-aware chips per route ----
function getSuggestedChips(route: string): string[] {
  if (route === '/' || route === '') {
    return ['What needs my attention today', 'What is the net revenue this month', 'Who is my highest buyer'];
  }
  if (route === '/inbox') {
    return ['Summarize this screen', 'Which vendor do we spend the most with', 'Attach PO po-11166 to invoice 13992'];
  }
  if (route === '/po-matching') {
    return ['Summarize this screen', 'Approve invoice 78875', 'Attach PO po-11166 to invoice 13992'];
  }
  if (route === '/ar-matching') {
    return ['Summarize this screen', 'Show unmatched deposits', 'Show overdue invoices'];
  }
  if (route === '/reminders') {
    return ['Summarize this screen', 'Send a reminder for AR-2026-0041', 'Who owes me the most'];
  }
  if (route === '/bank-upload') {
    return ['Summarize this screen', 'Show unmatched deposits', 'What needs my attention today'];
  }
  if (route === '/connections') {
    return ['Summarize this screen', 'What needs my attention today', 'Show open AP/AR totals'];
  }
  if (route === '/sales') {
    return ['Summarize this screen', 'Who owes me the most', 'Who is my highest buyer'];
  }
  return ['What needs my attention today', 'Show overdue invoices', 'Show unmatched payments'];
}

// ---- Route label for header context line ----
function getRouteLabel(route: string): string {
  const labels: Record<string, string> = {
    '/': 'Dashboard',
    '/inbox': 'Vendor bills',
    '/po-matching': 'PO matching',
    '/bank-upload': 'Bank feed',
    '/ar-matching': 'AR matching',
    '/reminders': 'Reminders',
    '/connections': 'ERP connections',
    '/sales': 'Sales invoices',
  };
  return labels[route] ?? 'Overview';
}

// ---- ThinkingIndicator ----
function ThinkingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0' }}>
      <span
        aria-hidden
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, width: 28, height: 28, borderRadius: 'var(--radius-md)',
          background: 'var(--grad-brand)', boxShadow: 'var(--shadow-brand)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" />
          <path d="M20 3v4" /><path d="M22 5h-4" />
        </svg>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
            background: 'var(--slate-400)',
            animation: `cs-dock-think 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </span>
    </div>
  );
}

// ---- FAB ----
interface FabProps {
  open: boolean;
  hasUnread: boolean;
  onClick: () => void;
}

function Fab({ open, hasUnread, onClick }: FabProps) {
  const [hover, setHover] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={open ? 'Close assistant' : 'Open CitiSoft assistant'}
      style={{
        position: 'relative',
        width: 56, height: 56,
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        background: hover ? 'var(--grad-brand-hover)' : 'var(--grad-brand)',
        boxShadow: hover
          ? '0 12px 32px rgba(43,121,186,0.38), var(--shadow-brand)'
          : 'var(--shadow-brand)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: `transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)`,
        transform: hover ? 'translateY(-2px)' : 'none',
        outline: 'none',
        flexShrink: 0,
      }}
      onFocus={e => { e.currentTarget.style.boxShadow = 'var(--shadow-brand), var(--shadow-focus)'; }}
      onBlur={e => { e.currentTarget.style.boxShadow = hover ? '0 12px 32px rgba(43,121,186,0.38), var(--shadow-brand)' : 'var(--shadow-brand)'; }}
    >
      {open ? (
        <X size={22} color="white" strokeWidth={2} />
      ) : (
        <img src="/logos/claude-white.svg" alt="" width={26} height={26} />
      )}
      {!open && hasUnread && (
        <span
          aria-hidden
          style={{
            position: 'absolute', top: 4, right: 4,
            width: 10, height: 10,
            borderRadius: '50%',
            background: 'var(--rose-500)',
            border: '2px solid var(--surface-page)',
            animation: 'cs-dock-pulse 2s ease-in-out infinite',
          }}
        />
      )}
    </button>
  );
}

// ---- AgentDock (main component) ----
let idCounter = 100;
function nextId() { return ++idCounter; }

export function AgentDock() {
  const agent = useAgent();
  const location = useLocation();
  const navigate = useNavigate();
  const route = location.pathname;

  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [hasUnread, setHasUnread] = React.useState(true);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const seeded = React.useRef(false);
  const threadRef = React.useRef<HTMLDivElement>(null);
  const inputWrapRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Seed greeting on first open
  function handleOpen() {
    setOpen(true);
    setHasUnread(false);
    if (seeded.current) return;
    seeded.current = true;
    const thinkId = nextId();
    setMessages([{ kind: 'thinking', id: thinkId }]);
    agent.ask('what needs my attention today', { route }).then(response => {
      setMessages([{ kind: 'agent', id: nextId(), response, animateFirst: true }]);
    });
  }

  function handleToggle() {
    if (!open) {
      handleOpen();
    } else {
      setOpen(false);
    }
  }

  async function submit(q: string) {
    const question = q.trim();
    if (!question || busy) return;
    setBusy(true);
    setInput('');

    const userId = nextId();
    const thinkId = nextId();
    setMessages(prev => [
      ...prev,
      { kind: 'user', id: userId, text: question },
      { kind: 'thinking', id: thinkId },
    ]);

    try {
      const response = await agent.ask(question, { route });
      setMessages(prev =>
        prev.filter(m => m.id !== thinkId).concat({ kind: 'agent', id: nextId(), response, animateFirst: true })
      );
    } finally {
      setBusy(false);
      const el = inputWrapRef.current?.querySelector('input');
      if (el) el.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  }

  // Action-block CTAs navigate to the relevant screen and close the panel
  function handleAction(to: string) {
    navigate(to);
    setOpen(false);
  }

  const chips = getSuggestedChips(route);
  const routeLabel = getRouteLabel(route);

  return (
    <>
      {/* Keyframe styles */}
      <style>{`
        @keyframes cs-dock-think {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes cs-dock-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.15); }
        }
        @keyframes cs-dock-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cs-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes cs-dock-think { 0%, 100% { opacity: 0.6; } }
          @keyframes cs-dock-pulse { 0%, 100% { opacity: 1; } }
          @keyframes cs-dock-in { from { opacity: 1; transform: none; } }
        }
      `}</style>

      {/* Fixed container */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 12,
          zIndex: 1050,
          pointerEvents: 'none',
        }}
      >
        {/* Panel */}
        {open && (
          <div
            role="dialog"
            aria-label="CitiSoft assistant"
            style={{
              pointerEvents: 'all',
              width: expanded ? 'min(760px, calc(100vw - 48px))' : 'min(400px, calc(100vw - 48px))',
              height: expanded ? 'calc(100vh - 110px)' : 'min(640px, calc(100vh - 120px))',
              transition: 'width var(--dur) var(--ease-out), height var(--dur) var(--ease-out)',
              background: 'var(--surface-card)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'cs-dock-in var(--dur) var(--ease-out) both',
            }}
          >
            {/* Dark header band */}
            <div
              style={{
                background: 'var(--slate-900)',
                borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexShrink: 0,
              }}
            >
              <img src="/logos/claude-white.svg" alt="" width={18} height={18} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <GradientText
                  as="span"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--fs-body-sm)',
                    fontWeight: 'var(--fw-semibold)',
                    display: 'block',
                    lineHeight: 1.2,
                    // Light-end gradient — the standard brand gradient fails
                    // contrast (≈2.6:1) against the dark header band.
                    background: 'var(--grad-brand-on-dark)',
                  }}
                >
                  CitiSoft assistant
                </GradientText>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--fs-overline)',
                    color: 'var(--slate-400)',
                    lineHeight: 1.2,
                    display: 'block',
                    marginTop: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Looking at: {routeLabel}
                </span>
              </div>
              <button
                onClick={() => setExpanded(e => !e)}
                aria-label={expanded ? 'Collapse chat' : 'Expand chat'}
                title={expanded ? 'Collapse' : 'Expand'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--slate-400)',
                  padding: 4,
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--slate-400)',
                  padding: 4,
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'color var(--dur-fast) var(--ease-out)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--slate-400)'; }}
                onFocus={e => { e.currentTarget.style.boxShadow = 'var(--shadow-focus)'; }}
                onBlur={e => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Thread */}
            <div
              ref={threadRef}
              aria-live="polite"
              aria-busy={busy}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-5)',
              }}
            >
              {messages.map(msg => {
                if (msg.kind === 'user') {
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div
                        style={{
                          maxWidth: '80%',
                          padding: 'var(--space-3) var(--space-4)',
                          background: 'var(--surface-sunken)',
                          border: '1px solid var(--border-default)',
                          borderRadius: 'var(--radius-lg)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: 'var(--fs-body-sm)',
                          color: 'var(--text-strong)',
                          lineHeight: 'var(--lh-relaxed)',
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                if (msg.kind === 'thinking') {
                  return <ThinkingIndicator key={msg.id} />;
                }

                return (
                  <AgentMessage
                    key={msg.id}
                    response={msg.response}
                    animateFirst={msg.animateFirst}
                    onAction={handleAction}
                  />
                );
              })}
            </div>

            {/* Composer area */}
            <div
              style={{
                flexShrink: 0,
                borderTop: '1px solid var(--border-subtle)',
                background: 'var(--surface-card)',
                padding: 'var(--space-3) var(--space-4) var(--space-4)',
              }}
            >
              {/* Suggested chips */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-2)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {chips.map(chip => (
                  <button
                    key={chip}
                    onClick={() => submit(chip)}
                    disabled={busy}
                    style={{
                      background: 'var(--surface-sunken)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '3px 10px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--fs-overline)',
                      color: 'var(--text-muted)',
                      cursor: busy ? 'not-allowed' : 'pointer',
                      lineHeight: 1.4,
                      transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
                    }}
                    onMouseEnter={e => {
                      if (!busy) {
                        (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-brand-tint)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)';
                      }
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-sunken)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input row */}
              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                <div style={{ flex: 1 }} ref={inputWrapRef}>
                  <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about invoices, payments…"
                    disabled={busy}
                    size="sm"
                    containerStyle={{ margin: 0 }}
                  />
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={busy || !input.trim()}
                  onClick={() => submit(input)}
                  leadingIcon={<Send size={14} />}
                  aria-label="Send message"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* FAB */}
        <div style={{ pointerEvents: 'all' }}>
          <Fab open={open} hasUnread={hasUnread} onClick={handleToggle} />
        </div>
      </div>
    </>
  );
}
