"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_SETTINGS, SessionSettings } from "@/types";
import { loadSettings, saveSettings as persistSettings } from "@/lib/storage";

let cached: SessionSettings | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): SessionSettings {
  if (cached === null) cached = loadSettings();
  return cached;
}

function getServerSnapshot(): SessionSettings {
  return DEFAULT_SETTINGS;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Settings backed by localStorage, read via useSyncExternalStore to avoid SSR hydration mismatches. */
export function useSettingsStore() {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setSettings = useCallback((next: SessionSettings) => {
    cached = next;
    persistSettings(next);
    listeners.forEach((listener) => listener());
  }, []);

  return [settings, setSettings] as const;
}
