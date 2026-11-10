import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { registerAndLogin } from "@/modules/auth/authService";

const push = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/modules/auth/authService", () => ({ registerAndLogin: vi.fn() }));

const registerMock = vi.mocked(registerAndLogin);

async function fillValidForm() {
  const user = userEvent.setup();
  render(<RegisterForm />);
  await user.type(screen.getByLabelText(/nick zawodnika/i), "FreakOne");
  await user.type(screen.getByLabelText(/^e-mail$/i), "a@b.pl");
  await user.type(screen.getByLabelText(/^hasło$/i), "sekret12");
  await user.type(screen.getByLabelText(/powtórz hasło/i), "sekret12");
  await user.click(screen.getByRole("checkbox"));
  return user;
}

describe("RegisterForm", () => {
  afterEach(() => {
    registerMock.mockReset();
    push.mockReset();
  });

  it("shows validation summary when fields are empty", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(screen.getByRole("button", { name: /załóż konto/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/popraw zaznaczone pola/i);
    expect(screen.getByText(/podaj nick zawodnika/i)).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
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

  it("registers and redirects to character creation", async () => {
    registerMock.mockResolvedValue({ kind: "success" });
    const user = await fillValidForm();

    await user.click(screen.getByRole("button", { name: /załóż konto/i }));

    expect(registerMock).toHaveBeenCalledWith({ nick: "FreakOne", email: "a@b.pl", password: "sekret12" });
    await waitFor(() => expect(push).toHaveBeenCalledWith("/create-character"));
  });

  it("shows server field errors next to fields and focuses the first one", async () => {
    registerMock.mockResolvedValue({
      kind: "invalid",
      errors: { email: "Ten e-mail jest już zajęty.", nick: "Ten nick jest już zajęty." },
    });
    const user = await fillValidForm();

    await user.click(screen.getByRole("button", { name: /załóż konto/i }));

    expect(await screen.findByText("Ten e-mail jest już zajęty.")).toBeInTheDocument();
    expect(screen.getByText("Ten nick jest już zajęty.")).toBeInTheDocument();
    expect(screen.getByLabelText(/nick zawodnika/i)).toHaveFocus();
    expect(push).not.toHaveBeenCalled();
  });

  it("shows a Polish message when the server is unreachable", async () => {
    registerMock.mockResolvedValue({ kind: "failure", reason: "network" });
    const user = await fillValidForm();

    await user.click(screen.getByRole("button", { name: /załóż konto/i }));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/brak połączenia z serwerem gry/i),
    );
  });

  it("links to terms page", () => {
    render(<RegisterForm />);

    const link = screen.getByRole("link", { name: /^regulamin$/i });
    expect(link).toHaveAttribute("href", "/terms");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
