import { AUTH_SPINNER, AUTH_SUBMIT, AUTH_SUBMIT_SKIN, AUTH_VIEW, type AuthView } from "@/components/auth/authStyles";

type SubmitButtonProps = {
  view: AuthView;
  skin: keyof typeof AUTH_SUBMIT_SKIN;
  loading: boolean;
  label: string;
  loadingLabel: string;
};

export function SubmitButton({ view, skin, loading, label, loadingLabel }: SubmitButtonProps) {
  return (
    <button
      className={`${AUTH_SUBMIT} ${AUTH_SUBMIT_SKIN[skin]} ${AUTH_VIEW[view].submit}`}
      type="submit"
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? <span className={AUTH_SPINNER} aria-hidden="true" /> : null}
      <span>{loading ? loadingLabel : label}</span>
    </button>
  );
}
