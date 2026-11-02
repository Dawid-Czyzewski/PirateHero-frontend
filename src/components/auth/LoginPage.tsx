import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export function LoginPageView() {
  return (
    <AuthLayout
      view="login"
      switchDesktop={
        <p>
          <span>Nie masz konta?</span>
          <span className="gap"> </span>
          <Link href="/register">Załóż konto</Link>
        </p>
      }
      switchMobile={
        <>
          <p>
            <span>Nie masz konta?</span>
          </p>
          <p>
            <Link href="/register">Załóż konto</Link>
          </p>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
