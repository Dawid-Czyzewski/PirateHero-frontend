import type { CreationStatus } from "@/modules/character/hooks/useCharacterCreation";

const STATUS_COLOR: Record<CreationStatus["kind"], string> = {
  idle: "",
  ok: "text-ok",
  err: "text-[#ff6b5e]",
};

export function CreationStatusLine({ status }: { status: CreationStatus }) {
  return (
    <p className={`m-0 min-h-6 text-center text-base ${STATUS_COLOR[status.kind]}`} role="status" aria-live="polite">
      {status.kind === "idle" ? "" : status.text}
    </p>
  );
}
