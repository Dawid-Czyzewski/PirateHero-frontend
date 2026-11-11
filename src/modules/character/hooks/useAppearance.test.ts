import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DEFAULT_APPEARANCE } from "@/modules/character/appearance";
import { useAppearance } from "@/modules/character/hooks/useAppearance";

describe("useAppearance", () => {
  it("starts with default appearance and the first part active", () => {
    const { result } = renderHook(() => useAppearance());

    expect(result.current.appearance).toEqual(DEFAULT_APPEARANCE);
    expect(result.current.activePart).toBe("face");
  });

  it("steps, chooses and switches parts", () => {
    const { result } = renderHook(() => useAppearance());

    act(() => result.current.step("hair", -1));
    act(() => result.current.choose("skin", 3));
    act(() => result.current.selectPart("tattoo"));

    expect(result.current.appearance).toEqual({ ...DEFAULT_APPEARANCE, hair: 7, skin: 3 });
    expect(result.current.activePart).toBe("tattoo");
  });

  it("randomizes with the injected generator", () => {
    const { result } = renderHook(() => useAppearance(() => 2));

    act(() => result.current.randomize());

    expect(result.current.appearance).toEqual({ face: 2, hair: 2, beard: 2, skin: 2, tattoo: 2 });
  });
});
