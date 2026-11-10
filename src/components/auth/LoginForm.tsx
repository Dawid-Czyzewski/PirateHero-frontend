"use client";

import Link from "next/link";
import { Checkbox } from "@/components/auth/Checkbox";
import { Field } from "@/components/auth/Field";
import { IconLock, IconMail } from "@/components/auth/fieldIcons";
import { FormStatusLine } from "@/components/auth/FormStatusLine";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { useLoginForm } from "@/modules/auth/hooks/useLoginForm";
import { useRememberedEmail } from "@/modules/auth/rememberedEmail";
import { PASSWORD_MIN_LENGTH } from "@/modules/auth/validation";

export function LoginForm() {
  const rememberedEmail = useRememberedEmail();
  return <LoginFormView key={rememberedEmail ?? ""} rememberedEmail={rememberedEmail} />;
}

function LoginFormView({ rememberedEmail }: { rememberedEmail: string | null }) {
  const form = useLoginForm(rememberedEmail);

  return (
    <form id="loginForm" className="auth__form" onSubmit={form.onSubmit} noValidate>
      <Field
        {...form.textField("email")}
        label="E-mail"
        type="email"
        icon={<IconMail />}
        inputMode="email"
        autoComplete="username"
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
        icon={<IconLock />}
        autoComplete="current-password"
        placeholder="Hasło"
        required
        minLength={PASSWORD_MIN_LENGTH}
      />

      <div className="auth__row">
        <Checkbox
          id="remember"
          name="remember"
          checked={form.remember}
          onChange={(event) => form.setRemember(event.target.checked)}
        >
          Zapamiętaj mnie
        </Checkbox>
        <Link className="small-link" href="#reset">
          Nie pamiętasz hasła?
        </Link>
      </div>

      <SubmitButton variant="btn-gold" loading={form.loading} label="ZALOGUJ" loadingLabel="LOGOWANIE…" />
      <FormStatusLine status={form.status} />
      <div className="auth__divider" aria-hidden="true" />
    </form>
  );
}
