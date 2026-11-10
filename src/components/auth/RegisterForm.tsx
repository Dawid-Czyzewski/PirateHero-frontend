"use client";

import Link from "next/link";
import { Checkbox } from "@/components/auth/Checkbox";
import { Field } from "@/components/auth/Field";
import { FormStatusLine } from "@/components/auth/FormStatusLine";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { useRegisterForm } from "@/modules/auth/hooks/useRegisterForm";
import { NICK_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/modules/auth/validation";

export function RegisterForm() {
  const form = useRegisterForm();
  const termsError = form.errors.terms;

  return (
    <form id="registerForm" className="auth__form" onSubmit={form.onSubmit} noValidate>
      <Field
        {...form.textField("nick")}
        label="Nick zawodnika"
        autoComplete="username"
        placeholder="Nick zawodnika"
        required
        maxLength={NICK_MAX_LENGTH}
      />

      <Field
        {...form.textField("email")}
        label="E-mail"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="E-mail"
        required
      />

      <Field
        {...form.textField("password")}
        label="Hasło"
        type="password"
        showPasswordToggle
        autoComplete="new-password"
        placeholder="Hasło"
        required
        minLength={PASSWORD_MIN_LENGTH}
      />

      <Field
        {...form.textField("password2")}
        label="Powtórz hasło"
        type="password"
        showPasswordToggle
        autoComplete="new-password"
        placeholder="Powtórz hasło"
        required
        minLength={PASSWORD_MIN_LENGTH}
      />

      <div className={`auth__row field${termsError ? " is-invalid" : ""}`} data-field="terms">
        <Checkbox
          ref={form.fieldRef("terms")}
          id="terms"
          name="terms"
          checked={form.values.terms}
          onChange={(event) => form.setValue("terms", event.target.checked)}
          required
          aria-invalid={Boolean(termsError)}
          aria-describedby="terms-err"
        >
          Akceptuję{" "}
          <Link href="/terms" target="_blank" rel="noopener">
            regulamin
          </Link>
        </Checkbox>
        <p className="field__error" id="terms-err" aria-live="polite">
          {termsError ?? ""}
        </p>
      </div>

      <SubmitButton variant="btn-red" loading={form.loading} label="ZAŁÓŻ KONTO" loadingLabel="TWORZENIE…" />
      <FormStatusLine status={form.status} />
    </form>
  );
}
