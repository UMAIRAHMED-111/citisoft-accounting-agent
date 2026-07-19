---
name: citisoft-design
description: Use this skill to generate well-branded interfaces and assets for Citisoft Solutions, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets
out (logos from `assets/`) and create static HTML files for the user to view, linking
`styles.css` for the real tokens. If working on production code, you can copy assets
and read the rules here to become an expert in designing with this brand.

Key facts:
- **Brand:** Citisoft Solutions — enterprise/industrial sourcing software. Professional,
  technical, trustworthy. Design philosophy is **visual-first** (diagrams + logos).
- **Colors:** signature 135° blue gradient (azure `#2b9fd4` → mid `#2c79ba` → deep
  `#255b9c`). Clean light theme (white / `#f8fafb` / slate text `#1f2733`) with dark
  high-impact sections on charcoal-blue `#14181f`. RFQ product accent = magenta
  (`#4a1e3d → #8a3e5d`); rose `#d6394f` for errors only.
- **Type:** Hanken Grotesk (UI/display), Source Serif 4 (editorial ledes), JetBrains
  Mono (data/code). All on Google Fonts (loaded via `tokens/fonts.css`).
- **Tokens:** link `styles.css` (the single entry point). Components are exposed on the
  `window.<Namespace>` global after loading `_ds_bundle.js` — run the design-system
  check to confirm the current namespace.
- **Components:** see `components/` (core, forms, surfaces, navigation, feedback, brand).
  Each has a `.prompt.md` with usage. **UI kits:** `ui_kits/website/`,
  `ui_kits/rfq-platform/`.

If the user invokes this skill without any other guidance, ask them what they want to
build or design, ask some questions, and act as an expert designer who outputs HTML
artifacts _or_ production code, depending on the need.
