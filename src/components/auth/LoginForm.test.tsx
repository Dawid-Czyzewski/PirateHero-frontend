import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LoginForm } from "@/components/auth/LoginForm";

describe("LoginForm", () => {
  it("shows field errors and status when submit is invalid", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /zaloguj/i }));

    expect(screen.getByText(/podaj e-mail lub login/i)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      /popraw zaznaczone pola/i,
    );
  });

  it("requires at least 8 password characters", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/e-mail lub login/i), "gracz");
    await user.type(screen.getByLabelText(/^hasło$/i), "short");
    await user.click(screen.getByRole("button", { name: /zaloguj/i }));

    expect(
      screen.getByText(/hasło musi mieć co najmniej 8 znaków/i),
    ).toBeInTheDocument();
  });

  it("shows soon message after valid submit", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/e-mail lub login/i), "gracz");
    await user.type(screen.getByLabelText(/^hasło$/i), "sekret12");
    await user.click(screen.getByRole("button", { name: /zaloguj/i }));

    expect(screen.getByRole("button", { name: /logowanie/i })).toBeDisabled();
    await waitFor(
      () => {
        expect(screen.getByRole("status")).toHaveTextContent(/wróć wkrótce/i);
      },
      { timeout: 2500 },
    );
  });
});

