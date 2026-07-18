import React from 'react';
import { Send } from 'lucide-react';
import { useAgent } from '../agent/AgentProvider';
import type { AgentResponse } from '../agent/types';
import { Logo, GradientText, Tag, Input, Button } from '../ds';
import { AgentMessage } from '../components/AgentMessage';

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

// ---- Suggested prompts ----
const SUGGESTED: string[] = [
  'What needs my attention today',
  'Show unmatched payments',
  'Why wasn\'t invoice 78875 auto-approved',
  'Overdue invoices',
];

// ---- ThinkingIndicator ----
function ThinkingIndicator() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-1) 0',
      }}
    >
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
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" />
          <path d="M20 3v4" />
          <path d="M22 5h-4" />
        </svg>
      </span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-body-sm)',
          color: 'var(--text-muted)',
        }}
      >
        <span style={dotStyle(0)} />
        <span style={dotStyle(1)} />
        <span style={dotStyle(2)} />
      </span>
    </div>
  );
}

function dotStyle(i: number): React.CSSProperties {
  return {
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--slate-400)',
    animation: `cs-thinking 1.2s ease-in-out ${i * 0.2}s infinite`,
  };
}

// ---- AgentChat ----
let idCounter = 0;
function nextId() {
  return ++idCounter;
}

export default function AgentChat() {
  const agent = useAgent();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const threadRef = React.useRef<HTMLDivElement>(null);
  const inputWrapRef = React.useRef<HTMLDivElement>(null);
  const seeded = React.useRef(false);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Seed greeting on mount
  React.useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const thinkId = nextId();
    setMessages([{ kind: 'thinking', id: thinkId }]);
    agent.ask('what needs my attention today').then(response => {
      setMessages([
        {
          kind: 'agent',
          id: nextId(),
          response,
          animateFirst: true,
        },
      ]);
    });
  }, [agent]);

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
      const response = await agent.ask(question);
      setMessages(prev =>
        prev
          .filter(m => m.id !== thinkId)
          .concat({ kind: 'agent', id: nextId(), response, animateFirst: true })
      );
    } finally {
      setBusy(false);
      // Refocus the text input inside the wrapper
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--surface-page)',
        overflow: 'hidden',
      }}
    >
      {/* ---- Dark high-impact header band ---- */}
      <header
        style={{
          background: 'var(--slate-900)',
          padding: 'var(--space-5) var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-6)',
          flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Logo variant="white" height={28} />
        <div
          style={{
            width: 1,
            height: 32,
            background: 'rgba(255,255,255,0.12)',
            flexShrink: 0,
          }}
          aria-hidden
        />
        <div>
          <GradientText
            as="h1"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-h4)',
              fontWeight: 'var(--fw-semibold)',
              lineHeight: 'var(--lh-snug)',
              letterSpacing: 'var(--ls-snug)',
              margin: 0,
            }}
          >
            CitiSoft Reconciliation Agent
          </GradientText>
          <p
            style={{
              margin: 'var(--space-1) 0 0',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--fs-caption)',
              color: 'var(--slate-400)',
              lineHeight: 1,
            }}
          >
            Reading your ledger · 6 AP · 8 AR
          </p>
        </div>
      </header>

      {/* ---- Message thread ---- */}
      <div
        ref={threadRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--space-8) var(--space-5)',
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-7)',
          }}
        >
          {messages.map(msg => {
            if (msg.kind === 'user') {
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '72%',
                      padding: 'var(--space-4) var(--space-5)',
                      background: 'var(--surface-card)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xs)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--fs-body)',
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

            // agent
            return (
              <AgentMessage
                key={msg.id}
                response={msg.response}
                animateFirst={msg.animateFirst}
              />
            );
          })}
        </div>
      </div>

      {/* ---- Composer area ---- */}
      <div
        style={{
          flexShrink: 0,
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--surface-card)',
          padding: 'var(--space-4) var(--space-5) var(--space-5)',
        }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* Suggested prompts */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-4)',
            }}
          >
            {SUGGESTED.map(prompt => (
              <Tag
                key={prompt}
                onClick={() => submit(prompt)}
                style={{ cursor: 'pointer' }}
              >
                {prompt}
              </Tag>
            ))}
          </div>

          {/* Input row */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <div style={{ flex: 1 }} ref={inputWrapRef}>
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about exceptions, invoices, payments…"
                disabled={busy}
                size="md"
                containerStyle={{ margin: 0 }}
              />
            </div>
            <Button
              variant="primary"
              size="md"
              disabled={busy || !input.trim()}
              onClick={() => submit(input)}
              leadingIcon={<Send size={16} />}
              aria-label="Send message"
            >
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* ---- Inline keyframe styles ---- */}
      <style>{`
        @keyframes cs-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes cs-thinking {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes cs-blink { 0%, 100% { opacity: 1; } }
          @keyframes cs-thinking { 0%, 100% { opacity: 0.6; } }
        }
      `}</style>
    </div>
  );
}
