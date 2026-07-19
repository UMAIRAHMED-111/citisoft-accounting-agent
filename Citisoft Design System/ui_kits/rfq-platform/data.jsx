// Shared sample data for the RFQ platform kit.
const RFQ_DATA = [
  { id: 'RFQ-10428', part: 'Flanged ball valve, 3"', cat: 'Valves & fittings', qty: '500', quotes: 7, status: 'reviewing', sLabel: 'Reviewing', due: '2026-07-02', best: '$48,250' },
  { id: 'RFQ-10427', part: 'Carbon steel plate, A36', cat: 'Steel & metals', qty: '12 t', quotes: 4, status: 'open', sLabel: 'Open · 2h left', due: '2026-06-27', best: '$31,900' },
  { id: 'RFQ-10425', part: 'Hex bolts, M12×40 cl.8.8', cat: 'Fasteners', qty: '20,000', quotes: 9, status: 'open', sLabel: 'Open', due: '2026-06-29', best: '$4,120' },
  { id: 'RFQ-10422', part: 'PTFE gasket sheet, 1.5mm', cat: 'Polymers', qty: '40 m²', quotes: 6, status: 'awarded', sLabel: 'Awarded', due: '2026-06-24', best: '$9,840' },
  { id: 'RFQ-10419', part: 'Stainless tube, 316L 2"', cat: 'Steel & metals', qty: '300 m', quotes: 5, status: 'awarded', sLabel: 'Awarded', due: '2026-06-20', best: '$22,500' },
  { id: 'RFQ-10417', part: 'Pneumatic actuator, DA', cat: 'Valves & fittings', qty: '120', quotes: 3, status: 'draft', sLabel: 'Draft', due: '—', best: '—' },
];

const RFQ_QUOTES = [
  { sup: 'Acme Steel Co.', rating: 4.8, price: '$48,250', lead: '12 days', terms: 'Net 30', best: true },
  { sup: 'Northgate Mfg.', rating: 4.6, price: '$51,900', lead: '9 days', terms: 'Net 45', best: false },
  { sup: 'Vertex Alloys', rating: 4.4, price: '$53,400', lead: '15 days', terms: 'Net 30', best: false },
  { sup: 'Brightline Industrial', rating: 4.2, price: '$54,100', lead: '8 days', terms: 'Net 60', best: false },
];

const STATUS_TONE = { reviewing: 'brand', open: 'warning', awarded: 'success', draft: 'neutral' };

window.RFQ_DATA = RFQ_DATA;
window.RFQ_QUOTES = RFQ_QUOTES;
window.STATUS_TONE = STATUS_TONE;
