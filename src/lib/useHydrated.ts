"use client";

import { useSyncExternalStore } from "react";

function subscribeNever(): () => void {
  return () => {};
}

export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNever, () => true, () => false);
}
