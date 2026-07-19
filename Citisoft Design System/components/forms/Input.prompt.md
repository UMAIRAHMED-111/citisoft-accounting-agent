Labelled text field; pass `error` for the rose invalid state, `hint` for helper text.

```jsx
<Input label="Work email" placeholder="you@company.com" />
<Input label="Part number" leadingIcon={<Hash/>} hint="Format: 90-44-1182" />
<Input label="Quantity" error="This RFQ is missing a quantity" />
```

- **size**: `sm` | `md` | `lg`. Focus shows the azure ring; `error` overrides hint and turns the border rose.
