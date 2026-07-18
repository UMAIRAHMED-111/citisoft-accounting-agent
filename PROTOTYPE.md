# AP/AR Reconciliation Agent — Spec Doc (Frontend Prototype)

## 1. Overview

An AI agent that sits on top of a company's ERP (Xero, Oracle, Dynamics, etc.) and automates AP and AR reconciliation end to end — invoice ingestion, PO matching, payment matching against bank activity, reminders, and a chat interface for the finance team to query their own data in natural language.

This doc scopes a **frontend-only prototype** (no real backend, no live ERP connection) built to demo the workflow convincingly on a Loom recording. All data is mocked/simulated client-side; the "agent" responses are either scripted or driven live via the Claude API for the chat piece.

---

## 2. Core Workflow (What We're Simulating)

### 2.1 AP (Accounts Payable)
1. Vendor sends an invoice to the company's email
2. Agent parses the invoice (OCR + structuring) — vendor, invoice #, amount, line items, due date
3. Agent matches it against the open PO in the ERP (PO ↔ invoice line-item/amount match)
4. If matched cleanly, agent submits it into the ERP as ready-for-payment
5. If mismatched (amount off, no PO found, duplicate), it's flagged for human review with reasoning attached

### 2.2 AR (Accounts Receivable)
1. Company uploads a bank statement (PK alternative to Plaid, since Plaid doesn't operate here) — PDF/CSV
2. Agent parses transactions out of the statement — amount, date, payer reference/memo
3. Agent matches each incoming payment against open invoices in the ERP (exact match on ref/amount, fuzzy match on amount + payer + date window if ref is missing/unclear)
4. Partial payments, lump sums, and unmatched cash are handled explicitly, not force-matched
5. Reconciled payments get marked/pushed back to the ERP as applied

### 2.3 Reminders
- Agent flags overdue invoices and drafts/sends reminders on a configurable schedule
- In the prototype, this is mocked — show a reminder draft + a "sent" state, not real delivery

### 2.4 Chat Interface
- A Claude-style chat panel where the user can ask questions about their data: "which invoices are overdue," "show me unmatched payments this month," "why wasn't this invoice auto-approved"
- This is the most demo-able part — can run on real Claude API calls against the mocked dataset, so answers feel live and reasoned, not scripted

---

## 3. Prototype Scope (v0 — Frontend Only, No Backend)

Goal: a clickable, narratable product that looks and feels real on screen recording. Everything backend-related is mocked with static/seeded JSON data and client-side logic — no real ERP connection, no real bank feed, no real email inbox.

**Screens to build:**

| Screen | What it shows | Notes |
|---|---|---|
| Dashboard | Overview: open AP, open AR, exceptions needing review, recent activity | Sets the "enterprise" tone visually |
| Invoice inbox (AP) | List of incoming invoices, OCR-extracted fields shown next to a preview of the "email/PDF" | One or two pre-loaded sample invoices, one clean, one messy |
| PO matching view | Shows PO vs invoice side by side, match status, confidence | Highlight mismatch reasoning |
| Bank statement upload (AR) | Upload flow → parsed transaction list → match results against open invoices | Use a sample statement, mock the parse |
| AR matching / exception queue | Matched vs unmatched payments, partial payment handling, reasoning shown | Same exception-queue pattern as AP |
| Reminders panel | List of overdue invoices, draft reminder, "sent" toggle | Purely visual, no real send |
| Chat panel | Claude-style chat, answers questions against the mocked dataset | Can be wired to real Claude API for authenticity |
| ERP connection screen (cosmetic) | Logos/toggle for Xero / Oracle / Dynamics, "Connected" state | Purely cosmetic, sells the "integrates with your ERP" narrative |

---

## 4. Data to Mock

- 5–8 sample vendor invoices (mix of clean matches and 1–2 deliberately messy ones — missing PO ref, amount mismatch)
- 3–5 open POs
- 1 sample bank statement with 8–10 transactions (mix of exact match, partial payment, unmatched cash)
- 5–10 open AR invoices
- A couple of overdue invoices for the reminders panel

All of this can live in static JSON files, no database needed.

---

## 5. Tech Stack (Prototype)

- **Framework**: Next.js / React (single app, no real backend routes beyond thin API routes if needed for the Claude chat calls)
- **State**: local React state / static JSON — no database
- **OCR "simulation"**: pre-extracted fields shown as if OCR ran, OR real Claude vision call on 1–2 sample invoice images for authenticity in the demo
- **Chat**: real Claude API call, given the mocked dataset as context, so it can answer questions live
- **Styling**: clean enterprise SaaS look — sidebar nav, dashboard cards, tables — nothing custom-illustrated needed
- **Hosting**: Vercel, quick to share a link alongside the Loom

---

## 6. Build Estimate

This assumes no real backend, no auth, no persistence beyond in-session state — purely built to demo a convincing end-to-end story on a Loom.

---

## 7. What NOT to Build for This Prototype

- Real ERP API integration (Xero/Oracle/Dynamics) — cosmetic only
- Real email inbox monitoring
- Real bank statement parsing at scale — one working sample is enough
- Real reminder delivery (WhatsApp/email/SMS)
- User auth, multi-tenant setup, persistence/database
- Any production-grade error handling

---

## 8. Demo Narrative (Suggested Loom Flow)

1. Start at dashboard — show the "state of the books" at a glance
2. Walk through AP: an invoice comes in, agent extracts fields, matches to PO, one clean auto-match, one flagged exception with reasoning
3. Walk through AR: upload a bank statement, agent parses and matches payments to open invoices, show a partial payment being handled
4. Show the reminders panel — overdue invoice, drafted reminder
5. End on the chat panel — ask it something like "what needs my attention today" and let it answer live from the data

This gives a full story arc without needing any real integrations underneath.