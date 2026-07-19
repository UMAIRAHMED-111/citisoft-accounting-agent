KPI tile for dashboards — mono value, uppercase label, optional trend delta.

```jsx
<StatCard label="Avg. quote turnaround" value="4.2" unit="hrs" delta="38% faster" icon={<Clock/>} accent />
<StatCard label="Open RFQs" value="27" delta="3 vs last week" deltaDir="down" />
```

- **deltaDir** `up` (green) / `down` (rose). **accent** fills the icon chip with the brand gradient.
