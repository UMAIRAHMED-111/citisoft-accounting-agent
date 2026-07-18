import { useSyncExternalStore } from 'react';

let version = 0;
const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getVersion(): number {
  return version;
}

function notifyListeners(): void {
  version++;
  listeners.forEach(cb => cb());
}

export function mutateSeed(fn: () => string): string {
  const result = fn();
  notifyListeners();
  return result;
}

export function useLedgerVersion(): number {
  return useSyncExternalStore(subscribe, getVersion, getVersion);
}
