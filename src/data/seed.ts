import type { Vendor, PurchaseOrder, Invoice, ArInvoice, BankStatement } from './types';

export const TODAY = new Date('2026-07-18');

// ---------------------------------------------------------------------------
// Vendors
// ---------------------------------------------------------------------------
export const vendors: Vendor[] = [
  { id: 'v-alro',     name: 'Alro Steel Corporation',    erp: 'NetSuite'   },
  { id: 'v-curbell',  name: 'Curbell Plastics, Inc.',    erp: 'Dynamics'   },
  { id: 'v-mcmaster', name: 'McMaster-Carr Supply Co.',  erp: 'NetSuite'   },
  { id: 'v-klein',    name: 'Klein Plating Works, Inc.', erp: 'QuickBooks' },
  { id: 'v-aplus',    name: 'A Plus Powder Coaters',     erp: 'QuickBooks' },
  { id: 'v-anago',    name: 'Anago Cleaning Service',    erp: 'Xero'       },
];

// ---------------------------------------------------------------------------
// Purchase Orders
// ---------------------------------------------------------------------------
export const purchaseOrders: PurchaseOrder[] = [
  // PO #1 — Alro Steel GFB3506PV  (exact match: total = $3,419.49)
  {
    id: 'po-28954',
    vendorId: 'v-alro',
    description: 'Steel bar stock — C1144 and 316/316L stainless rod',
    lineItems: [
      { sku: '02201600',    description: '1/2 RD CF C1144, 12 FT (15 LNG, 121 LB)', qty: 121, unitPrice: 1.11,  amount: 134.31 },
      { sku: 'RT12523349',  description: '1/2 RD 316/316L Stainless, 12 FT (90 LNG, 726 LB)', qty: 726, unitPrice: 4.43,  amount: 3216.18 },
      { sku: 'FREIGHT-1',   description: 'Shipping & Handling Line 1', qty: 1, unitPrice: 10.00, amount: 10.00 },
      { sku: 'FREIGHT-2',   description: 'Shipping & Handling Line 2', qty: 1, unitPrice: 40.00, amount: 40.00 },
      { sku: 'FREIGHT-STD', description: 'Standard Freight', qty: 1, unitPrice: 19.00, amount: 19.00 },
    ],
    total: 3419.49,
    currency: 'USD',
  },

  // PO #2 — Curbell Plastics 91918970  (exact match: total = $17,173.58)
  {
    id: 'po-28876',
    vendorId: 'v-curbell',
    description: 'PEEK rod stock 0.875" BLACK KETRON 1000',
    lineItems: [
      { sku: '4171', description: 'PEEK ROD_FOOT 0.875 in BLACK KETRON 1000', qty: 632, unitPrice: 26.75, amount: 16906.00 },
      { sku: 'SH-CURBELL', description: 'Shipping & Handling', qty: 1, unitPrice: 267.58, amount: 267.58 },
    ],
    total: 17173.58,
    currency: 'USD',
  },

  // PO #3 — McMaster-Carr 66861386  (exact match: total = $732.67)
  {
    id: 'po-29037',
    vendorId: 'v-mcmaster',
    description: 'Shop supplies — drum pump, panel air filters',
    lineItems: [
      { sku: '9918K112', description: 'Drum Pump for Water and Chemicals, 8 oz/Stroke, 70mm Drum, 22" Discharge Tube', qty: 1,  unitPrice: 45.65,  amount: 45.65  },
      { sku: '2063K67',  description: 'Panel Air Filter 2" Thick 25×25 Trade Size, Packs of 12', qty: 2,  unitPrice: 91.80,  amount: 183.60 },
      { sku: '2063K798', description: 'Panel Air Filter 2" Thick 20×25 Trade Size, Packs of 12', qty: 2,  unitPrice: 86.70,  amount: 173.40 },
      { sku: 'SALESTAX', description: 'Sales Tax', qty: 1, unitPrice: 41.47, amount: 41.47 },
      { sku: 'SHIPPING', description: 'Shipping', qty: 1, unitPrice: 288.55, amount: 288.55 },
    ],
    total: 732.67,
    currency: 'USD',
  },

  // PO #4 — Klein Plating 142924  (exact match: total = $175.00)
  {
    id: 'po-28953',
    vendorId: 'v-klein',
    description: 'Plating services — Part 4131 Armature (minimum lot charge)',
    lineItems: [
      { sku: '4131-ARMATURE', description: 'Parts Processed – Minimum Lot Charge, Job #137464, Part #4131 Armature Rev D, Qty 1638, DT #279839', qty: 1, unitPrice: 175.00, amount: 175.00 },
    ],
    total: 175.00,
    currency: 'USD',
  },

  // PO #5 — A Plus Powder 78875  (MISMATCH: PO total $900.00 < invoice $951.96)
  {
    id: 'po-11166',
    vendorId: 'v-aplus',
    description: 'Powder coating — structural stanchions and engine board supports (BLACK)',
    lineItems: [
      { sku: '230195', description: 'MID Engine Board Support, 1"×2.43"×20"', qty: 36, unitPrice: 5.00,  amount: 180.00 },
      { sku: '230410', description: 'FWD PORT Stanchion, 2"×3.68"×28"',       qty: 12, unitPrice: 5.04,  amount: 60.48  },
      { sku: '230411', description: 'FWD STBD Stanchion, 2"×3.68"×28"',       qty: 12, unitPrice: 5.04,  amount: 60.48  },
      { sku: '230412', description: 'AFT Port Stanchion, 2"×3.68"×27.25"',    qty: 12, unitPrice: 5.04,  amount: 60.48  },
      { sku: '240386', description: 'AFT PORT Stanchion, 3.5"×10"×19.13"',    qty: 6,  unitPrice: 6.62,  amount: 39.72  },
      { sku: '240387', description: 'AFT STBD Stanchion, 3.5"×10"×19"',       qty: 6,  unitPrice: 6.62,  amount: 39.72  },
      { sku: '240388', description: 'FWD PORT Stanchion, 3.5"×6.75"×28"',     qty: 6,  unitPrice: 6.62,  amount: 39.72  },
      { sku: '240389', description: 'FWD STBD Stanchion, 3.5"×6.75"×28"',     qty: 6,  unitPrice: 6.62,  amount: 39.72  },
      // PO did NOT include the engine board stiffener (240394) or the two aft stanchion large batches
    ],
    total: 900.00,  // intentionally below invoice $951.96 — triggers mismatch scenario
    currency: 'USD',
  },
];

