import type { AgentProvider, AgentResponse, AgentContext } from './types';
import { runIntent, matchIntent } from './intents';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class LocalAgent implements AgentProvider {
  async ask(q: string, ctx?: AgentContext): Promise<AgentResponse> {
    const { kind } = matchIntent(q, ctx);
    const ms = kind === 'action'
      ? 700 + Math.random() * 400   // 700–1100ms for actions
      : 400 + Math.random() * 300;  // 400–700ms for queries
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
