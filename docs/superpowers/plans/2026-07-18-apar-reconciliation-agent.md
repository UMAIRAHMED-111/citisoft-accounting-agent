# AP/AR Reconciliation Agent — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clickable, Loom-demoable frontend prototype of CitiSoft's AP/AR Reconciliation Agent — 8 screens, mocked data, a simulated-but-reasoned agent — on the real Citisoft design system.

**Architecture:** Vite + React + TypeScript SPA with `react-router`. The Citisoft design tokens are copied verbatim; DS primitives are ported to typed `src/ds/` components. A seeded mock dataset flows through one `reconcile()` engine so every screen and the agent read identical, internally-consistent numbers. The agent is a deterministic client-side engine behind a swappable `AgentProvider` interface.

**Tech Stack:** Vite, React 18, TypeScript, react-router-dom v6, lucide-react, vitest (logic tests), Citisoft design tokens (CSS custom properties). Fonts via Google Fonts (Hanken Grotesk, Source Serif 4, JetBrains Mono).

## Global Constraints

- **Design tokens only.** No hardcoded hex/px colors in components outside `src/ds/tokens.css`. Use CSS custom properties (`var(--...)`) from the Citisoft tokens.
- **Brand gradient** is 135°, exactly three stops (`--grad-brand`); use it intentionally (1–2 moments per view): primary actions, agent identity, match/confidence highlights. Never gradient *text* except via the `GradientText` primitive.
- **Rose (`--rose-500`) is reserved for problem/error/exception states only.** Never decorative.
- **Success = matched, Warning = partial/needs-attention, Rose = exception/error.** Consistent across all screens.
- **Type:** Hanken Grotesk for UI/display, Source Serif 4 for editorial ledes only, JetBrains Mono for all amounts, IDs, invoice/PO refs, dates-as-data.
- **Casing:** sentence case for headings, buttons, nav, labels. Uppercase only as a tracked typographic device (overlines). No ALL-CAPS body. **No emoji anywhere.**
- **Voice:** confident, precise, plainspoken. Errors are blame-free and specific ("This invoice is missing a PO reference" — not "Oops!").
- **Motion:** 120–280ms, `var(--ease-out)`, no bounce. Every animation needs a `@media (prefers-reduced-motion: reduce)` alternative. Skeletons for parse/OCR simulation, not spinners.
- **A11y:** body text ≥4.5:1 contrast; focus rings always visible (3px azure `--focus-ring`); all interactive elements keyboard-reachable.
- **No real backend.** All data mocked client-side. No API keys, no network calls for the agent.
- **Namespace note:** the source DS bundle exposes components on `window.CitisoftDesignSystem_1a14bd`; we do NOT use the bundle — we port the components. Keep prop APIs identical to the DS `.d.ts` files (in `Citisoft Design System/components/**/*.d.ts`) so they stay drop-in faithful.

---

## File Structure

```
package.json  vite.config.ts  tsconfig.json  index.html  vitest.config.ts
public/
  citisoft-logo.png  citisoft-logo-white.png  citisoft-logo-slate.png
  invoices/         # 6 REAL vendor invoice PDFs, copied+slugified from assets/Invoices/
src/
  main.tsx  App.tsx
  ds/
    tokens.css        # copied verbatim: styles.css @imports inlined (fonts,colors,typography,spacing,effects,base)
    icons.tsx         # lucide-react re-exports used across app
    GradientText.tsx  Logo.tsx  Avatar.tsx  Badge.tsx  Button.tsx
    IconButton.tsx  Tag.tsx  Dialog.tsx  Toast.tsx  Tooltip.tsx
    Checkbox.tsx  Input.tsx  Select.tsx  Switch.tsx  Tabs.tsx
    Card.tsx  FeatureChip.tsx  StatCard.tsx  index.ts
  app/
    AppShell.tsx  Sidebar.tsx  Topbar.tsx  routes.tsx
  data/
    types.ts  seed.ts  reconcile.ts
    reconcile.test.ts  seed.test.ts
  agent/
    types.ts  engine.ts  intents.ts  AgentProvider.tsx
    engine.test.ts
  screens/
    Dashboard.tsx  InvoiceInbox.tsx  PoMatching.tsx  BankUpload.tsx
    ArMatching.tsx  Reminders.tsx  AgentChat.tsx  ErpConnections.tsx
  components/
    PdfViewer.tsx   # collapsible real-PDF viewer (native <iframe>/<embed>)
    MatchLineItems.tsx  # side-by-side extracted-invoice vs PO line items
    ErpSyncPanel.tsx    # ERP write-back status + "Post to ERP" action
  lib/
    format.ts  format.test.ts
  components/           # shared app (non-DS) building blocks
    PageHeader.tsx  ExceptionCallout.tsx  ConfidenceMeter.tsx
    DataTable.tsx  Skeleton.tsx  EmptyState.tsx  AgentMessage.tsx
```

**Verification model:** logic files (`format`, `seed`, `reconcile`, agent `engine`) get vitest unit tests (real TDD). UI files get browser-screenshot verification against explicit acceptance criteria — the dev server runs and each screen is captured at 1320px and 768px and checked against its criteria. This matches how the Citisoft DS kits themselves are validated.

---

### Task 1: Scaffold the Vite + React + TS project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `vitest.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`
- Create: `public/citisoft-logo.png`, `public/citisoft-logo-white.png`, `public/citisoft-logo-slate.png` (copied from DS `assets/`)
- Create: `src/ds/tokens.css`

**Interfaces:**
- Produces: a running dev server at `localhost:5173` rendering an empty themed page; `src/ds/tokens.css` importable as the single token source.

- [ ] **Step 1: Scaffold and install**

