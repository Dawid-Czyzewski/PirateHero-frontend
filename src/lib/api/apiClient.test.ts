import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getJson, postJson } from "@/lib/api/apiClient";
import { onSessionExpired } from "@/lib/api/sessionEvents";

const API = "http://api.test";
const REFRESH_URL = `${API}/api/auth/refresh`;

type Reply = Response | Error;

const fetchMock = vi.fn<typeof fetch>();
const expired = vi.fn();
let unsubscribe: () => void;

function urlOf(input: Parameters<typeof fetch>[0]): string {
  return typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
}

function status(code: number): Response {
  return new Response(null, { status: code });
}

function serve(routes: Record<string, Reply[]>) {
  fetchMock.mockImplementation(async (input) => {
    const reply = routes[urlOf(input)]?.shift();
    if (!reply) throw new Error(`Unexpected request to ${urlOf(input)}`);
    if (reply instanceof Error) throw reply;
    return reply;
  });
}

function callsTo(url: string): number {
  return fetchMock.mock.calls.filter(([input]) => urlOf(input) === url).length;
}

describe("apiClient session refresh", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", API);
    vi.stubGlobal("fetch", fetchMock);
    unsubscribe = onSessionExpired(expired);
  });

  afterEach(() => {
    unsubscribe();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
    expired.mockReset();
  });

  it("returns non-401 responses untouched", async () => {
    serve({ [`${API}/api/me`]: [Response.json({ nick: "Cebulak" })] });

    expect(await getJson("/api/me")).toEqual({ kind: "response", status: 200, body: { nick: "Cebulak" } });
    expect(callsTo(REFRESH_URL)).toBe(0);
  });

  it("refreshes once and retries the original request after 401", async () => {
    serve({
      [`${API}/api/characters`]: [status(401), status(201)],
      [REFRESH_URL]: [status(200)],
    });

    const result = await postJson("/api/characters", { face: 1 });

    expect(result).toMatchObject({ kind: "response", status: 201 });
    expect(callsTo(REFRESH_URL)).toBe(1);
    expect(fetchMock.mock.calls[2]?.[1]?.body).toBe(JSON.stringify({ face: 1 }));
    expect(expired).not.toHaveBeenCalled();
  });

  it("does not refresh again when the retry is still unauthorized", async () => {
    serve({
      [`${API}/api/me`]: [status(401), status(401)],
      [REFRESH_URL]: [status(200)],
    });

    expect(await getJson("/api/me")).toMatchObject({ kind: "response", status: 401 });
    expect(callsTo(REFRESH_URL)).toBe(1);
    expect(callsTo(`${API}/api/me`)).toBe(2);
  });

  it("shares one refresh between parallel unauthorized requests", async () => {
    serve({
      [`${API}/api/me`]: [status(401), status(401), status(401), status(200), status(200), status(200)],
      [REFRESH_URL]: [status(200)],
    });

    const results = await Promise.all([getJson("/api/me"), getJson("/api/me"), getJson("/api/me")]);

    expect(results.map((result) => result.kind === "response" && result.status)).toEqual([200, 200, 200]);
    expect(callsTo(REFRESH_URL)).toBe(1);
  });

  it("announces an expired session once when refresh fails", async () => {
    serve({
      [`${API}/api/me`]: [status(401), status(401)],
      [REFRESH_URL]: [status(401)],
    });

    const results = await Promise.all([getJson("/api/me"), getJson("/api/me")]);

    expect(results).toEqual([
      { kind: "response", status: 401, body: null },
      { kind: "response", status: 401, body: null },
    ]);
    expect(callsTo(REFRESH_URL)).toBe(1);
    expect(expired).toHaveBeenCalledTimes(1);
  });

  it("keeps the session when refresh hits a network error", async () => {
    serve({
      [`${API}/api/me`]: [status(401)],
      [REFRESH_URL]: [new TypeError("Failed to fetch")],
    });

    expect(await getJson("/api/me")).toEqual({ kind: "network-error" });
    expect(expired).not.toHaveBeenCalled();
  });

  it("starts a new refresh for a later 401", async () => {
    serve({
      [`${API}/api/me`]: [status(401), status(200), status(401), status(200)],
      [REFRESH_URL]: [status(200), status(200)],
    });

    await getJson("/api/me");
    await getJson("/api/me");

    expect(callsTo(REFRESH_URL)).toBe(2);
  });

  it.each(["/api/auth/login", "/api/auth/register", "/api/auth/logout"])(
    "never refreshes for auth endpoint %s",
    async (path) => {
      serve({ [`${API}${path}`]: [status(401)] });

      expect(await postJson(path, {})).toMatchObject({ kind: "response", status: 401 });
      expect(callsTo(REFRESH_URL)).toBe(0);
    },
  );
});
