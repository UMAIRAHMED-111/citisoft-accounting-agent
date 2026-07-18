import { describe, it, expect } from 'vitest';
import { LocalAgent } from './engine';

const agent = new LocalAgent();

describe('agent', () => {
  it('answers "what needs my attention" from real exceptions', async () => {
    const r = await agent.ask('what needs my attention today');
    const text = JSON.stringify(r.blocks);
    expect(text).toMatch(/\$/); // cites real amounts
    expect(r.blocks.some(b => b.type === 'table' || b.type === 'action')).toBe(true);
  });

  it('explains a specific unapproved invoice with reasoning', async () => {
    const r = await agent.ask("why wasn't 78875 auto-approved");
    expect(r.blocks.some(b => b.type === 'reasoning')).toBe(true);
  });

  it('falls back helpfully on nonsense', async () => {
    const r = await agent.ask('asdf zzz');
    expect(r.blocks.length).toBeGreaterThan(0);
  });
});
