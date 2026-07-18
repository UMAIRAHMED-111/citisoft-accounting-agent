import { Bot } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function AgentChat() {
  return (
    <div>
      <PageHeader
        title="Agent"
        subtitle="AI-powered reconciliation assistant"
      />
      <EmptyState
        icon={<Bot size={28} />}
        title="Agent chat coming soon"
        body="Ask the AI agent to find exceptions, explain mismatches, and suggest actions."
      />
    </div>
  );
}
