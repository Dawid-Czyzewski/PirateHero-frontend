import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/auth/LoginForm";
import { login } from "@/modules/auth/authService";
import { resolvePlayerHome } from "@/modules/character/playerHome";

const push = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/modules/auth/authService", () => ({ login: vi.fn() }));
vi.mock("@/modules/character/playerHome", () => ({ resolvePlayerHome: vi.fn() }));

const loginMock = vi.mocked(login);
const homeMock = vi.mocked(resolvePlayerHome);

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup();
  render(<LoginForm />);
  await user.type(screen.getByLabelText(/^e-mail$/i), email);
  await user.type(screen.getByLabelText(/^hasło$/i), password);
  await user.click(screen.getByRole("button", { name: /zaloguj/i }));
  return user;
}

describe("LoginForm", () => {
  afterEach(() => {
    loginMock.mockReset();
    homeMock.mockReset();
    push.mockReset();
    localStorage.clear();
  });

  it("shows field errors and status when submit is invalid", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /zaloguj/i }));

    expect(screen.getByText(/podaj adres e-mail/i)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/popraw zaznaczone pola/i);
    expect(screen.getByLabelText(/^e-mail$/i)).toHaveFocus();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("requires at least 8 password characters", async () => {
    await fillAndSubmit("gracz@example.com", "short");

    expect(screen.getByText(/hasło musi mieć co najmniej 8 znaków/i)).toBeInTheDocument();
  });

  it("logs in and sends a player without a character to the creator", async () => {
    loginMock.mockResolvedValue({ kind: "success" });
    homeMock.mockResolvedValue("/create-character");

    await fillAndSubmit(" gracz@example.com ", "sekret12");

    expect(loginMock).toHaveBeenCalledWith({ email: "gracz@example.com", password: "sekret12" });
    await waitFor(() => expect(push).toHaveBeenCalledWith("/create-character"));
  });

  it("sends a player with a character to the profile", async () => {
    loginMock.mockResolvedValue({ kind: "success" });
    homeMock.mockResolvedValue("/postac");

    await fillAndSubmit("gracz@example.com", "sekret12");

    await waitFor(() => expect(push).toHaveBeenCalledWith("/postac"));
  });

  it("shows a Polish message for wrong credentials", async () => {
    loginMock.mockResolvedValue({ kind: "failure", reason: "bad-credentials" });

    await fillAndSubmit("gracz@example.com", "zlehaslo1");

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/nieprawidłowy e-mail lub hasło/i),
    );
    expect(screen.getByRole("button", { name: /zaloguj/i })).toBeEnabled();
    expect(push).not.toHaveBeenCalled();
  });

  it("remembers the email only when asked", async () => {
    loginMock.mockResolvedValue({ kind: "success" });
    homeMock.mockResolvedValue("/postac");
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/^e-mail$/i), "gracz@example.com");
    await user.type(screen.getByLabelText(/^hasło$/i), "sekret12");
    await user.click(screen.getByRole("checkbox", { name: /zapamiętaj mnie/i }));
    await user.click(screen.getByRole("button", { name: /zaloguj/i }));

    await waitFor(() => expect(localStorage.getItem("fl_email")).toBe("gracz@example.com"));
  });

  it("prefills a remembered email", () => {
    localStorage.setItem("fl_email", "zapamietany@example.com");

    render(<LoginForm />);

    expect(screen.getByLabelText(/^e-mail$/i)).toHaveValue("zapamietany@example.com");
    expect(screen.getByRole("checkbox", { name: /zapamiętaj mnie/i })).toBeChecked();
  });
});
