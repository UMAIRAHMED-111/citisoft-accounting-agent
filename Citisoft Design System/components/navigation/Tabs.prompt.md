Underline tab bar with a gradient active indicator; tabs can carry a count pill.

```jsx
<Tabs
  tabs={[{value:'open',label:'Open',count:27},{value:'awarded',label:'Awarded',count:8},{value:'all',label:'All'}]}
  defaultValue="open"
  onChange={setTab}
/>
```

- Controlled (`value`+`onChange`) or uncontrolled (`defaultValue`). Pass plain strings for simple tabs.
