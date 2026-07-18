import type { AgentProvider, AgentResponse } from './types';
import { runIntent } from './intents';

export class LocalAgent implements AgentProvider {
  async ask(q: string): Promise<AgentResponse> {
    return Promise.resolve(runIntent(q));
  }
}

// Swap point: replace LocalAgent with ClaudeAgent once an API key is configured.
export class ClaudeAgent implements AgentProvider {
  async ask(_q: string): Promise<AgentResponse> {
    throw new Error('ClaudeAgent: not configured — set VITE_ANTHROPIC_API_KEY to enable.');
  }
}
