"use client";

import { registerAndLogin } from "@/modules/auth/authService";
import { useAuthForm } from "@/modules/auth/hooks/useAuthForm";
import {
  REGISTER_FIELDS,
  validateRegisterField,
  type RegisterFields,
} from "@/modules/auth/validation";
import { CHARACTER_ROUTES } from "@/modules/character/characterRoutes";

const INITIAL_VALUES: RegisterFields = {
  nick: "",
  email: "",
  password: "",
  password2: "",
  terms: false,
};

async function characterCreator(): Promise<string> {
  return CHARACTER_ROUTES.create;
}

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
    nextRoute: characterCreator,
  });
}
