import { Toaster } from 'sonner';

export function GameToaster() {
  return (
    <Toaster
      theme="dark"
      position="top-center"
      closeButton
      gap={10}
      offset={16}
      className="game-toaster"
      toastOptions={{
        className: 'game-toast',
        classNames: {
          toast: 'game-toast',
          title: 'game-toast__title',
          description: 'game-toast__description',
          success: 'game-toast--success',
          error: 'game-toast--error',
          warning: 'game-toast--warning',
          info: 'game-toast--info',
          closeButton: 'game-toast__close',
          actionButton: 'game-toast__action',
          cancelButton: 'game-toast__cancel',
        },
      }}
    />
  );
}
