import { Inbox } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function InvoiceInbox() {
  return (
    <div>
      <PageHeader
        title="Invoice inbox"
        subtitle="Review and process incoming AP invoices"
      />
      <EmptyState
        icon={<Inbox size={28} />}
        title="Invoice inbox coming soon"
        body="Incoming vendor invoices awaiting review and PO matching will appear here."
      />
    </div>
  );
}
