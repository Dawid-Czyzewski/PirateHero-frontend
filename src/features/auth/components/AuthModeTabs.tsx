type AuthModeTabsProps = {
  isLogin: boolean;
  onSelectLogin: () => void;
  onSelectRegister: () => void;
  loginLabel: string;
  registerLabel: string;
};

export function AuthModeTabs({
  isLogin,
  onSelectLogin,
  onSelectRegister,
  loginLabel,
  registerLabel,
}: AuthModeTabsProps) {
  const tabBase =
    'flex-1 py-2 text-sm font-display font-semibold rounded-md transition-colors cursor-pointer';

  return (
    <div className="flex rounded-lg bg-muted p-1" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={isLogin}
        onClick={onSelectLogin}
        className={`${tabBase} ${
          isLogin
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {loginLabel}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={!isLogin}
        onClick={onSelectRegister}
        className={`${tabBase} ${
          !isLogin
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {registerLabel}
      </button>
    </div>
  );
}
