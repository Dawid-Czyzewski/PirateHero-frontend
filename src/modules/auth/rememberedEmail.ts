"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "fl_email";

function readRememberedEmail(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function rememberEmail(email: string | null): void {
  try {
    if (email) localStorage.setItem(STORAGE_KEY, email);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function useRememberedEmail(): string | null {
  return useSyncExternalStore(subscribe, readRememberedEmail, () => null);
}
