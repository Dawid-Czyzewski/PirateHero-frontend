import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'icon';
};

export const Button = ({
  className = '',
  variant = 'default',
  size = 'default',
  type = 'button',
  ...props
}: ButtonProps) => {
  const variantClass =
    variant === 'outline'
      ? 'border border-border bg-transparent hover:bg-muted/50'
      : variant === 'secondary'
        ? 'bg-muted/50 text-foreground hover:opacity-90'
        : variant === 'ghost'
          ? 'bg-transparent hover:bg-muted/50'
          : 'bg-primary text-primary-foreground hover:opacity-90';
  const sizeClass = size === 'sm' ? 'h-8 px-3 text-xs' : size === 'icon' ? 'h-10 w-10 p-0' : 'h-10 px-4';
  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${variantClass} ${sizeClass} ${className}`}
      {...props}
    />
  );
};

export const Input = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`min-h-11 w-full rounded-lg border border-border bg-muted/50 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 ${className}`}
    {...props}
  />
);

export const Textarea = ({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`w-full rounded-lg border border-border bg-muted/50 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 ${className}`}
    {...props}
  />
);

export const ScrollArea = ({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`overflow-y-auto ${className}`} {...props}>
    {children}
  </div>
);
