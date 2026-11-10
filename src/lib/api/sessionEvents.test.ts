import { describe, expect, it, vi } from "vitest";
import { notifySessionExpired, onSessionExpired } from "@/lib/api/sessionEvents";

describe("session events", () => {
  it("notifies subscribed listeners until they unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = onSessionExpired(listener);

    notifySessionExpired();
    unsubscribe();
    notifySessionExpired();

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
