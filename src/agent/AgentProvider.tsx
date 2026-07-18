import { createContext, useContext, type ReactNode } from 'react';
import type { AgentProvider } from './types';
import { LocalAgent } from './engine';

const defaultAgent: AgentProvider = new LocalAgent();

const AgentContext = createContext<AgentProvider>(defaultAgent);

export function AgentProviderComponent({
  agent = defaultAgent,
  children,
}: {
  agent?: AgentProvider;
  children: ReactNode;
}) {
  return <AgentContext.Provider value={agent}>{children}</AgentContext.Provider>;
}

export function useAgent(): AgentProvider {
  return useContext(AgentContext);
}
