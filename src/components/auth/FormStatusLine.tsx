import { AUTH_STATUS } from "@/components/auth/authStyles";
import type { FormStatus } from "@/modules/auth/hooks/useAuthForm";

const STATUS_COLOR: Record<FormStatus["kind"], string> = {
  idle: "",
  ok: "text-ok",
  err: "text-[#ff6b5e]",
};

export function FormStatusLine({ status }: { status: FormStatus }) {
  return (
    <p className={`${AUTH_STATUS} ${STATUS_COLOR[status.kind]}`} role="status" aria-live="polite">
      {status.kind === "idle" ? "" : status.text}
    </p>
  );
}
