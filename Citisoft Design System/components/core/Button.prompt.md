Primary call-to-action button; use for the single most important action in a view — the gradient `primary` is Citisoft's signature device, so keep it to one per section.

```jsx
<Button onClick={start}>Start an RFQ</Button>
<Button variant="secondary" size="sm">Talk to sales</Button>
<Button variant="ghost" trailingIcon={<ArrowRight/>}>View the workflow</Button>
<Button accent="rfq">Submit quote</Button>
```

- **variant**: `primary` (brand gradient), `secondary` (white + border), `ghost` (tinted on hover), `danger` (rose).
- **size**: `sm` | `md` | `lg`. **accent**: `brand` | `rfq` (magenta) for the primary variant inside the RFQ product.
- Hover lifts 1px + brightens; press translates down 1px (no scale). Pass `leadingIcon`/`trailingIcon` as 16–20px icon nodes.
