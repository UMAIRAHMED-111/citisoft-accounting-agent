# Citisoft Solutions — Design System

A brand-driven design system for **Citisoft Solutions**, an enterprise/industrial
software company. The system is professional, technical, and trustworthy — built
for enterprise and industrial buyers. Its design philosophy is **visual-first**:
lead with diagrams, logos, and product imagery so users can *relate to things*,
not just read about them.

> **Namespace:** components are exposed on `window.CitisoftDesignSystem_1a14bd`
> in card/kit HTML (run `check_design_system` to confirm the current value).

---

## Sources

- **Brand brief** — provided by the client (color palette, fonts, philosophy, product accents).
- **Logo** — `uploads/CitiSoft Logo (1).png` (original), copied to `assets/`.
- No codebase or Figma file was provided. This system is therefore authored from
  the brand brief + logo. Where a real product spec is unknown, screens are built
  as faithful *brand-consistent* recreations and clearly labelled as samples.

If a codebase or Figma becomes available, re-attach it and these recreations
should be reconciled against the real source of truth.

---

## Products represented

1. **Citisoft marketing website** — the public brand surface. Light theme with
   dark high-impact sections (hero, Products, Insights). See `ui_kits/website/`.
2. **RFQ / Sales Platform** — the flagship product: a request-for-quote and
   sales workflow tool for industrial buyers and suppliers. Carries its own
   **magenta accent gradient** (`#4a1e3d → #8a3e5d`). See `ui_kits/rfq-platform/`.

---

## Content fundamentals

How Citisoft writes copy.

- **Voice:** confident, precise, plainspoken. We sound like engineers who respect
  the reader's time — never breathless marketing. Short declaratives over long
  qualified sentences.
- **Person:** address the customer as **"you"**; the company is **"we"**.
  ("You send one RFQ. We route it to every qualified supplier.")
- **Casing:** **Sentence case** for almost everything — headings, buttons, nav,
  labels. Reserve Title Case for proper product names ("RFQ Platform"). Never ALL
  CAPS in body copy; uppercase is a *typographic* device only (overlines/eyebrows),
  set with wide letter-spacing — never typed in caps.
- **Numbers & specifics:** lead with concrete figures. "Cut quote turnaround from
  6 days to 4 hours" beats "dramatically faster". Use real units, monospace for
  data (IDs, SKUs, timestamps).
- **Tone by surface:** marketing = aspirational but grounded; product UI = terse,
  instructional, calm; error/problem states = direct and blame-free
  ("This RFQ is missing a delivery date" — not "Oops!").
- **Emoji:** **none.** This is an enterprise/industrial brand. Iconography carries
  visual warmth instead.
- **Examples:**
  - Eyebrow: `RFQ PLATFORM` (uppercase, tracked)
  - Hero H1: "Quote industrial parts in hours, not weeks."
  - Subhead (serif lede): "Citisoft connects buyers and suppliers on one
    auditable workflow — from request to award."
  - Button: "Start an RFQ", "Talk to sales", "View the workflow"
  - Empty state: "No active quotes yet. Create your first RFQ to get started."

---

## Visual foundations

The motifs and rules that make something look like Citisoft.

- **Color story:** a clean **light theme** (white cards, `#f8fafb` page, near-black
  slate text `#1f2733`, soft grey borders) punctuated by **dark high-impact
  sections** built on charcoal-blue `#14181f` with near-white text — the brand
  blues *glow* against the dark. Most surfaces are one or the other; avoid muddy
  mid-greys.
- **The signature gradient:** a **135° blue gradient** (azure `#2b9fd4` → mid
  `#2c79ba` → deep `#255b9c`) is the brand's single most recognisable device. It
  runs across primary buttons, accent strokes, diagram highlights, icon chips, and
  gradient *text*. Always 135°, always the same three stops. Use it intentionally —
  one or two gradient moments per view, not everywhere.
- **Product accents:** each product gets its own 135° accent gradient layered on
  the same neutral system. RFQ/Sales = magenta `#4a1e3d → #8a3e5d`. A single
  **rose-red `#d6394f`** is reserved for problem/error states only — never decorative.
- **Type:** **Hanken Grotesk** for everything UI and display (tight tracking on
  large sizes, extrabold for hero numerals); **Source Serif 4** for editorial ledes
  and pull-quotes (adds a human, trustworthy register); **JetBrains Mono** for data,
  IDs, code, and stat readouts. Display type is big and confident with negative
  letter-spacing; body is generous (1.65 line-height).