```bash
cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent"
npm create vite@latest . -- --template react-ts   # answer: keep existing files / ignore, do not overwrite git
# if the interactive prompt blocks, scaffold into a temp dir and move src/config files in.
npm install
npm install react-router-dom lucide-react
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: Copy tokens verbatim into `src/ds/tokens.css`**

Concatenate, in this exact order, the contents of the Citisoft DS token files into `src/ds/tokens.css`:
`Citisoft Design System/tokens/fonts.css`, `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css`, `tokens/effects.css`, `tokens/base.css`. Do not edit values. Command:

```bash
cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent"
DS="Citisoft Design System/tokens"
cat "$DS/fonts.css" "$DS/colors.css" "$DS/typography.css" "$DS/spacing.css" "$DS/effects.css" "$DS/base.css" > src/ds/tokens.css
cp "Citisoft Design System/assets/citisoft-logo.png" "Citisoft Design System/assets/citisoft-logo-white.png" "Citisoft Design System/assets/citisoft-logo-slate.png" public/
```

- [ ] **Step 3: Wire `index.html`, `main.tsx`, `App.tsx`**

`index.html` `<title>` = "CitiSoft — AP/AR Reconciliation Agent". `src/main.tsx` imports `./ds/tokens.css`, mounts `<App/>` in `<React.StrictMode>` with a `<BrowserRouter>`. `App.tsx` returns a placeholder `<div style={{fontFamily:'var(--font-sans)',color:'var(--text-strong)',background:'var(--surface-page)'}}>CitiSoft</div>`.

- [ ] **Step 4: Configure vitest** — `vitest.config.ts` with `environment: 'jsdom'`, `globals: true`. Add `"test": "vitest run"` and `"test:watch": "vitest"` to `package.json` scripts.

- [ ] **Step 5: Verify** — Run `npm run dev`, screenshot `localhost:5173`. Expected: page background is `#f8fafb`, "CitiSoft" text in Hanken Grotesk slate. Run `npm run build` — expected: clean build, no TS errors.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: scaffold Vite React TS app with Citisoft tokens"
```

---

### Task 2: Port the Citisoft DS primitives to typed components

**Files:**
- Create: all `src/ds/*.tsx` listed in File Structure, plus `src/ds/index.ts`, `src/ds/icons.tsx`
- Create (temporary): `src/screens/_Specimen.tsx` (a component gallery for visual verification; kept for reference)

**Interfaces:**
- Produces (exact APIs — mirror the DS `.d.ts` files exactly):
  - `Button({children, variant='primary'|'secondary'|'ghost'|'danger', size='sm'|'md'|'lg', accent='brand'|'rfq', fullWidth?, leadingIcon?, trailingIcon?, ...})`
  - `IconButton({icon, label, variant='brand'|'secondary'|'ghost', size})`
  - `Card({children, padding=20, interactive?, elevated?})`
  - `StatCard({label, value, unit?, delta?, deltaDir='up'|'down', icon?, accent?})`
  - `Badge({children, tone='brand'|'neutral'|'success'|'warning'|'error'|'rfq', solid?, dot?})`
  - `Tag({children, active?, icon?, onRemove?})`
  - `Avatar({name?, src?, size='xs'|'sm'|'md'|'lg', square?})`
  - `Tabs({tabs: (string|{value,label,count?})[], value?, defaultValue?, onChange})`
  - `Dialog({open, onClose, title?, children, footer?, width=460})`
  - `Toast({tone='info'|'success'|'warning'|'error', title?, children, onDismiss?, duration=5000})`
  - `Tooltip({label, placement='top'|'bottom'|'left'|'right', children})`
  - `Input({label?, hint?, error?, leadingIcon?, trailingIcon?, size, ...input})`
  - `Select({label?, hint?, error?, options: (string|{value,label})[], size, ...select})`
  - `Switch({label?, checked?, defaultChecked?, onChange(checked,e), disabled?, size})`
  - `Checkbox({label?, checked?, defaultChecked?, onChange(checked,e), disabled?})`
  - `GradientText({children, accent='brand'|'rfq', as='span'})`
  - `Logo({variant='color'|'white'|'slate', height=32, basePath})` — resolves PNGs from `/citisoft-logo*.png` in `public/`.
  - `FeatureChip({icon, title, children, accent})`
- All exported from `src/ds/index.ts`.

- [ ] **Step 1: Reference the source, port faithfully**

For each component read the source in `Citisoft Design System/components/**/<Name>.jsx` and its `.d.ts`, and reimplement as a typed `.tsx` using the same token variables and visual behavior. Keep prop names/defaults identical. Key visual contracts to preserve (from `readme.md`):
- Primary `Button` = `var(--grad-brand)` fill, white text, `--radius-md`, `--shadow-brand`; hover → `--grad-brand-hover` + 1px lift; press → translateY(1px). `secondary` = white fill + `--border-default`; `ghost` = transparent; `danger` = `--rose-500`.
- `Card` = white, `--radius-lg`, `1px --border-default`, `--shadow-sm` (`--shadow-md` when `elevated`); `interactive` adds pointer + 1px hover lift.
- `StatCard` = `Card` + uppercase tracked `label` (`--text-faint`), mono `value` (`--fs-h1`/extrabold), optional `unit`, `delta` in success/rose by `deltaDir`, icon chip (gradient when `accent`).
- `Badge` tones map to semantic tokens (`success`/`warning`/`error`(rose)/`brand`/`neutral`); tinted by default, `solid` filled, optional leading `dot`.
- `Tabs` = underline tabs, gradient active indicator, optional mono count pills.
- `Dialog` = fixed centered, charcoal scrim ~55% + `--blur-overlay`, `--radius-lg`, close on Escape/scrim/×. Use a semantic z-index scale (define in tokens usage: backdrop < modal).
- `Input`/`Select` share `--radius-md`, `--border-default`, focus → `--shadow-focus`; `error` turns border rose + shows message.
- `Switch`/`Checkbox` = `--grad-brand` when on.
- Motion uses `var(--dur)`/`var(--ease-out)`.

- [ ] **Step 2: Build the specimen gallery** — `src/screens/_Specimen.tsx` renders every primitive in every variant/state (default/hover-noted/focus/disabled). Temporarily route `/` to it.

- [ ] **Step 3: Verify visually** — `npm run dev`, screenshot the specimen at 1320px. Acceptance: gradient buttons show the 3-stop blue; cards have hairline borders + soft shadow (not floaty); badges show correct semantic colors; focus rings visible on tab-through; no hardcoded colors (grep `src/ds` for `#` hex outside `tokens.css` returns nothing).

