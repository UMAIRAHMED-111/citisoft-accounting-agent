import type { AgentProvider, AgentResponse, AgentContext } from './types';
import { runIntent, matchIntent } from './intents';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class LocalAgent implements AgentProvider {
  async ask(q: string, ctx?: AgentContext): Promise<AgentResponse> {
    const { kind } = matchIntent(q, ctx);
    // Believable thinking time; near-instant under vitest so the suite stays fast.
    const testMode = import.meta.env?.MODE === 'test';
    const ms = testMode
      ? 5
      : kind === 'action'
        ? 2000 + Math.random() * 900   // 2.0–2.9s: reading, mutating, re-matching
        : 1200 + Math.random() * 800;  // 1.2–2.0s: querying the ledger
    await sleep(ms);
    return runIntent(q, ctx);
  }
}

// Swap point: replace LocalAgent with ClaudeAgent once an API key is configured.
export class ClaudeAgent implements AgentProvider {
  async ask(_q: string, _ctx?: AgentContext): Promise<AgentResponse> {
    throw new Error('ClaudeAgent: not configured — set VITE_ANTHROPIC_API_KEY to enable.');
  }
}
