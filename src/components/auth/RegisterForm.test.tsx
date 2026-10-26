import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RegisterForm } from "@/components/auth/RegisterForm";

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/nazwa gracza/i), "FreakOne");
  await user.type(screen.getByLabelText(/adres e-mail/i), "a@b.pl");
  await user.type(screen.getByLabelText(/^hasło$/i), "sekret1");
  await user.type(screen.getByLabelText(/powtórz hasło/i), "sekret1");
  await user.click(screen.getByRole("checkbox"));
}

describe("RegisterForm", () => {
  it("shows validation error when required fields are missing", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(screen.getByRole("button", { name: /stwórz konto/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      /uzupełnij pola|hasła muszą być takie same|zaakceptuj regulamin/i,
    );
  });

  it("shows validation error when passwords do not match", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/nazwa gracza/i), "FreakOne");
    await user.type(screen.getByLabelText(/adres e-mail/i), "a@b.pl");
    await user.type(screen.getByLabelText(/^hasło$/i), "sekret1");
    await user.type(screen.getByLabelText(/powtórz hasło/i), "sekret2");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /stwórz konto/i }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("shows soon status for a valid registration attempt", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /stwórz konto/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/wróć wkrótce/i);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("links to login and legal pages", () => {
    render(<RegisterForm />);

    expect(screen.getByRole("link", { name: /zaloguj się/i })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(screen.getByRole("link", { name: /regulamin/i })).toHaveAttribute(
      "href",
      "/terms",
    );
    expect(
      screen.getByRole("link", { name: /politykę prywatności/i }),
    ).toHaveAttribute("href", "/privacy");
  });
});