```bash
grep -rn --include=*.tsx -E "#[0-9a-fA-F]{3,6}" src/ds && echo "FAIL: hex found" || echo "PASS: no raw hex"
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(ds): port Citisoft design-system primitives to typed components"
```

---

### Task 3: Domain types and seeded mock dataset

**Files:**
- Create: `src/data/types.ts`, `src/data/seed.ts`, `src/data/seed.test.ts`
- Create: `src/lib/format.ts`, `src/lib/format.test.ts`
- Create: `public/invoices/*.pdf` (6 real vendor invoices copied + slugified from `assets/Invoices/`)

**Interfaces:**
- Produces:
  - `types.ts`: `Vendor {id, name, erp}` (`erp: 'Xero'|'NetSuite'|'Dynamics'|'QuickBooks'` — which ERP this vendor posts to), `PurchaseOrder {id, vendorId, description, lineItems: LineItem[], total, currency}`, `LineItem {sku, description, qty, unitPrice, amount}`, `Invoice {id, vendorId, invoiceNo, amount, currency, dueDate, receivedAt, poRef?|null, lineItems: LineItem[], source:'email'|'upload', raw:{fromEmail,subject}, pdfUrl:string, erpStatus:'not_posted'|'ready'|'posted', erpDocNo?:string|null}`, `ArInvoice {id, customer, invoiceNo, amount, issuedDate, dueDate, ref}`, `BankTxn {id, date, amount, memo, payerRef?|null}`, `BankStatement {id, account, period, txns: BankTxn[]}`, plus enums `ApStatus='auto_approved'|'needs_review'|'duplicate'`, `MatchKind='exact'|'partial'|'lump'|'unmatched'`.
  - `seed.ts`: `export const vendors`, `purchaseOrders`, `apInvoices` (**the 6 REAL invoices below**), `arInvoices` (8; 2 overdue relative to a fixed `TODAY = new Date('2026-07-18')`), `bankStatement` (9 txns: ≥3 exact-ref, 1 partial, 1 lump covering two invoices, ≥1 unmatched cash). Export `TODAY`.
  - `format.ts`: `money(n:number, currency?='USD'):string` (e.g. `$48,200.00`), `shortMoney(n):string` (`$48.2K`/`$3.1M`), `fmtDate(d:Date|string):string` (`Jul 18, 2026`), `daysBetween(a,b):number`, `daysOverdue(due:Date, today?):number`.

**The 6 real AP invoices (industrial vendors — fits the Citisoft sourcing brand). Copy each from `assets/Invoices/` to `public/invoices/<slug>.pdf`, read the PDF, and transcribe its REAL vendor / invoice # / date / line items / total into `seed.ts`. `pdfUrl` = `/invoices/<slug>.pdf`. Author the imaginary `PurchaseOrder` for each so the demo scenarios below hold:**

| # | Source file (in `assets/Invoices/`) | slug | scenario | ApStatus |
|---|---|---|---|---|
| 1 | `[AP] CEMS…Alro Steel Corporation - GFB3506PV - 06-02-2026.pdf` | `alro-steel-GFB3506PV` | PO + amount match exactly | auto_approved (→ erpStatus `posted`, erpDocNo e.g. `BILL-10482`) |
| 2 | `[AP] CEMS…Curbell Plastics, Inc - 91918970 - 06-23-2026.pdf` | `curbell-plastics-91918970` | clean match | auto_approved (posted) |
| 3 | `[AP] CEMS…Mcmaster-carr Supply Co - 66861386 - 06-17-2026.pdf` | `mcmaster-carr-66861386` | clean match | auto_approved (posted) |
| 4 | `[AP] CEMS…Klein Plating Works, Inc - 142924 - 06-02-2026.pdf` | `klein-plating-142924` | clean match | auto_approved (ready, not yet posted) |
| 5 | `[AP] QTR…A Plus Powder Coaters - 78875 - 07-09-2026.pdf` | `aplus-powder-78875` | **amount mismatch** — invoice total > PO total (e.g. an extra/over-billed line) | needs_review (erpStatus `not_posted`) |
| 6 | `[AP] COMCO…Anago Cleaning Service - 13992 - 07-05-2026.pdf` | `anago-cleaning-13992` | **no PO** — services invoice, `poRef: null` | needs_review (not_posted) |

Copy command (run once, quoting the bracketed spaced filenames):
```bash
cd "/Users/umairahmed/Documents/Citisoft Solutions/citisoft-accounting-agent"
mkdir -p public/invoices
cp "assets/Invoices/[AP] CEMS__Processed Invoices__2026__06. Jun 2026__Alro Steel Corporation - GFB3506PV - 06-02-2026.pdf" "public/invoices/alro-steel-GFB3506PV.pdf"
cp "assets/Invoices/[AP] CEMS__Processed Invoices__2026__06. Jun 2026__Curbell Plastics, Inc - 91918970 - 06-23-2026.pdf" "public/invoices/curbell-plastics-91918970.pdf"
cp "assets/Invoices/[AP] CEMS__Processed Invoices__2026__06. Jun 2026__Mcmaster-carr Supply Co - 66861386 - 06-17-2026.pdf" "public/invoices/mcmaster-carr-66861386.pdf"
cp "assets/Invoices/[AP] CEMS__Processed Invoices__2026__06. Jun 2026__Klein Plating Works, Inc - 142924 - 06-02-2026.pdf" "public/invoices/klein-plating-142924.pdf"
cp "assets/Invoices/[AP] QTR__Processed Invoices__2026__07. Jul 2026__A Plus Powder Coaters - 78875 - 07-09-2026.pdf" "public/invoices/aplus-powder-78875.pdf"
cp "assets/Invoices/[AP] COMCO__Processed Invoices__2026__07. Jul 2026__Anago Cleaning Service - 13992 - 07-05-2026.pdf" "public/invoices/anago-cleaning-13992.pdf"
```
Use the Read tool on each copied PDF to transcribe its real vendor name, invoice number, invoice date, line items (description/qty/unit price/amount), and total. Where a PDF's line detail is sparse, author plausible industrial line items consistent with the visible total — the total and vendor/invoice#/date MUST match the real PDF. For invoice #5, set the PO total BELOW the invoice total so the mismatch reason is real; for #6 leave `poRef: null`.

