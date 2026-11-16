import Link from "next/link";
import { CHARACTER_ROUTES } from "@/modules/character/characterRoutes";
import type { CreationStatus, StatusAction } from "@/modules/character/hooks/useCharacterCreation";

type CreationStatusLineProps = {
  status: CreationStatus;
  onRetry: () => void;
};

const STATUS_COLOR: Record<CreationStatus["kind"], string> = {
  idle: "",
  ok: "text-ok",
  err: "text-[#ff6b5e]",
};

const ACTION = "font-cond font-bold tracking-[.04em] text-white uppercase underline decoration-blood decoration-2 underline-offset-4 hover:text-blood";

function StatusActionControl({ action, onRetry }: { action: StatusAction; onRetry: () => void }) {
  if (action === "open-profile") {
    return (
      <Link className={ACTION} href={CHARACTER_ROUTES.profile}>
        Przejdź do postaci
      </Link>
    );
  }
  return (
    <button type="button" className={ACTION} onClick={onRetry}>
      Spróbuj ponownie
    </button>
  );
}

export function CreationStatusLine({ status, onRetry }: CreationStatusLineProps) {
  return (
    <div
      className={`m-0 flex flex-wrap empty:min-h-0 not-empty:min-h-6 items-center justify-center gap-x-3 gap-y-1 text-center font-semi text-base font-medium ${STATUS_COLOR[status.kind]}`}
      role="status"
      aria-live="polite"
    >
      {status.kind === "idle" ? null : (
        <>
          <span>{status.text}</span>
          {status.action ? <StatusActionControl action={status.action} onRetry={onRetry} /> : null}
        </>
      )}
    </div>
  );
}
