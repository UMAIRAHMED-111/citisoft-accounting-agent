The base container for grouped content. White, 14px radius, hairline border, soft shadow — never the "rounded card with a colored left border" trope.

```jsx
<Card>…</Card>
<Card interactive elevated onClick={open}>…</Card>
```

- **interactive** adds a 2px hover lift; **elevated** uses the medium shadow at rest. Compose other primitives inside.
