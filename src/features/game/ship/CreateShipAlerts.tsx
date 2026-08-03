type Props = {
  errorMessage: string | null;
  successMessage: string | null;
};

export function CreateShipAlerts({ errorMessage, successMessage }: Props) {
  return (
    <>
      {errorMessage ? (
        <div
          className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}
      {successMessage ? (
        <div
          className="mb-4 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2.5 text-sm text-primary"
          role="status"
        >
          {successMessage}
        </div>
      ) : null}
    </>
  );
}
