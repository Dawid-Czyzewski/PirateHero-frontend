import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NpcCard } from "@/components/combat/NpcCard";
import { KOSA } from "@/modules/combat/__fixtures__/combat";

describe("NpcCard", () => {
  it("starts a fight with the opponent", async () => {
    const onFight = vi.fn();
    render(<NpcCard npc={KOSA} hard={false} blockedHint={null} onFight={onFight} />);

    await userEvent.click(screen.getByRole("button", { name: "Walcz: Kosa" }));

    expect(onFight).toHaveBeenCalledWith(KOSA);
  });

  it("locks the fight without enough stamina and says when it will be possible", () => {
    render(<NpcCard npc={KOSA} hard={false} blockedHint="Wystarczy Kondychy za 2:14" onFight={vi.fn()} />);

    const button = screen.getByRole("button", { name: "Walcz: Kosa" });
    expect(button).toBeDisabled();
    expect(button).toHaveAccessibleDescription("Wystarczy Kondychy za 2:14");
  });
});
