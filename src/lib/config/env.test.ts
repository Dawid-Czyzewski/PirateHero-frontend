import { afterEach, describe, expect, it, vi } from "vitest";
import { apiBaseUrl } from "@/lib/config/env";

describe("apiBaseUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the configured API address without trailing slashes", () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:8000//");

    expect(apiBaseUrl()).toBe("http://localhost:8000");
  });

  it("fails loudly when the address is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");

    expect(() => apiBaseUrl()).toThrow(/NEXT_PUBLIC_API_URL/);
  });
});
