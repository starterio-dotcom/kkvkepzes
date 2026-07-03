"use client";
import { useCallback, useSyncExternalStore } from "react";

// localStorage-ban tárolt string-halmaz (kész leckék). useSyncExternalStore-ral
// SSR-/hidratálás-biztos: a szerver-pillanatkép a defaults, mountkor jön a mentett
// állapot — nincs setState-az-effectben minta.

type Entry = { raw: string | null; set: Set<string> };
const cache = new Map<string, Entry>();
const fallbacks = new Map<string, Set<string>>();
const listeners = new Set<() => void>();

function fallbackFor(key: string, defaults?: readonly string[]) {
  let f = fallbacks.get(key);
  if (!f) { f = new Set(defaults); fallbacks.set(key, f); }
  return f;
}

function read(key: string, defaults?: readonly string[]): Set<string> {
  let raw: string | null = null;
  try { raw = localStorage.getItem(key); } catch {}
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.set;
  let set = fallbackFor(key, defaults);
  if (raw) { try { set = new Set<string>(JSON.parse(raw)); } catch {} }
  cache.set(key, { raw, set });
  return set;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => { listeners.delete(cb); window.removeEventListener("storage", cb); };
}

export function useStoredSet(key: string, defaults?: readonly string[]): [Set<string>, (id: string) => void] {
  const done = useSyncExternalStore(subscribe, () => read(key, defaults), () => fallbackFor(key, defaults));
  const add = useCallback((id: string) => {
    const next = new Set(read(key));
    next.add(id);
    let raw: string | null = null;
    try { localStorage.setItem(key, JSON.stringify([...next])); raw = localStorage.getItem(key); } catch {}
    cache.set(key, { raw, set: next });
    listeners.forEach((l) => l());
  }, [key]);
  return [done, add];
}
