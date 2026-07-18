import { ListChecks } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function ArMatching() {
  return (
    <div>
      <PageHeader
        title="AR matching"
        subtitle="Match customer payments to outstanding invoices"
      />
      <EmptyState
        icon={<ListChecks size={28} />}
        title="AR matching coming soon"
        body="Customer payment-to-invoice reconciliation and exception handling will appear here."
      />
    </div>
  );
}
