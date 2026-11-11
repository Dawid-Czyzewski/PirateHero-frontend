import { AuthLayout } from "@/components/auth/AuthLayout";
import { GuestOnly } from "@/components/auth/GuestOnly";
import { RegisterForm } from "@/components/auth/RegisterForm";

export function RegisterPageView() {
  return (
    <AuthLayout view="register">
      <GuestOnly>
        <RegisterForm />
      </GuestOnly>
    </AuthLayout>
  );
}
