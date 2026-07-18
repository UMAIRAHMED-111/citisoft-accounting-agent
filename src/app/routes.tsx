import { Route, Routes, Navigate } from 'react-router-dom';
import { AppShell } from './AppShell';
import Dashboard from '../screens/Dashboard';
import InvoiceInbox from '../screens/InvoiceInbox';
import PoMatching from '../screens/PoMatching';
import BankUpload from '../screens/BankUpload';
import ArMatching from '../screens/ArMatching';
import Reminders from '../screens/Reminders';
import AgentChat from '../screens/AgentChat';
import ErpConnections from '../screens/ErpConnections';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="inbox" element={<InvoiceInbox />} />
        <Route path="po-matching" element={<PoMatching />} />
        <Route path="bank-upload" element={<BankUpload />} />
        <Route path="ar-matching" element={<ArMatching />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="agent" element={<AgentChat />} />
        <Route path="connections" element={<ErpConnections />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
