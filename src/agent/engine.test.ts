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

  it('reports net revenue / cash for the month with a breakdown table', async () => {
    const r = await agent.ask('what is the net revenue for this month');
    const text = JSON.stringify(r.blocks);
    expect(r.blocks.some(b => b.type === 'table')).toBe(true);
    expect(text).toMatch(/Net cash movement/);
    expect(text).toMatch(/\$/);
  });

  it('names the highest buyer with a ranked table', async () => {
    const r = await agent.ask('which is my highest buyer');
    const text = JSON.stringify(r.blocks);
    expect(text).toMatch(/Global Aerospace Fabricators/); // $22,100 — largest AR customer
    expect(r.blocks.some(b => b.type === 'table')).toBe(true);
  });

  it('names the top vendor by spend', async () => {
    const r = await agent.ask('which vendor do we spend the most with');
    const text = JSON.stringify(r.blocks);
    expect(text).toMatch(/Curbell Plastics/); // $17,173.58 — largest AP vendor
  });

  it('ranks who owes the most', async () => {
    const r = await agent.ask('who owes me the most');
    const text = JSON.stringify(r.blocks);
    expect(text).toMatch(/Precision Parts LLC/); // $12,450 open — largest balance
  });
});
