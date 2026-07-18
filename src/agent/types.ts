export type AgentBlock =
  | { type: 'text'; text: string }
  | { type: 'table'; columns: string[]; rows: string[][] }
  | { type: 'action'; title: string; detail: string; cta: string }
  | { type: 'reasoning'; steps: string[] };

export interface AgentResponse {
  blocks: AgentBlock[];
}

export interface AgentContext {
  route: string;
}

export interface AgentProvider {
  ask(q: string, ctx?: AgentContext): Promise<AgentResponse>;
}
