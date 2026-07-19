import type { Vendor, PurchaseOrder, Invoice, ArInvoice, BankStatement } from './types';

export const TODAY = new Date('2026-07-18');

// ---------------------------------------------------------------------------
// Vendors
// ---------------------------------------------------------------------------
export const vendors: Vendor[] = [
  { id: 'v-alro',     name: 'Alro Steel Corporation',    erp: 'NetSuite' },
  { id: 'v-curbell',  name: 'Curbell Plastics, Inc.',    erp: 'Dynamics' },
  { id: 'v-mcmaster', name: 'McMaster-Carr Supply Co.',  erp: 'NetSuite' },
  { id: 'v-klein',    name: 'Klein Plating Works, Inc.', erp: 'Xero'     },
  { id: 'v-aplus',    name: 'A Plus Powder Coaters',     erp: 'Xero'     },
  { id: 'v-anago',    name: 'Anago Cleaning Service',    erp: 'Xero'     },
  { id: 'v-drytech',      name: 'Dry Tech Corporation',          erp: 'NetSuite'  },
  { id: 'v-accromet',     name: 'Accro-Met, Inc.',               erp: 'Xero'      },
  { id: 'v-clearfield',   name: 'Clearfield Wholesale Paper Co.', erp: 'Dynamics'  },
  { id: 'v-airtech',      name: 'AIR TECH',                      erp: 'NetSuite'  },
  { id: 'v-hitech',       name: 'Hi-Tech Turning & Milling',     erp: 'Xero'      },
  { id: 'v-able',         name: 'Able Electropolishing',         erp: 'Xero'      },
  { id: 'v-georgino',     name: 'Georgino Industrial Supply',    erp: 'NetSuite'  },
  { id: 'v-genevieve',    name: 'Genevieve Swiss Industries',    erp: 'Dynamics'  },
  { id: 'v-keb',          name: 'KEB',                           erp: 'Xero'      },
  { id: 'v-kowalski',     name: 'KOWALSKI',                      erp: 'NetSuite'  },
  { id: 'v-cutting',      name: 'Cutting Edge Bullets',          erp: 'Dynamics'  },
  { id: 'v-earle',        name: 'Earle M. Jorgensen Company',   erp: 'NetSuite'  },
];

/** ERPs with live connections — the single source of truth shared by the
 *  Topbar status chip and the Connections screen. QuickBooks is intentionally
 *  not connected. */
