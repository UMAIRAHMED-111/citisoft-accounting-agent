# CitiSoft AP/AR Reconciliation Agent

A frontend-only prototype demonstrating an AI-powered accounts payable and accounts receivable reconciliation workflow. All data is mocked client-side; there is no real backend, ERP connection, or live bank feed.

## Screens

| Screen | Path |
|---|---|
| Dashboard | `/` |
| Invoice inbox (AP) | `/inbox` |
| PO matching | `/po-matching` |
| Bank statement upload | `/bank-upload` |
| AR matching | `/ar-matching` |
| Reminders | `/reminders` |
| Agent chat | `/agent` |
| ERP connections | `/connections` |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build       # TypeScript compile + Vite production build → dist/
npm run preview     # Serve the dist/ folder locally
npx vitest run      # Run the 23 unit tests (data, reconcile logic, agent engine)
```

## Deploy to Vercel

1. Push the repo to GitHub (or any Git host Vercel supports).
2. Import the repo in the [Vercel dashboard](https://vercel.com/new).
3. Accept the default settings — Vercel detects Vite automatically.
4. Click **Deploy**. The `dist/` output directory and build command (`npm run build`) are set correctly by default.

No environment variables are required. The prototype runs entirely client-side.

## Loom demo script

Suggested order for a 5-8 minute walkthrough:

1. **Dashboard** — open the app, show the KPI strip (open AP, open AR, exceptions, reconciled MTD), point out the "Needs your attention" exceptions list and the cash position chart.

2. **Invoice inbox (AP)** — select an invoice from the left panel, walk through the OCR-extracted fields, show the PDF viewer expanding, highlight the PO match with line-item comparison, note the confidence tag. Select the invoice with a missing PO reference to show the flagged/exception state.

3. **PO matching** — switch to the PO matching screen, show the exception queue with the amount-mismatch reason callout, demonstrate the "Approve anyway" and "Flag for vendor" actions and the resulting toast notification.

4. **Bank statement upload** — click "Use sample statement", watch the parse progress bar and skeleton rows, then navigate to AR matching.

5. **AR matching** — walk through the bank transactions, expand an exact-match row and a partial-match row to show the reasoning and invoice applied amounts. Point out the unmatched deposit.

6. **Reminders** — show the overdue invoice list on the left, review the auto-drafted reminder email, toggle "Auto-remind every 7 days", click "Send reminder" and show the success toast.

7. **Agent chat** — end the demo here. The greeting response appears automatically. Ask "Why wasn't invoice 78875 auto-approved" and "Show unmatched payments" to demonstrate live reasoning against the mocked dataset.

## Notes

- This is a **frontend-only prototype** with mocked data. The agent responses are simulated; no real Claude API key is required.
- The ERP connections screen is cosmetic — toggles do not make real API calls.
- Responsive layout supports widths from 768 px upward. The sidebar collapses to an icon rail below 880 px.
