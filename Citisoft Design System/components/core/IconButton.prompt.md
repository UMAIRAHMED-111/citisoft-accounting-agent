Icon-only button for toolbars and compact controls; always pass a `label` for accessibility.

```jsx
<IconButton icon={<Bell/>} label="Notifications" />
<IconButton variant="brand" icon={<Plus/>} label="New RFQ" />
<IconButton variant="ghost" size="sm" icon={<MoreHorizontal/>} label="More" />
```

- **variant**: `brand` (gradient chip), `secondary` (bordered), `ghost`. **size**: `sm` 32 / `md` 40 / `lg` 48.
