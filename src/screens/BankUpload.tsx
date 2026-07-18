import { Upload } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function BankUpload() {
  return (
    <div>
      <PageHeader
        title="Bank upload"
        subtitle="Import bank statements for reconciliation"
      />
      <EmptyState
        icon={<Upload size={28} />}
        title="Bank upload coming soon"
        body="Upload CSV or OFX bank statements to match against AR invoices."
      />
    </div>
  );
}