export const CONNECTED_ERPS = ['Xero', 'NetSuite', 'Dynamics'] as const;

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
  // PO for Dry Tech 406693 ($3,240.00)
  {
    id: 'po-29101',
    vendorId: 'v-drytech',
    description: 'Industrial desiccant dryers — hopper units and replacement cartridges',
    lineItems: [
      { sku: 'DT-HD24', description: 'Hopper Dryer 24L capacity, 3-phase 240V', qty: 2, unitPrice: 1185.00, amount: 2370.00 },
      { sku: 'DT-CART8', description: 'Replacement desiccant cartridge, 8-pack', qty: 3, unitPrice: 290.00, amount: 870.00 },
    ],
    total: 3240.00,
    currency: 'USD',
  },
  // PO for Accro-Met 0102715 ($1,875.50)
  {
    id: 'po-29102',
    vendorId: 'v-accromet',
    description: 'Precision CNC machined aluminum brackets — batch run',
    lineItems: [
      { sku: 'AM-BKT-7040', description: 'CNC Bracket 7040 Alum, 12"×4"×1.5", qty 25', qty: 25, unitPrice: 58.50, amount: 1462.50 },
      { sku: 'AM-SETUP', description: 'Setup / fixturing charge', qty: 1, unitPrice: 413.00, amount: 413.00 },
    ],
    total: 1875.50,
    currency: 'USD',
  },
  // PO for Clearfield 607610 ($924.80)
  {
    id: 'po-29103',
    vendorId: 'v-clearfield',
    description: 'Packing and shipping paper supplies',
    lineItems: [
      { sku: 'CWP-KRAFT40', description: 'Kraft paper roll 40lb, 24"×900ft', qty: 4, unitPrice: 98.70, amount: 394.80 },
      { sku: 'CWP-BOX-C',   description: 'Corrugated box 18"×12"×12", bundle of 25', qty: 10, unitPrice: 53.00, amount: 530.00 },
    ],
    total: 924.80,
    currency: 'USD',
  },
  // PO for AIR TECH 10023422-000 ($5,610.00)
  {
    id: 'po-29104',
    vendorId: 'v-airtech',
    description: 'Compressed air filtration system — inline coalescing filters and regulator sets',
    lineItems: [
      { sku: 'AT-CF-12', description: 'Coalescing filter 1/2" NPT, 50 SCFM rated', qty: 6, unitPrice: 285.00, amount: 1710.00 },
      { sku: 'AT-REG-34', description: 'Precision regulator 3/4" NPT with gauge', qty: 5, unitPrice: 380.00, amount: 1900.00 },
      { sku: 'AT-KIT-MNT', description: 'Mounting bracket and tubing kit', qty: 10, unitPrice: 200.00, amount: 2000.00 },
    ],
    total: 5610.00,
    currency: 'USD',
  },
  // PO for Hi-Tech Turning 2026-456 ($7,830.00)
  {
    id: 'po-29105',
    vendorId: 'v-hitech',
    description: 'CNC turned titanium shaft assemblies — batch production run',
    lineItems: [
      { sku: 'HT-TI-SHAFT', description: 'Ti-6Al-4V turned shaft, Ø0.875"×8.25", qty 60', qty: 60, unitPrice: 97.50, amount: 5850.00 },
      { sku: 'HT-GRIND',    description: 'OD grinding to h6 tolerance, per piece', qty: 60, unitPrice: 32.50, amount: 1950.00 },
      { sku: 'HT-CMM',      description: 'CMM first-article inspection report', qty: 1, unitPrice: 30.00, amount: 30.00 },
    ],
    total: 7830.00,
    currency: 'USD',
  },
  // PO for Able Electropolishing 581894 ($640.00)
  {
    id: 'po-29106',
    vendorId: 'v-able',
    description: 'Electropolishing service — 316 SS instrument housings',
    lineItems: [
      { sku: 'EP-SS316-SM',  description: 'EP service SS316 housings <6" OD, per piece', qty: 80, unitPrice: 8.00, amount: 640.00 },
    ],
    total: 640.00,
    currency: 'USD',
  },
  // PO for Georgino Industrial 5303960 ($2,187.50)
  {
    id: 'po-29107',
    vendorId: 'v-georgino',
    description: 'Industrial MRO consumables — abrasives, cutting tools, safety',
    lineItems: [
      { sku: 'GI-FLP-80',   description: 'Flap disc 4.5" 80-grit, box of 25', qty: 5, unitPrice: 62.50, amount: 312.50 },
      { sku: 'GI-END-1/2',  description: 'Carbide end mill 1/2" 4-flute, pack of 5', qty: 8, unitPrice: 155.00, amount: 1240.00 },
      { sku: 'GI-GLOVE-L',  description: 'Cut-resistant gloves Level A4, pair', qty: 25, unitPrice: 25.40, amount: 635.00 },
    ],
    total: 2187.50,
    currency: 'USD',
  },
  // PO for Genevieve Swiss 470373 ($4,455.00)
  {
    id: 'po-29108',
    vendorId: 'v-genevieve',
    description: 'Swiss screw-machine turned parts — aluminum 6061 connector pins',
    lineItems: [
      { sku: 'GS-PIN-6061', description: 'Al 6061-T6 connector pin Ø3/8"×1.25", qty 300', qty: 300, unitPrice: 14.85, amount: 4455.00 },
    ],
    total: 4455.00,
    currency: 'USD',
  },
  // PO for KEB 0061533 ($3,120.00)
  {
    id: 'po-29109',
    vendorId: 'v-keb',
    description: 'Variable frequency drive modules — panel-mount units',
    lineItems: [
      { sku: 'KEB-F5-2.2', description: 'KEB COMBIVERT F5 VFD 2.2kW 3-phase 480V', qty: 4, unitPrice: 520.00, amount: 2080.00 },
      { sku: 'KEB-BRK-SFT', description: 'Dynamic braking resistor kit, compatible F5', qty: 4, unitPrice: 260.00, amount: 1040.00 },
    ],
    total: 3120.00,
    currency: 'USD',
  },
  // PO for KOWALSKI 519269 ($1,560.00)
  {
    id: 'po-29110',
    vendorId: 'v-kowalski',
    description: 'Precision ground flat stock — O1 tool steel bar',
    lineItems: [
      { sku: 'KW-O1-1X2', description: 'O1 Tool Steel flat stock 1"×2"×36", ground', qty: 12, unitPrice: 130.00, amount: 1560.00 },
    ],
    total: 1560.00,
    currency: 'USD',
  },
  // PO for Cutting Edge Bullets 6132 ($9,450.00)
  {
    id: 'po-29111',
    vendorId: 'v-cutting',
    description: 'Precision projectile blanks — copper jacketed, custom OAL',
    lineItems: [
      { sku: 'CEB-308-168', description: '.308 168gr HPBT match blank, per 1000', qty: 3, unitPrice: 2850.00, amount: 8550.00 },
      { sku: 'CEB-SETUP',   description: 'Custom OAL die setup charge', qty: 1, unitPrice: 900.00, amount: 900.00 },
    ],
    total: 9450.00,
    currency: 'USD',
  },
  // PO for Earle M. Jorgensen T986250429 ($6,318.75)
  {
    id: 'po-29112',
    vendorId: 'v-earle',
    description: 'Bar stock — 4140 alloy steel hex and round rod',
    lineItems: [
      { sku: 'EMJ-4140-HX', description: '4140 HEX CF 1" A/F×12 FT, 24 PC (297 LB)', qty: 297, unitPrice: 1.85, amount: 549.45 },
      { sku: 'EMJ-4140-RD', description: '4140 RD CF 2.5"×12 FT, 20 PC (3140 LB)', qty: 3140, unitPrice: 1.84, amount: 5777.60 },
      { sku: 'EMJ-FREIGHT', description: 'Freight surcharge', qty: 1, unitPrice: -8.30, amount: -8.30 },
    ],
    total: 6318.75,
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
  // ap-7 — Dry Tech Corporation 406693 — posted
  {
    id: 'ap-7',
    vendorId: 'v-drytech',
    invoiceNo: '406693',
    amount: 3240.00,
    currency: 'USD',
    dueDate: new Date('2026-06-27'),
    receivedAt: new Date('2026-05-29'),
    poRef: 'po-29101',
    lineItems: [
      { sku: 'DT-HD24',   description: 'Hopper Dryer 24L capacity, 3-phase 240V',    qty: 2, unitPrice: 1185.00, amount: 2370.00 },
      { sku: 'DT-CART8',  description: 'Replacement desiccant cartridge, 8-pack',    qty: 3, unitPrice: 290.00,  amount: 870.00  },
    ],
    source: 'email',
    raw: { fromEmail: 'billing@drytechcorp.com', subject: 'Invoice 406693 — Dry Tech Corporation' },
    pdfUrl: '/invoices/dry-tech-406693.pdf',
    erpStatus: 'posted',
    erpDocNo: 'BILL-10503',
  },
  // ap-8 — Accro-Met 0102715 — posted
  {
    id: 'ap-8',
    vendorId: 'v-accromet',
    invoiceNo: '0102715',
    amount: 1875.50,
    currency: 'USD',
    dueDate: new Date('2026-07-18'),
    receivedAt: new Date('2026-06-19'),
    poRef: 'po-29102',
    lineItems: [
      { sku: 'AM-BKT-7040', description: 'CNC Bracket 7040 Alum, 12"×4"×1.5", qty 25', qty: 25, unitPrice: 58.50,  amount: 1462.50 },
      { sku: 'AM-SETUP',    description: 'Setup / fixturing charge',                    qty: 1,  unitPrice: 413.00, amount: 413.00  },
    ],
    source: 'email',
    raw: { fromEmail: 'ap@accro-met.com', subject: 'Accro-Met Invoice 0102715' },
    pdfUrl: '/invoices/accro-met-0102715.pdf',
    erpStatus: 'posted',
    erpDocNo: 'BILL-10508',
  },
  // ap-9 — Clearfield Wholesale Paper 607610 — ready
  {
    id: 'ap-9',
    vendorId: 'v-clearfield',
    invoiceNo: '607610',
    amount: 924.80,
    currency: 'USD',
    dueDate: new Date('2026-07-23'),
    receivedAt: new Date('2026-06-24'),
    poRef: 'po-29103',
    lineItems: [
      { sku: 'CWP-KRAFT40', description: 'Kraft paper roll 40lb, 24"×900ft',           qty: 4,  unitPrice: 98.70, amount: 394.80 },
      { sku: 'CWP-BOX-C',   description: 'Corrugated box 18"×12"×12", bundle of 25',   qty: 10, unitPrice: 53.00, amount: 530.00 },
    ],
    source: 'email',
    raw: { fromEmail: 'invoices@clearfieldpaper.com', subject: 'Invoice #607610 Clearfield Wholesale Paper' },
    pdfUrl: '/invoices/clearfield-wholesale-607610.pdf',
    erpStatus: 'ready',
    erpDocNo: null,
  },
  // ap-10 — AIR TECH 10023422-000 — posted
  {
    id: 'ap-10',
    vendorId: 'v-airtech',
    invoiceNo: '10023422-000',
    amount: 5610.00,
    currency: 'USD',
    dueDate: new Date('2026-07-31'),
    receivedAt: new Date('2026-07-02'),
    poRef: 'po-29104',
    lineItems: [
      { sku: 'AT-CF-12',    description: 'Coalescing filter 1/2" NPT, 50 SCFM rated',    qty: 6,  unitPrice: 285.00, amount: 1710.00 },
      { sku: 'AT-REG-34',   description: 'Precision regulator 3/4" NPT with gauge',       qty: 5,  unitPrice: 380.00, amount: 1900.00 },
      { sku: 'AT-KIT-MNT',  description: 'Mounting bracket and tubing kit',               qty: 10, unitPrice: 200.00, amount: 2000.00 },
    ],
    source: 'email',
    raw: { fromEmail: 'billing@airtechfilter.com', subject: 'AIR TECH Invoice 10023422-000' },
    pdfUrl: '/invoices/air-tech-10023422-000.pdf',
    erpStatus: 'posted',
    erpDocNo: 'BILL-10515',
  },
  // ap-11 — Hi-Tech Turning & Milling 2026-456 — posted
  {
    id: 'ap-11',
    vendorId: 'v-hitech',
    invoiceNo: '2026-456',
    amount: 7830.00,
    currency: 'USD',
    dueDate: new Date('2026-07-05'),
    receivedAt: new Date('2026-06-06'),
    poRef: 'po-29105',
    lineItems: [
      { sku: 'HT-TI-SHAFT', description: 'Ti-6Al-4V turned shaft, Ø0.875"×8.25"',    qty: 60, unitPrice: 97.50, amount: 5850.00 },
      { sku: 'HT-GRIND',    description: 'OD grinding to h6 tolerance, per piece',    qty: 60, unitPrice: 32.50, amount: 1950.00 },
      { sku: 'HT-CMM',      description: 'CMM first-article inspection report',        qty: 1,  unitPrice: 30.00, amount: 30.00  },
    ],
    source: 'email',
    raw: { fromEmail: 'ar@hitechtm.com', subject: 'Invoice 2026-456 Hi-Tech Turning & Milling' },
    pdfUrl: '/invoices/hi-tech-turning-2026-456.pdf',
    erpStatus: 'posted',
    erpDocNo: 'BILL-10521',
  },
  // ap-12 — Able Electropolishing 581894 — ready
  {
    id: 'ap-12',
    vendorId: 'v-able',
    invoiceNo: '581894',
    amount: 640.00,
    currency: 'USD',
    dueDate: new Date('2026-07-03'),
    receivedAt: new Date('2026-06-04'),
    poRef: 'po-29106',
    lineItems: [
      { sku: 'EP-SS316-SM', description: 'EP service SS316 housings <6" OD, per piece', qty: 80, unitPrice: 8.00, amount: 640.00 },
    ],
    source: 'email',
    raw: { fromEmail: 'billing@ableelectro.com', subject: 'Able Electropolishing Invoice 581894' },
    pdfUrl: '/invoices/able-electropolishing-581894.pdf',
    erpStatus: 'ready',
    erpDocNo: null,
  },
  // ap-13 — Georgino Industrial Supply 5303960 — posted
  {
    id: 'ap-13',
    vendorId: 'v-georgino',
    invoiceNo: '5303960',
    amount: 2187.50,
    currency: 'USD',
    dueDate: new Date('2026-06-28'),
    receivedAt: new Date('2026-05-30'),
    poRef: 'po-29107',
    lineItems: [
      { sku: 'GI-FLP-80',  description: 'Flap disc 4.5" 80-grit, box of 25',               qty: 5,  unitPrice: 62.50,  amount: 312.50  },
      { sku: 'GI-END-1/2', description: 'Carbide end mill 1/2" 4-flute, pack of 5',         qty: 8,  unitPrice: 155.00, amount: 1240.00 },
      { sku: 'GI-GLOVE-L', description: 'Cut-resistant gloves Level A4, pair',               qty: 25, unitPrice: 25.40,  amount: 635.00  },
    ],
    source: 'email',
    raw: { fromEmail: 'sales@georginoindustrial.com', subject: 'Georgino Invoice #5303960' },
    pdfUrl: '/invoices/georgino-industrial-5303960.pdf',
    erpStatus: 'posted',
    erpDocNo: 'BILL-10527',
  },
  // ap-14 — Genevieve Swiss Industries 470373 — posted
  {
    id: 'ap-14',
    vendorId: 'v-genevieve',
    invoiceNo: '470373',
    amount: 4455.00,
    currency: 'USD',
    dueDate: new Date('2026-07-08'),
    receivedAt: new Date('2026-06-09'),
    poRef: 'po-29108',
    lineItems: [
      { sku: 'GS-PIN-6061', description: 'Al 6061-T6 connector pin Ø3/8"×1.25", qty 300', qty: 300, unitPrice: 14.85, amount: 4455.00 },
    ],
    source: 'email',
    raw: { fromEmail: 'billing@geneviewewswiss.com', subject: 'Invoice 470373 — Genevieve Swiss Industries' },
    pdfUrl: '/invoices/genevieve-swiss-470373.pdf',
    erpStatus: 'posted',
    erpDocNo: 'BILL-10533',
  },
  // ap-15 — KEB 0061533 — ready
  {
    id: 'ap-15',
    vendorId: 'v-keb',
    invoiceNo: '0061533',
    amount: 3120.00,
    currency: 'USD',
    dueDate: new Date('2026-07-01'),
    receivedAt: new Date('2026-06-02'),
    poRef: 'po-29109',
    lineItems: [
      { sku: 'KEB-F5-2.2',  description: 'KEB COMBIVERT F5 VFD 2.2kW 3-phase 480V',  qty: 4, unitPrice: 520.00, amount: 2080.00 },
      { sku: 'KEB-BRK-SFT', description: 'Dynamic braking resistor kit, compatible F5', qty: 4, unitPrice: 260.00, amount: 1040.00 },
    ],
    source: 'email',
    raw: { fromEmail: 'invoice@keb-america.com', subject: 'KEB Invoice 0061533' },
    pdfUrl: '/invoices/keb-0061533.pdf',
    erpStatus: 'ready',
    erpDocNo: null,
  },
  // ap-16 — KOWALSKI 519269 — posted
  {
    id: 'ap-16',
    vendorId: 'v-kowalski',
    invoiceNo: '519269',
    amount: 1560.00,
    currency: 'USD',
    dueDate: new Date('2026-06-18'),
    receivedAt: new Date('2026-05-20'),
    poRef: 'po-29110',
    lineItems: [
      { sku: 'KW-O1-1X2', description: 'O1 Tool Steel flat stock 1"×2"×36", ground', qty: 12, unitPrice: 130.00, amount: 1560.00 },
    ],
    source: 'email',
    raw: { fromEmail: 'billing@kowalskisteel.com', subject: 'KOWALSKI Invoice 519269' },
    pdfUrl: '/invoices/kowalski-519269.pdf',
    erpStatus: 'posted',
    erpDocNo: 'BILL-10538',
  },
  // ap-17 — Cutting Edge Bullets 6132 — posted
  {
    id: 'ap-17',
    vendorId: 'v-cutting',
    invoiceNo: '6132',
    amount: 9450.00,
    currency: 'USD',
    dueDate: new Date('2026-06-06'),
    receivedAt: new Date('2026-05-08'),
    poRef: 'po-29111',
    lineItems: [
      { sku: 'CEB-308-168', description: '.308 168gr HPBT match blank, per 1000', qty: 3, unitPrice: 2850.00, amount: 8550.00 },
      { sku: 'CEB-SETUP',   description: 'Custom OAL die setup charge',            qty: 1, unitPrice: 900.00,  amount: 900.00  },
    ],
    source: 'email',
    raw: { fromEmail: 'orders@cuttingedgebullets.com', subject: 'Invoice 6132 Cutting Edge Bullets' },
    pdfUrl: '/invoices/cutting-edge-bullets-6132.pdf',
    erpStatus: 'posted',
    erpDocNo: 'BILL-10542',
  },
  // ap-18 — Earle M. Jorgensen T986250429 — posted
  {
    id: 'ap-18',
    vendorId: 'v-earle',
    invoiceNo: 'T986250429',
    amount: 6318.75,
    currency: 'USD',
    dueDate: new Date('2026-07-23'),
    receivedAt: new Date('2026-06-24'),
    poRef: 'po-29112',
    lineItems: [
      { sku: 'EMJ-4140-HX', description: '4140 HEX CF 1" A/F×12 FT, 24 PC (297 LB)',  qty: 297,  unitPrice: 1.85,  amount: 549.45  },
      { sku: 'EMJ-4140-RD', description: '4140 RD CF 2.5"×12 FT, 20 PC (3140 LB)',    qty: 3140, unitPrice: 1.84,  amount: 5777.60 },
      { sku: 'EMJ-FREIGHT', description: 'Freight surcharge',                           qty: 1,    unitPrice: -8.30, amount: -8.30   },
    ],
    source: 'email',
    raw: { fromEmail: 'invoicing@emjmetals.com', subject: 'Earle M. Jorgensen Invoice T986250429' },
    pdfUrl: '/invoices/earle-jorgensen-T986250429.pdf',
    erpStatus: 'posted',
    erpDocNo: 'BILL-10547',
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
  // --- 9 PAID AR invoices (ar-9..ar-17) ---
  {
    id: 'ar-9',
    customer: 'Nordwell Systems',
    invoiceNo: 'AR-2026-0090',
    amount: 6800.00,
    issuedDate: new Date('2026-04-10'),
    dueDate: new Date('2026-05-10'),
    ref: 'AR-2026-0090',
    source: 'erp' as const,
  },
  {
    id: 'ar-10',
    customer: 'Hartline Precision',
    invoiceNo: 'AR-2026-0091',
    amount: 4250.00,
    issuedDate: new Date('2026-04-18'),
    dueDate: new Date('2026-05-18'),
    ref: 'AR-2026-0091',
    source: 'erp' as const,
  },
  {
    id: 'ar-11',
    customer: 'Cascade Instruments',
    invoiceNo: 'AR-2026-0092',
    amount: 11300.00,
    issuedDate: new Date('2026-04-25'),
    dueDate: new Date('2026-05-25'),
    ref: 'AR-2026-0092',
    source: 'erp' as const,
  },
  {
    id: 'ar-12',
    customer: 'Bluepine Fabrication',
    invoiceNo: 'AR-2026-0093',
    amount: 3700.00,
    issuedDate: new Date('2026-05-05'),
    dueDate: new Date('2026-06-04'),
    ref: 'AR-2026-0093',
    source: 'erp' as const,
  },
  {
    id: 'ar-13',
    customer: 'Ironvale Manufacturing',
    invoiceNo: 'AR-2026-0094',
    amount: 9100.00,
    issuedDate: new Date('2026-05-12'),
    dueDate: new Date('2026-06-11'),
    ref: 'AR-2026-0094',
    source: 'erp' as const,
  },
  {
    id: 'ar-14',
    customer: 'Summit Gasket & Seal',
    invoiceNo: 'AR-2026-0095',
    amount: 2450.00,
    issuedDate: new Date('2026-05-20'),
    dueDate: new Date('2026-06-19'),
    ref: 'AR-2026-0095',
    source: 'erp' as const,
  },
  {
    id: 'ar-15',
    customer: 'Ridgemont Tooling',
    invoiceNo: 'AR-2026-0096',
    amount: 14800.00,
    issuedDate: new Date('2026-05-28'),
    dueDate: new Date('2026-06-27'),
    ref: 'AR-2026-0096',
    source: 'erp' as const,
  },
  {
    id: 'ar-16',
    customer: 'Lakeshore Controls',
    invoiceNo: 'AR-2026-0097',
    amount: 5650.00,
    issuedDate: new Date('2026-06-04'),
    dueDate: new Date('2026-07-04'),
    ref: 'AR-2026-0097',
    source: 'erp' as const,
  },
  {
    id: 'ar-17',
    customer: 'Nordwell Systems',
    invoiceNo: 'AR-2026-0098',
    amount: 7500.00,
    issuedDate: new Date('2026-06-10'),
    dueDate: new Date('2026-07-10'),
    ref: 'AR-2026-0098',
    source: 'erp' as const,
  },
  // --- 4 OPEN (not overdue) AR invoices (ar-18..ar-21) ---
  {
    id: 'ar-18',
    customer: 'Hartline Precision',
    invoiceNo: 'AR-2026-0099',
    amount: 6200.00,
    issuedDate: new Date('2026-06-20'),
    dueDate: new Date('2026-07-20'),
    ref: 'AR-2026-0099',
    source: 'erp' as const,
  },
  {
    id: 'ar-19',
    customer: 'Cascade Instruments',
    invoiceNo: 'AR-2026-0100',
    amount: 8750.00,
    issuedDate: new Date('2026-06-28'),
    dueDate: new Date('2026-07-28'),
    ref: 'AR-2026-0100',
    source: 'erp' as const,
  },
  {
    id: 'ar-20',
    customer: 'Bluepine Fabrication',
    invoiceNo: 'AR-2026-0101',
    amount: 8900.00,
    issuedDate: new Date('2026-07-02'),
    dueDate: new Date('2026-08-01'),
    ref: 'AR-2026-0101',
    source: 'erp' as const,
  },
  {
    id: 'ar-21',
    customer: 'Lakeshore Controls',
    invoiceNo: 'AR-2026-0102',
    amount: 4800.00,
    issuedDate: new Date('2026-07-08'),
    dueDate: new Date('2026-08-07'),
    ref: 'AR-2026-0102',
    source: 'erp' as const,
  },
  // --- 3 OVERDUE AR invoices (ar-22..ar-24) ---
  {
    id: 'ar-22',
    customer: 'Ironvale Manufacturing',
    invoiceNo: 'AR-2026-0103',
    amount: 7200.00,
    issuedDate: new Date('2026-05-01'),
    dueDate: new Date('2026-05-31'),
    ref: 'AR-2026-0103',
    source: 'erp' as const,
  },
  {
    id: 'ar-23',
    customer: 'Summit Gasket & Seal',
    invoiceNo: 'AR-2026-0104',
    amount: 5400.00,
    issuedDate: new Date('2026-05-15'),
    dueDate: new Date('2026-06-14'),
    ref: 'AR-2026-0104',
    source: 'erp' as const,
  },
  {
    id: 'ar-24',
    customer: 'Ridgemont Tooling',
    invoiceNo: 'AR-2026-0105',
    amount: 3850.00,
    issuedDate: new Date('2026-06-01'),
    dueDate: new Date('2026-07-01'),
    ref: 'AR-2026-0105',
    source: 'erp' as const,
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
    // txn-10: Nordwell Systems payment AR-2026-0090
    {
      id: 'txn-10',
      date: new Date('2026-05-15'),
      amount: 6800.00,
      memo: 'ACH CREDIT NORDWELL SYSTEMS REF AR-2026-0090',
      payerRef: 'AR-2026-0090',
    },
    // txn-11: Hartline Precision payment AR-2026-0091
    {
      id: 'txn-11',
      date: new Date('2026-05-22'),
      amount: 4250.00,
      memo: 'ACH CREDIT HARTLINE PRECISION REF AR-2026-0091',
      payerRef: 'AR-2026-0091',
    },
    // txn-12: Cascade Instruments payment AR-2026-0092
    {
      id: 'txn-12',
      date: new Date('2026-05-28'),
      amount: 11300.00,
      memo: 'WIRE CASCADE INSTRUMENTS REF AR-2026-0092',
      payerRef: 'AR-2026-0092',
    },
    // txn-13: Bluepine Fabrication payment AR-2026-0093
    {
      id: 'txn-13',
      date: new Date('2026-06-06'),
      amount: 3700.00,
      memo: 'ACH CREDIT BLUEPINE FABRICATION REF AR-2026-0093',
      payerRef: 'AR-2026-0093',
    },
    // txn-14: Ironvale Manufacturing payment AR-2026-0094
    {
      id: 'txn-14',
      date: new Date('2026-06-13'),
      amount: 9100.00,
      memo: 'WIRE IRONVALE MANUFACTURING REF AR-2026-0094',
      payerRef: 'AR-2026-0094',
    },
    // txn-15: Summit Gasket & Seal payment AR-2026-0095
    {
      id: 'txn-15',
      date: new Date('2026-06-21'),
      amount: 2450.00,
      memo: 'ACH CREDIT SUMMIT GASKET SEAL REF AR-2026-0095',
      payerRef: 'AR-2026-0095',
    },
    // txn-16: Ridgemont Tooling payment AR-2026-0096
    {
      id: 'txn-16',
      date: new Date('2026-06-30'),
      amount: 14800.00,
      memo: 'WIRE RIDGEMONT TOOLING REF AR-2026-0096',
      payerRef: 'AR-2026-0096',
    },
    // txn-17: Lakeshore Controls payment AR-2026-0097
    {
      id: 'txn-17',
      date: new Date('2026-07-06'),
      amount: 5650.00,
      memo: 'ACH CREDIT LAKESHORE CONTROLS REF AR-2026-0097',
      payerRef: 'AR-2026-0097',
    },
    // txn-18: Nordwell Systems 2nd payment AR-2026-0098
    {
      id: 'txn-18',
      date: new Date('2026-07-13'),
      amount: 7500.00,
      memo: 'ACH CREDIT NORDWELL SYSTEMS REF AR-2026-0098',
      payerRef: 'AR-2026-0098',
    },
    // txn-19: Outbound AP payment — Hi-Tech Turning BILL-10521
    {
      id: 'txn-19',
      date: new Date('2026-07-08'),
      amount: -7830.00,
      memo: 'ACH DEBIT HI-TECH TURNING MILLING BILL-10521',
      payerRef: null,
    },
    // txn-20: Outbound AP payment — Cutting Edge Bullets BILL-10542
    {
      id: 'txn-20',
      date: new Date('2026-06-09'),
      amount: -9450.00,
      memo: 'ACH DEBIT CUTTING EDGE BULLETS BILL-10542',
      payerRef: null,
    },
    // txn-21: Payroll run
    {
      id: 'txn-21',
      date: new Date('2026-07-11'),
      amount: -28400.00,
      memo: 'PAYROLL ACH DEBIT GUSTO PAYROLL 0711',
      payerRef: null,
    },
    // txn-22: Corporate card settlement
    {
      id: 'txn-22',
      date: new Date('2026-07-14'),
      amount: -4200.00,
      memo: 'CARD SETTLEMENT AMEX CORP 1234 0714',
      payerRef: null,
    },
  ],
};
