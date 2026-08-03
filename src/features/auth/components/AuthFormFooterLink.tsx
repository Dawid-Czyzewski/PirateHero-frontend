type AuthFormFooterLinkProps = {
  isLogin: boolean;
  onToggleMode: () => void;
  promptWhenLogin: string;
  promptWhenRegister: string;
  linkLabelWhenLogin: string;
  linkLabelWhenRegister: string;
};

export function AuthFormFooterLink({
  isLogin,
  onToggleMode,
  promptWhenLogin,
  promptWhenRegister,
  linkLabelWhenLogin,
  linkLabelWhenRegister,
}: AuthFormFooterLinkProps) {
  return (
    <p className="text-center text-xs text-muted-foreground">
      <span>{isLogin ? promptWhenLogin : promptWhenRegister}</span>{' '}
      <button
        type="button"
        onClick={onToggleMode}
        className="text-primary hover:underline font-medium cursor-pointer"
      >
        {isLogin ? linkLabelWhenLogin : linkLabelWhenRegister}
      </button>
    </p>
  );
}
