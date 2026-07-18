import { BellRing } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

export default function Reminders() {
  return (
    <div>
      <PageHeader
        title="Reminders"
        subtitle="Automated payment reminders and follow-ups"
      />
      <EmptyState
        icon={<BellRing size={28} />}
        title="Reminders coming soon"
        body="Scheduled payment reminders and overdue invoice alerts will be configured here."
      />
    </div>
  );
}
