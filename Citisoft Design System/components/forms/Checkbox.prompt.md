Checkbox with the brand-gradient checked fill.

```jsx
<Checkbox label="Notify me when quotes arrive" defaultChecked />
<Checkbox label="I agree to the supplier terms" checked={ok} onChange={setOk} />
```

- Works controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`). `onChange` receives the next boolean.