// ---------------------------------------------------------------------------
// AP Invoices  (6 real vendor invoices)
// ---------------------------------------------------------------------------
export const apInvoices: Invoice[] = [
  // #1 — Alro Steel GFB3506PV — auto_approved, posted
  {
    id: 'ap-1',
    vendorId: 'v-alro',
    invoiceNo: 'GFB3506PV',
    amount: 3419.49,
    currency: 'USD',
    dueDate: new Date('2026-07-02'),   // Net 30 from 06/02/2026
    receivedAt: new Date('2026-06-03'),
    poRef: 'po-28954',
    lineItems: [
      { sku: '02201600',    description: '1/2 RD CF C1144, 12 FT (15 LNG, 121 LB)',               qty: 121, unitPrice: 1.11,  amount: 134.31 },
      { sku: 'RT12523349',  description: '1/2 RD 316/316L Stainless, 12 FT (90 LNG, 726 LB)',     qty: 726, unitPrice: 4.43,  amount: 3216.18 },
      { sku: 'FREIGHT-1',   description: 'Shipping & Handling Line 1',                             qty: 1,   unitPrice: 10.00, amount: 10.00 },
      { sku: 'FREIGHT-2',   description: 'Shipping & Handling Line 2',                             qty: 1,   unitPrice: 40.00, amount: 40.00 },
      { sku: 'FREIGHT-STD', description: 'Standard Freight',                                       qty: 1,   unitPrice: 19.00, amount: 19.00 },
    ],
    source: 'email',
    raw: { fromEmail: 'amarchitelli@alro.com', subject: 'Invoice GFB3506PV from Alro Steel Corporation' },
    pdfUrl: '/invoices/alro-steel-GFB3506PV.pdf',
    erpStatus: 'posted',
    erpDocNo: 'BILL-10482',
  },

  // #2 — Curbell Plastics 91918970 — auto_approved, posted
  {
    id: 'ap-2',
    vendorId: 'v-curbell',
    invoiceNo: '91918970',
    amount: 17173.58,
    currency: 'USD',
    dueDate: new Date('2026-07-23'),   // Net 30 from 06/23/2026
    receivedAt: new Date('2026-06-24'),
    poRef: 'po-28876',
    lineItems: [
      { sku: '4171',       description: 'PEEK ROD_FOOT 0.875 in BLACK KETRON 1000',  qty: 632, unitPrice: 26.75,  amount: 16906.00 },
      { sku: 'SH-CURBELL', description: 'Shipping & Handling',                        qty: 1,   unitPrice: 267.58, amount: 267.58  },
    ],
    source: 'email',
    raw: { fromEmail: 'ar@curbellplastics.com', subject: 'Invoice 91918970 — Curbell Plastics' },
    pdfUrl: '/invoices/curbell-plastics-91918970.pdf',
    erpStatus: 'posted',
    erpDocNo: 'BILL-10491',
  },

  // #3 — McMaster-Carr 66861386 — auto_approved, posted
  {
    id: 'ap-3',
    vendorId: 'v-mcmaster',
    invoiceNo: '66861386',
    amount: 732.67,
    currency: 'USD',
    dueDate: new Date('2026-07-17'),   // Net 30 from 06/17/2026
    receivedAt: new Date('2026-06-18'),
    poRef: 'po-29037',
    lineItems: [
      { sku: '9918K112', description: 'Drum Pump for Water and Chemicals, 8 oz/Stroke, 70mm Drum',       qty: 1, unitPrice: 45.65,  amount: 45.65  },
      { sku: '2063K67',  description: 'Panel Air Filter 2" Thick 25×25 Trade Size, Packs of 12',        qty: 2, unitPrice: 91.80,  amount: 183.60 },
      { sku: '2063K798', description: 'Panel Air Filter 2" Thick 20×25 Trade Size, Packs of 12',        qty: 2, unitPrice: 86.70,  amount: 173.40 },
      { sku: 'SALESTAX', description: 'Sales Tax',                                                        qty: 1, unitPrice: 41.47,  amount: 41.47  },
      { sku: 'SHIPPING', description: 'Shipping',                                                         qty: 1, unitPrice: 288.55, amount: 288.55 },
    ],
    source: 'email',
    raw: { fromEmail: 'cle.sales@mcmaster.com', subject: 'McMaster-Carr Invoice 66861386' },
    pdfUrl: '/invoices/mcmaster-carr-66861386.pdf',
    erpStatus: 'posted',
    erpDocNo: 'BILL-10497',
  },

  // #4 — Klein Plating 142924 — auto_approved, ready (not yet posted)
  {
    id: 'ap-4',
    vendorId: 'v-klein',
    invoiceNo: '142924',
    amount: 175.00,
    currency: 'USD',
    dueDate: new Date('2026-07-02'),   // Net 30 from 06/02/2026
    receivedAt: new Date('2026-06-05'),
    poRef: 'po-28953',
    lineItems: [
      { sku: '4131-ARMATURE', description: 'Parts Processed – Minimum Lot Charge, Job #137464, Part #4131 Armature Rev D, Qty 1638, DT #279839', qty: 1, unitPrice: 175.00, amount: 175.00 },
    ],
    source: 'email',
    raw: { fromEmail: 'billing@kleinplating.com', subject: 'Invoice #142924 Klein Plating Works' },
    pdfUrl: '/invoices/klein-plating-142924.pdf',
    erpStatus: 'ready',
    erpDocNo: null,
  },

  // #5 — A Plus Powder 78875 — needs_review (amount mismatch: invoice $951.96 > PO $900.00)
  {
    id: 'ap-5',
    vendorId: 'v-aplus',
    invoiceNo: '78875',
    amount: 951.96,
    currency: 'USD',
    dueDate: new Date('2026-09-07'),   // Net 60 from 07/09/2026
    receivedAt: new Date('2026-07-10'),
    poRef: 'po-11166',
    lineItems: [
      { sku: '230195', description: 'MID Engine Board Support, 1"×2.43"×20"',                       qty: 36, unitPrice: 5.00,  amount: 180.00 },
      { sku: '230410', description: 'FWD PORT Stanchion, 2"×3.68"×28"',                             qty: 12, unitPrice: 5.04,  amount: 60.48  },
      { sku: '230411', description: 'FWD STBD Stanchion, 2"×3.68"×28"',                             qty: 12, unitPrice: 5.04,  amount: 60.48  },
      { sku: '230412', description: 'AFT Port Stanchion, 2"×3.68"×27.25"',                          qty: 12, unitPrice: 5.04,  amount: 60.48  },
      { sku: '240386', description: 'AFT PORT Stanchion, 3.5"×10"×19.13"',                          qty: 6,  unitPrice: 6.62,  amount: 39.72  },
      { sku: '240387', description: 'AFT STBD Stanchion, 3.5"×10"×19"',                             qty: 6,  unitPrice: 6.62,  amount: 39.72  },
      { sku: '240388', description: 'FWD PORT Stanchion, 3.5"×6.75"×28"',                           qty: 6,  unitPrice: 6.62,  amount: 39.72  },
      { sku: '240389', description: 'FWD STBD Stanchion, 3.5"×6.75"×28"',                           qty: 6,  unitPrice: 6.62,  amount: 39.72  },
      { sku: '240394', description: 'Engine Board Stiffener, .75"×.75"×32" *PLUG 4 THREADS*',       qty: 15, unitPrice: 6.60,  amount: 99.00  },
      { sku: '250115', description: 'AFT STBD Stanchion, 2"×3.38"×28.25"',                         qty: 36, unitPrice: 5.04,  amount: 181.44 },
      { sku: '250114', description: 'AFT PORT Stanchion, 2"×3.38"×28.25"',                         qty: 30, unitPrice: 5.04,  amount: 151.20 },
    ],
    source: 'email',
    raw: { fromEmail: 'billing@apluspc.com', subject: 'Invoice 78875 — A Plus Powder Coaters' },
    pdfUrl: '/invoices/aplus-powder-78875.pdf',
    erpStatus: 'not_posted',
    erpDocNo: null,
  },

  // #6 — Anago Cleaning 13992 — needs_review, no PO
  {
    id: 'ap-6',
    vendorId: 'v-anago',
    invoiceNo: '13992',
    amount: 407.81,
    currency: 'USD',
    dueDate: new Date('2026-08-10'),   // due date per invoice
    receivedAt: new Date('2026-07-06'),
    poRef: null,
    lineItems: [
      { sku: 'JANITORIAL', description: 'August Janitorial Services', qty: 1, unitPrice: 375.00, amount: 375.00 },
      { sku: 'SALESTAX',   description: 'Sales Tax',                  qty: 1, unitPrice: 32.81,  amount: 32.81  },
    ],
    source: 'email',
    raw: { fromEmail: 'billing@anago.com', subject: 'Anago Cleaning Invoice #13992 — August Services' },
    pdfUrl: '/invoices/anago-cleaning-13992.pdf',
    erpStatus: 'not_posted',
    erpDocNo: null,
  },
];

