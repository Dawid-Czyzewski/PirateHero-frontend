import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hasStatus, isSuccessful, sendJson } from "@/lib/api/http";

const fetchMock = vi.fn<typeof fetch>();

describe("sendJson", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test");
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("posts JSON with credentials to the configured API", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await sendJson("POST", "/api/auth/login", { email: "a@b.pl" });

    expect(fetchMock).toHaveBeenCalledWith("http://api.test/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ email: "a@b.pl" }),
    });
  });

  it("sends GET without a body", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await sendJson("GET", "/api/me");

    expect(fetchMock).toHaveBeenCalledWith("http://api.test/api/me", {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
  });

  it("returns status and parsed body", async () => {
    fetchMock.mockResolvedValue(Response.json({ violations: [] }, { status: 422 }));

    expect(await sendJson("POST", "/x", {})).toEqual({ kind: "response", status: 422, body: { violations: [] } });
  });

  it("returns null body for empty or non-JSON responses", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 200 }));
    fetchMock.mockResolvedValueOnce(new Response("<html>", { status: 500 }));

    expect(await sendJson("GET", "/x")).toEqual({ kind: "response", status: 200, body: null });
    expect(await sendJson("GET", "/x")).toEqual({ kind: "response", status: 500, body: null });
  });

  it("reports network errors instead of throwing", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    expect(await sendJson("GET", "/x")).toEqual({ kind: "network-error" });
  });
});

describe("result helpers", () => {
  it("recognises successful and specific statuses", () => {
    const ok = { kind: "response", status: 201, body: null } as const;
    const unauthorized = { kind: "response", status: 401, body: null } as const;
    const offline = { kind: "network-error" } as const;

    expect(isSuccessful(ok)).toBe(true);
    expect(isSuccessful(unauthorized)).toBe(false);
    expect(isSuccessful(offline)).toBe(false);
    expect(hasStatus(unauthorized, 401)).toBe(true);
    expect(hasStatus(offline, 401)).toBe(false);
  });
});
