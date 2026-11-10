import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type CheckboxProps = {
  children: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children">;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, ...inputProps },
  ref,
) {
  return (
    <label className="check">
      <input {...inputProps} ref={ref} type="checkbox" />
      <span className="check__box" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8.5l3.2 3L13 4.5"
          />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
});