// ---------------------------------------------------------------------------
// AR Invoices — 8 total, exactly 2 overdue relative to TODAY (2026-07-18)
// Overdue = dueDate < TODAY
// ---------------------------------------------------------------------------
export const arInvoices: ArInvoice[] = [
  // 2 overdue (dueDate before 2026-07-18)
  {
    id: 'ar-1',
    customer: 'Precision Parts LLC',
    invoiceNo: 'AR-2026-0041',
    amount: 12450.00,
    issuedDate: new Date('2026-05-15'),
    dueDate: new Date('2026-06-14'),   // OVERDUE (34 days overdue)
    ref: 'AR-2026-0041',
  },
  {
    id: 'ar-2',
    customer: 'Apex Manufacturing Co.',
    invoiceNo: 'AR-2026-0048',
    amount: 8300.00,
    issuedDate: new Date('2026-06-01'),
    dueDate: new Date('2026-07-01'),   // OVERDUE (17 days overdue)
    ref: 'AR-2026-0048',
  },
  // 6 not overdue (dueDate >= TODAY)
  {
    id: 'ar-3',
    customer: 'Global Aerospace Fabricators',
    invoiceNo: 'AR-2026-0055',
    amount: 22100.00,
    issuedDate: new Date('2026-06-18'),
    dueDate: new Date('2026-07-18'),   // due TODAY — not overdue
    ref: 'AR-2026-0055',
  },
  {
    id: 'ar-4',
    customer: 'Delta Machining Solutions',
    invoiceNo: 'AR-2026-0061',
    amount: 5875.50,
    issuedDate: new Date('2026-06-25'),
    dueDate: new Date('2026-07-25'),
    ref: 'AR-2026-0061',
  },
  {
    id: 'ar-5',
    customer: 'Keystone Industrial Supply',
    invoiceNo: 'AR-2026-0067',
    amount: 9640.00,
    issuedDate: new Date('2026-07-01'),
    dueDate: new Date('2026-07-31'),
    ref: 'AR-2026-0067',
  },
  {
    id: 'ar-6',
    customer: 'TriState Metal Works',
    invoiceNo: 'AR-2026-0072',
    amount: 14200.00,
    issuedDate: new Date('2026-07-05'),
    dueDate: new Date('2026-08-04'),
    ref: 'AR-2026-0072',
  },
  {
    id: 'ar-7',
    customer: 'Ridgeway Fabrication Inc.',
    invoiceNo: 'AR-2026-0078',
    amount: 3300.00,
    issuedDate: new Date('2026-07-08'),
    dueDate: new Date('2026-08-07'),
    ref: 'AR-2026-0078',
  },
  {
    id: 'ar-8',
    customer: 'Pittsburgh Automation Partners',
    invoiceNo: 'AR-2026-0083',
    amount: 18750.00,
    issuedDate: new Date('2026-07-10'),
    dueDate: new Date('2026-08-09'),
    ref: 'AR-2026-0083',
  },
];

