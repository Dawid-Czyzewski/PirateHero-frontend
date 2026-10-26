import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { RegisterHeadline } from "@/components/auth/RegisterHeadline";

export function RegisterPageView() {
  return (
    <AuthShell>
      <header className="mb-8 sm:mb-10">
        <h1 id="register-heading" className="sr-only">
          Zarejestruj się w Freak Legends
        </h1>
        <RegisterHeadline />
      </header>
      <RegisterForm />
    </AuthShell>
  );
}
