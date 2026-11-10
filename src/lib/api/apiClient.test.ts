import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { postJson } from "@/lib/api/apiClient";

const fetchMock = vi.fn<typeof fetch>();

describe("postJson", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test");
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("sends JSON with credentials to the configured API", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await postJson("/api/auth/login", { email: "a@b.pl" });

    expect(fetchMock).toHaveBeenCalledWith("http://api.test/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ email: "a@b.pl" }),
    });
  });

  it("returns status and parsed body", async () => {
    fetchMock.mockResolvedValue(Response.json({ violations: [] }, { status: 422 }));

    expect(await postJson("/x", {})).toEqual({ kind: "response", status: 422, body: { violations: [] } });
  });

  it("returns null body for empty or non-JSON responses", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 200 }));
    fetchMock.mockResolvedValueOnce(new Response("<html>", { status: 500 }));

    expect(await postJson("/x", {})).toEqual({ kind: "response", status: 200, body: null });
    expect(await postJson("/x", {})).toEqual({ kind: "response", status: 500, body: null });
  });

  it("reports network errors instead of throwing", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    expect(await postJson("/x", {})).toEqual({ kind: "network-error" });
  });
});
