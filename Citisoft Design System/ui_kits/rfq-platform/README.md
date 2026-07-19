# RFQ / Sales Platform — UI kit

The flagship Citisoft product: a request-for-quote and sales workflow app for
industrial buyers. Carries the product's own **magenta accent gradient**
(`#4a1e3d → #8a3e5d`) layered on the shared neutral system.

> **Note:** No production app or Figma was provided. This is an original, on-brand
> recreation built from the brand brief + design-system primitives. Reconcile
> against the real product when available.

## Run
Open `index.html` (loads `styles.css` + `_ds_bundle.js`, then the kit files).

## Surfaces (files)
- `AppShell.jsx` — `Sidebar` (product nav with magenta active state) + `Topbar`
  (search, New RFQ, notifications, user).
- `Dashboard.jsx` — greeting, KPI `StatCard` row, and a filterable RFQ table
  (`Tabs` + rows that open the detail view).
- `RfqDetail.jsx` — single RFQ: header, a ranked **quote-comparison table** with a
  working **Award** action, plus spec + activity sidebars.
- `data.jsx` — shared sample RFQ + quote data.
- `icons.jsx` — inline Lucide-path `RIcon` helper.

## Interactive flow
1. Dashboard → click any RFQ row → RFQ detail.
2. In detail, **Award** a quote → success `Toast` + awarded state.
3. **New RFQ** (topbar) → `Dialog` form → publish → success `Toast`.
4. Tabs filter the table; sidebar nav switches areas.

## Components used
`Logo`, `Avatar`, `IconButton`, `Button`, `Badge`, `Tag`, `Tabs`, `Card`,
`StatCard`, `Input`, `Select`, `Dialog`, `Toast`.
