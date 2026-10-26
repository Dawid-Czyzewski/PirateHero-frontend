import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LoginForm } from "@/components/auth/LoginForm";

describe("LoginForm", () => {
  it("shows error when identifier is empty", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("Hasło"), "secret1");
    await user.click(screen.getByRole("button", { name: /wejdź do gry/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Podaj e-mail lub nick.",
    );
  });

  it("shows error when password is too short", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("E-mail lub nick"), "gracz");
    await user.type(screen.getByPlaceholderText("Hasło"), "123");
    await user.click(screen.getByRole("button", { name: /wejdź do gry/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Hasło musi mieć min. 6 znaków.",
    );
  });

  it("shows soon status for valid credentials", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("E-mail lub nick"), "gracz");
    await user.type(screen.getByPlaceholderText("Hasło"), "sekret1");
    await user.click(screen.getByRole("button", { name: /wejdź do gry/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/wróć wkrótce/i);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("clears error after user edits a field", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /wejdź do gry/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("E-mail lub nick"), "a");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