// ---------------------------------------------------------------------------
// Bank Statement — 9 txns
//   ≥3 exact-ref matches (AR invoices)
//   1 partial (only some of the amount)
//   1 lump covering two AR invoices
//   ≥1 unmatched cash
// ---------------------------------------------------------------------------
export const bankStatement: BankStatement = {
  id: 'stmt-2026-07',
  account: 'Checking — JPMorgan Chase ****4783',
  period: 'Jul 1–18, 2026',
  txns: [
    // Exact match → AR-2026-0083 (Pittsburgh Automation Partners, $18,750.00)
    {
      id: 'txn-1',
      date: new Date('2026-07-02'),
      amount: 18750.00,
      memo: 'ACH CREDIT PITTSBURGH AUTOMATION PARTNERS REF AR-2026-0083',
      payerRef: 'AR-2026-0083',
    },
    // Exact match → AR-2026-0078 (Ridgeway Fabrication Inc., $3,300.00)
    {
      id: 'txn-2',
      date: new Date('2026-07-07'),
      amount: 3300.00,
      memo: 'WIRE RIDGEWAY FABRICATION INC REF AR-2026-0078',
      payerRef: 'AR-2026-0078',
    },
    // Exact match → AR-2026-0055 (Global Aerospace, $22,100.00)
    {
      id: 'txn-3',
      date: new Date('2026-07-15'),
      amount: 22100.00,
      memo: 'ACH CREDIT GLOBAL AEROSPACE FABRICATORS REF AR-2026-0055',
      payerRef: 'AR-2026-0055',
    },
    // Partial match → AR-2026-0061 (Delta Machining, $5,875.50) — only $3,000 paid
    {
      id: 'txn-4',
      date: new Date('2026-07-10'),
      amount: 3000.00,
      memo: 'ACH CREDIT DELTA MACHINING SOLUTIONS PARTIAL AR-2026-0061',
      payerRef: 'AR-2026-0061',
    },
    // Lump sum covering AR-2026-0067 ($9,640) + AR-2026-0072 ($14,200) = $23,840
    {
      id: 'txn-5',
      date: new Date('2026-07-12'),
      amount: 23840.00,
      memo: 'WIRE KEYSTONE INDL SUPPLY LUMP PYMT AR-2026-0067 AR-2026-0072',
      payerRef: null,
    },
    // Unmatched cash deposit
    {
      id: 'txn-6',
      date: new Date('2026-07-03'),
      amount: 500.00,
      memo: 'CASH DEPOSIT — BRANCH TELLER',
      payerRef: null,
    },
    // Unmatched wire — no AR ref
    {
      id: 'txn-7',
      date: new Date('2026-07-08'),
      amount: 2750.00,
      memo: 'WIRE INBOUND UNKNOWN SENDER 0047291',
      payerRef: null,
    },
    // Bank fee (debit)
    {
      id: 'txn-8',
      date: new Date('2026-07-01'),
      amount: -35.00,
      memo: 'MONTHLY ACCOUNT SERVICE FEE',
      payerRef: null,
    },
    // AP payment outbound — Alro Steel (for reference in AP flow)
    {
      id: 'txn-9',
      date: new Date('2026-07-05'),
      amount: -3419.49,
      memo: 'ACH DEBIT ALRO STEEL CORP BILL-10482',
      payerRef: null,
    },
  ],
};
