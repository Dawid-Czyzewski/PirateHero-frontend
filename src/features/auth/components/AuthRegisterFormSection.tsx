import type { useRegisterFlow } from '@/features/auth/useRegisterFlow';
import { RegisterAvatarStep } from '@/features/auth/components/register/RegisterAvatarStep';
import { RegisterCredentialsStep } from '@/features/auth/components/register/RegisterCredentialsStep';

type RegisterFlow = ReturnType<typeof useRegisterFlow>;

type AuthRegisterFormSectionProps = {
  registerFlow: RegisterFlow;
  showPassword: boolean;
  onTogglePassword: () => void;
};

export function AuthRegisterFormSection({
  registerFlow,
  showPassword,
  onTogglePassword,
}: AuthRegisterFormSectionProps) {
  const isStepTwo = registerFlow.registerStep === 2;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isStepTwo) {
          void registerFlow.submitRegistration();
          return;
        }
        registerFlow.goToAvatarStep();
      }}
      className="space-y-4"
    >
      {!isStepTwo ? (
        <RegisterCredentialsStep
          registerFlow={registerFlow}
          showPassword={showPassword}
          onTogglePassword={onTogglePassword}
        />
      ) : (
        <RegisterAvatarStep registerFlow={registerFlow} />
      )}
    </form>
  );
}
