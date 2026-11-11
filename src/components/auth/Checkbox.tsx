import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { AUTH_CHECK, AUTH_CHECK_BOX, AUTH_VIEW, type AuthView } from "@/components/auth/authStyles";

type CheckboxProps = {
  view: AuthView;
  invalid?: boolean;
  children: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children" | "className">;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { view, invalid = false, children, ...inputProps },
  ref,
) {
  const styles = AUTH_VIEW[view];

  return (
    <label className={`${AUTH_CHECK} ${styles.check}`}>
      <input {...inputProps} ref={ref} type="checkbox" className="peer absolute m-0 h-px w-px opacity-0" />
      <span className={`${AUTH_CHECK_BOX} ${styles.checkBox}${invalid ? " border-fire" : ""}`} aria-hidden="true">
        <svg className="h-[72%] w-[72%] text-[#1b1206] opacity-0" viewBox="0 0 16 16">
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
