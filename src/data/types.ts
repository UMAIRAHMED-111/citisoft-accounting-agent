export type ErpSystem = 'Xero' | 'NetSuite' | 'Dynamics' | 'QuickBooks';

export interface Vendor {
  id: string;
  name: string;
  erp: ErpSystem;
}

export interface LineItem {
  sku: string;
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  description: string;
  lineItems: LineItem[];
  total: number;
  currency: string;
}

export type ErpStatus = 'not_posted' | 'ready' | 'posted';

export interface Invoice {
  id: string;
  vendorId: string;
  invoiceNo: string;
  amount: number;
  currency: string;
  dueDate: Date;
  receivedAt: Date;
  poRef?: string | null;
  lineItems: LineItem[];
  source: 'email' | 'upload';
  raw: { fromEmail: string; subject: string };
  pdfUrl: string;
  erpStatus: ErpStatus;
  erpDocNo?: string | null;
  manualApproved?: boolean;
}

export interface ArInvoice {
  id: string;
  customer: string;
  invoiceNo: string;
  amount: number;
  issuedDate: Date;
  dueDate: Date;
  ref: string;
  reminderSent?: boolean;
}

export interface BankTxn {
  id: string;
  date: Date;
  amount: number;
  memo: string;
  payerRef?: string | null;
}

export interface BankStatement {
  id: string;
  account: string;
  period: string;
  txns: BankTxn[];
}

export type ApStatus = 'auto_approved' | 'needs_review' | 'duplicate';
export type MatchKind = 'exact' | 'partial' | 'lump' | 'unmatched';
