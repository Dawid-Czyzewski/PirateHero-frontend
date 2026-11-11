"use client";

import Link from "next/link";
import { AUTH_FORM, AUTH_ROW, AUTH_ROW_ERROR, AUTH_VIEW } from "@/components/auth/authStyles";
import { Checkbox } from "@/components/auth/Checkbox";
import { Field } from "@/components/auth/Field";
import { FormStatusLine } from "@/components/auth/FormStatusLine";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { useRegisterForm } from "@/modules/auth/hooks/useRegisterForm";
import { NICK_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/modules/auth/validation";

const VIEW = AUTH_VIEW.register;

export function RegisterForm() {
  const form = useRegisterForm();
  const termsError = form.errors.terms;

  return (
    <form id="registerForm" className={`${AUTH_FORM} ${VIEW.form}`} onSubmit={form.onSubmit} noValidate>
      <Field
        {...form.textField("nick")}
        view="register"
        label="Nick zawodnika"
        autoComplete="username"
        placeholder="Nick zawodnika"
        required
        maxLength={NICK_MAX_LENGTH}
      />

      <Field
        {...form.textField("email")}
        view="register"
        className={VIEW.fieldGap}
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
        view="register"
        className={VIEW.fieldGap}
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
        view="register"
        className={VIEW.fieldGap}
        label="Powtórz hasło"
        type="password"
        showPasswordToggle
        autoComplete="new-password"
        placeholder="Powtórz hasło"
        required
        minLength={PASSWORD_MIN_LENGTH}
      />

      <div className={`relative ${AUTH_ROW} ${VIEW.row}`} data-field="terms">
        <Checkbox
          view="register"
          invalid={Boolean(termsError)}
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
        <p className={`${AUTH_ROW_ERROR} ${VIEW.rowError}`} id="terms-err" aria-live="polite">
          {termsError ?? ""}
        </p>
      </div>

      <SubmitButton view="register" skin="red" loading={form.loading} label="ZAŁÓŻ KONTO" loadingLabel="TWORZENIE…" />
      <FormStatusLine status={form.status} />
    </form>
  );
}
