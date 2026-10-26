import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { TopicSelect } from "@/components/legal/TopicSelect";

function Harness({ initial = "" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return <TopicSelect value={value} onChange={setValue} />;
}

describe("TopicSelect", () => {
  it("opens the listbox and selects a topic", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const trigger = screen.getByRole("button", { name: /wybierz temat/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: /konto \/ logowanie/i }));

    expect(screen.getByRole("button", { name: /konto \/ logowanie/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByDisplayValue("konto")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: /wybierz temat/i }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
