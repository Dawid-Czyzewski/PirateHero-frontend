import { AuthLayout } from "@/components/auth/AuthLayout";
import { GuestOnly } from "@/components/auth/GuestOnly";
import { LoginForm } from "@/components/auth/LoginForm";

export function LoginPageView() {
  return (
    <AuthLayout view="login">
      <GuestOnly>
        <LoginForm />
      </GuestOnly>
    </AuthLayout>
  );
}