- **Spacing & layout:** 8px grid with 2/4px micro-steps for dense data tables.
  Max content width ~1200px; sections breathe at ~96px vertical rhythm. Generous
  whitespace on marketing, tighter density in the product app.
- **Backgrounds:** mostly **flat** white or charcoal. The gradient and product
  imagery/diagrams provide energy — *not* noisy textures. Occasional very-subtle
  blue tint (`#f1f8fc`) for sunken/feature panels. No repeating patterns, no grain.
- **Imagery vibe:** cool-toned, technical, real (industrial parts, supply chains,
  dashboards). Diagrams are first-class citizens — flowcharts, node graphs, and
  schematic highlights drawn in brand blue. Prefer a diagram or product screenshot
  over a stock photo where possible.
- **Cards:** white, `--radius-lg` (14px) corners, **1px `--border-default` border
  + soft low shadow** (`--shadow-sm`/`--shadow-md`). Flat and architectural, not
  floaty. On dark, cards are `#1b212b` with a hairline white-alpha border. Never
  the "rounded card with a single colored left border" trope.
- **Corner radii:** 6–14px is the working range; pills (`--radius-pill`) only for
  tags, avatars, and small status chips. Inputs and buttons share `--radius-md`.
- **Borders:** 1px hairlines in cool grey (`--slate-200`) are the default
  separator. 2px brand stroke for focus/active emphasis.
- **Shadows:** cool-tinted (`rgba(20,24,31,…)`), low and wide. Elevation is gentle —
  the system reads crisp, not skeuomorphic. Brand buttons get a soft blue glow
  (`--shadow-brand`).
- **Motion:** quick and confident — 120–280ms, `--ease-out`, **no bounce**.
  Fades and short translates (6–10px). Hover lifts are subtle (1px). Enterprise calm.
- **Hover states:** primary (gradient) buttons brighten to `--grad-brand-hover` +
  gentle lift; secondary/ghost darken their fill a step; links underline.
- **Press states:** translate down 1px and slightly darken — no scale-down jelly.
- **Transparency / blur:** reserved for overlays and dialog scrims
  (`--blur-overlay`, charcoal scrim at ~55% alpha) and the dark-theme glass nav.
  Not used decoratively on content.
- **Focus:** always visible — 3px `--focus-ring` (azure at 45%). Accessibility is
  non-negotiable for enterprise buyers.

---

## Iconography

- **No icon set was provided in the brief**, so the system standardises on
  **[Lucide](https://lucide.dev)** — a clean, consistent 24px line-icon set
  (1.75–2px stroke, rounded joins) that matches Citisoft's technical-but-approachable
  register. *This is a substitution; if Citisoft has an in-house icon library,
  swap it in and update this section.*
- **Delivery:** linked from CDN in cards/kits
  (`https://unpkg.com/lucide@latest`), rendered via `lucide.createIcons()` or
  inline `<svg>`. Stroke width 1.75, `currentColor`, so icons inherit text color
  and the brand gradient where wrapped in a `.cs-grad-text`/gradient chip.
- **Usage:** icons are functional and quiet — paired with labels, sized 16–20px in
  UI, 24–32px in feature lists. **Gradient icon chips** (a rounded square filled
  with `--grad-brand`, white icon) are a recurring brand device on feature cards.
- **Brand marks:** `assets/citisoft-logo.png` (full color, on light),
  `assets/citisoft-logo-white.png` (on dark), `assets/citisoft-logo-slate.png`
  (mono). The logo's sparkle + chevron motif is the brand's signature glyph.
- **Emoji / unicode icons:** not used.

---

## Index — what's in this folder

**Foundations**
- `styles.css` — global entry point (link this one file). `@import`s only.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css`,
  `fonts.css`, `base.css`.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).

**Assets**
- `assets/` — logo variants (full-color / white / slate).

**Components** (`components/`) — reusable React primitives on the namespace:
- `core/` — Button, IconButton, Badge, Tag, Avatar
- `forms/` — Input, Select, Checkbox, Switch
- `surfaces/` — Card, StatCard, FeatureChip
- `navigation/` — Tabs
- `feedback/` — Dialog, Tooltip, Toast
- `brand/` — Logo, GradientText

**UI kits** (`ui_kits/`)
- `website/` — Citisoft marketing website (hero, products, insights, footer).
- `rfq-platform/` — RFQ / Sales platform app (dashboard, RFQ detail, quotes).

**Slides** (`slides/`) — branded 16:9 sample slides (title, section, content,
stat, quote, diagram).

**Skill**
- `SKILL.md` — makes this folder usable as a downloadable Claude Agent Skill.
- `readme.md` — this file.
