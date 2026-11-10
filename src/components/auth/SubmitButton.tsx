type SubmitButtonProps = {
  variant: "btn-gold" | "btn-red";
  loading: boolean;
  label: string;
  loadingLabel: string;
};

export function SubmitButton({ variant, loading, label, loadingLabel }: SubmitButtonProps) {
  return (
    <button
      className={`auth__submit ${variant}${loading ? " is-loading" : ""}`}
      type="submit"
      disabled={loading}
      aria-busy={loading}
      data-loading={loadingLabel}
    >
      <span className="spin" aria-hidden="true" />
      <span className="label">{loading ? loadingLabel : label}</span>
    </button>
  );
}
