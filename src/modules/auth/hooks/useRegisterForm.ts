"use client";

import { AUTH_ROUTES } from "@/modules/auth/authRoutes";
import { registerAndLogin } from "@/modules/auth/authService";
import { useAuthForm } from "@/modules/auth/hooks/useAuthForm";
import {
  REGISTER_FIELDS,
  validateRegisterField,
  type RegisterFields,
} from "@/modules/auth/validation";

const INITIAL_VALUES: RegisterFields = {
  nick: "",
  email: "",
  password: "",
  password2: "",
  terms: false,
};

function submitRegistration(values: RegisterFields) {
  return registerAndLogin({
    nick: values.nick.trim(),
    email: values.email.trim(),
    password: values.password,
  });
}

export function useRegisterForm() {
  return useAuthForm({
    initialValues: INITIAL_VALUES,
    fields: REGISTER_FIELDS,
    validateField: validateRegisterField,
    dependentFields: { password: "password2" },
    submit: submitRegistration,
    successRoute: AUTH_ROUTES.afterRegister,
  });
}
