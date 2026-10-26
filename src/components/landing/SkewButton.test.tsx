import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SkewButton } from "@/components/landing/SkewButton";

describe("SkewButton", () => {
  it("renders as a link when href is provided", () => {
    render(<SkewButton href="/login">Zaloguj</SkewButton>);

    const link = screen.getByRole("link", { name: /zaloguj/i });
    expect(link).toHaveAttribute("href", "/login");
  });

  it("renders as a submit button and handles clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <SkewButton type="submit" onClick={onClick}>
        Wyślij
      </SkewButton>,
    );

    const button = screen.getByRole("button", { name: /wyślij/i });
    expect(button).toHaveAttribute("type", "submit");

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
