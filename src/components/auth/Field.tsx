"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import {
  AUTH_EYE,
  AUTH_FIELD_ERROR,
  AUTH_FIELD_LABEL,
  AUTH_INPUT,
  AUTH_VIEW,
  type AuthView,
} from "@/components/auth/authStyles";
import { EyeOff, EyeOn } from "@/components/auth/fieldIcons";

type FieldProps = {
  view: AuthView;
  label: string;
  name: string;
  error?: string;
  icon?: ReactNode;
  showPasswordToggle?: boolean;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "className">;

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { view, label, name, error = "", icon, showPasswordToggle = false, type = "text", id, className = "", ...inputProps },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? name ?? `${name}-${autoId}`;
  const errorId = `${inputId}-err`;
  const [visible, setVisible] = useState(false);
  const styles = AUTH_VIEW[view];
  const inputType = showPasswordToggle && type === "password" && visible ? "text" : type;
  const filled = inputProps.value !== undefined && String(inputProps.value).length > 0;

  return (
    <div className={`relative block ${className}`} data-field={name}>
      <label className={`${AUTH_FIELD_LABEL} ${styles.label}`} htmlFor={inputId}>
        {label}
      </label>
      <div className="relative">
        {icon}
        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          name={name}
          type={inputType}
          className={`${AUTH_INPUT} ${styles.input} ${showPasswordToggle ? styles.inputWithEye : ""}`}
          data-state={!error && filled ? "valid" : undefined}
          aria-invalid={error ? true : false}
          aria-describedby={errorId}
        />
        {showPasswordToggle ? (
          <button
            type="button"
            className={`${AUTH_EYE} ${styles.eye}`}
            aria-pressed={visible}
            aria-label={visible ? "Ukryj hasło" : "Pokaż hasło"}
            data-toggle={name}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff /> : <EyeOn />}
          </button>
        ) : null}
      </div>
      <p className={`${AUTH_FIELD_ERROR} ${styles.error}`} id={errorId} aria-live="polite">
        {error}
      </p>
    </div>
  );
});
