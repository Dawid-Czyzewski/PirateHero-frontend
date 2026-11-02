import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RegisterForm } from "@/components/auth/RegisterForm";

describe("RegisterForm", () => {
  it("shows validation summary when fields are empty", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(screen.getByRole("button", { name: /załóż konto/i }));

    expect(screen.getByRole("status")).toHaveTextContent(
      /popraw zaznaczone pola/i,
    );
    expect(screen.getByText(/podaj nick zawodnika/i)).toBeInTheDocument();
  });

  it("requires matching passwords and terms", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/nick zawodnika/i), "FreakOne");
    await user.type(screen.getByLabelText(/^e-mail$/i), "a@b.pl");
    await user.type(screen.getByLabelText(/^hasło$/i), "sekret12");
    await user.type(screen.getByLabelText(/powtórz hasło/i), "sekret99");
    await user.click(screen.getByRole("button", { name: /załóż konto/i }));

    expect(screen.getByText(/hasła nie są takie same/i)).toBeInTheDocument();
    expect(screen.getByText(/zaakceptować regulamin/i)).toBeInTheDocument();
  });

  it("shows soon message after valid submit", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/nick zawodnika/i), "FreakOne");
    await user.type(screen.getByLabelText(/^e-mail$/i), "a@b.pl");
    await user.type(screen.getByLabelText(/^hasło$/i), "sekret12");
    await user.type(screen.getByLabelText(/powtórz hasło/i), "sekret12");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /załóż konto/i }));

    await waitFor(
      () => {
        expect(screen.getByRole("status")).toHaveTextContent(/wróć wkrótce/i);
      },
      { timeout: 2500 },
    );
  });

  it("links to terms page", () => {
    render(<RegisterForm />);

    const link = screen.getByRole("link", { name: /^regulamin$/i });
    expect(link).toHaveAttribute("href", "/terms");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
