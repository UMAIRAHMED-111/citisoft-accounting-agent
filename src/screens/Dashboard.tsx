import { LayoutGrid } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your AP/AR reconciliation status"
      />
      <EmptyState
        icon={<LayoutGrid size={28} />}
        title="Dashboard coming soon"
        body="KPI cards, exception counts, and recent activity will appear here."
      />
    </div>
  );
}
