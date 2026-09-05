import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'emerald'
    | 'violet'
    | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'touch';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-white/5',
      outline:
        'border border-border/70 bg-card/60 hover:bg-card hover:border-border text-foreground',
      ghost:
        'hover:bg-white/5 text-muted-foreground hover:text-foreground',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm shadow-destructive/20',
      emerald:
        'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20',
      violet:
        'bg-violet-600 text-white hover:bg-violet-500 shadow-md shadow-violet-600/20',
      glow:
        'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-500/25',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
      md: 'h-10 px-4 text-sm rounded-xl gap-2',
      lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
      icon: 'h-10 w-10 rounded-xl p-0',
      touch: 'h-12 px-5 text-sm rounded-xl gap-2 min-h-[48px] min-w-[48px]', // Touch target optimized
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
