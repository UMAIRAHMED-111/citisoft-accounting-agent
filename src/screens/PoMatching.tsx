import { GitCompareArrows } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function PoMatching() {
  return (
    <div>
      <PageHeader
        title="PO matching"
        subtitle="Match AP invoices to purchase orders"
      />
      <EmptyState
        icon={<GitCompareArrows size={28} />}
        title="PO matching coming soon"
        body="Automated and manual AP invoice-to-PO matching will be available here."
      />
    </div>
  );
}