- [ ] **Step 0: Copy the 6 PDFs and transcribe them** (commands + Read above) before writing `seed.ts`.

- [ ] **Step 1: Write failing tests for `format.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { money, shortMoney, fmtDate, daysOverdue } from './format';
describe('format', () => {
  it('formats money with grouping and 2dp', () => expect(money(48200)).toBe('$48,200.00'));
  it('shortens millions', () => expect(shortMoney(3120000)).toBe('$3.1M'));
  it('shortens thousands', () => expect(shortMoney(48200)).toBe('$48.2K'));
  it('formats dates human', () => expect(fmtDate(new Date('2026-07-18'))).toBe('Jul 18, 2026'));
  it('computes overdue days', () => expect(daysOverdue(new Date('2026-07-06'), new Date('2026-07-18'))).toBe(12));
});
```

- [ ] **Step 2: Run — expect FAIL** — `npm test -- format` → module/exports missing.

- [ ] **Step 3: Implement `format.ts`** using `Intl.NumberFormat('en-US',{style:'currency',currency})` for `money`; `Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'})` for `fmtDate`; arithmetic on `.getTime()` / 86400000 (floored) for day diffs; manual `/1e6`→`M`, `/1e3`→`K` (1dp) for `shortMoney`.

- [ ] **Step 4: Run — expect PASS** — `npm test -- format`.

- [ ] **Step 5: Write `types.ts`, then `seed.ts`, then `seed.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { apInvoices, arInvoices, purchaseOrders, bankStatement } from './seed';
describe('seed integrity', () => {
  it('has 6 AP invoices incl. 2 messy', () => {
    expect(apInvoices).toHaveLength(6);
    expect(apInvoices.filter(i => i.poRef == null)).not.toHaveLength(0);
  });
  it('every AP invoice points at a real PDF under /invoices/', () => {
    for (const i of apInvoices) expect(i.pdfUrl).toMatch(/^\/invoices\/.+\.pdf$/);
  });
  it('every AP poRef (when present) resolves to a real PO', () => {
    for (const i of apInvoices) if (i.poRef) expect(purchaseOrders.find(p => p.id === i.poRef)).toBeTruthy();
  });
  it('has 8 AR invoices with 2 overdue', () => {
    expect(arInvoices).toHaveLength(8);
  });
  it('bank statement has 9 txns with at least one unmatched-cash memo', () => {
    expect(bankStatement.txns).toHaveLength(9);
  });
});
```

