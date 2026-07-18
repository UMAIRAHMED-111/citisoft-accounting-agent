# AP/AR Reconciliation Agent — Frontend Prototype Design

**Date:** 2026-07-18
**Status:** Approved
**Product spec:** `PROTOTYPE.md` (client-authored requirements — source of truth for *what*)
**This doc:** the *how* — technical and design decisions for the frontend prototype.

---

## 1. Goal

A clickable, narratable frontend prototype of CitiSoft's **AP/AR Reconciliation Agent** — an AI agent that sits on a company's ERP and automates accounts-payable and accounts-receivable reconciliation. Built to demo a convincing end-to-end story on a Loom recording. No real backend, no live ERP, no live bank feed. All data mocked client-side; the agent is simulated but reasoned.

Success = a finance-team viewer watching the Loom believes this is a real product.

## 2. Decisions locked in brainstorming

| Decision | Choice | Rationale |
|---|---|---|
| Stack | **Vite + React + TypeScript**, `react-router` | User pick; static SPA, deploys to Vercel. |
| Design system | Port the Citisoft DS into typed `src/ds/` components; copy `styles.css` + `tokens/` verbatim | `_ds_bundle.js` is a `window`-global IIFE, not importable in Vite. Tokens stay the exact brand contract; typed primitives give clean imports + control. |
| Agent chat | **Simulated** — deterministic client-side engine over mock data, behind a swappable `AgentProvider` | No backend to hide an API key in a pure SPA; reliable for Loom takes. Real Claude can drop in behind the same interface later. |
| Theme | Light product UI + one dark high-impact agent moment | Follows DS: light app (white cards, `#f8fafb`, slate text), blue signature gradient on primary/agent/match highlights; charcoal-blue `#14181f` on the agent chat header. |

**Deviation from `PROTOTYPE.md` §5:** spec suggested Next.js + live Claude API. We ship Vite + a simulated agent instead (see above). The `AgentProvider` interface preserves a clean path to real Claude via a backend later.

## 3. Architecture

```
src/
  ds/            # ported, typed Citisoft design-system primitives
    tokens.css   # copied verbatim from Citisoft DS (styles.css + tokens/*)
    Button.tsx  Card.tsx  StatCard.tsx  Badge.tsx  Tabs.tsx  Dialog.tsx
    Toast.tsx  Input.tsx  Select.tsx  Switch.tsx  Checkbox.tsx  Avatar.tsx
    Tag.tsx  IconButton.tsx  Logo.tsx  GradientText.tsx  index.ts
  app/
    AppShell.tsx     # sidebar + topbar + <Outlet/>
    Sidebar.tsx
    Topbar.tsx
    routes.tsx
  screens/
    Dashboard.tsx
    InvoiceInbox.tsx      # AP
    PoMatching.tsx        # AP
    BankUpload.tsx        # AR
    ArMatching.tsx        # AR exception queue
    Reminders.tsx
    AgentChat.tsx
    ErpConnections.tsx
  agent/
    AgentProvider.tsx     # context; swappable engine
    engine.ts             # deterministic reasoning over mock data
    intents.ts            # question -> handler routing
  data/
    types.ts              # Invoice, PO, Payment, Statement, MatchResult, ...
    seed.ts               # seeded mock dataset
    reconcile.ts          # derives matches + reasoning; single source of truth
  lib/
    format.ts             # currency, dates, ids
    icons.tsx             # lucide-react wrappers
  main.tsx  App.tsx
public/
  citisoft-logo.png  citisoft-logo-white.png  citisoft-logo-slate.png
```

**Data flow:** `seed.ts` → `reconcile.ts` computes match state + reasoning once → screens and the agent engine both read from the same derived model, so every number is internally consistent across all 8 screens and the chat.

## 4. Screens

1. **Dashboard** — KPI StatCards (Open AP, Open AR, Exceptions needing review, Reconciled MTD), cash-position mini-chart, "Needs your attention" exception list, recent activity feed. Optional docked agent side-panel.
2. **Invoice inbox (AP)** — list ↔ OCR-extracted fields beside a rendered "email/PDF" preview. One clean invoice, one messy (missing PO ref / amount mismatch).
3. **PO matching** — PO vs invoice side-by-side, line-item match, confidence meter, mismatch reasoning callout, approve / flag actions.
4. **Bank statement upload (AR)** — drop-zone → simulated parse with progress/skeleton → parsed transaction list.
5. **AR matching / exception queue** — matched vs unmatched, partial-payment + lump-sum handling, fuzzy-match reasoning, guardrails against force-matching unmatched cash.
6. **Reminders** — overdue-invoice list, drafted reminder, "sent" state toggle (visual only).
7. **Agent chat** — full-screen Claude-style panel; rich responses (inline tables, action cards, reasoning) over mock data. Dark high-impact header.
8. **ERP connections** — cosmetic Xero / Oracle / Dynamics tiles with "Connected" state.

## 5. Agent simulation

- `AgentProvider` exposes `ask(question): Promise<AgentResponse>`.
- `engine.ts` routes to intent handlers ("what needs my attention", "overdue invoices", "unmatched payments this month", "why wasn't INV-x auto-approved") that query the derived model and return structured `AgentResponse` (prose + optional table/action-card blocks + reasoning).
- Streaming-style token reveal for authenticity; canned fallback for unrecognized questions that still points at real data.
- Swappable: a future `ClaudeAgentProvider` implements the same interface against a backend.

## 6. Design & craft rules

- Tokens only — no hardcoded hex outside `tokens.css`.
- Semantic states: success = matched, warning = partial/needs-attention, rose = exception/error (**rose reserved for problems only**, per DS).
- Blue signature gradient (135°, three fixed stops) used intentionally: primary actions, agent identity, confidence/match highlights — one or two gradient moments per view.
- Type: Hanken Grotesk (UI), Source Serif 4 (editorial ledes only), JetBrains Mono (amounts, IDs, refs).
- Motion 120–280ms, ease-out, no bounce; `prefers-reduced-motion` alternatives. Skeletons for parse/OCR simulations, not spinners.
- Every interactive component ships default/hover/focus/active/disabled states. Empty states teach the interface.
- Contrast: body text ≥4.5:1. Focus rings always visible (3px azure).

## 7. Mock data

- 6 vendor invoices (2 deliberately messy), 4 open POs, 1 bank statement (9 transactions: exact / partial / lump-sum / unmatched cash), 8 open AR invoices, 2 overdue.
- Typed in `types.ts`, seeded in `seed.ts`, all match state derived by `reconcile.ts`.

## 8. Out of scope (per `PROTOTYPE.md` §7)

Real ERP integration, real email monitoring, real bank parsing at scale, real reminder delivery, auth/multi-tenant, persistence/DB, production error handling.

## 9. Demo narrative the build must support

Dashboard (state of the books) → AP (invoice in → extract → PO match → one clean auto-match, one flagged exception with reasoning) → AR (upload statement → parse → match payments → handle a partial) → Reminders (overdue → drafted reminder) → Agent chat ("what needs my attention today" → live-feeling reasoned answer from the data).
