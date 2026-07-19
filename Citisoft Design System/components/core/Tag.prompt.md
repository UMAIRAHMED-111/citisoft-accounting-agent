Filter or category chip; toggleable (`active`) or removable (`onRemove`).

```jsx
<Tag active onClick={toggle}>Steel</Tag>
<Tag onRemove={() => remove(id)}>Supplier: Acme</Tag>
<Tag icon={<Tag/>}>Category</Tag>
```

- **active** gives the brand-tint selected look. Pass **onRemove** for a × button; pass **onClick** to make it interactive.
