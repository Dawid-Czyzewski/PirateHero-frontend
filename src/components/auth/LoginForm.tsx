"use client";

import Link from "next/link";
import { AUTH_FORM, AUTH_ROW, AUTH_SMALL_LINK, AUTH_VIEW } from "@/components/auth/authStyles";
import { Checkbox } from "@/components/auth/Checkbox";
import { Field } from "@/components/auth/Field";
import { IconLock, IconMail } from "@/components/auth/fieldIcons";
import { FormStatusLine } from "@/components/auth/FormStatusLine";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { useLoginForm } from "@/modules/auth/hooks/useLoginForm";
import { useRememberedEmail } from "@/modules/auth/rememberedEmail";
import { PASSWORD_MIN_LENGTH } from "@/modules/auth/validation";

const VIEW = AUTH_VIEW.login;

export function LoginForm() {
  const rememberedEmail = useRememberedEmail();
  return <LoginFormView key={rememberedEmail ?? ""} rememberedEmail={rememberedEmail} />;
}

function LoginFormView({ rememberedEmail }: { rememberedEmail: string | null }) {
  const form = useLoginForm(rememberedEmail);

  return (
    <form id="loginForm" className={`${AUTH_FORM} ${VIEW.form}`} onSubmit={form.onSubmit} noValidate>
      <Field
        {...form.textField("email")}
        view="login"
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
        view="login"
        className={VIEW.fieldGap}
        label="Hasło"
        type="password"
        showPasswordToggle
        icon={<IconLock />}
        autoComplete="current-password"
        placeholder="Hasło"
        required
        minLength={PASSWORD_MIN_LENGTH}
      />

      <div className={`${AUTH_ROW} ${VIEW.row}`}>
        <Checkbox
          view="login"
          id="remember"
          name="remember"
          checked={form.remember}
          onChange={(event) => form.setRemember(event.target.checked)}
        >
          Zapamiętaj mnie
        </Checkbox>
        <Link className={`${AUTH_SMALL_LINK} ${VIEW.smallLink}`} href="#reset">
          Nie pamiętasz hasła?
        </Link>
      </div>

      <SubmitButton view="login" skin="gold" loading={form.loading} label="ZALOGUJ" loadingLabel="LOGOWANIE…" />
      <FormStatusLine status={form.status} />
      <div className="hidden h-px w-full flex-none bg-white/13 desk:mt-21 desk:block" aria-hidden="true" />
    </form>
  );
}
