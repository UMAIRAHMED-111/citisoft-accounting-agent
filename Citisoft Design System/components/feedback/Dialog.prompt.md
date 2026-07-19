Modal dialog for confirmations and short forms; blurred charcoal scrim, closes on Escape / scrim / ×.

```jsx
<Dialog open={open} onClose={close} title="Cancel this RFQ?"
  footer={<>
    <Button variant="secondary" onClick={close}>Keep it</Button>
    <Button variant="danger" onClick={confirm}>Cancel RFQ</Button>
  </>}>
  Suppliers will be notified and any open quotes will be withdrawn.
</Dialog>
```

- Render it always; it returns null when `open` is false. Put actions in `footer`.
