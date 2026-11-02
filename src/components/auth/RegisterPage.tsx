import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export function RegisterPageView() {
  return (
    <AuthLayout
      view="register"
      switchDesktop={
        <>
          <p>
            <span>Masz już konto?</span>
          </p>
          <p>
            <Link href="/login">Zaloguj się</Link>
          </p>
        </>
      }
      switchMobile={
        <p>
          <span>Masz już konto?</span>
          <span className="gap"> </span>
          <Link href="/login">Zaloguj się</Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
