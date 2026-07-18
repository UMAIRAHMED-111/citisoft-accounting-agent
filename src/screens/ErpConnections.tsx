import { Plug } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function ErpConnections() {
  return (
    <div>
      <PageHeader
        title="Connections"
        subtitle="Manage ERP and accounting system integrations"
      />
      <EmptyState
        icon={<Plug size={28} />}
        title="Connections coming soon"
        body="Connect Xero, QuickBooks, Sage, and other accounting systems here."
      />
    </div>
  );
}
