"use client";

import { useState } from "react";
import { AUTH_ROUTES } from "@/modules/auth/authRoutes";
import { login } from "@/modules/auth/authService";
import { useAuthForm } from "@/modules/auth/hooks/useAuthForm";
import { rememberEmail } from "@/modules/auth/rememberedEmail";
import { LOGIN_FIELDS, validateLoginField, type LoginFields } from "@/modules/auth/validation";

function submitLogin(values: LoginFields) {
  return login({ email: values.email.trim(), password: values.password });
}

export function useLoginForm(rememberedEmail: string | null) {
  const [remember, setRemember] = useState(rememberedEmail !== null);
  const form = useAuthForm({
    initialValues: { email: rememberedEmail ?? "", password: "" },
    fields: LOGIN_FIELDS,
    validateField: validateLoginField,
    submit: submitLogin,
    successRoute: AUTH_ROUTES.afterLogin,
    onSuccess: (values) => rememberEmail(remember ? values.email.trim() : null),
  });

  return { ...form, remember, setRemember };
}