- [ ] **Step 6: Run — expect PASS** — `npm test -- seed`. Fix seed data until green.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat(data): domain types, seeded mock dataset, format helpers"
```

---

### Task 4: The reconciliation engine

**Files:**
- Create: `src/data/reconcile.ts`, `src/data/reconcile.test.ts`

**Interfaces:**
- Consumes: everything from `seed.ts`/`types.ts`.
- Produces:
  - `matchInvoiceToPo(inv: Invoice, pos: PurchaseOrder[]): { po?: PurchaseOrder; status: ApStatus; confidence: number; reasons: string[] }` — exact PO+amount → `auto_approved` (confidence ≥0.95); PO found but amount differs → `needs_review` with reason `"Amount $X is $Δ over PO #Y"`; no `poRef` and no fuzzy hit → `needs_review` reason `"No purchase-order reference on the invoice"`; duplicate invoiceNo → `duplicate`.
  - `matchPaymentToInvoices(txn: BankTxn, invoices: ArInvoice[]): { matches: {invoice: ArInvoice; applied: number}[]; kind: MatchKind; confidence: number; reasons: string[] }` — exact ref+amount → `exact`; amount < single invoice → `partial`; amount == sum of two invoices' refs/amounts → `lump`; else → `unmatched` (never force-match).
  - `buildLedger(): Ledger` — one call returning the fully-derived model: `{ ap: ApRow[], ar: ArRow[], exceptions: Exception[], kpis: {openApTotal, openArTotal, exceptionsCount, reconciledMtd}, activity: ActivityItem[] }`. This is the single source screens + agent read.

- [ ] **Step 1: Write failing tests** (cover: clean AP auto-approve, amount-mismatch review reason, missing-PO review reason, exact AR match, partial payment, lump-sum across two invoices, unmatched cash, and `buildLedger().kpis` totals equal the summed open items).

```ts
import { describe, it, expect } from 'vitest';
import { matchInvoiceToPo, matchPaymentToInvoices, buildLedger } from './reconcile';
import { apInvoices, purchaseOrders, arInvoices, bankStatement } from './seed';
describe('AP matching', () => {
  it('auto-approves a clean PO+amount match', () => {
    const clean = apInvoices.find(i => i.poRef && purchaseOrders.find(p => p.id===i.poRef && p.total===i.amount))!;
    const r = matchInvoiceToPo(clean, purchaseOrders);
    expect(r.status).toBe('auto_approved'); expect(r.confidence).toBeGreaterThanOrEqual(0.95);
  });
  it('flags a missing-PO invoice with a specific reason', () => {
    const messy = apInvoices.find(i => i.poRef == null)!;
    const r = matchInvoiceToPo(messy, purchaseOrders);
    expect(r.status).toBe('needs_review');
    expect(r.reasons.join(' ')).toMatch(/purchase-order reference/i);
  });
});
describe('AR matching', () => {
  it('never force-matches unmatched cash', () => {
    const results = bankStatement.txns.map(t => matchPaymentToInvoices(t, arInvoices));
    expect(results.some(r => r.kind === 'unmatched')).toBe(true);
    expect(results.some(r => r.kind === 'partial')).toBe(true);
    expect(results.some(r => r.kind === 'lump')).toBe(true);
  });
});
describe('ledger', () => {
  it('kpis reconcile to summed open items', () => {
    const l = buildLedger();
    expect(l.kpis.exceptionsCount).toBe(l.exceptions.length);
    expect(l.kpis.openApTotal).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run — expect FAIL** — `npm test -- reconcile`.

- [ ] **Step 3: Implement `reconcile.ts`** — pure functions, no side effects; reasons are human, blame-free, specific (per Global Constraints voice). `buildLedger` composes the per-item matchers over the seed.

- [ ] **Step 4: Run — expect PASS** — `npm test -- reconcile`. Then `npm test` (all green).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(data): reconciliation engine deriving the shared ledger"
```

---

### Task 5: The agent engine

**Files:**
- Create: `src/agent/types.ts`, `src/agent/engine.ts`, `src/agent/intents.ts`, `src/agent/engine.test.ts`, `src/agent/AgentProvider.tsx`

**Interfaces:**
- Consumes: `buildLedger()` from `reconcile.ts`.
- Produces:
  - `types.ts`: `AgentBlock = {type:'text', text:string} | {type:'table', columns:string[], rows:string[][]} | {type:'action', title:string, detail:string, cta:string} | {type:'reasoning', steps:string[]}`; `AgentResponse = { blocks: AgentBlock[] }`; `AgentProvider interface { ask(q:string): Promise<AgentResponse> }`.
  - `intents.ts`: `matchIntent(q:string): IntentHandler` routing on keyword sets to handlers for: "what needs my attention / today", "overdue invoices", "unmatched payments (this month)", "why wasn't {INV} auto-approved", "open AP / AR totals". Each handler reads the ledger and returns an `AgentResponse` with a table/action/reasoning as appropriate. Unknown → a helpful fallback that still surfaces the 2 top exceptions from real data.
  - `engine.ts`: `class LocalAgent implements AgentProvider` — `ask` selects a handler, and returns the response (optionally wrapped by a streaming reveal on the UI side; engine itself is synchronous-resolved Promise).
  - `AgentProvider.tsx`: React context exposing `useAgent(): { ask, streaming reveal helper }`, defaulting to `LocalAgent`. A `ClaudeAgent` stub (throws "not configured") documents the swap point.

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect } from 'vitest';
import { LocalAgent } from './engine';
const agent = new LocalAgent();
describe('agent', () => {
  it('answers "what needs my attention" from real exceptions', async () => {
    const r = await agent.ask('what needs my attention today');
    const text = JSON.stringify(r.blocks);
    expect(text).toMatch(/\$/); // cites real amounts
    expect(r.blocks.some(b => b.type === 'table' || b.type === 'action')).toBe(true);
  });
  it('explains a specific unapproved invoice with reasoning', async () => {
    const r = await agent.ask('why wasn\'t INV-2041 auto-approved');
    expect(r.blocks.some(b => b.type === 'reasoning')).toBe(true);
  });
  it('falls back helpfully on nonsense', async () => {
    const r = await agent.ask('asdf zzz');
    expect(r.blocks.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run — expect FAIL** — `npm test -- engine`.
- [ ] **Step 3: Implement** `types.ts`, `intents.ts`, `engine.ts`, `AgentProvider.tsx`. (Use a real invoice id from `seed.ts` in the test; adjust the literal to match.)
- [ ] **Step 4: Run — expect PASS** — `npm test` (all green).
- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(agent): deterministic reasoning engine behind swappable provider"
```

---

### Task 6: App shell — sidebar, topbar, router

**Files:**
- Create: `src/app/AppShell.tsx`, `src/app/Sidebar.tsx`, `src/app/Topbar.tsx`, `src/app/routes.tsx`
- Create: `src/components/PageHeader.tsx`, `src/components/EmptyState.tsx`
- Modify: `src/App.tsx` (mount `<AppShell/>` with routed `<Outlet/>`); remove the temporary specimen route from `/`.

**Interfaces:**
- Consumes: `Logo`, `Avatar`, `IconButton`, `Badge` from `ds`; `buildLedger` for sidebar counts.
- Produces: routes `/` (Dashboard), `/inbox`, `/po-matching`, `/bank-upload`, `/ar-matching`, `/reminders`, `/agent`, `/connections`. `Sidebar` nav items with lucide icons + active state (`rgba` brand tint + `--accent`, mono count pill for exceptions). `Topbar` = search field, an ERP-status chip ("Xero · Connected", success dot), notifications `IconButton`, user block ("Amara Okafor / Financial controller"). `PageHeader({title, subtitle?, actions?})`. `EmptyState({icon,title,body,cta?})`.

- [ ] **Step 1: Build shell + router** following `Citisoft Design System/ui_kits/rfq-platform/AppShell.tsx` structure but with **brand-blue** active state (not magenta): active nav bg `rgba(43,159,212,0.10)`, text/icon `var(--accent-strong)`. Sidebar width 232px, topbar height 62px. Nav: Dashboard, Invoice inbox, PO matching, Bank upload, AR matching, Reminders, Agent, Connections. Exceptions count pill on the items that have exceptions (from ledger).
- [ ] **Step 2: Placeholder screens** — each of the 8 screen files exports a component rendering `<PageHeader/>` + an `EmptyState` for now, so routing is verifiable.
- [ ] **Step 3: Verify** — `npm run dev`, screenshot at 1320px and 768px. Acceptance: logo renders top-left; nav active state is brand-blue and legible; clicking each nav item routes and updates the active state; topbar ERP chip shows a success dot; layout holds at 768px (sidebar may stay fixed for the demo — note if it needs a collapse in Task 15). No console errors.
- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(app): app shell, sidebar, topbar, routing"
```

---

### Task 7: Dashboard screen

**Files:**
- Create: `src/screens/Dashboard.tsx`, `src/components/DataTable.tsx`, `src/components/ExceptionCallout.tsx`
- Modify: `src/app/routes.tsx` (already routed)

**Interfaces:**
- Consumes: `buildLedger()`, `StatCard`, `Card`, `Badge`, `Tabs`, `GradientText`, format helpers.
- Produces: `DataTable({columns, rows, onRowClick?})` reusable table (mono for numeric/id cells, right-aligned amounts, hover row tint, uppercase tracked header — mirror the DS Dashboard table). `ExceptionCallout({exception})` — a full-bordered callout (NOT a left-stripe) with rose accent icon chip + specific reason + "Review" link.

- [ ] **Step 1: Build** — greeting header ("Good morning, Amara" + "You have N items needing review"); a 4-up `StatCard` row (Open AP, Open AR, Exceptions needing review [rose accent when >0], Reconciled MTD [accent gradient icon]); a two-column region: left = "Needs your attention" list of `ExceptionCallout`s (from `ledger.exceptions`), right = a compact cash-position bar/spark (pure SVG or CSS bars from ledger, brand blue) + recent activity feed. Use one gradient moment (the Reconciled MTD StatCard icon).
- [ ] **Step 2: Verify** — screenshot 1320px + 768px. Acceptance: all figures match `buildLedger()` (cross-check the exceptions count pill in sidebar equals the callout count); rose only appears on exception affordances; no left-stripe borders; StatCards show mono values; text contrast passes; grid reflows to 2-up then 1-up on narrow.
- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(dashboard): KPIs, exception queue, activity, cash position"
```

---

### Task 8: Invoice inbox (AP)

**Files:**
- Create: `src/screens/InvoiceInbox.tsx`, `src/components/Skeleton.tsx`, `src/components/PdfViewer.tsx`, `src/components/MatchLineItems.tsx`, `src/components/ErpSyncPanel.tsx`
- Reuse: `DataTable`, `Card`, `Badge`, `Button`, `IconButton`, `Toast`, `ConfidenceMeter` (from Task 9 if built first; otherwise define a minimal inline meter here and Task 9 reuses it — keep ONE `ConfidenceMeter` in `src/components/`).

**Interfaces:**
- Consumes: `apInvoices` (each has real `pdfUrl`, `lineItems`, `erpStatus`, `erpDocNo`, `vendorId`→`vendors[].erp`), `purchaseOrders`, `matchInvoiceToPo`, ledger.
- Produces:
  - `Skeleton({w?,h?,radius?})` shimmer block (reduced-motion → static tint).
  - `PdfViewer({url, title, defaultOpen?})` — a **collapsible** panel with a header row (doc icon, filename, page hint, expand/collapse chevron, "Open in new tab" `IconButton`). When open, renders the real PDF inline via `<iframe src={url} title=... style height 520>` (native Chrome PDF rendering; no pdf.js dependency). Collapsed → just the header bar. Reduced-motion: instant toggle, no height animation.
  - `MatchLineItems({invoiceItems, poItems})` — two aligned columns ("Invoice — extracted" | "Purchase order") rendered as a single aligned grid so matching rows sit on the same baseline: matched rows get a success tick + subtle success tint; a differing amount row is highlighted warning/rose with the delta shown in mono; a line present on one side only shows an "unmatched line" marker on the empty side. Header shows a `ConfidenceMeter` + overall match `Badge`.
  - `ErpSyncPanel({invoice})` — shows the target ERP (`vendors[].erp`, small monogram tile + name), a status `Badge` (`posted` = success "Posted · {erpDocNo}", `ready` = brand "Ready to post", `not_posted` = neutral/warning "Held for review"), and a primary `Button` "Post to {ERP}" that (for `ready`) flips status to `posted`, assigns a mock doc no, and fires a success `Toast`. Sells the "writes back to your ERP" narrative.

- [ ] **Step 1: Build the screen** — split layout. **Left column** = invoice list (vendor, invoiceNo mono, amount, status `Badge`: `auto_approved`=success, `needs_review`=warning, `duplicate`=neutral). Default-select the first invoice so the screen is never blank. **Right panel** (for the selected invoice), top to bottom:
  1. Header: vendor, invoice # (mono), amount, due date, an ApStatus `Badge`, and the `ErpSyncPanel` status inline.
  2. **OCR-extracted fields** card: vendor, invoice #, amount, invoice date, PO ref — each with a small mono confidence tag; for invoice #6 (`poRef: null`) the PO-ref field is rose-flagged "No PO reference found on the document"; a "Re-run extraction" affordance replays a ~900ms `Skeleton` shimmer then reveals fields (simulated OCR).
  3. **`PdfViewer`** (`url={invoice.pdfUrl}`, `defaultOpen` false so the list stays scannable; expanding shows the REAL scanned invoice). This is the "see the real document" moment.
  4. **`MatchLineItems`** — the invoice's extracted `lineItems` vs its matched PO's `lineItems` side by side (agent matching capability). For #5 the mismatched line is highlighted; for #6 (no PO) show an empty-PO state: "No purchase order raised — this is a services invoice" with a "Find/attach PO" affordance.
  5. **`ErpSyncPanel`** action row.
- [ ] **Step 2: Verify** — dev server; screenshot: (a) a clean invoice (#1 Alro Steel) with the PDF viewer expanded showing the real PDF, side-by-side items all matched, ERP = "Posted · BILL-…"; (b) the mismatch invoice (#5 A Plus Powder) with the differing line highlighted + confidence meter in the warning band; (c) the no-PO invoice (#6 Anago) with the rose-flagged PO-ref field + empty-PO state. Acceptance: real PDFs actually render in the iframe (not a broken/blank frame); collapse/expand works; extracted fields + statuses match `matchInvoiceToPo`; "Post to ERP" flips status + toasts; no left-stripe borders; reduced-motion disables shimmer + height animation.
- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(ap): invoice inbox — real PDF viewer, side-by-side matching, ERP sync"
```

---

### Task 9: PO matching (AP)

**Files:**
- Create: `src/screens/PoMatching.tsx`
- Reuse: `MatchLineItems`, `PdfViewer`, `ConfidenceMeter`, `ErpSyncPanel` (all from Task 8, in `src/components/`), `Card`, `Badge`, `Button`, `Toast`, `ExceptionCallout`.

**Note:** `ConfidenceMeter` and `MatchLineItems` are created in Task 8 and live in `src/components/`. This task reuses them — do NOT create duplicates. `ConfidenceMeter({value:number})` = a 0–1 meter; ≥0.9 brand-blue/success, 0.6–0.9 warning, <0.6 rose; mono percentage label.

**Interfaces:**
- Consumes: `apInvoices`, `purchaseOrders`, `matchInvoiceToPo`.

- [ ] **Step 1: Build** — a focused matching **workspace** for the invoices that need a human decision (default to invoice #5, the amount-mismatch; a small selector lists the AP invoices needing review). Layout: a header with `ConfidenceMeter` + match summary `Badge`; the `MatchLineItems` grid (PO vs invoice, differing line highlighted warning/rose, delta in mono); a collapsible `PdfViewer` of the real invoice PDF beside/below it for evidence; an `ExceptionCallout` with the specific reason from `matchInvoiceToPo` ("Amount $X is $Δ over PO #Y" / "No purchase-order reference on the invoice"); an `ErpSyncPanel` showing the invoice is held from the ERP until resolved. Actions: `Button` "Approve anyway" (secondary) + "Flag for vendor" (primary) — either fires a success `Toast` and updates the row's state.
- [ ] **Step 2: Verify** — screenshot the mismatch invoice. Acceptance: the differing line is visually distinguished with a real delta; confidence meter color matches the band; the real PDF renders in the viewer; reasoning is specific + blame-free; ERP panel shows "held for review"; actions toast; no left-stripe borders (full-border callout).
- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(ap): PO vs invoice matching workspace with confidence, evidence, ERP hold"
```

---

### Task 10: Bank statement upload (AR)

**Files:**
- Create: `src/screens/BankUpload.tsx`
- Reuse: `Skeleton`, `DataTable`, `Button`, `Card`.

**Interfaces:**
- Consumes: `bankStatement`.
- Produces: an upload → parse → list flow (all simulated).

- [ ] **Step 1: Build** — a dashed drop-zone `Card` ("Drop a bank statement (PDF or CSV)" + "Use sample statement" `Button`). Clicking "Use sample statement" transitions: (a) a file chip appears, (b) a "Parsing…" state with `Skeleton` rows + a progress bar ~1.4s, (c) reveals a `DataTable` of the 9 parsed transactions (date, memo, payerRef mono, amount right-aligned). A summary line: "9 transactions · $X total · covering {period}". A primary `Button` "Match against open invoices" routes to `/ar-matching`.
- [ ] **Step 2: Verify** — screenshot each of the three states (idle, parsing, parsed). Acceptance: progress + skeleton play then reveal real seed txns; reduced-motion collapses the animation to an instant reveal; the "Match" button navigates.
- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(ar): bank statement upload and simulated parse"
```

---

### Task 11: AR matching / exception queue

**Files:**
- Create: `src/screens/ArMatching.tsx`
- Reuse: `DataTable`, `Tabs`, `Badge`, `ExceptionCallout`, `ConfidenceMeter`.

**Interfaces:**
- Consumes: `bankStatement`, `arInvoices`, `matchPaymentToInvoices`.

- [ ] **Step 1: Build** — `Tabs`: All / Matched / Partial / Unmatched (counts from the matcher). A table of transactions → matched invoice(s) with a `MatchKind` `Badge` (exact=success, partial=warning, lump=brand, unmatched=neutral/rose). Expanding a row reveals reasoning: exact→"Ref {r} matched INV-{n}"; partial→"$X of $Y applied; $Δ still open"; lump→"$X covers INV-{a} + INV-{b}"; unmatched→"No invoice matches this deposit — left as unapplied cash" with an explicit **do-not-force-match** note and a manual "Match manually" affordance. A summary strip: applied vs unapplied totals.
- [ ] **Step 2: Verify** — screenshot with a partial, a lump, and an unmatched row expanded. Acceptance: every kind present; unmatched cash is never auto-applied; reasoning strings match `matchPaymentToInvoices`; tab counts correct.
- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(ar): payment matching and exception queue"
```

---

### Task 12: Reminders

**Files:**
- Create: `src/screens/Reminders.tsx`
- Reuse: `DataTable`, `Card`, `Button`, `Switch`, `Toast`.

**Interfaces:**
- Consumes: `arInvoices`, `daysOverdue`, ledger.

- [ ] **Step 1: Build** — left: list of overdue AR invoices (customer, invoiceNo, amount, "N days overdue" in rose mono). Selecting one shows a drafted reminder on the right: a `Card` styled like an email (to, subject "Payment reminder: INV-{n}", a plainspoken blame-free body citing amount + days overdue + a pay link placeholder). A "Send reminder" `Button` flips the row to a "Sent" `Badge` (success) + success `Toast` ("Reminder sent to {customer}") — visual only. A per-row cadence `Switch` ("Auto-remind every 7 days").
- [ ] **Step 2: Verify** — screenshot draft + post-send states. Acceptance: overdue math matches `daysOverdue` against `TODAY`; copy is blame-free; send flips state + toasts; no real network.
- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(reminders): overdue list, drafted reminder, sent state"
```

---

### Task 13: Agent chat

**Files:**
- Create: `src/screens/AgentChat.tsx`, `src/components/AgentMessage.tsx`
- Reuse: `AgentProvider`/`useAgent`, `GradientText`, `Card`, `Badge`, `Input`, `Button`.

**Interfaces:**
- Consumes: `useAgent().ask`, `AgentResponse` block renderer.

- [ ] **Step 1: Build** — a full-height chat column with the **one dark high-impact moment**: a header band on `var(--slate-900)` (#14181f) with the white logo + `GradientText` agent name ("CitiSoft Reconciliation Agent") + a "Reading your ledger" status. Message list renders user bubbles (right, neutral) and agent messages via `AgentMessage`, which switches on `AgentBlock.type`: `text` (prose), `table` (mono `DataTable`), `action` (a `Card` with title/detail + `Button` cta), `reasoning` (a numbered, muted step list). A composer at the bottom (`Input` + send `Button`) plus 3–4 suggested-prompt `Tag`s ("What needs my attention today", "Show unmatched payments", "Why wasn't INV-{n} auto-approved"). Agent replies use a short streaming token reveal (respect reduced-motion → instant). Seed the thread with one agent greeting that cites 1–2 real exceptions so the screen is never empty.
- [ ] **Step 2: Verify** — screenshot the thread after asking "what needs my attention today" and "why wasn't {INV} auto-approved". Acceptance: dark header blues glow; answers cite real amounts/ids from the ledger; table/action/reasoning blocks render correctly; suggested prompts work; streaming reveal respects reduced-motion; contrast on the dark header passes.
- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat(agent): chat screen with rich reasoned responses"
```

---

### Task 14: ERP connections (cosmetic)

**Files:**
- Create: `src/screens/ErpConnections.tsx`
- Reuse: `Card`, `Badge`, `Switch`, `FeatureChip`, `Button`.

- [ ] **Step 1: Build** — a grid of ERP tiles (Xero, Oracle NetSuite, Microsoft Dynamics, QuickBooks): each a `Card` with the ERP name, a short line, a status `Badge` (Xero = "Connected" success dot; others = "Connect" `Button`). Toggling connect flips a tile to connected + success `Toast`. A top note: "Your ledger stays the source of truth. The agent reads and writes back through your ERP." Purely cosmetic (no logos required — use a neutral monogram tile if brand logos aren't available, to avoid trademark assets).
- [ ] **Step 2: Verify** — screenshot. Acceptance: Xero shows connected; connecting another toasts + flips; consistent card vocabulary; sentence case; no emoji.
- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: cosmetic ERP connections screen"
```

---

### Task 15: Polish, a11y, responsive, demo dry-run

**Files:**
- Modify: any screen needing responsive/motion/empty-state/a11y fixes; `src/app/Sidebar.tsx` (mobile collapse if needed).
- Create: `README.md` (run/build/deploy + demo script), delete `src/screens/_Specimen.tsx` route (keep file or remove).

- [ ] **Step 1: Motion + reduced-motion audit** — confirm every animated surface (skeletons, streaming reveal, hover lifts, toasts, dialog) has a `@media (prefers-reduced-motion: reduce)` alternative. Grep for transitions lacking a reduced-motion guard on keyed animations.
- [ ] **Step 2: A11y pass** — keyboard-tab every screen: focus rings visible everywhere; dialogs trap focus + close on Escape; images have alt; color is never the only signal (badges carry text). Spot-check body-text contrast ≥4.5:1 (especially muted text on tinted surfaces and the dark agent header).
- [ ] **Step 3: Responsive pass** — screenshot all 8 screens at 1320, 1024, 768. Fix overflow (headings, tables → horizontal scroll or stacked), collapse the sidebar to icons or a drawer ≤768px. Verify no text overflows its container at any width.
- [ ] **Step 4: Consistency sweep** — same Button shapes, one form-control vocabulary, one icon style (lucide), sentence case, no emoji, rose only on problems, gradient only on the sanctioned moments. Run the hex grep across `src` (allow only `tokens.css`).

```bash
grep -rn --include=*.tsx -E "#[0-9a-fA-F]{3,6}" src | grep -v "tokens.css" && echo "REVIEW hex" || echo "PASS"
```

- [ ] **Step 5: Full demo dry-run** — walk the §9 narrative end to end (Dashboard → AP inbox → PO match → bank upload → AR match → reminders → agent chat), screenshotting each step; confirm the numbers stay consistent across screens (KPIs = ledger = agent answers). Fix any drift.
- [ ] **Step 6: Build + README** — `npm run build` clean; write `README.md` (dev/build/deploy-to-Vercel + the Loom demo script). Run `npm test` (all green).
- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "polish: a11y, responsive, motion, demo dry-run, README"
```

---

## Self-Review

**Spec coverage (vs `PROTOTYPE.md` + design doc):**
- §2.1 AP flow → Tasks 4, 8, 9. §2.2 AR flow → Tasks 4, 10, 11. §2.3 Reminders → Task 12. §2.4 Chat → Tasks 5, 13.
- §3 all 8 screens → Tasks 7–14 (Dashboard, Invoice inbox, PO matching, Bank upload, AR matching, Reminders, Chat, ERP connections). ✓
- §4 mock data (6 AP / 4 PO / 9 txns / 8 AR / 2 overdue) → Task 3 seed + tests. ✓
- §5 stack (Vite+React+TS per approved deviation), styling (DS tokens), simulated agent → Tasks 1, 2, 5. ✓
- §7 out-of-scope respected (no backend/auth/persistence). ✓
- §8 demo narrative → Task 15 dry-run. ✓
- Design doc theme (light + dark agent moment), semantic states, gradient discipline, motion → Global Constraints + per-task acceptance. ✓

**Placeholder scan:** logic tasks carry real test + impl code; UI tasks carry concrete structure, exact token usage, and screenshot acceptance criteria (the correct verification for visual work) rather than fabricated unit tests. No "TBD/handle edge cases" left.

**Type consistency:** `buildLedger()` shape is defined once (Task 4) and consumed by Tasks 5–13; `AgentResponse`/`AgentBlock` defined in Task 5 and rendered in Task 13; `matchInvoiceToPo`/`matchPaymentToInvoices` signatures fixed in Task 4 and reused in Tasks 8–11. Component prop APIs fixed in Task 2 mirror the DS `.d.ts`. Consistent.

---

## Execution Handoff
