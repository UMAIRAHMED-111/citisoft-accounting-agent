Status pill for states, counts, and labels (e.g. RFQ status, "New", "3 quotes").

```jsx
<Badge tone="success" dot>Awarded</Badge>
<Badge tone="warning">Awaiting quotes</Badge>
<Badge tone="error" solid>Overdue</Badge>
<Badge tone="brand">New</Badge>
```

- **tone**: `brand` | `neutral` | `success` | `warning` | `error` | `rfq`. **solid** fills; **dot** adds a leading status dot. Reserve `error` for problem states.
