Transient notification; place in a fixed bottom/top-right stack.

```jsx
<Toast tone="success" title="Quote submitted" onDismiss={dismiss}>
  Acme Steel was notified.
</Toast>
```

- **tone**: `info` | `success` | `warning` | `error`. Auto-dismisses after `duration` (default 5s); pass `onDismiss` to enable the timer + close button.
