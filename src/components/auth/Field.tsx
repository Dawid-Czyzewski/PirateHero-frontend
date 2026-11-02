"use client";

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { EyeOff, EyeOn } from "@/components/auth/fieldIcons";

type FieldProps = {
  label: string;
  name: string;
  error?: string;
  icon?: ReactNode;
  showPasswordToggle?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "className">;

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  {
    label,
    name,
    error = "",
    icon,
    showPasswordToggle = false,
    type = "text",
    id,
    ...inputProps
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? name ?? `${name}-${autoId}`;
  const errorId = `${inputId}-err`;
  const [visible, setVisible] = useState(false);
  const inputType =
    showPasswordToggle && type === "password"
      ? visible
        ? "text"
        : "password"
      : type;

  const stateClass = error
    ? "is-invalid"
    : inputProps.value && String(inputProps.value).length > 0
      ? "is-valid"
      : "";

  const inputClass = [
    "field__input",
    icon ? "has-icon" : "",
    showPasswordToggle ? "has-eye" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`field ${stateClass}`.trim()} data-field={name}>
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="field__wrap">
        {icon}
        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          name={name}
          type={inputType}
          className={inputClass}
          aria-invalid={error ? true : false}
          aria-describedby={errorId}
        />
        {showPasswordToggle ? (
          <button
            type="button"
            className="eye"
            aria-pressed={visible}
            aria-label={visible ? "Ukryj hasło" : "Pokaż hasło"}
            data-toggle={name}
            onClick={() => setVisible((v) => !v)}
          >
            <EyeOn />
            <EyeOff />
          </button>
        ) : null}
      </div>
      <p className="field__error" id={errorId} aria-live="polite">
        {error}
      </p>
    </div>
  );
});
