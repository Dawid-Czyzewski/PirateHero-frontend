import type { FormStatus } from "@/modules/auth/hooks/useAuthForm";

const STATUS_CLASS: Record<FormStatus["kind"], string> = {
  idle: "",
  ok: " is-ok",
  err: " is-err",
};

export function FormStatusLine({ status }: { status: FormStatus }) {
  return (
    <p className={`auth__status${STATUS_CLASS[status.kind]}`} role="status" aria-live="polite">
      {status.kind === "idle" ? "" : status.text}
    </p>
  );
}
